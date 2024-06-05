// import './style.css';
// import { useState } from 'react';

// function ProgressBarStepComponent() {
//     const [progressSteps, setProgressSteps] = useState([{ id: 0, stepName: "Step 1" }]);
//     const [editingStep, setEditingStep] = useState(null);
    

//     function addStep() {
//         const id = progressSteps.length;
//         setProgressSteps([...progressSteps, { id, stepName: `Step ${id + 1}` }]);
//     }

//     function updateStep(id, newStepName) {
//         setProgressSteps(
//             progressSteps.map(step => step.id === id ? { ...step, stepName: newStepName } : step)
//         );
//     }

//     function startEditing(id) {
//         setEditingStep(id);
//     }

//     function stopEditing() {
//         setEditingStep(null);
//     }

//     return (
//         <div className="progressBar">
//             {progressSteps.map((step, index) => (
//                 <div key={step.id} className={`pointer ${index === 0 ? 'pointerStart' : ''}`} style={{ zIndex: progressSteps.length - index }} onDoubleClick={() => startEditing(step.id)}>
//                     {editingStep === step.id ? (
//                         <input
//                             type="text"
//                             className="editingStep"
//                             value={step.stepName}
//                             onChange={(e) => updateStep(step.id, e.target.value)}
//                             onBlur={stopEditing}
//                             autoFocus
//                         />
//                     ) : (<h4 className="stepName">{step.stepName}</h4>)}
//                 </div>
//             ))}
//             <button type="button" className="addStep" onClick={addStep}>
//                 <span className="css-button-text">+</span>
//             </button>
//         </div>
//     );
// }

// export default ProgressBarStepComponent;

import './style.css';
import { useState, useEffect } from 'react';
import { collection, doc, addDoc, getDocs, updateDoc } from "firebase/firestore";
import { db, auth } from './firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc } from "firebase/firestore";


import { useNavigate } from "react-router-dom";

function ProgressBarStepComponent() {
    const [progressSteps, setProgressSteps] = useState([]);
    const [editingStep, setEditingStep] = useState(null);

    useEffect(() => {
        const fetchProgressSteps = async () => {
            const user = auth.currentUser;
            if (user) {
                const querySnapshot = await getDocs(collection(db, "users", user.uid, "progressSteps"));
                const steps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProgressSteps(steps);
            }
        };

        auth.onAuthStateChanged(user => {
            if (user) {
                fetchProgressSteps();
            }
        });
    }, []);

    const addStep = async () => {
        const user = auth.currentUser;
        if (user) {
            const id = progressSteps.length;
            const newStep = { stepName: `Step ${id + 1}` };
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
}

export default ProgressBarStepComponent;
