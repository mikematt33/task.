import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Editor from './Editor';
import TaskList from './TaskList';
import TaskSidebar from './taskSidebar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function List() {
    const navigate = useNavigate();
    const [selectedTaskUid, setSelectedTaskUid] = useState('');
    const [selectedTagEvents, setSelectedTagEvents] = useState([{}]);
    const currentView = 'task';

    const handleSelectTask = (uid) => {
        setSelectedTaskUid(uid);
    };

    const handleSelectTag = (events) => {
        setSelectedTagEvents(events);
    };

    useEffect(() => {
        if (localStorage.length === 0) {
            navigate('/');
        }
    }, []);

    return (
        <Container fluid className="ListContainer">
            <Row>
                <Col xs={2}>
                    <TaskSidebar currentView={currentView} onSelectTag={handleSelectTag}/>
                </Col>
                <Col className="start-50 TaskList">
                    <TaskList onSelectTask={handleSelectTask} selectedTagEvents={selectedTagEvents}/>
                </Col>
                <Col>
                    <Editor uid={selectedTaskUid} selectedTagEvents={selectedTagEvents} setSelectedTagEvents={setSelectedTagEvents}/>
                </Col>
            </Row>
        </Container>
    );
}
export default List;

