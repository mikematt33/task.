import React, { useState, useEffect, useCallback } from 'react';
import { fetchFirstTagByID } from '../../actions';
import { Tooltip } from 'react-tooltip';
import { Dropdown } from 'react-bootstrap';
import Markdown from 'react-markdown';

function formatTimeDifference(startDate, endDate) {
    const timeDiff = Math.abs(endDate - startDate);

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    let formattedDifference = '';

    if (hours > 0) {
        formattedDifference += `${hours} hr`;
        if (hours !== 1) {
            formattedDifference += 's';
        }
    }

    if (minutes > 0) {
        if (formattedDifference !== '') {
            formattedDifference += ', ';
        }
        formattedDifference += `${minutes} min`;
    }

    return formattedDifference;
}

function getRelativeDate(date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()) {
        return 'Today';
    }

    if (date.getFullYear() === tomorrow.getFullYear() &&
        date.getMonth() === tomorrow.getMonth() &&
        date.getDate() === tomorrow.getDate()) {
        return 'Tomorrow';
    }

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = weekdays[date.getDay()];
    return dayOfWeek;
}

function formatDate(date) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const suffixes = ['th', 'st', 'nd', 'rd'];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const suffix = (day % 10 === 1 && day !== 11) ? suffixes[1] : 
                   (day % 10 === 2 && day !== 12) ? suffixes[2] :
                   (day % 10 === 3 && day !== 13) ? suffixes[3] : suffixes[0];

    const period = hours >= 12 ? 'pm' : 'am';
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;

    // Add leading zero to minutes if less than 10
    const formattedMinutes = minutes < 10 ? `:0${minutes}` : `:${minutes}`;

    return `${month} ${day}${suffix}, ${hour12}${formattedMinutes}${period}`;
}

async function deleteSingleEvent(eventId) {
    try {
        const response = await fetch(`http://localhost:3006/api/v1/tasks/deleteTask/${eventId}`, {
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

async function deleteAllEvents(eventId) {
    try {
        const response = await fetch(`http://localhost:3006/api/v1/tasks/deleteAllTasks/${eventId}`, {
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

const MonthEvent = ({ tagName, tagValue, event, setTooltipVisible }) => {
    const [color, setColor] = useState('#000');
    const [isPastEvent, setIsPastEvent] = useState(false);

    const eventId = `month-calendar-${event.uid}`;

    const fetchTagColor = async (tagValue) => {
        try {
            const tagInfo = await fetchFirstTagByID(tagValue);
            setColor(tagInfo.color); 
        } catch (error) {
            console.error('Error fetching tag color:', error);
        }
    };

    const capitalizeFirstLetter = string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const checkIfPastEvent = useCallback(() => {
        const now = new Date();
        const eventEndDate = new Date(event.end);
        if (eventEndDate < now) {
            setIsPastEvent(true);
        }
    }, [event.end]);

    useEffect(() => {
        if (tagName) {
            fetchTagColor(tagValue);
        }
        checkIfPastEvent();
    }, [tagName, tagValue, checkIfPastEvent]);

    return (
        <div>
            <Tooltip 
                id={eventId} 
                openOnClick 
                clickable
                positionStrategy='fixed' 
                border='1.5px solid #393939' 
                classNameArrow='custom-arrow' 
                borderRadius='20px'
                className='custom-tooltip' 
                opacity={.95}
                style={{ zIndex: 1000 }}
                afterShow={() => setTooltipVisible(eventId, true)}
                afterHide={() => setTooltipVisible(eventId, false)}
                >
                <div style={{cursor: 'text', userSelect: 'text'}}>
                    <h5>{event.title}</h5>
                    <p>
                        <span style={{ display: event.nullStart ? 'inline-block' : 'none', opacity: '0.35', marginRight: '5px' }}>Due</span>
                        <span style={{ color: isPastEvent ? 'rgb(255, 64, 64)' : color, marginRight: '5px' }}>
                            {getRelativeDate(new Date(event.start))} {formatDate(new Date(event.start))}
                        </span>
                        <span style={{ display: event.nullStart ? 'none' : 'inline-block', opacity: '0.35', marginRight: '5px' }}>
                            ({formatTimeDifference(event.start, event.end)})
                        </span>
                        <span style={{ display: Object.keys(event.repeating).length === 0 ? 'none' : 'block', opacity: '0.35', marginRight: '5px' }}>
                            {event.repeating.frequency ? (event.repeating.frequency === 'None' ? '' : `Occurs ${capitalizeFirstLetter(event.repeating.frequency)}`) : ''}
                        </span>
                    </p>
                    <div className="rbc-month-divider"></div>
                    <div style={{overflowY: 'scroll', maxHeight: '400px', maxWidth: '300px', wordBreak: 'break-word'}}>
                        <Markdown>{event.body}</Markdown>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Dropdown>
                            <Dropdown.Toggle className='custom-tooltip-dropdown-delete-button'>
                                Delete
                            </Dropdown.Toggle>

                            <Dropdown.Menu variant='dark' renderOnMount popperConfig={{ strategy: 'fixed' }} style={{ fontSize: '12px' }}>
                                <Dropdown.Item onClick={() => deleteSingleEvent(event.uid)}>Delete this event in series</Dropdown.Item>
                                <Dropdown.Item onClick={() => deleteAllEvents(event.uid)}>Delete all events in series</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </Tooltip>
            <div data-tooltip-id={eventId}
                style={{
                    backgroundColor: '#393939',
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                }}>
                <div style={{
                    height: '30px',
                    width: '4%',
                    backgroundColor: isPastEvent ? 'rgb(255, 64, 64)' : color,
                    marginRight: '5px',
                    borderRadius: '5px',
                }} />
                <span style={{
                    fontSize: '14px',
                    marginLeft: '2px',
                }}>{event.title}</span>
            </div>
        </div>
    );
};

export default MonthEvent;