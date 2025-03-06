import React, { useState, useEffect, useRef } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import CustomToolbar from './calendarToolbar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchUserEventsByID, fetchUserSettings } from '../../actions';
import { jwtDecode } from 'jwt-decode';
import MonthEvent from './monthEvent';
import WeekEvent from './weekEvent';
import DayEvent from './dayEvent';

const localizer = momentLocalizer(moment);

const CustomCalendar = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [currentView, setCurrentView] = useState('month');
    const [currentFilter, setCurrentFilter] = useState('all');
    const tooltipVisibleRef = useRef(null);
    const lastEventRef = useRef(null);

    const formats = {
        dateFormat: 'D',
        weekdayFormat: (date, culture, localizer) =>
            localizer.format(date, 'dddd', culture),
        dayFormat: (date, culture, localizer) =>
            localizer.format(date, 'dddd Do', culture),
        timeGutterFormat: (date, culture, localizer) =>
            localizer.format(date, 'hh:mm a', culture),
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = jwtDecode(token).id;

        fetchUserEventsByID(userId)
            .then(data => {
                const transformedEvents = data.map(event => {
                    let start = event.start;
                    let end = event.end;
                    if (start === null) {
                        start = new Date(event.end);
                        end = new Date(event.end);
                        event.nullStart = true;
                    } else {
                        start = new Date(start);
                        end = new Date(end);
                        event.nullStart = false;
                    }
                    return {
                        ...event,
                        start,
                        end,
                    };
                });
                setEvents(transformedEvents);
            })
            .catch(error => {
                console.error('Error fetching calendar events:', error);
            });
    }, []);

    useEffect(() => {
        let filtered = events;
        switch (currentFilter) {
            case 'events':
                filtered = events.filter(event => event.nullStart === false);
                break;
            case 'tasks':
                filtered = events.filter(event => event.nullStart === true);
                break;
            case 'overdue':
                filtered = events.filter(event => event.end < new Date());
                break;
            default:
                break;
        }
        setFilteredEvents(filtered);
    }, [currentFilter, events]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = jwtDecode(token).id;

        fetchUserSettings(userId)
            .then(settings => {
                const settingsView = settings.default_cal_view;
    
                if (settingsView) {
                    setCurrentView(settingsView);
                }
            })
            .catch(error => {
                console.error('Error fetching user settings:', error);
            });
    }, []);

    const setTooltipVisible = (eventId, visible) => {
        if (visible) {
            tooltipVisibleRef.current = eventId;
            lastEventRef.current = eventId;
        } else if (lastEventRef.current === eventId) {
            tooltipVisibleRef.current = null;
        }
    };

    const handleViewChange = view => {
        setCurrentView(view);
    };

    return (
        <div className='App'>
            <Calendar
                views={['month', 'week', 'day']}
                localizer={localizer}
                defaultDate={new Date()}
                view={currentView}
                events={filteredEvents}
                style={{ height: '100vh' }}
                dayLayoutAlgorithm={'no-overlap'}
                formats={formats}
                onView={handleViewChange}
                components={{
                    toolbar: props => <CustomToolbar {...props} currentView={currentView} currentFilter={currentFilter} setFilter={setCurrentFilter} />,
                    month: { event: ({ event }) => <MonthEvent 
                                                        event={event} 
                                                        tagName={Object.keys(event.tags)[0]} 
                                                        tagValue={Object.values(event.tags)[0]}
                                                        setTooltipVisible={setTooltipVisible} 
                                                    /> },
                    week: { event: ({ event }) => <WeekEvent 
                                                        title={event.title} 
                                                        tagName={Object.keys(event.tags)[0]} 
                                                        tagValue={Object.values(event.tags)[0]}
                                                        endDate={event.end} 
                                                    /> },
                    day: { event: ({ event }) => <DayEvent 
                                                        title={event.title} 
                                                        tagName={Object.keys(event.tags)[0]} 
                                                        tagValue={Object.values(event.tags)[0]} 
                                                        endDate={event.end} 
                                                    />,}
                }}
                popup
            />
        </div>
    );
};

export default CustomCalendar;
