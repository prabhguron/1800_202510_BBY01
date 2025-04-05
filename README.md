# TossRite

## Overview
TossRite helps individuals properly dispose of their trash in the correct bins while being rewarded through gamification. The application allows users to upload photos of their waste items and receive detailed guidance on proper disposal methods. By gamifying the waste sorting process, TossRite encourages environmentally responsible behavior through a points system and visual plant growth that reflects user progress.

Developed with a focus on environmental sustainability and user engagement, TossRite combines practical waste management guidance with interactive features that make responsible disposal more engaging and rewarding.

## Features

- **Smart Waste Identification**: Upload photos of trash items and receive detailed explanations on where to dispose of them
- **Community Section**: Text and interact with other users in real-time to share tips and experiences
- **Reward System**: Earn points for properly disposing of waste items
- **Visual Growth Tracking**: Watch your personal plant grow as you accumulate points, providing a visual representation of your environmental impact
- **Responsive Design**: Access the application seamlessly across different devices

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **API**: Gemini AI API for waste identification
- **Database**: Firebase Firestore
- **Hosting**: Firebase

## Usage

### Option 1: Use the Live Application
Access TossRite directly through the deployed link (add link here when available)

### Option 2: Run Locally
1. Fork and clone the repository
2. Navigate to the project directory:cd tossrite
3. Install dependencies:by npm install
4. Create a `.env` file with the following:
PORT=3000
GEMINI_API_KEY=your_gemini_api_key
Copy5. Set up Firebase configuration (either create your own or contact Prabh for existing keys)
6. Start the application:
npm start
Copy7. Open your browser and navigate to `http://localhost:3000`

## Project Structure
<pre> ``` 1800_202510_BBY01/ ├── node_modules/ ├── public/ │ ├── html/ │ ├── images/ │ └── styles/ │ ├── community.css │ ├── leaderboard.css │ ├── Login.css │ ├── main.css │ ├── main2.css │ ├── mainPage.css │ ├── plantlevel.css │ ├── style.css │ ├── template.css │ └── visualization.css ├── client.js ├── community.js ├── displayUser.js ├── firebase-config.js ├── firebaseAPI.js ├── index1.html ├── leaderboard.js ├── plantgrowth.js ├── plantlevel.js ├── UserPage.html ├── .env ├── .gitignore ├── index.html ├── package-lock.json ├── package.json ├── README.md └── server.js ``` </pre>

## Contributors
- **Indy Grewal** - BCIT CST Student with a passion for creating user-friendly applications. Fun fact: Loves solving Rubik's Cubes in under a minute.
- **Prabh Guron** - BCIT CST Student, who loves soccer and coding on notepad.
- **Westin Morgan** - BCIT CST Student, who loves video games and coding on notepad.

## Acknowledgments

- Waste identification powered by Google's Gemini AI API
- Firebase and Firestore for backend services
- Icons sourced from [FontAwesome](https://fontawesome.com/) (if applicable)
- Streak icon credit: <a href="https://www.flaticon.com/free-icons/fire" title="fire icons">Fire icons created by Bahu Icons - Flaticon</a>

## Limitations and Future Work
### Limitations

- AI waste identification accuracy may vary depending on image quality
- Limited to waste types the AI has been trained to recognize
- Currently optimized primarily for common household waste items

### Future Work

- Enhanced visualization section with more interactive elements
- Expanded community features including challenges and collaborative goals
- Improved AI identification for a wider range of waste materials
- Integration with local waste management guidelines based on user location
- Mobile app development for easier photo capture and usage

## License
This project is licensed under the MIT License. See the LICENSE file for details.
