import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { completeTaskByTaskID, unCompleteTaskByTaskID } from '../actions';

function Task(props) {
    // const toggleCheckbox = (e) => {
    //     e.preventDefault();
    //     let checkbox = e.target.previousSibling.firstChild;
    //     checkbox.checked = !checkbox.checked;
    // };
    const getDueDateColor = (dueDate) => {
        const now = new Date();
        const dueDateTime = new Date(dueDate);
        const hoursLeft = (dueDateTime - now) / (1000 * 60 * 60);
        if (hoursLeft <= 0) {
            return 'red';
        } else if (hoursLeft <= 3) {
            return 'orange';
        }else if (dueDateTime.toDateString() === now.toDateString()) {
            return 'yellow';
        } else {
            return 'green';
        }
    };

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        if (!isChecked) {
            props.onSelectTask("");
            completeTaskByTaskID(props.uid);
            setIsChecked(!isChecked);
        } else {
            unCompleteTaskByTaskID(props.uid);
            setIsChecked(!isChecked);
        }
        // props.onSelectTask(props.uid);
    };

    const handleSelectTask = () => {
        if (!isChecked) {
            props.onSelectTask(props.uid);
        }
    };

    return (
        <div className="TaskDiv" onClick={handleSelectTask} style={{opacity: isChecked ? 0.45 : 1}}>
            <Form.Check 
                type="checkbox" 
                inline 
                className="TaskCheckbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
            />
            <label className="TaskLabel">
                <h4 className="TaskName">{props.name}</h4>
            </label>
            <h6 className="TaskDueDate" style={{color: getDueDateColor(props.dueDate.raw)}}>{props.dueDate.display}</h6>
        </div>
        );
    }
 export default Task;
