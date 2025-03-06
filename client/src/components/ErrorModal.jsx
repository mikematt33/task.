import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ErrorModal = ({ show, errorMessage, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} centered data-bs-theme={'dark'}>
            <Modal.Header closeButton style={{ backgroundColor: '#1C1C1C', borderColor: '#575757' }}>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: '#1C1C1C', borderColor: '#575757' }}>{errorMessage}</Modal.Body>
            <Modal.Footer style={{ backgroundColor: '#1C1C1C', borderColor: '#575757' }}>
                <Button id='error-modal-close' variant="secondary" onClick={handleClose} style={{background: 'transparent', color: '#8E00FD', border: 'none'}}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ErrorModal;
