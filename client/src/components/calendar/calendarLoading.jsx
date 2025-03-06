import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CustomCalendar from "./ReactBigCalendar";
import TaskSidebar from '../taskSidebar';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CalendarLoad(){
    const navigate = useNavigate();
    const currentView = 'calendar';

    useEffect(() => {
        if (localStorage.length === 0) {
            navigate('/');
        }
    }, []);

    return (
        <Container fluid className="ListContainer">
            <Row>
                <Col xs={2}>
                    <TaskSidebar currentView={currentView} />
                </Col>
                <Col xs={10}><CustomCalendar></CustomCalendar></Col>
            </Row>
        </Container>
    );
}

export default CalendarLoad;