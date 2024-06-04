import './style.css';
import { useState } from 'react';

function ProgressBarStepComponent() {
    const [progressSteps, setProgressSteps] = useState([{ id: 0, stepName: "Step 1" }]);
    const [editingStep, setEditingStep] = useState(null);
    

    function addStep() {
        const id = progressSteps.length;
        setProgressSteps([...progressSteps, { id, stepName: `Step ${id + 1}` }]);
    }

    function updateStep(id, newStepName) {
        setProgressSteps(
            progressSteps.map(step => step.id === id ? { ...step, stepName: newStepName } : step)
        );
    }

    function startEditing(id) {
        setEditingStep(id);
    }

    function stopEditing() {
        setEditingStep(null);
    }

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
