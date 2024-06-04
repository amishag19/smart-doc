import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    function loginUser(e) {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                navigate("/home")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });
    }

  return (
    <div className="Login">
            <form className="Login">
                <h1>Log in</h1>
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
                <button type="submit" onClick={loginUser}>
                    Log in
                </button>
                <p>New user? Sign up <Link to="/signup">here</Link></p>
            </form>
        </div>
        
  );
}

export default Login;
