import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

async function logAllUsers() {
  try {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);
    let lb = [];
    
    console.log("All users in collection:");
    //here you will add the each user make your own html then use
    //innerhtml to add it to leaderboard.html
    querySnapshot.forEach((doc) => {
      let user = doc.data();
      let name = user.username;
      let points = user.points;
      // Log each user with their ID and data
      console.log( doc.data().username);
      lb.push({

          n : name,
          p : points,

      })

    });

    lb.sort(({p:a}, {p:b}) => b-a);

    let str = "<table><tr><th>#</th><th>Name</th><th>Points</th></tr>";
    for (let i=0; i < lb.length; i++) {
        str += "<tr>";
        str += "<td>" + (i+1) + "</td>";
        str += "<td>" + lb[i].n + "</td>";
        str += "<td>" + lb[i].p + "</td>";
        str += "<tr>";
    }
    str += "</table>";
    document.getElementById("list").innerHTML = str;

  } catch (error) {
    console.error("Error getting users:", error);
  }

}

// Call the function
logAllUsers();