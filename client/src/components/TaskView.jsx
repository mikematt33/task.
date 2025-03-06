import React, { useState, useEffect } from 'react';
import { fetchAllTagByUserID, fetchUserEventsByID } from '../actions';
import { jwtDecode } from 'jwt-decode';
import Button from 'react-bootstrap/Button';

const TaskView = ({ onSelectTag }) => {
    const [selectedTagEvents, setSelectedTagEvents] = useState([{}]);
    const [currentTags, setCurrentTags] = useState([]);
    const [currentSelectedTag, setcurrentSelectedTag] = useState('All');

    function handleTagChange(tagName, tagID) {
        setcurrentSelectedTag(tagID);

        if (tagName !== 'All') {
            fetchUserEventsByID(jwtDecode(localStorage.getItem('token')).id)
                .then(data => {
                    const filteredData = data.filter(event => Object.values(event.tags).includes(tagID));
                    setSelectedTagEvents(filteredData);
                    onSelectTag(filteredData);
                })
                .catch(error => {
                    console.error('Error fetching and filtering tag events:', error);
                });
        } else {
            fetchUserEventsByID(jwtDecode(localStorage.getItem('token')).id)
                .then(data => {
                    setSelectedTagEvents(data);
                    onSelectTag(data);
                })
                .catch(error => {
                    console.error('Error fetching and filtering tag events:', error);
                });
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = jwtDecode(token).id;

        fetchAllTagByUserID(userId)
            .then(data => {
                setCurrentTags(data);
                handleTagChange('All', 0);
            })
            .catch(error => {
                handleTagChange('All', 0);
                console.error('Error fetching tags:', error);
            });

    }, []);

    return <div>
                <h5>My Lists</h5>
                <div style={{maxHeight: '59vh', overflowX: 'scroll'}}>
                    <Button className={currentSelectedTag === 0 ? 'button-select-task' : 'button-select-default'} onClick={() => handleTagChange('All', 0)}>All</Button>
                    {currentTags.map(tag => {
                        return <Button className={currentSelectedTag === tag.id ? 'button-select-task' : 'button-select-default'} key={tag.id} onClick={() => handleTagChange(tag.name, tag.id)}>
                            {tag.name}
                        </Button>;
                    })}
                </div>
            </div>;
};

export default TaskView;