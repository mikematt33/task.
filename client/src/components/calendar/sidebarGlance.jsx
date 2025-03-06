import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import { fetchUserEventsByID, fetchUserSettings, fetchFirstTagByID } from '../../actions';
import TaskView from '../TaskView';

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

function formatTime12Hr(date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

function formatDateSlash(date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.setHours(0,0,0,0) === today.setHours(0,0,0,0)) {
        return 'Today';
    } else if (date.setHours(0,0,0,0) === tomorrow.setHours(0,0,0,0)) {
        return 'Tomorrow';
    } else if (date.setHours(0,0,0,0) === yesterday.setHours(0,0,0,0)) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
}

const EventDisplay = ({ event }) => {
    return (
        event.start !== null ? 
        <div id={event.id} style={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '7px', fontSize: '12px' }}>
                <p style={{ marginBottom: '4px' }}>{formatTime12Hr(event.start)}</p>
                <p style={{ marginBottom: '4px' }}>{formatTimeDifference(event.start, event.end)}</p>
            </div>
            <div style={{ height: '50px', width: '4px', backgroundColor: event.color, marginRight: '7px', borderRadius: '10px' }}></div>
            <div style={{ marginRight: '7px', fontSize: '12px' }}>
                <p style={{ fontSize: '12px', marginBottom: '4px' }}>{event.title}</p>
                <p style={{ fontSize: '12px', marginBottom: '4px', opacity: '.5' }}>{formatDateSlash(event.end)}</p>
            </div>
        </div>
        :
        <div id={event.id} style={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
            <p style={{ marginBottom: '5px', fontSize: '12px', marginRight: '7px' }}>{formatTime12Hr(event.end)}</p>
            <div style={{ height: '50px', width: '4px', backgroundColor: event.color, marginRight: '7px', borderRadius: '10px' }}></div>
            <div style={{ marginRight: '7px', fontSize: '12px' }}>
                <p style={{ fontSize: '12px', marginBottom: '4px' }}>{event.title}</p>
                <p style={{ fontSize: '12px', opacity: '.5', marginBottom: '4px' }}>Due {formatDateSlash(event.end)}</p>
            </div>
        </div>
    );
};

const OverdueEventDisplay = ({ event }) => {
    return (
        event.start !== null ? 
        <div id={event.id} style={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '7px', fontSize: '12px' }}>
                <p style={{ marginBottom: '4px' }}>{formatTime12Hr(event.start)}</p>
            </div>
            <div style={{ height: '50px', width: '4px', backgroundColor: 'rgba(255, 64, 64, .75)', marginRight: '7px', borderRadius: '10px' }}></div>
            <div style={{ marginRight: '7px', fontSize: '12px' }}>
                <p style={{ fontSize: '12px', marginBottom: '4px' }}>{event.title}</p>
                <p style={{ color: 'rgba(255, 64, 64, .75)', fontSize: '12px', marginBottom: '4px', opacity: '.5' }}>{formatDateSlash(event.end)}</p>
            </div>
        </div>
        :
        <div id={event.id} style={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
            <p style={{ marginBottom: '5px', fontSize: '12px', marginRight: '7px' }}>{formatTime12Hr(event.end)}</p>
            <div style={{ height: '50px', width: '4px', backgroundColor: 'rgba(255, 64, 64, .75)', marginRight: '7px', borderRadius: '10px' }}></div>
            <div style={{ marginRight: '7px', fontSize: '12px' }}>
                <p style={{ fontSize: '12px', marginBottom: '4px' }}>{event.title}</p>
                <p style={{ color: 'rgba(255, 64, 64, .75)', fontSize: '12px', opacity: '.5', marginBottom: '4px' }}>Due {formatDateSlash(event.end)}</p>
            </div>
        </div>
    );
};

// Custom hook for data fetching
const useCalendarData = () => {
    const [events, setEvents] = useState([]);
    const [overdueEvents, setOverdueEvents] = useState([]);

    const fetchTagColor = async (tagValue) => {
        try {
            const tagInfo = await fetchFirstTagByID(tagValue);
            return tagInfo.color;
        } catch (error) {
            console.error('Error fetching tag color:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = jwtDecode(token).id;
        let glanceView = 1;

        fetchUserSettings(userId)
            .then(settings => {
                glanceView = settings.at_a_glance;
            })
            .catch(error => {
                console.error('Error fetching user settings:', error);
            });

        fetchUserEventsByID(userId)
        .then(async data => {
            let transformedEvents = await Promise.all(data.map(async event => {
                let eventWithColor = {
                    ...event,
                    start: event.start ? new Date(event.start) : null,
                    end: new Date(event.end),
                };
                
                try {
                    const color = await fetchTagColor(Object.values(event.tags)[0]);
                    eventWithColor.color = color;
                } catch (error) {
                    console.error('Error fetching tag color:', error);
                }
    
                return eventWithColor;
            }));

                if (glanceView === 2) {
                    transformedEvents = transformedEvents.filter(event => event.start === null);
                } else if (glanceView === 3) {
                    transformedEvents = transformedEvents.filter(event => event.start !== null);
                }

                const overdue = transformedEvents.filter(event => event.end < new Date());
                setOverdueEvents(overdue);

                transformedEvents = transformedEvents.filter(event => event.end >= new Date());

                setEvents(transformedEvents);
            })
            .catch(error => {
                console.error('Error fetching calendar events:', error);
            });
    }, []);

    return { events, overdueEvents };
};

// Component for "At A Glance" section
const AtAGlance = ({ events }) => {
    // Sort events by event.end
    const sortedEvents = [...events].sort((a, b) => new Date(a.end) - new Date(b.end));

    return (
        <div className="sidebar-glace">
            {sortedEvents.length > 0 ? 
                sortedEvents.map((event) => <EventDisplay key={event.uid} event={event} />)
                : 
                <p style={{ fontSize: '14px', opacity: '.65' }}>No events</p>
            }
        </div>
    );
};

// Component for "Overdue" section
const Overdue = ({ overdueEvents }) => {
    // Sort overdueEvents by event.end
    const sortedOverdueEvents = [...overdueEvents].sort((a, b) => new Date(a.end) - new Date(b.end));

    return (
        <div className="sidebar-overdue">
            {sortedOverdueEvents.length > 0 ? 
                sortedOverdueEvents.map((event) => <OverdueEventDisplay key={event.uid} event={event} />)
                : 
                <p style={{ fontSize: '14px', opacity: '.65' }}>No overdue events</p>
            }
        </div>
    );
};

// Main component
const CalendarView = () => {
    const { events, overdueEvents } = useCalendarData();

    return  <div>
                <h4><b>At A Glance</b></h4>
                <AtAGlance events={events} />
                <h4><b>Overdue</b></h4>
                <Overdue overdueEvents={overdueEvents} />
            </div>;
};

const SidebarGlance = ({ currentView, onSelectTag }) => {
    const renderView = () => {
        switch(currentView) {
            case 'calendar':
                return <CalendarView />;
            case 'task':
                return <TaskView onSelectTag={onSelectTag} />;
            default:
                return null;
        }
    }

    return (
        <>
            {renderView()}
        </>
    );
};

export default SidebarGlance;
