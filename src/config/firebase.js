import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyDbmtgXmvrtkS2XQ_vecT71FePKMXpPQyE",
  authDomain: "nsmobile-a341c.firebaseapp.com",
  projectId: "nsmobile-a341c",
  storageBucket: "nsmobile-a341c.appspot.com",
  messagingSenderId: "494904917042",
  appId: "1:494904917042:web:7424332f525efcb0eed02b",
  measurementId: "G-R951ZYCJSJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);