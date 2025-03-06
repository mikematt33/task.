import React, { useState } from 'react';
import { Modal, Button, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import ErrorModal from "./ErrorModal";

const ChangeEmailPopup = ({ show, close }) => {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [currentErrorMessage, setCurrentErrorMessage] = useState("Error ...");

  const handleClose = () => {
    setEmail('');
    setConfirmEmail('');
    setError('');
    close();
  };

  const handleShowErrorModal = (message) => {
    setCurrentErrorMessage(message)
    setShowErrorModal(true);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setCurrentErrorMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    const userId = jwtDecode(token).id;

    if (!email || !confirmEmail) {
      handleShowErrorModal('Both fields are required');
        console.error('Both fields are required');
        return;
    }

    try {
      const response = await fetch('http://localhost:3006/api/v1/auth/updateEmail', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: userId, newEmail: email, confirmNewEmail: confirmEmail })
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 400) {
          setTimeout(() => setError(data.error), 200);
        }
        throw new Error(data.error);
      }

      handleClose();

    } catch (error) {
      console.error('Error updating email:', error);
    }
    
  };

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="change-email-modal" animation={false} >
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          errorMessage={currentErrorMessage}
          handleClose={handleCloseErrorModal}
        ></ErrorModal>
      )}
      <Modal.Header>
        <button type="button" className="btn-close-custom" onClick={handleClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="8" fill="#FF4040"/>
            <path d="M5.17188 10.8284L10.8287 5.17151" stroke="#990100" strokeWidth="2" strokeLinecap="round"/>
            <path d="M5.17188 5.17163L10.8287 10.8285" stroke="#990100" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <Modal.Title>Change Email</Modal.Title>
      </Modal.Header>
      <br></br>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>New Email</FormLabel>
            <FormControl
              type="email"
              placeholder="Enter new email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>
          <br>
          </br>
          <FormGroup>
            <FormLabel>Confirm New Email</FormLabel>
            <FormControl
              type="email"
              placeholder="Confirm new email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
            />
          </FormGroup>
          {error && <p style={{marginTop: '15px', color: '#FF4040', textAlign: 'center', marginBottom: '-5px'}}>{error}</p>}
          <Button className="update-email-btn" type="submit" style={{marginTop: '15px', marginRight: '10px', float: 'right'}}>
            Update Email
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangeEmailPopup;

