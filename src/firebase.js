import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhUj7JJHriiFBvlyAiSqn4STPtSxJd_ZQ",
  authDomain: "acromechanic.firebaseapp.com",
  projectId: "acromechanic",
  storageBucket: "acromechanic.appspot.com",
  messagingSenderId: "873817987219",
  appId: "1:873817987219:web:3fd8d43fb5262ca93c9566",
  measurementId: "G-EQCHH6W5VP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
