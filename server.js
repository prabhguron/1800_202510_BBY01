const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Validate API key
if (!process.env.GEMINI_API_KEY) {
  console.error('FATAL: Gemini API key is missing. Set GEMINI_API_KEY in .env file.');
  process.exit(1);
}

// Middleware for logging and CORS
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  return req.method === 'OPTIONS' ? res.sendStatus(200) : next();
});

// Configure file upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `waste-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

// Serve static files
app.use(express.static('public'));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Waste categorization endpoint
app.post('/categorize', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      category: "unknown", 
      error: 'No image uploaded' 
    });
  }
  
  try {
    const result = await categorizeWaste(req.file.path);
    res.json(result);
  } catch (error) {
    console.error('Categorization Error:', error);
    res.status(500).json({ 
      category: "unknown", 
      confidence: 0, 
      error: 'Failed to categorize waste' 
    });
  }
});

async function categorizeWaste(imagePath) {
  try {
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');
    
    const prompt = `
      Analyze this image and determine if the item is compostable, recyclable, or garbage.
      
      Response format:
      {
        "category": "compostable|recyclable|garbage",
        "confidence": 0.0-1.0,
        "explanation": "Why this item belongs in this category",
        "tips": "Disposal recommendations"
      }
    `;
    
    const parts = [
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image
        }
      }
    ];
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
    });
    
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }
    
    const responseData = JSON.parse(jsonMatch[0]);
    
    // Clean up uploaded file
    fs.unlinkSync(imagePath);
    
    return {
      category: responseData.category,
      confidence: responseData.confidence,
      explanation: responseData.explanation,
      tips: responseData.tips
    };
  } catch (error) {
    console.error('Waste Categorization Error:', error);
    
    // Ensure file is deleted even if analysis fails
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (cleanupError) {
      console.error('File Cleanup Error:', cleanupError);
    }
    
    return {
      category: "unknown",
      confidence: 0,
      error: "Image analysis failed"
    };
  }
}

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});