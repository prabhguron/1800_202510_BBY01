// server.js - Backend Server
const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

// Basic CORS handling
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log('Created uploads directory');
}

// Serve static files
app.use(express.static('public'));
console.log('Serving static files from public directory');

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// API endpoint for waste categorization
app.post('/categorize', upload.single('image'), async (req, res) => {
  console.log('POST request received at /categorize');
  console.log('Request headers:', req.headers);
  
  if (!req.file) {
    console.log('No file received in request');
    return res.status(400).json({ error: 'No image uploaded' });
  }
  
  console.log('File received:', req.file.filename);
  
  try {
    const result = await categorizeWaste(req.file.path);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      category: "unknown", 
      confidence: 0, 
      error: 'Failed to categorize waste' 
    });
  }
});

// Initialize the API client
const genAI = new GoogleGenerativeAI("AIzaSyAUZyyox_2VLvFK9cjqcl4Fy7Tjq3byfik");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function categorizeWaste(imagePath) {
  try {
    // Read the image file
    const imageData = fs.readFileSync(imagePath);
    
    // Convert the image to base64
    const base64Image = imageData.toString('base64');
    
    // Prepare the prompt for the AI
    const prompt = `
      Analyze this image and determine if the item is compostable, recyclable, or garbage.
      
      Please categorize the item into one of these three categories:
      - compostable: Organic materials that can decompose naturally
      - recyclable: Materials that can be recycled and reprocessed
      - garbage: Items that should go to landfill
      
      Provide your response in this format:
      {
        "category": "compostable|recyclable|garbage",
        "confidence": 0.0-1.0,
        "explanation": "Brief explanation of why the item belongs in this category",
        "tips": "Additional disposal tips for this item"
      }
    `;
    
    // Create parts for the multimodal request
    const parts = [
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image
        }
      }
    ];
    
    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    });
    
    // Parse the response
    const responseText = result.response.text();
    console.log(result)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Could not parse AI response");
    }
    
    const responseData = JSON.parse(jsonMatch[0]);
    
    // Clean up the uploaded file
    fs.unlinkSync(imagePath);
    
    return {
      category: responseData.category,
      confidence: responseData.confidence,
      explanation: responseData.explanation,
      tips: responseData.tips
    };
  } catch (error) {
    console.error('Error in categorizeWaste:', error);
    
    // Clean up the uploaded file
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up file:', cleanupError);
    }
    
    return {
      category: "unknown",
      confidence: 0,
      error: "Failed to analyze the image"
    };
  }
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Test the server by visiting: http://localhost:${port}/test`);
});