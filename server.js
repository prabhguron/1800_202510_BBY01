const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Validate environment variables
const validateEnvVars = () => {
  const requiredVars = ['GEMINI_API_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error(`FATAL: Missing environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }
};

// CORS and security middleware
const configureCORS = () => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
};

// Configure file storage for uploads
const configureFileStorage = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, 'uploads');
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `waste-${Date.now()}${path.extname(file.originalname)}`);
    }
  });

  return multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });
};

// Initialize server
const initializeServer = () => {
  // Validate environment variables
  validateEnvVars();

  // Configure CORS
  configureCORS();

  // Serve static files
  app.use(express.static(path.join(__dirname, 'public')));

  // Serve index file
  app.get('/', (req, res) => {
    const possibleIndexPaths = [
      path.join(__dirname,  'index.html'),
      path.join(__dirname, 'public', 'index1.html'),
      path.join(__dirname, 'public', 'html', 'index.html')
    ];

    for (const indexPath of possibleIndexPaths) {
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
    }

    res.status(404).send('Index file not found');
  });

  // Configure file upload
  const upload = configureFileStorage();

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
      const result = await categorizeWaste(req.file.path, model);
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

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  });

  // Start server
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

// Waste categorization function
async function categorizeWaste(imagePath, model) {
  try {
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');
    
    const prompt = `
      Analyze this image and determine if the item is compostable, recyclable, or garbage.
      
      Response format:
      {
        "category": "compostable|recyclable|garbage",
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
      category: responseData.category || "unknown",
      tips: responseData.tips || "No specific disposal tips available"
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
    
    throw error;
  }
}

// Initialize the server
initializeServer();