// import { useEffect, useState } from 'react';
// import { collection, doc, addDoc, getDocs, updateDoc, getDoc } from "firebase/firestore";
// import { db, auth } from './firebase';
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import CountdownComponent from './CountdownComponent';
// import './App.css';

// function Home() {
//     const [headerTitle, setHeaderTitle] = useState("Title");
//     const [newCountdown, setCountdown] = useState(false);
//     const [showProgressBar, setShowProgressBar] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const loadUserData = async () => {
//             const user = auth.currentUser;
//             if (user) {
//                 const docRef = doc(db, "users", user.uid);
//                 const docSnap = await getDoc(docRef);
//                 if (docSnap.exists()) {
//                     const data = docSnap.data();
//                     setHeaderTitle(data.headerTitle);
//                     setCountdown(data.newCountdown);
//                     setShowProgressBar(data.showProgressBar);
//                 } else {
//                     console.log("No such document!");
//                 }
//             }
//         };

//         onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 loadUserData();
//             }
//         });
//     }, []);

//     function ProgressBarStepComponent() {
//         const [progressSteps, setProgressSteps] = useState([]);
//         const [editingStep, setEditingStep] = useState(null);

//         useEffect(() => {
//             const fetchProgressSteps = async () => {
//                 const user = auth.currentUser;
//                 if (user) {
//                     const querySnapshot = await getDocs(collection(db, "users", user.uid, "progressSteps"));
//                     const steps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//                     setProgressSteps(steps);
//                 }
//             };

//             auth.onAuthStateChanged(user => {
//                 if (user) {
//                     fetchProgressSteps();
//                 }
//             });
//         }, []);

//         const addStep = async () => {
//             const user = auth.currentUser;
//             if (user) {
//                 const id = progressSteps.length;
//                 const newStep = { stepName: `Step ${id + 1}` };
//                 const docRef = await addDoc(collection(db, "users", user.uid, "progressSteps"), newStep);
//                 setProgressSteps([...progressSteps, { id: docRef.id, ...newStep }]);
//             }
//         };

//         const updateStep = async (id, newStepName) => {
//             const user = auth.currentUser;
//             if (user) {
//                 const docRef = doc(db, "users", user.uid, "progressSteps", id);
//                 await updateDoc(docRef, { stepName: newStepName });
//                 setProgressSteps(progressSteps.map(step => step.id === id ? { ...step, stepName: newStepName } : step));
//             }
//         };

//         const startEditing = (id) => {
//             setEditingStep(id);
//         };

//         const stopEditing = () => {
//             setEditingStep(null);
//         };

//         return (
//             <div className="progressBar">
//                 {progressSteps.map((step, index) => (
//                     <div key={step.id} className={`pointer ${index === 0 ? 'pointerStart' : ''}`} style={{ zIndex: progressSteps.length - index }} onDoubleClick={() => startEditing(step.id)}>
//                         {editingStep === step.id ? (
//                             <input
//                                 type="text"
//                                 className="editingStep"
//                                 value={step.stepName}
//                                 onChange={(e) => updateStep(step.id, e.target.value)}
//                                 onBlur={stopEditing}
//                                 autoFocus
//                             />
//                         ) : (<h4 className="stepName">{step.stepName}</h4>)}
//                     </div>
//                 ))}
//                 <button type="button" className="addStep" onClick={addStep}>
//                     <span className="css-button-text">+</span>
//                 </button>
//             </div>
//         );
//     }

//     function toggleProgressBar() {
//         setShowProgressBar(prev => !prev);
//         const user = auth.currentUser;
//         if (user) {
//             const docRef = doc(db, "users", user.uid);
//             updateDoc(docRef, { showProgressBar: !showProgressBar });
//         }
//     }

//     function Countdown() {
//         setCountdown(prev => !prev);
//         const user = auth.currentUser;
//         if (user) {
//             const docRef = doc(db, "users", user.uid);
//             updateDoc(docRef, { newCountdown: !newCountdown });
//         }
//     }

//     function handleTitleChange(e) {
//         setHeaderTitle(e.target.textContent);
//     }

//     function handleTitleBlur() {
//         const user = auth.currentUser;
//         if (user) {
//             const docRef = doc(db, "users", user.uid);
//             updateDoc(docRef, { headerTitle: headerTitle });
//         }
//     }

//     function handleSignOut() {
//         signOut(auth).then(() => {
//             navigate("/login");
//         }).catch((error) => {
//             console.error("Error signing out: ", error);
//         });
//     }

//     return (
//         <div className="App">
//             <header className="App-header">
//                 <h2>Smart Doc </h2>
//                 <div className="Menu-bar">
//                     <button type="button" className="css-button" onClick={toggleProgressBar}>
//                         <span className="css-button-text">Progress Bar</span>
//                     </button>
//                     <button type="button" className="css-button">
//                         <span className="css-button-text">H1</span>
//                     </button>
//                     <button type="button" className="css-button">
//                         <span className="css-button-text">H2</span>
//                     </button>
//                     <button type="button" className="css-button">
//                         <span className="css-button-text">H3</span>
//                     </button>
//                     <button type="button" className="css-button">
//                         <span className="css-button-text">Body</span>
//                     </button>
//                     <button type="button" className="css-button" onClick={Countdown}>
//                         <span className="css-button-text">Countdown</span>
//                     </button>
//                     <button type="button" className="css-button">
//                         <span className="css-button-text">Section</span>
//                     </button>
//                     <button type="button" className="css-button">
//                         <span className="css-button-text" onClick={handleSignOut}>Sign out</span>
//                     </button>
//                 </div>
//             </header>
//             <div className="Page" contentEditable="true" suppressContentEditableWarning={true} style={{ outline: 'none' }}>
//                 <h1 id="HeaderTitle" contentEditable="true" style={{ outline: 'none' }} onInput={handleTitleChange} onBlur={handleTitleBlur} autoFocus>{headerTitle}</h1>
//                 <div contentEditable="false">
//                     {showProgressBar && <ProgressBarStepComponent />}
//                     <div contentEditable="true" suppressContentEditableWarning={true} style={{ outline: 'none', minHeight: '1em' }}></div>
//                 </div>
//                 <div contentEditable="false">
//                     <div contentEditable="true" suppressContentEditableWarning={true} style={{ outline: 'none', minHeight: '1em' }}></div>
//                 </div>
//                 {newCountdown && (
//                     <div className='countdown' contentEditable="false">
//                         <CountdownComponent />
//                     </div>
//                 )}
//                 <div contentEditable="true" suppressContentEditableWarning={true} style={{ outline: 'none', minHeight: '1em' }}></div>
//             </div>
//         </div>
//     );
// }

// export default Home;




// new code

// import { useEffect, useState } from 'react';
// import { collection, doc, addDoc, getDocs, updateDoc, getDoc, query, orderBy } from "firebase/firestore";
// import { db, auth } from './firebase';
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import CountdownComponent from './CountdownComponent';
// import {Editor, EditorState, RichUtils, convertToRaw} from 'draft-js';
// import './App.css';

// function Home() {
//     // const [headerTitle, setHeaderTitle] = useState("Title");
//     const [newCountdown, setCountdown] = useState(false);
//     const [showProgressBar, setShowProgressBar] = useState(false);
//     const [editorState, setEditorState] = useState(() =>
//       EditorState.createEmpty(),
//     );
//     const navigate = useNavigate();

//     useEffect(() => {
//         const loadUserData = async () => {
//             const user = auth.currentUser;
//             if (user) {
//                 const docRef = doc(db, "users", user.uid);
//                 const docSnap = await getDoc(docRef);
//                 if (docSnap.exists()) {
//                     const data = docSnap.data();
//                     // setEditorState(data.editorState);
//                     // setHeaderTitle(data.headerTitle);
//                     setCountdown(data.newCountdown);
//                     setShowProgressBar(data.showProgressBar);
//                 } else {
//                     console.log("No such document!");
//                 }
//             }
//         };

//         onAuthStateChanged(auth, (user) => {
//             if (user) {
//                 loadUserData();
//             }
//         });
//     }, []);

//     function ProgressBarStepComponent() {
//         const [progressSteps, setProgressSteps] = useState([]);
//         const [editingStep, setEditingStep] = useState(null);

//         useEffect(() => {
//           fetchProgressSteps();
//       }, []);

//       const fetchProgressSteps = async () => {
//           const user = auth.currentUser;
//           if (user) {
//               const q = query(collection(db, "users", user.uid, "progressSteps"), orderBy("order"));
//               const querySnapshot = await getDocs(q);
//               const steps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//               setProgressSteps(steps);
//           }
//       };

//         const addStep = async () => {
//           const user = auth.currentUser;
//           if (user) {
//               const newStep = { 
//                   stepName: `Step ${progressSteps.length + 1}`, 
//                   order: progressSteps.length 
//               };
//               const docRef = await addDoc(collection(db, "users", user.uid, "progressSteps"), newStep);
//               setProgressSteps([...progressSteps, { id: docRef.id, ...newStep }]);
//           }
//       };

//         const updateStep = async (id, newStepName) => {
//             const user = auth.currentUser;
//             if (user) {
//                 const docRef = doc(db, "users", user.uid, "progressSteps", id);
//                 await updateDoc(docRef, { stepName: newStepName });
//                 setProgressSteps(progressSteps.map(step => step.id === id ? { ...step, stepName: newStepName } : step));
//             }
//         };

//         const startEditing = (id) => {
//             setEditingStep(id);
//         };

//         const stopEditing = () => {
//             setEditingStep(null);
//         };

//         return (
//             <div className="progressBar">
//                 {progressSteps.map((step, index) => (
//                     <div key={step.id} className={`pointer ${index === 0 ? 'pointerStart' : ''}`} style={{ zIndex: progressSteps.length - index }} onDoubleClick={() => startEditing(step.id)}>
//                         {editingStep === step.id ? (
//                             <input
//                                 type="text"
//                                 className="editingStep"
//                                 value={step.stepName}
//                                 onChange={(e) => updateStep(step.id, e.target.value)}
//                                 onBlur={stopEditing}
//                                 autoFocus
//                             />
//                         ) : (<h4 className="stepName">{step.stepName}</h4>)}
//                     </div>
//                 ))}
//                 <button type="button" className="addStep" onClick={addStep}>
//                     <span className="css-button-text">+</span>
//                 </button>
//             </div>
//         );
//     }

//     function toggleProgressBar() {
//         setShowProgressBar(prev => !prev);
//         const user = auth.currentUser;
//         if (user) {
//             const docRef = doc(db, "users", user.uid);
//             updateDoc(docRef, { showProgressBar: !showProgressBar });
//         }
//     }

//     function Countdown() {
//         setCountdown(prev => !prev);
//         const user = auth.currentUser;
//         if (user) {
//             const docRef = doc(db, "users", user.uid);
//             updateDoc(docRef, { newCountdown: !newCountdown });
//         }
//     }

//     // function handleTitleChange(e) {
//     //     setHeaderTitle(e.target.textContent);
//     // }

//     // function handleTitleBlur() {
//     //     console.log ("Running blur");
//     //     const user = auth.currentUser;
//     //     if (user) {
//     //         const docRef = doc(db, "users", user.uid);
//     //         updateDoc(docRef, { headerTitle: headerTitle });
//     //     }
//     // }

//     function handleSignOut() {
//         signOut(auth).then(() => {
//             navigate("/login");
//         }).catch((error) => {
//             console.error("Error signing out: ", error);
//         });
//     }

//     function saveTitle() {      
//       const user = auth.currentUser;
//         if (user) {
//             const docRef = doc(db, "users", user.uid);
//             updateDoc(docRef, { title: JSON.stringify(convertToRaw(editorState.getCurrentContent())) });
//         }
//     }

//     function saveContent() {      
//       const user = auth.currentUser;
//         if (user) {
//             const docRef = doc(db, "users", user.uid);
//             updateDoc(docRef, { content: JSON.stringify(convertToRaw(editorState.getCurrentContent())) });
//         }
//     }

//     function _onH1Click() {
//       setEditorState(RichUtils.toggleBlockType(editorState, 'header-one'));
//       saveTitle();
//       //call editorState.createWithContent(convertFromRaw(JSON.parse(on the data in Firebase)))
//     }

//     function _onH2Click() {
//       setEditorState(RichUtils.toggleBlockType(editorState, 'header-two'));
//       saveContent();
//       //call editorState.createWithContent(convertFromRaw(JSON.parse(on the data in Firebase)))
//     }

//     function _onH3Click() {
//       setEditorState(RichUtils.toggleBlockType(editorState, 'header-three'));
//       saveContent();
//       //call editorState.createWithContent(convertFromRaw(JSON.parse(on the data in Firebase)))
//     }
  

//     return (
//         <div className="App">
//             <header className="App-header">
//                 <h2>Smart Doc </h2>
//                 <div className="Menu-bar">
//                     <button type="button" className="css-button" onClick={toggleProgressBar}>
//                         <span className="css-button-text">Progress Bar</span>
//                     </button>
//                     <button type="button" className="css-button" onClick={_onH1Click}>
//                         <span className="css-button-text">H1</span>
//                     </button>
//                     <button type="button" className="css-button" onClick={_onH2Click}>
//                         <span className="css-button-text">H2</span>
//                     </button>
//                     <button type="button" className="css-button" onClick={_onH3Click}>
//                         <span className="css-button-text">H3</span>
//                     </button>          
//                     <button type="button" className="css-button" onClick={Countdown}>
//                         <span className="css-button-text">Countdown</span>
//                     </button>
//                     <button type="button" className="css-button">
//                         <span className="css-button-text" onClick={handleSignOut}>Sign out</span>
//                     </button>
//                 </div>
//             </header>

//             <div className="Page">

//                 <Editor editorState={editorState} onChange={setEditorState} onBlur = {saveTitle}/>

//                 <div>
//                     {showProgressBar && <ProgressBarStepComponent />}
//                     <Editor editorState={editorState} onChange={setEditorState} onBlur = {saveContent}/>
//                 </div>

//                 {newCountdown && (
//                     <div className='countdown'>
//                         <CountdownComponent />
//                     </div>
//                 )}
//                 <Editor editorState={editorState} onChange={setEditorState} onBlur = {saveContent}/>
                
//             </div>
//         </div>
//     );
// }

// export default Home;




// chatgpt code
import { useEffect, useState, useCallback } from 'react';
import { collection, doc, addDoc, getDocs, updateDoc, getDoc, query, orderBy } from "firebase/firestore";
import { db, auth } from './firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import CountdownComponent from './CountdownComponent';
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import './App.css';
import React from 'react';

function Home() {
    const [newCountdown, setCountdown] = useState(false);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [titleEditorState, setTitleEditorState] = useState(() => 
        EditorState.createEmpty()
    );
    const [contentEditorState1, setContentEditorState1] = useState(() => 
        EditorState.createEmpty()
    );
    const [contentEditorState2, setContentEditorState2] = useState(() => 
        EditorState.createEmpty()
    );
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.titleEditorState) {
                        setTitleEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(data.titleEditorState))));
                    }
                    if (data.contentEditorState1) {
                        setContentEditorState1(EditorState.createWithContent(convertFromRaw(JSON.parse(data.contentEditorState1))));
                    }
                    if (data.contentEditorState2) {
                        setContentEditorState2(EditorState.createWithContent(convertFromRaw(JSON.parse(data.contentEditorState2))));
                    }
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

    const ProgressBarStepComponent = React.memo(() => {
        const [progressSteps, setProgressSteps] = useState([]);
        const [editingStep, setEditingStep] = useState(null);

        useEffect(() => {
            fetchProgressSteps();
        }, []);

        const fetchProgressSteps = async () => {
            const user = auth.currentUser;
            if (user) {
                const q = query(collection(db, "users", user.uid, "progressSteps"), orderBy("order"));
                const querySnapshot = await getDocs(q);
                const steps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProgressSteps(steps);
            }
        };

        const addStep = async () => {
            const user = auth.currentUser;
            if (user) {
                const newStep = { 
                    stepName: `Step ${progressSteps.length + 1}`, 
                    order: progressSteps.length 
                };
                const docRef = await addDoc(collection(db, "users", user.uid, "progressSteps"), newStep);
                setProgressSteps([...progressSteps, { id: docRef.id, ...newStep }]);
            }
        };

        const updateStep = async (id, newStepName) => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "users", user.uid, "progressSteps", id);
                await updateDoc(docRef, { stepName: newStepName });
                setProgressSteps(progressSteps.map(step => step.id === id ? { ...step, stepName: newStepName } : step));
            }
        };

        const startEditing = (id) => {
            setEditingStep(id);
        };

        const stopEditing = () => {
            setEditingStep(null);
        };

        return (
            <div className="progressBar">
                {progressSteps.map((step, index) => (
                    <div key={step.id} className={`pointer ${index === 0 ? 'pointerStart' : ''}`} style={{ zIndex: progressSteps.length - index }} onDoubleClick={() => startEditing(step.id)}>
                        {editingStep === step.id ? (
                            <input
                                type="text"
                                className="editingStep"
                                value={step.stepName}
                                onChange={(e) => updateStep(step.id, e.target.value)}
                                onBlur={stopEditing}
                                autoFocus
                            />
                        ) : (<h4 className="stepName">{step.stepName}</h4>)}
                    </div>
                ))}
                <button type="button" className="addStep" onClick={addStep}>
                    <span className="css-button-text">+</span>
                </button>
            </div>
        );
    });

    const toggleProgressBar = useCallback(() => {
        setShowProgressBar(prev => !prev);
        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, "users", user.uid);
            updateDoc(docRef, { showProgressBar: !showProgressBar });
        }
    }, [showProgressBar]);

    const Countdown = useCallback(() => {
        setCountdown(prev => !prev);
        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, "users", user.uid);
            updateDoc(docRef, { newCountdown: !newCountdown });
        }
    }, [newCountdown]);

    const handleSignOut = useCallback(() => {
        signOut(auth).then(() => {
            navigate("/login");
        }).catch((error) => {
            console.error("Error signing out: ", error);
        });
    }, [navigate]);

    const saveEditorState = useCallback((state, fieldName) => {
        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, "users", user.uid);
            updateDoc(docRef, { [fieldName]: JSON.stringify(convertToRaw(state.getCurrentContent())) });
        }
    }, []);

    const handleTitleChange = useCallback((state) => {
        setTitleEditorState(state);
        saveEditorState(state, "titleEditorState");
    }, [saveEditorState]);

    const handleContentChange1 = useCallback((state) => {
        setContentEditorState1(state);
        saveEditorState(state, "contentEditorState1");
    }, [saveEditorState]);

    const handleContentChange2 = useCallback((state) => {
        setContentEditorState2(state);
        saveEditorState(state, "contentEditorState2");
    }, [saveEditorState]);

    const _onH1Click = useCallback(() => {
        const newState = RichUtils.toggleBlockType(titleEditorState, 'header-one');
        setTitleEditorState(newState);
        saveEditorState(newState, "titleEditorState");
    }, [titleEditorState, saveEditorState]);

    const _onH2Click = useCallback(() => {
        const newState = RichUtils.toggleBlockType(contentEditorState1, 'header-two');
        setContentEditorState1(newState);
        saveEditorState(newState, "contentEditorState1");
    }, [contentEditorState1, saveEditorState]);

    const _onH3Click = useCallback(() => {
        const newState = RichUtils.toggleBlockType(contentEditorState2, 'header-three');
        setContentEditorState2(newState);
        saveEditorState(newState, "contentEditorState2");
    }, [contentEditorState2, saveEditorState]);

    return (
        <div className="App">
            <header className="App-header">
                <h2>Smart Doc </h2>
                <div className="Menu-bar">
                    <button type="button" className="css-button" onClick={toggleProgressBar}>
                        <span className="css-button-text">Progress Bar</span>
                    </button>
                    <button type="button" className="css-button" onClick={_onH1Click}>
                        <span className="css-button-text">H1</span>
                    </button>
                    <button type="button" className="css-button" onClick={_onH2Click}>
                        <span className="css-button-text">H2</span>
                    </button>
                    <button type="button" className="css-button" onClick={_onH3Click}>
                        <span className="css-button-text">H3</span>
                    </button>          
                    <button type="button" className="css-button" onClick={Countdown}>
                        <span className="css-button-text">Countdown</span>
                    </button>
                    <button type="button" className="css-button">
                        <span className="css-button-text" onClick={handleSignOut}>Sign out</span>
                    </button>
                </div>
            </header>

            <div className="Page">           
                <div>
                    <Editor editorState={titleEditorState} onChange={handleTitleChange} />
                </div>
                <div>
                  {showProgressBar && <ProgressBarStepComponent />}
                </div>
                
                <div>
                    <Editor editorState={contentEditorState1} onChange={handleContentChange1} />
                </div>
                {newCountdown && (
                    <div className='countdown'>
                        <CountdownComponent />
                    </div>
                )}
                <div>                    
                    <Editor editorState={contentEditorState2} onChange={handleContentChange2} />
                </div>
            </div>
        </div>
    );
}

export default Home;
