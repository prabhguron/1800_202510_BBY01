var firebaseConfig = {
    apiKey: "AIzaSyA5evmzAKaU5Eh6rWqzwHsQvNxHUTpQrsM",
    authDomain: "tossrite.firebaseapp.com",
    projectId: "tossrite",
    storageBucket: "tossrite.firebasestorage.app",
    messagingSenderId: "963644302631",
    appId: "1:963644302631:web:17c10f4733b7a0a9a6b502",
    measurementId: "G-KBGJLMXZG8"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();