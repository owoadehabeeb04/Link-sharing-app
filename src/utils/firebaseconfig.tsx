// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_cn_nlP1G-owg4gsPTmmdArbhqGzYzio",
  authDomain: "devlink-sharing-app.firebaseapp.com",
  projectId: "devlink-sharing-app",
  storageBucket: "devlink-sharing-app.appspot.com",
  messagingSenderId: "1036150263879",
  appId: "1:1036150263879:web:6e85df2a8f41619c782162"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleAuth = new GoogleAuthProvider();
export const storage = getStorage(app);

// Optionally initialize analytics and performance monitoring
if (typeof window !== "undefined") {
  if ("measurementId" in firebaseConfig) {
    getAnalytics(app);
    getPerformance(app);
  }
}

export default app;
