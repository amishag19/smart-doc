import { useEffect, useState } from 'react';

import { collection, doc, addDoc, getDocs, updateDoc, query, where } from "firebase/firestore";
import { db, auth } from './firebase';

import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc } from "firebase/firestore";


import { useNavigate } from "react-router-dom";

import ProgressBarStepComponent from './ProgressBarStepComponent';
import CountdownComponent from './CountdownComponent';

import './App.css';


function Home() {
    const [headerTitle, setHeaderTitle] = useState("Title");
    const [newCountdown, setCountdown] = useState(false);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserData = async () => {
          const user = auth.currentUser;
          if (user) {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              setHeaderTitle(data.headerTitle);
              setCountdown(data.newCountdown);
              setShowProgressBar(data.showProgressBar);
            } else {
              console.log("No such document!");
            }
          }
        };
    
        onAuthStateChanged(auth, (user) => {
          if (user) {
            loadUserData();
          }
        });
      }, []);
  
    function toggleProgressBar() {
        setShowProgressBar(prev => !prev);
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          updateDoc(docRef, { showProgressBar: !showProgressBar });
        }
    }
  
    function Countdown() {
        setCountdown(true);
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          updateDoc(docRef, { newCountdown: true });
        }
    }
  
    function handleTitleChange(e) {
        setHeaderTitle(e.target.innerText);
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          updateDoc(docRef, { headerTitle: e.target.innerText });
        }
    }
  
    function handleSignOut() {
        signOut(auth).then(() => {
            navigate("/login");
        }).catch((error) => {
            console.error("Error signing out: ", error);
        });
     }
  
    return (
      <div className="App">
        <header className="App-header">
  
          <h2 id="HeaderTitle" contentEditable="true" style={{ outline: 'none' }}>{headerTitle}</h2>
  
          <div className="Menu-bar">
  
            <button type="button" className="css-button" onClick={toggleProgressBar}>
              <span className="css-button-text">Progress Bar</span>
            </button>
  
            <button type="button" className="css-button">
              <span className="css-button-text">H1</span>
            </button>
  
            <button type="button" className="css-button">
              <span className="css-button-text">H2</span>
            </button>
  
            <button type="button" className="css-button">
              <span className="css-button-text">H3</span>
            </button>
  
            <button type="button" className="css-button">
              <span className="css-button-text">Body</span>
            </button>
  
            <button type="button" className="css-button" onClick={Countdown}>
              <span className="css-button-text">Countdown</span>
            </button>
  
            <button type="button" className="css-button">
              <span className="css-button-text">Section</span>
            </button>

            <button type="button" className="css-button">
              <span className="css-button-text" onClick={handleSignOut}>Sign out</span>
            </button>
            
          </div>
          
        </header>
  
        <div className="Page" contentEditable="true" suppressContentEditableWarning={true} style={{ outline: 'none' }}>
          <h1>{headerTitle}</h1>
  
          <div contentEditable="false">
            {showProgressBar && <ProgressBarStepComponent />}
            <div contentEditable="true" suppressContentEditableWarning={true} style={{ outline: 'none', minHeight: '1em' }}></div>
          </div>
          
  
          <div contentEditable="false">
            <div contentEditable="true" suppressContentEditableWarning={true} style={{ outline: 'none', minHeight: '1em' }}></div>
          </div>
          
          {newCountdown && (
            <div className='countdown' contentEditable="false">
              <CountdownComponent /> 
            </div>
            )}
            <div contentEditable="true" suppressContentEditableWarning={true} style={{ outline: 'none', minHeight: '1em' }}></div> 
        </div>
      </div>
    );
}

export default Home;