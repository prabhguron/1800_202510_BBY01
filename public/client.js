// client.js - Frontend JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const fileInput = document.getElementById('file-input');
  const uploadBtn = document.getElementById('upload-btn');
  const imagePreview = document.getElementById('image-preview');
  const resultContainer = document.getElementById('result-container');
  const resultTitle = document.getElementById('result-title');
  const resultExplanation = document.getElementById('result-explanation');
  const resultTips = document.getElementById('result-tips');
  const loading = document.querySelector('.loading');
  
  // Add event listeners
  uploadBtn.addEventListener('click', function() {
    fileInput.click();
  });
  
  fileInput.addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileUpload(file);
    }
  });
  
  // Handle file preview and upload
  function handleFileUpload(file) {
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = 'block';
    }
    reader.readAsDataURL(file);
    
    // Reset and hide result
    resultContainer.style.display = 'none';
    resultContainer.className = 'result-container';
    
    // Show loading indicator
    loading.style.display = 'block';
    
    // Submit to server
    submitImage(file);
  }
  
  // Submit image to server
  async function submitImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch('/categorize', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Server error');
      }
      
      const result = await response.json();
      
      // Log the JSON response in the browser console
      console.log('Response from server:', result);
      
   
      
      // Loop through all properties in the object
    
      
      displayResult(result);
    } catch (error) {
      console.error('Error:', error);
      displayError(error);
    } finally {
      loading.style.display = 'none';
    }
  }
  
  // Display the result
  function displayResult(result) {
    resultContainer.style.display = 'block';
    
    if (result.category === 'unknown') {
      resultContainer.className = 'result-container unknown';
      resultTitle.textContent = 'Could not determine category';
      resultExplanation.textContent = result.error || 'Could not analyze the image';
      resultTips.textContent = '';
      return;
    }
    
    // Set class based on category
    resultContainer.className = `result-container ${result.category}`;
    
    // Display result
    const confidencePercent = Math.round(result.confidence * 100);
    resultTitle.textContent = `This item is ${result.category.toUpperCase()} (${confidencePercent}% confidence)`;
    resultExplanation.textContent = result.explanation;
    resultTips.textContent = result.tips || '';
  }
  
  // Display error message
  function displayError(error) {
    resultContainer.style.display = 'block';
    resultContainer.className = 'result-container unknown';
    resultTitle.textContent = 'Error';
    resultExplanation.textContent = 'Failed to analyze the image. Please try again.';
    resultTips.textContent = '';
  }
});