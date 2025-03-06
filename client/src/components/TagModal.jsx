import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { HexColorPicker } from 'react-colorful';
import { fetchAllTagByUserID, createTag, deleteTag } from '../actions';
import { jwtDecode } from 'jwt-decode';
import ConfirmModal from './ConfirmModal';

const TagModal = ({ show, handleClose, savedTags }) => {
  const [color, setColor] = useState('#5F5F5F');
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [originalTags, setOriginalTags] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tagIdToDelete, setTagIdToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = jwtDecode(token).id;

    setOriginalTags(savedTags);
    setSelectedTags(savedTags);

    fetchAllTagByUserID(userId)
      .then(data => {
        data = data.map(tag => ({...tag, text: tag.name}));
        if (savedTags.length > 0) {
          data = data.filter(tag => savedTags.every(savedTag => savedTag.id !== tag.id));
        }
        setTags(data);
      })
      .catch(error => {
        console.error('Error fetching tags:', error);
      });
  }, []);

  const handleCloseTagModal = () => {
    handleClose(originalTags);
  };

  const handleCreateTag = async () => {
    if (inputValue.trim()) {
      const token = localStorage.getItem('token');
      const userId = jwtDecode(token).id;

      const newTag = {
        user_id: userId,
        name: inputValue.trim(),
        color: color, 
      };

      await createTag(newTag);

      setTags(currentTags => [...currentTags, newTag]);
      setInputValue(''); 
    }
  };

  const handleSaveTags = () => {
    handleClose(selectedTags);
  };

  const handleSelectTag = (tag) => {
    setSelectedTags([...selectedTags, tag]);
    setTags(tags.filter(t => t.id !== tag.id)); //removes from the lower area
  };
  
  const handleDeselectTag = (tagId) => {
    const tagToDeselect = selectedTags.find(t => t.id === tagId);
    setTags([...tags, tagToDeselect]); //adds it back to the lower area
    setSelectedTags(selectedTags.filter(t => t.id !== tagId)); //removes it from the selected area
  };   
  
  const handleDeleteTag = (tagId, e) => {
    e.stopPropagation();
    setTagIdToDelete(tagId);
    setShowConfirmModal(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirmModal(false);
  }

  const handleConfirm = async () => {
    if (tagIdToDelete) {
      const token = localStorage.getItem('token');
      const userId = jwtDecode(token).id;
      try {
        await deleteTag(tagIdToDelete, userId);
      } catch (error) {
        console.error('Error deleting tag:', error);
      }
      setTags(tags.filter(tag => tag.id !== tagIdToDelete));
      setSelectedTags(selectedTags.filter(tag => tag.id !== tagIdToDelete));
      setTagIdToDelete(null);
    }
    setShowConfirmModal(false);
  };

  return (
    <Modal show={show} onHide={handleCloseTagModal} centered dialogClassName="tagModal" animation={false}>
      <Modal.Body>
        <div className="tag-display-area">
          {tags.map(tag => (
            <div key={tag.id} className="tag-item" style={{ backgroundColor: tag.color }} onClick={() => handleSelectTag(tag)}>
              <img src="/images/RemoveTag.svg" alt="Delete" onClick={(e) => {
                e.stopPropagation();
                handleDeleteTag(tag.id, e);
              }} />
              <span>{tag.name}</span>
            </div>
          ))}
        </div>
        <div className="create-tag-header">Create New Tag:</div>
        <div id='tag-input-name' className="tag-input-area">
          <input 
            type="text" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter tag name"
          />
        </div>
        <div className="attach-to-tag-header">Attach to Task:</div>
        <div className="selected-tags-area">
          {selectedTags.map(tag => (
            <div key={tag.id} className="selected-tag-item" style={{ backgroundColor: tag.color }} onClick={() => handleDeselectTag(tag.id)}>
              <span>{tag.name}</span>
            </div>
          ))}
        </div>
        <Button className="save-button" onClick={handleSaveTags}>Save</Button>
        <div className="color-picker-container">
          <HexColorPicker color={color} onChange={setColor} />
        </div>
        <Button className={inputValue.trim() ? "create-button" : "create-button-incomplete"} onClick={handleCreateTag} disabled={!inputValue.trim()}>Create</Button>
      </Modal.Body>
      <ConfirmModal 
        show={showConfirmModal} 
        handleClose={handleCloseConfirm} 
        handleConfirm={handleConfirm} 
        message="Are you sure you want to continue? <br>(This will remove the tag from all tasks)"
        title="Delete Tag?"
      />
    </Modal>
  );
};

export default TagModal;
