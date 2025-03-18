import { db } from "./firebase-config.js"; 
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

async function fetchLeaderboard(order = "desc") {
    const tableBody = document.querySelector(".list");
    tableBody.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";  // Show loading state

    try {
        console.log("Fetching leaderboard data...");
        const leaderboardRef = collection(db, "users"); // Ensure you're querying the correct collection
        const q = query(leaderboardRef, orderBy("points", order)); // Query for sorting based on 'points'

        // Fetch data from Firestore
        const querySnapshot = await getDocs(q);
        console.log("Query Snapshot:", querySnapshot);  // Log the query snapshot

        // If there's no data in the snapshot
        if (querySnapshot.empty) {
            console.log("No data found in the snapshot.");
            tableBody.innerHTML = "<tr><td colspan='3'>No leaderboard data available</td></tr>";
            return;
        }

        // Clear the table and load the data
        tableBody.innerHTML = "";
        let rank = 1;
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Document Data:", data);  // Log each document data

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${rank}</td>
                <td>${data.username}</td>
                <td>${data.points}</td>
            `;
            tableBody.appendChild(row);
            rank++;
        });
    } catch (error) {
        console.error("Error fetching leaderboard data:", error); // Log the specific error
        tableBody.innerHTML = "<tr><td colspan='3'>Error loading data.</td></tr>"; // Show error message on the page
    }
}

// Initial call to load the leaderboard
fetchLeaderboard();

// Sorting functionality
document.getElementById("sort-dropdown").addEventListener("change", (event) => {
    const sortOrder = event.target.value;
    fetchLeaderboard(sortOrder);  // Re-fetch leaderboard based on selected sort order
});