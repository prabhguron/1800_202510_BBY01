import { auth, db } from "/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  doc,
  getDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Define the plant levels and their point thresholds
const plantLevels = [
  { level: 1, min: 0, max: 9, name: "Seedling" },
  { level: 2, min: 10, max: 19, name: "Small Plant" },
  { level: 3, min: 20, max: 29, name: "Growing Plant" },
  { level: 4, min: 30, max: 39, name: "Budding Plant" },
  { level: 5, min: 40, max: Infinity, name: "Flowering Plant" },
];

// Function to determine current level based on points
function getCurrentLevel(points) {
  for (const tier of plantLevels) {
    if (points >= tier.min && points <= tier.max) {
      return tier;
    }
  }
  return plantLevels[0]; // Default to first level
}

// Function to calculate progress percentage within current level
function getProgressInLevel(points, currentLevel) {
  // If at max level, show 100%
  if (currentLevel.level === plantLevels[plantLevels.length - 1].level) {
    return 100;
  }
  
  const pointsInLevel = points - currentLevel.min;
  const pointsNeededForLevel = currentLevel.max - currentLevel.min + 1;
  return Math.min(100, Math.round((pointsInLevel / pointsNeededForLevel) * 100));
}

// Create SVG plant visualization based on user points
function createPlantVisualization(points) {
  const currentLevel = getCurrentLevel(points);
  const progressPercent = getProgressInLevel(points, currentLevel);
  
  // Create container for SVG
  const container = document.querySelector('.containerPlant');
  container.innerHTML = ''; // Clear existing content
  
  // Create SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 400 600");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "auto");
  svg.setAttribute("class", "plant-svg");
  
  // Create background
  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("width", "400");
  background.setAttribute("height", "600");
  background.setAttribute("fill", "#e0f7e0");
  background.setAttribute("rx", "20");
  background.setAttribute("ry", "20");
  svg.appendChild(background);
  
  // Create pot
  const pot = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pot.setAttribute("d", "M150,550 L250,550 L270,450 L130,450 Z");
  pot.setAttribute("fill", "#a67c52");
  svg.appendChild(pot);
  
  const potTop = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  potTop.setAttribute("cx", "200");
  potTop.setAttribute("cy", "450");
  potTop.setAttribute("rx", "70");
  potTop.setAttribute("ry", "15");
  potTop.setAttribute("fill", "#8b5a2b");
  svg.appendChild(potTop);
  
  // Create soil
  const soil = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  soil.setAttribute("cx", "200");
  soil.setAttribute("cy", "450");
  soil.setAttribute("rx", "60");
  soil.setAttribute("ry", "10");
  soil.setAttribute("fill", "#3d2314");
  svg.appendChild(soil);
  
  // Create level elements based on current level
  // Stem (always present)
  const stem = document.createElementNS("http://www.w3.org/2000/svg", "path");
  stem.setAttribute("d", "M200,450 Q190,400 200,350 Q210,300 190,250 Q180,200 200,150");
  stem.setAttribute("stroke", "#76b947");
  stem.setAttribute("stroke-width", "8");
  stem.setAttribute("fill", "none");
  svg.appendChild(stem);
  
  // Level 1: Small leaves at bottom
  if (currentLevel.level >= 1) {
    const leaf1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    leaf1.setAttribute("d", "M200,400 Q220,390 240,400 Q220,410 200,400");
    leaf1.setAttribute("fill", "#a4de02");
    svg.appendChild(leaf1);
    
    const leaf2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    leaf2.setAttribute("d", "M200,380 Q180,370 160,380 Q180,390 200,380");
    leaf2.setAttribute("fill", "#a4de02");
    svg.appendChild(leaf2);
  }
  
  // Level 2: Medium leaves in middle
  if (currentLevel.level >= 2) {
    const leaf3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    leaf3.setAttribute("d", "M190,350 Q160,340 150,310 Q180,320 190,350");
    leaf3.setAttribute("fill", "#88cc00");
    svg.appendChild(leaf3);
    
    const leaf4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    leaf4.setAttribute("d", "M210,320 Q240,310 260,290 Q230,310 210,320");
    leaf4.setAttribute("fill", "#88cc00");
    svg.appendChild(leaf4);
  }
  
  // Level 3: Large leaves near top
  if (currentLevel.level >= 3) {
    const leaf5 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    leaf5.setAttribute("d", "M190,280 Q140,260 130,210 Q160,250 190,280");
    leaf5.setAttribute("fill", "#76b947");
    svg.appendChild(leaf5);
    
    const leaf6 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    leaf6.setAttribute("d", "M210,240 Q260,220 280,180 Q240,220 210,240");
    leaf6.setAttribute("fill", "#76b947");
    svg.appendChild(leaf6);
  }
  
  // Level 4: Bud
  if (currentLevel.level >= 4) {
    const bud = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    bud.setAttribute("cx", "200");
    bud.setAttribute("cy", "150");
    bud.setAttribute("r", "15");
    bud.setAttribute("fill", "#fdfd96");
    svg.appendChild(bud);
  }
  
  // Level 5: Flower
  if (currentLevel.level >= 5) {
    const flowerCenter = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    flowerCenter.setAttribute("cx", "200");
    flowerCenter.setAttribute("cy", "150");
    flowerCenter.setAttribute("r", "20");
    flowerCenter.setAttribute("fill", "#fdfd96");
    svg.appendChild(flowerCenter);
    
    const petal1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    petal1.setAttribute("d", "M180,150 Q200,120 220,150 Q200,180 180,150");
    petal1.setAttribute("fill", "#ff6b6b");
    svg.appendChild(petal1);
    
    const petal2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    petal2.setAttribute("d", "M200,130 Q230,130 200,170 Q170,130 200,130");
    petal2.setAttribute("fill", "#ff6b6b");
    svg.appendChild(petal2);
  }
  
  // Create point display
  const pointsRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  pointsRect.setAttribute("x", "150");
  pointsRect.setAttribute("y", "500");
  pointsRect.setAttribute("width", "100");
  pointsRect.setAttribute("height", "30");
  pointsRect.setAttribute("rx", "15");
  pointsRect.setAttribute("ry", "15");
  pointsRect.setAttribute("fill", "#76b947");
  svg.appendChild(pointsRect);
  
  const pointsText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  pointsText.setAttribute("x", "200");
  pointsText.setAttribute("y", "522");
  pointsText.setAttribute("text-anchor", "middle");
  pointsText.setAttribute("fill", "white");
  pointsText.setAttribute("font-family", "Arial");
  pointsText.setAttribute("font-weight", "bold");
  pointsText.textContent = `${points} POINTS`;
  svg.appendChild(pointsText);
  
  // Create level display
  const levelRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  levelRect.setAttribute("x", "120");
  levelRect.setAttribute("y", "70");
  levelRect.setAttribute("width", "160");
  levelRect.setAttribute("height", "40");
  levelRect.setAttribute("rx", "20");
  levelRect.setAttribute("ry", "20");
  levelRect.setAttribute("fill", "rgba(0,0,0,0.1)");
  svg.appendChild(levelRect);
  
  const levelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  levelText.setAttribute("x", "200");
  levelText.setAttribute("y", "98");
  levelText.setAttribute("text-anchor", "middle");
  levelText.setAttribute("fill", "#333");
  levelText.setAttribute("font-family", "Arial");
  levelText.setAttribute("font-weight", "bold");
  levelText.setAttribute("font-size", "20");
  levelText.textContent = `LEVEL ${currentLevel.level}`;
  svg.appendChild(levelText);
  
  // Create progress bar background
  const progressBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  progressBg.setAttribute("x", "100");
  progressBg.setAttribute("y", "30");
  progressBg.setAttribute("width", "200");
  progressBg.setAttribute("height", "20");
  progressBg.setAttribute("rx", "10");
  progressBg.setAttribute("ry", "10");
  progressBg.setAttribute("fill", "rgba(0,0,0,0.1)");
  svg.appendChild(progressBg);
  
  // Create progress bar fill
  const progressFill = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  progressFill.setAttribute("x", "100");
  progressFill.setAttribute("y", "30");
  progressFill.setAttribute("width", `${(progressPercent / 100) * 200}`);
  progressFill.setAttribute("height", "20");
  progressFill.setAttribute("rx", "10");
  progressFill.setAttribute("ry", "10");
  progressFill.setAttribute("fill", "#76b947");
  svg.appendChild(progressFill);
  
  // Add level name text
  const nameText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  nameText.setAttribute("x", "200");
  nameText.setAttribute("y", "45");
  nameText.setAttribute("text-anchor", "middle");
  nameText.setAttribute("fill", "#333");
  nameText.setAttribute("font-family", "Arial");
  nameText.setAttribute("font-size", "14");
  nameText.textContent = currentLevel.name;
  svg.appendChild(nameText);
  
  // Add SVG to container
  container.appendChild(svg);
}

// Function to get the user info from the database
async function getUserInfo() {
  // Check if user is authenticated
  const user = auth.currentUser;

  if (!user) {
    console.log("User not authenticated");
    return;
  }

  try {
    // Get the user document from Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("User Data:", userData);

      // Check for points and create visualization
      if (userData.points !== undefined) {
        createPlantVisualization(userData.points);
      }
    } else {
      console.log("User document not found");
    }
  } catch (error) {
    console.error("Error getting user info:", error);
  }
}

// Set up real-time updates when points change
function setupPointsListener() {
  const user = auth.currentUser;
  if (!user) return;

  const userDocRef = doc(db, "users", user.uid);
  
  // Listen for changes to the user document
  onSnapshot(userDocRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      if (userData.points !== undefined) {
        createPlantVisualization(userData.points);
      }
    }
  });
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    getUserInfo();
    setupPointsListener(); // Set up real-time listener
  } else {
    console.log("No user logged in");
  }
});