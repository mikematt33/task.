import React from 'react';
import { Navigate } from 'react-big-calendar';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';

function CustomToolbar(props) {
    const { label, currentView, onNavigate, onView, currentFilter, setFilter} = props;

    const navigate = action => {
        onNavigate(action);
    };

    const view = view => {
        onView(view);
    };

    const filter = filter => {
        setFilter(filter);
    };

    const capitalizeFirstLetter = string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div style={{ padding: '5px 0', backgroundColor: '#232323' }}>
            <Button variant="link" className="toolbar-button" onClick={() => navigate(Navigate.TODAY)}>Today</Button>
            <Button variant="link" className="toolbar-button" onClick={() => navigate(Navigate.PREVIOUS)}>{"<"}</Button>
            <span className="toolbar-date">{label}</span>
            <Button variant="link" className="toolbar-button" onClick={() => navigate(Navigate.NEXT)}>{">"}</Button>
            
            <div style={{ float: 'right', marginRight: '75px', display: 'flex', flexDirection: 'row' }}>
                <Dropdown onSelect={filter} style={{ marginRight: '30px' }}>
                    <Dropdown.Toggle variant='success' id="dropdown-basic" className='custom-toggle'>
                        {capitalizeFirstLetter(currentFilter)}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className='custom-menu'>
                        <Dropdown.Item eventKey="all">All</Dropdown.Item>
                        <Dropdown.Item eventKey="events">Events</Dropdown.Item>
                        <Dropdown.Item eventKey="tasks">Tasks</Dropdown.Item>
                        <Dropdown.Item eventKey="overdue">Overdue</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                
                <Dropdown onSelect={view}>
                    <Dropdown.Toggle variant='success' id="dropdown-basic" className='custom-toggle'>
                        {capitalizeFirstLetter(currentView)}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className='custom-menu'>
                        <Dropdown.Item eventKey="month">Month</Dropdown.Item>
                        <Dropdown.Item eventKey="week">Week</Dropdown.Item>
                        <Dropdown.Item eventKey="day">Day</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
}

export default CustomToolbar;
