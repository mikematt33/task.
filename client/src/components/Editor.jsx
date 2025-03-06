import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useState } from "react";
import { ToggleButton } from 'react-bootstrap';
import React from "react";
import Markdown from 'react-markdown';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Dropdown } from 'react-bootstrap';
import MiniCalModal from './MiniCalModal';
import { fetchTaskByTaskID, setTaskByTaskID, setTaskDateByTaskID, fetchAllTagsByTagID, setTaskTagsByTaskID} from '../actions';
import _, { set } from 'lodash';
import TagModal from './TagModal';

function Editor(props) {

    const [title, setTitle] = useState("");
    const [currentTitle, setCurrentTitle] = useState("");
    const [contents, setContents] = useState("");
    const [tags, setTags] = useState([]);
    const [savedContents, setSavedContents] = useState("");
    const [editChecked, setEditCheck] = useState(false);
    const [autosave, setAutosave] = useState(false);
    const [showCalModal, setShowCalModal] = useState(false);
    const [currentDate, setCurrentDate] = useState(null);
    const [showTagModal, setShowTagModal] = useState(false);

    const handleSave = async () => {
        try {
            const body = JSON.stringify({ 'title': title, 'body': contents });
            await setTaskByTaskID(props.uid, body);

            console.log("save successful");
            setSavedContents(contents);

        } catch (error) {
            console.error('Error updating database:', error);
        }
    };

    const handleUpdateDate = async (formData) => {
        try {

            const taskDate = formData;

            let startTimeDate = null;
            let endTimeDate = null;

            if (taskDate.type === 'Task') {
                let date = new Date(taskDate.taskSelectedDate);
                let year = date.getUTCFullYear();
                let month = date.getUTCMonth(); 
                let day = date.getUTCDate();
    
                let hour = parseInt(taskDate.startTime.hour);
                let minute = parseInt(taskDate.startTime.minute);
                let period = taskDate.startTime.period;
    
                // Convert to 24-hour format
                if (period === 'PM' && hour < 12) {
                    hour += 12;
                } else if (period === 'AM' && hour === 12) {
                    hour = 0;
                }

                startTimeDate = null;
                endTimeDate = new Date(Date.UTC(year, month, day, hour, minute));

            } else if (taskDate.type === 'Event') {

                let date = new Date(taskDate.eventSelectedDate);
                let year = date.getUTCFullYear();
                let month = date.getUTCMonth(); 
                let day = date.getUTCDate();
    
                let startHour = parseInt(taskDate.eventStartTime.hour);
                let startMinute = parseInt(taskDate.eventStartTime.minute);
                let startPeriod = taskDate.eventStartTime.period;
    
                // Convert to 24-hour format
                if (startPeriod === 'PM' && startHour < 12) {
                    startHour += 12;
                } else if (startPeriod === 'AM' && startHour === 12) {
                    startHour = 0;
                }

                let endHour = parseInt(taskDate.endTime.hour);
                let endMinute = parseInt(taskDate.endTime.minute);
                let endPeriod = taskDate.endTime.period;
    
                // Convert to 24-hour format
                if (endPeriod === 'PM' && endHour < 12) {
                    endHour += 12;
                } else if (endPeriod === 'AM' && endHour === 12) {
                    endHour = 0;
                }

                startTimeDate = new Date(Date.UTC(year, month, day, startHour, startMinute));
                endTimeDate = new Date(Date.UTC(year, month, day, endHour, endMinute));
            }

            const body = JSON.stringify({ 'start': startTimeDate, 'end': endTimeDate });
            const resultArray = await setTaskDateByTaskID(props.uid, body);
            const result = resultArray[0];

            console.log(props.selectedTagEvents);
            console.log('Result: ', result)

            props.setSelectedTagEvents(prevEvents => {
                const eventExists = prevEvents.some(event => event.uid === props.uid);
              
                if (eventExists) {
                  return prevEvents.map(event => event.uid === props.uid ? result : event);
                } else {
                  return [...prevEvents, result];
                }
            });

        } catch (error) {
            console.error('Error updating database:', error);
        }
    };

    const handleUpdateTags = async (tags) => {
        try {
            const taskTags = tags;
            const body = JSON.stringify({ 'tags': taskTags });
            await setTaskTagsByTaskID(props.uid, body);

        } catch (error) {
            console.error('Error updating database:', error);
        }
    };

    async function deleteSingleTask(taskId) {
        try {
            const response = await fetch(`http://localhost:3006/api/v1/tasks/deleteTask/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
    
            if (response.status !== 204) {
                const data = await response.json();
                throw new Error(data.message);
            }

            window.location.reload();

        } catch (error) {
            console.error('Error deleteing:', error);
        }
    }
    
    async function deleteAllTasks(taskId) {
        try {
            const response = await fetch(`http://localhost:3006/api/v1/tasks/deleteAllTasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
    
            if (response.status !== 204) {
                const data = await response.json();
                throw new Error(data.message);
            }

            window.location.reload();

        } catch (error) {
            console.error('Error deleteing:', error);
        }
    }

    const toggleEdit = () => {
        if (editChecked) {
            setContents(document.getElementById("MainEditor").value);
            handleSave();
        }
        setEditCheck(!editChecked);
    };

    const updateContents = () => {
        setContents(document.getElementById("MainEditor").value);
    };

    const handleOpenCalModal = () => {
        setShowCalModal(true);
    };
  
    const handleCloseCalModal = async (formData, type) => {
        if (type === 'task') {
            if (_.isEqual(formData, currentDate)) {
                setShowCalModal(false);
                return;
            } else {
                setCurrentDate(formData);
                await handleUpdateDate(formData);
            }
        }
        setShowCalModal(false);
    };

    const handleCloseTagModal = (tags) => {
        handleUpdateTags(tags);
        setTags(tags);
        setShowTagModal(false);  
    };

    const handleOpenTagModal = () => {
        setShowTagModal(true);
    };

    React.useEffect(() => {
        if (props.uid !== "") {
            const fetchTaskInfo = async () => {
                try {
                    setEditCheck(false);
                    const taskInfo = await fetchTaskByTaskID(props.uid);
                    setTitle(taskInfo[0].title);
                    setCurrentTitle(taskInfo[0].title);
                    setContents(taskInfo[0].body);
                    setSavedContents(taskInfo[0].body);

                    if (!_.isEqual(taskInfo[0], [])) {
                        let tagResults = [];
                        for (const tag in taskInfo[0].tags) {
                          let tagInfo = await fetchAllTagsByTagID(taskInfo[0].tags[tag]);
                          tagResults.push(...tagInfo); // spread the array to push each object individually
                        }
                        setTags(tagResults);
                    }

                    const startDate = new Date(taskInfo[0].start);
                    const endDate = new Date(taskInfo[0].end);

                    let startHours = startDate.getHours();;
                    let startPeriod;
                    let endHours = endDate.getHours();
                    let endPeriod;

                    if(startHours > 12) {
                        startHours -= 12;
                        startPeriod = 'PM';
                    } else startPeriod = 'AM';

                    if(endHours > 12) {
                        endHours -= 12;
                        endPeriod = 'PM';
                    } else endPeriod = 'AM';

                    let dateInfo = {};
                    if (taskInfo[0].start === null) {

                        dateInfo = {
                        type: "Task",
                        taskSelectedDate: endDate,
                        startTime: {hour: endHours, minute: endDate.getMinutes(), period: endPeriod},
                        repeat: taskInfo[0].repeating.frequency,
                        repeatTimeTask: taskInfo[0].repeating.end_time,
                        };
                    } else {

                        dateInfo = {
                        type: "Event",
                        eventSelectedDate: endDate,
                        eventStartTime: {hour: startHours, minute: startDate.getMinutes(), period: startPeriod},
                        endTime: {hour: endHours, minute: endDate.getMinutes(), period: endPeriod},
                        repeatEvent: taskInfo[0].repeating.frequency,
                        repeatTime: taskInfo[0].repeating.end_time,
                        };
                    }

                    setCurrentDate(dateInfo);



                } catch (error) {
                    console.error('Error fetching task info:', error);
                }
            };

            fetchTaskInfo();
        }
    }, [props.uid]);

    React.useEffect(() => {
        const autosave = setInterval(function() {setAutosave(true);}, 10000);
        return () => {
            setAutosave(false);
            clearInterval(autosave);
        };
    }, []);

    React.useEffect(() => {

        if (autosave && contents !== savedContents) {
            handleSave();
            setAutosave(false);
        }
    }, [autosave, contents, savedContents, handleSave]);


    React.useEffect(() => {
        if (title !== "")
            handleSave();
    }, [title]);

    let display;
    if (contents === "") display = <Row className="text-center EmptyDisplay align-items-center">
                                <h3 className="EmptyEditorText">Click the edit button above to start writing!</h3></Row>;
    else display = <Markdown className="MDDisplay">{contents}</Markdown>;

    const edit = <Form.Control onChange={updateContents} id="MainEditor" as="textarea" size="md" type="text" defaultValue={contents}/>;
    let activeEditorMode = display;
    let editButtonIconClass = "bi-pencil-square";

    if (editChecked) {
        activeEditorMode = edit;
        editButtonIconClass = "bi-eyeglasses";
    }

    else {
        activeEditorMode = display;
        editButtonIconClass = "bi-pencil-square";
    }

    if (props.uid === "")

        return (
                <Row className="text-center EmptyEditor align-items-center">
                <h3 className="EmptyEditorText">select a task</h3>
                </Row>);

    else {
        return (
            <Container fluid>
                <div className="EditorHeader">
                <Form.Control onChange={(e) => setCurrentTitle(e.target.value)} onBlur={(e) => setTitle(e.target.value)} className="align-middle" id="EditorTaskTitle" value={currentTitle} />

                    <div onBlur={() => {}} style={{ float: "right"}}>
                    <Button variant="outline-secondary" id="EditorCalendarButton" className="HeaderButton" onClick={handleOpenCalModal}>
                        <i className="bi-calendar EditorHeaderIcon" />
                    </Button>
                    <Button variant="outline-secondary" id="EditorTagButton" className="HeaderButton" onClick={handleOpenTagModal}>
                        <i className="bi-tag EditorHeaderIcon" />
                    </Button>

                    {showCalModal && <MiniCalModal disable handleCloseModal={handleCloseCalModal} savedDate={currentDate} classInput={"modalCalendar-content-update"} />}
                    {showTagModal && <TagModal show={showTagModal} handleClose={handleCloseTagModal} savedTags={tags} />}

                    <ToggleButton 
                        type="checkbox"
                        onChange={toggleEdit}
                        variant="outline-secondary"
                        className="HeaderButton"
                        id="EditButton"
                        checked={editChecked}
                    ><i className={editButtonIconClass + " EditorHeaderIcon"} /></ToggleButton>

                    <Dropdown style={{display: 'inline'}}>
                        <Dropdown.Toggle id='EditorTrashButton'>
                            <i className="bi-trash3 EditorHeaderIcon" style={{fontSize: "24px"}}/>
                        </Dropdown.Toggle>

                        <Dropdown.Menu variant='dark' renderOnMount popperConfig={{ strategy: 'fixed' }} style={{ fontSize: '12px' }}>
                            <Dropdown.Item onClick={() => deleteSingleTask(props.uid)}>Delete this event in series</Dropdown.Item>
                            <Dropdown.Item onClick={() => deleteAllTasks(props.uid)}>Delete all events in series</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    </div>

                </div>
                <hr className="EditorHR"></hr>
                {activeEditorMode}
            </Container>

    );
    }
}

export default Editor;