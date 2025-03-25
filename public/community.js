import { auth, db } from "/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Function to get the user info from the database
async function getUserInfo() {
  // Check if user is authenticated
  const user = auth.currentUser;
  console.log(auth);

  console.log(user)

  if (!user) {
    console.log("User not authenticated");
    return null;
  }

  try {
    // Get the user document from Firestore
    const userDocRef = doc(db, "users", user.uid);


    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Return user info
      return userDoc.data() || null;
    } else {
      console.log("User document not found");
      return null;
    }
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
}

async function createPost() {
  try {
    const userInfo = await getUserInfo();
    const message = document.getElementById('message').value;

    await addDoc(collection(db, "posts"), {
        username : userInfo.username,
        text : message,
        date : new Date().toISOString(),
    });
  } catch(error) {
    console.error("Error creating post:", error);
  }
}

async function logAllPosts() {
  try {
    const userInfo = await getUserInfo();
    const postCollection = collection(db, "posts");
    const querySnapshot = await getDocs(postCollection);
    let posts = [];
    
    querySnapshot.forEach((doc) => {
      let post = doc.data();
      let name = post.username;
      let date = post.date;
      let text = post.text;

      posts.push({

          n : name,
          d : date,
          t : text,

      })

    });

    let str = "";
    for (let i=0; i < posts.length; i++) {
        str += "<div class=" + "post-container>" + "<table><tr>";
        str += "<td>" + posts[i].n + "</td>";
        str += "<td>" + posts[i].d + "</td>";
        str += "</tr></table><br>";
        str += "<p>" + posts[i].t + "</p></div>";
    }
    document.getElementById("all-posts").innerHTML = str;

  } catch (error) {
    console.error("Error getting posts:", error);
  }

}

// Call the function


  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userInfo = await getUserInfo();
  
      logAllPosts();
 
    }
  });
  

//Check if sort order is changed
var e = document.getElementById("send-btn");
e.addEventListener("click", function() {
    if (document.getElementById('message').value != "") {
      createPost();
      logAllPosts();
    }
  
});