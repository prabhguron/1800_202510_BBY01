import { auth, db } from "/firebase-config.js";
import { doc, getDoc, updateDoc, onSnapshot, } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

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
  
  
  async function getUserInfo() {
    const user = auth.currentUser;
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.log("User document not found");
        return null;
      }
    } catch (error) {
      console.error("Error getting user info:", error);
      return null;
    }
  }

  async function addPoints(point) {
    let userInfo = await getUserInfo();
    let userName = userInfo.username;
    let userPoints = userInfo.points;
  
    // Update points in Firestore
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userDocRef, {
      points: userPoints + point,
    });

    const totalDocRef = doc(db, "totalpoints", "totalpoints");
    const totalDoc = await getDoc(totalDocRef);
    const totl = totalDoc.data().total;
    await updateDoc(totalDocRef, {
        total: totl+1
    });
  
    document.getElementById("points").textContent = `Points: ${userPoints + point} `;
  }

  const wasteFacts = [
    "Recycling one aluminum can saves enough energy to power a TV for three hours." ,
    "Food waste in landfills generates methane, a greenhouse gas 25 times more potent than carbon dioxide.",
    "Composting organic waste can reduce landfill waste by up to 30%.",
    "Plastic takes up to 1,000 years to decompose in landfills.",
    "Glass is 100% recyclable and can be recycled endlessly without losing quality.",
    "Around 91% of plastic worldwide is not recycled.",
    "Every ton of recycled paper saves 17 trees and 7,000 gallons of water.",
    "Electronic waste makes up only 2% of trash in landfills but accounts for 70% of toxic waste.",
    "Recycling a single plastic bottle can save enough energy to power a light bulb for three hours.",
    "If food waste were a country, it would be the third-largest emitter of greenhouse gases in the world."
  ];
  
  function changeText() {
console.log("working")
    var timer = 0;
  
    // Use let instead of var
    for (let i = 0; i < wasteFacts.length; i++) {
  
      setTimeout(() => { 
        document.getElementById('stats').innerHTML = wasteFacts[i]  
      }, timer);
  
      timer = timer + 5000;
    }
  
  }
  






  async function showTotal() {
    const totalDocRef = doc(db, "totalpoints", "totalpoints");

    const totalDoc = await getDoc(totalDocRef);

    const totl = totalDoc.data().total;
    document.getElementById("stats1").innerHTML =  `TossRite users have helped save ${totl} pieces of garbage from misuse.`;
;
    changeText();
   
  }
  showTotal();

  onSnapshot(doc(db, "totalpoints", "totalpoints"), (snapshot) => {
      showTotal();
  });

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
    console.log(result.category )
    document.querySelectorAll('.tossCanImg').forEach(canElement => {
      canElement.classList.remove("show");
  });


    
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
    const confidencePercent = Math.round( 80);
    resultTitle.textContent = `This item is ${result.category.toUpperCase()} (${confidencePercent}% confidence)`;
    resultExplanation.textContent = result.explanation;
    resultTips.textContent = result.tips || '';
    document.getElementById(`${result.category }`).classList.add("show")

    addPoints(1);

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