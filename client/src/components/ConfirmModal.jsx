import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ConfirmModal = ({ show, handleClose, handleConfirm, message, title }) => {
    return (
        <Modal show={show} onHide={handleClose} centered data-bs-theme={'dark'}>
            <Modal.Header closeButton style={{backgroundColor: '#1C1C1C', borderColor: '#575757'}}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{backgroundColor: '#1C1C1C', borderColor: '#575757'}}>
                <p dangerouslySetInnerHTML={{ __html: message }}></p>
            </Modal.Body>
            <Modal.Footer style={{backgroundColor: '#1C1C1C', borderColor: '#575757'}}>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button id='confirm-modal-yes' variant="primary" onClick={handleConfirm} style={{background: 'transparent', borderColor: 'rgba(255, 64, 64, .9)', color: 'rgba(255, 64, 64, .9)'}}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;