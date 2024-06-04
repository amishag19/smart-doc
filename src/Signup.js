import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import './App.css';

import { auth } from "./firebase";

function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //     function signUpUser(e) {
    //         e.preventDefault();
    //         createUserWithEmailAndPassword(auth, email, password)
    //             .then((userCredential) => {
    //                 // Signed up
    //                 navigate("/login");
    //             })
    //             .catch((error) => {
    //                 const errorCode = error.code;
    //                 const errorMessage = error.message;
    //                 console.error(errorCode, errorMessage);
    //             });
    //     }

    const signUpUser = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const db = getFirestore();
            
            // Create user document in Firestore
            await setDoc(doc(db, "users", user.uid), {
                headerTitle: "Title",
                content: "",
                showProgressBar: false,
                newCountdown: false,
            });
            
            console.log('User signed up and document created:', user);
            navigate("/login");
        } catch (error) {
            console.error('Error signing up:', error.code, error.message);
        }
    };

    return (
        <form>
            <h1>Sign up</h1>
            <label htmlFor="email">Email: </label>
            <input value={email}
                type="email" id="email" name="email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password: </label>
            <input value={password}
                type="password" id="password" name="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" onClick={signUpUser}>
                Sign up
            </button>
        </form>
    );
}
export default Signup;


