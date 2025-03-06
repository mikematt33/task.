import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Settings from './Settings';
import SidebarGlance from './calendar/sidebarGlance';

function TaskSidebar({ currentView, onSelectTag }) {
    const navigate = useNavigate();
    const [showSettings, setShowSettings] = useState(false);

    function handleLogOut() {
        localStorage.removeItem('token');
        navigate('/');
    }

    function handleViewChange(view) {
        if (view === 'task') {
            navigate('/list');
        } else if (view === 'calendar') {
            navigate('/calendar');
        }
    }

    const handleSettingsOpen = () => setShowSettings(true);

    const handleClose = () => {
        setShowSettings(false);
    };

    return (
        <div className={currentView === 'calendar' ? 'sidebar-outline' : ''}>
            <img className='task-logo' src={process.env.PUBLIC_URL + '/images/taskLogo.svg'} alt="task logo" />
            <Button className={currentView === 'calendar' ? 'button-select-calendar' : 'button-select-default'} onClick={() => handleViewChange('calendar')}>Calendar</Button>
            <Button className={currentView === 'task' ? 'button-select-task' : 'button-select-default'} onClick={() => handleViewChange('task')}>List</Button>
            <div className='sidebar-middle'><SidebarGlance currentView={currentView} onSelectTag={onSelectTag} /></div>
            <div className='sidebar-bottom'>
                <Button className='logout' onClick={handleSettingsOpen}><i id='settings-icon' className="bi bi-gear"></i><span className='logout-text'>Settings</span></Button>
                <Button className='logout' onClick={handleLogOut}><i id='logout-icon' className="bi bi-box-arrow-left"></i><span className='logout-text'>Logout</span></Button>
            </div>
            <Settings show={showSettings} close={handleClose} />
        </div>
    );
}

export default TaskSidebar;