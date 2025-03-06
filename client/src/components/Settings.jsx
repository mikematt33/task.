import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
} from "react-bootstrap";
import EmailPopup from './EmailPopup';
import PasswordPopup from './PasswordPopup';
import { fetchUserSettings , updateUserSettings, deleteUser } from '../actions';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from "./ConfirmModal";

function Settings({ show, close }) {
  const navigate = useNavigate();
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [settings, setSettings] = useState({
    default_cal_view: "month",
    at_a_glance: 1,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userId = jwtDecode(token).id;
      fetchUserSettings(userId)
        .then(fetchedSettings => {
          setSettings(fetchedSettings);
        })
        .catch(error => {
          console.error('Error fetching user settings:', error);
        });
    }
  }, []);

  const handleEmailOpen = () => {
    setHidden(false);
    setShowEmailPopup(true); }

  const handlePasswordOpen = () => {
    setHidden(false); 
    setShowPasswordPopup(true); }

  const handleClose = () => {
      setShowEmailPopup(false);
      setShowPasswordPopup(false);
      setHidden(true);
  };

  const handleViewChange = (e) => {
    const newSettingValue = e.target.value;
    setSettings(prevSettings => ({ ...prevSettings, default_cal_view: newSettingValue }));
  };
  
  const handleAtAGlanceViewChange = (event) => {
    const newSettingValue = event.target.value;
    setSettings(prevSettings => ({ ...prevSettings, at_a_glance: parseInt(newSettingValue, 10) }));
  };

  function handleLogOut() {
    localStorage.removeItem('token');
    navigate('/');
}

  const handleCloseConfirm = () => {
    setShowConfirmModal(false);
  }

  const handleConfirm = async () => {
    const userID = jwtDecode(localStorage.getItem('token')).id;
    await deleteUser(userID);
    setShowConfirmModal(false);

    handleLogOut();
  };

  const handleDeleteAccount = async () => {
    setShowConfirmModal(true);
  };

  const handleSaveSettings = async () => {
    const token = localStorage.getItem('token');
      if (token) {
        const userId = jwtDecode(token).id;
        updateUserSettings(userId, settings)
          .then(message => {
            window.location.reload()
          })
          .catch(error => {
            console.error('Error updating settings:', error);
            alert('Error updating settings. Please try again.');
          });
       }
    };

  return ( 
    <>
      <Modal show={show && hidden} onHide={close} centered className="settings-modal" animation={false}>
        <Modal.Header className="settings-modal-header">
          <Modal.Title className="settings-modal-title">
            Settings
            <button type="button" className="btn-close-icon" onClick={close} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w456y7tyuhjnb.org/2000/svg">
            <circle cx="8" cy="8" r="8" fill="#FF4040"/>
            <path d="M5.17188 10.8284L10.8287 5.17151" stroke="#990100" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5.17188 5.17163L10.8287 10.8285" stroke="#990100" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
          </Modal.Title>
        </Modal.Header>
        <br></br>
        <Modal.Body className="setting-modal-body">
          <Form>
            <center>
              <Form.Group>
                {["radio"].map((type) => (
                  <div key={`inline-${type}`} className="settings-form-1">
                    Default Calender View: &thinsp;
                    <Form.Check
                      inline
                      label="Monthly"
                      name="group1"
                      type={type}
                      value = "month"
                      id={`inline-${type}-1`}
                      checked={settings.default_cal_view === 'month'} 
                      onChange={handleViewChange}
                    />
                    <Form.Check
                      inline
                      label="Weekly"
                      name="group1"
                      value = "week"
                      type={type}
                      id={`inline-${type}-1`}
                      checked={settings.default_cal_view === 'week'} 
                      onChange={handleViewChange}
                    />
                    <Form.Check
                      inline
                      label="Daily"
                      name="group1"
                      type={type}
                      value = "day"
                      id={`inline-${type}-1`}
                      checked={settings.default_cal_view === 'day'} 
                      onChange={handleViewChange}
                    />
                  </div>
                ))}
              </Form.Group>
            </center>
            <br></br>
            <center>
              <Form.Group>
                {["radio"].map((type) => (
                  <div key={`inline-${type}`} className="settings-form-2">
                    "At a Glance" view: &thinsp;
                    <Form.Check
                      inline
                      label="Both"
                      name="group2"
                      type={type}
                      value = "1"
                      id={`inline-${type}-1`}
                      checked={settings.at_a_glance === 1} 
                      onChange={handleAtAGlanceViewChange}
                    />
                    <Form.Check
                      inline
                      label="Task Only"
                      name="group2"
                      type={type}
                      value = "2"
                      id={`inline-${type}-1`}
                      checked={settings.at_a_glance === 2} 
                      onChange={handleAtAGlanceViewChange}
                    />
                    <Form.Check
                      inline
                      label="Event Only"
                      name="group2"
                      type={type}
                      value = "3"
                      id={`inline-${type}-1`}
                      checked={settings.at_a_glance === 3} 
                      onChange={handleAtAGlanceViewChange}
                    />
                  </div>
                ))}
              </Form.Group>
            </center>
            <br></br>
          </Form>
          <a className="change-email-link" onClick={handleEmailOpen}> Change Email </a>
          <br></br>
          <br></br>
          <a className="change-password-link" onClick={handlePasswordOpen}> Change Password </a>
          <a className="delete-account-link" style={{cursor: 'pointer'}} onClick={handleDeleteAccount}>Delete Account</a>
          <br></br>
          <br></br>
          <Button className="save-settings-btn" variant="primary" onClick={handleSaveSettings}>
            <b>Save Settings</b>
          </Button>
          <br></br>
        </Modal.Body>
      </Modal>
      <EmailPopup show={showEmailPopup} close={handleClose} />
      <PasswordPopup show={showPasswordPopup} close={handleClose} />
      <ConfirmModal 
        show={showConfirmModal} 
        handleClose={handleCloseConfirm} 
        handleConfirm={handleConfirm} 
        message="Are you sure you want to delete your arrount? <br>(This will remove all tasks and events associated with your account)"
        title="Delete Account?"
      />

    </>
  );
}
export default Settings; 