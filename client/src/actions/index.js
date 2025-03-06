export const fetchUserEventsByID = (userId) => {
    return fetch(`http://localhost:3006/api/v1/tasks/getAllTasksByID/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.data) {
                return data.data.calendar_events;
            } else {
                return [];
            }
        })
        .catch(error => {
            console.error('Error fetching user events:', error);
            throw error;
        });
};

export const fetchFirstTagByID = (tagID) => {
    return fetch(`http://localhost:3006/api/v1/tags/getTagsByID/${tagID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => data.data.tags[0])
        .catch(error => {
            console.error('Error fetching tag:', error);
            throw error;
        });
};

export const fetchAllTagByUserID = (userID) => {
    return fetch(`http://localhost:3006/api/v1/tags/getAllTagsByUserID/${userID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => data.data.tags)
        .catch(error => {
            console.error('Error fetching tag:', error);
            throw error;
        });
};


export const fetchTaskByTaskID = (uid) => {
    return fetch(`http://localhost:3006/api/v1/tasks/getTaskByTaskID/${uid}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.data) {
                return data.data.task_info;
            } else {
                return [];
            }
        })
        .catch(error => {
            console.error('Error fetching user events:', error);
            throw error;
        });
};

export const setTaskByTaskID = (uid, contents) => {
    return fetch(`http://localhost:3006/api/v1/tasks/updateTaskByTaskID/${uid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: contents
            })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.data) {
                return data.data.task_info;
            } else {
                return [];
            }
        })
        .catch(error => {
            console.error('Error fetching user events:', error);
            throw error;
        });
};

export const setTaskDateByTaskID = (uid, contents) => {
    return fetch(`http://localhost:3006/api/v1/tasks/updateTaskDateByTaskID/${uid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: contents
            })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.data) {
                return data.data.task_info;
            } else {
                return [];
            }
        })
        .catch(error => {
            console.error('Error fetching user events:', error);
            throw error;
        });
};

export const setTaskTagsByTaskID = (uid, contents) => {
    return fetch(`http://localhost:3006/api/v1/tasks/updateTaskTagsByTaskID/${uid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: contents
            })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.data) {
                return data.data.task_info;
            } else {
                return [];
            }
        })
        .catch(error => {
            console.error('Error fetching user events:', error);
            throw error;
        });
};

export const fetchUserSettings = (userId) => {
    return fetch(`http://localhost:3006/api/v1/users/getUserSettings/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.data) {
                return data.data.settings;
            } else {
                return {};
            }
        })
        .catch(error => {
            console.error('Error fetching user settings:', error);
            throw error;
        });
};

export const updateUserSettings = (userId, updatedSettings) => {
    return fetch(`http://localhost:3006/api/v1/users/updateSettings/${userId}`, {
        method: 'PUT', // Use PUT since we are updating existing data
        headers: {
            'Content-Type': 'application/json', // Specify the content type as JSON
        },
        body: JSON.stringify({ settings: updatedSettings }), // Stringify the updated settings object
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        return data.message; // Assuming the server responds with a message upon success
    })
    .catch(error => {
        console.error('Error updating user settings:', error);
        throw error;
    });
};

export const createTask = (task) => {
    return fetch('http://localhost:3006/api/v1/tasks/createTask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.data) {
            return data.data.task_info;
        } else {
            return [];
        }
    })
    .catch(error => {
        console.error('Error creating task:', error);
        throw error;
    });
};

export const createEvent = (task) => {
    return fetch('http://localhost:3006/api/v1/tasks/createEvent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.data) {
            return data.data.task_info;
        } else {
            return [];
        }
    })
    .catch(error => {
        console.error('Error creating task:', error);
        throw error;
    });
};

export const createTag = (tag) => {
    return fetch('http://localhost:3006/api/v1/tags/createTag', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tag)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.data) {
            return data.data.tag_info;
        } else {
            return [];
        }
    })
    .catch(error => {
        console.error('Error creating tag:', error);
        throw error;
    });
};

export const deleteTag = (tagId, userId) => {
    return fetch(`http://localhost:3006/api/v1/tags/deleteTag/${tagId}?userId=${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Only try to parse the response as JSON if the status is not 204
        if (response.status !== 204) {
            return response.json().then(data => data.message);
        }
    })
    .catch(error => {
        console.error('Error deleting tag:', error);
        throw error;
    });
};

export const fetchAllTagsByTagID = (tagID) => {
    return fetch(`http://localhost:3006/api/v1/tags/getTagsByID/${tagID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => data.data.tags)
        .catch(error => {
            console.error('Error fetching tag:', error);
            throw error;
        });
};

export const deleteUser = (userId) => {
    return fetch(`http://localhost:3006/api/v1/users/deleteUser/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Only try to parse the response as JSON if the status is not 204
        if (response.status !== 204) {
            return response.json().then(data => data.message);
        }
    })
    .catch(error => {
        console.error('Error deleting user:', error);
        throw error;
    });
}

export const completeTaskByTaskID = (taskID) => {
    return fetch(`http://localhost:3006/api/v1/tasks/completeTaskByTaskID/${taskID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.data) {
            return data.data.task_info;
        } else {
            return [];
        }
    })
    .catch(error => {
        console.error('Error completing task:', error);
        throw error;
    });
};

export const unCompleteTaskByTaskID = (taskID) => {
    return fetch(`http://localhost:3006/api/v1/tasks/unCompleteTaskByTaskID/${taskID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.data) {
            return data.data.task_info;
        } else {
            return [];
        }
    })
    .catch(error => {
        console.error('Error completing task:', error);
        throw error;
    });
};