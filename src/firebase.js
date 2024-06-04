import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {firebaseConfig} from "./firebaseConfig";
import { getAuth } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)

export const db = getFirestore(app);