const { MissingParameterError, EmptyResultError } = require('../errors');
const db = require('../db');
const crypto = require('crypto');

exports.getCalendarEvents = async (req, res, next) => {
    try {
        const results = await db.query('SELECT uid, start_time, end_time, title, body, tags FROM tasks');

        if (results.rows.length === 0) {
            const error = new EmptyResultError('No events found');
            return next(error);
        }

        const transformedResults = results.rows.map(row => ({
            uid: row.uid,
            title: row.title,
            start: row.start_time,
            end: row.end_time,
            body: row.body,
            tags: row.tags,
        }));
        res.status(200).json({
            status: 'success',
            results: transformedResults.length,
            data: {
                calendar_events: transformedResults
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllTasksByID = async (req, res, next) => {
    try {
        const results = await db.query('SELECT uid, start_time, end_time, title, body, repeating, repeating_end_time, tags FROM tasks WHERE user_id = $1 AND completed_time IS NULL', [req.params.userID]);

        if (results.rows.length === 0) {
            const error = new EmptyResultError('No events found');
            return next(error);
        }
        
        const transformedResults = results.rows.map(row => ({
            uid: row.uid,
            title: row.title,
            start: row.start_time,
            end: row.end_time,
            body: row.body,
            repeating: row.repeating,
            repeating_end_time: row.repeating_end_time,
            tags: row.tags,
        }));
        res.status(200).json({
            status: 'success',
            results: transformedResults.length,
            data: {
                calendar_events: transformedResults
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getTaskByTaskID = async (req, res, next) => {
    try {
        const results = await db.query('SELECT uid, start_time, end_time, title, body, repeating, repeating_end_time, tags FROM tasks WHERE uid = $1 AND completed_time IS NULL', [req.params.taskID]);
        
        if (results.rows.length === 0) {
            const error = new EmptyResultError('No tasks found');
            return next(error);
        }
        
        const transformedResults = results.rows.map(row => ({
            uid: row.uid,
            title: row.title,
            start: row.start_time,
            end: row.end_time,
            body: row.body,
            repeating: row.repeating,
            repeating_end_time: row.repeating_end_time,
            tags: row.tags,
        }));
        res.status(200).json({
            status: 'success',
            results: transformedResults.length,
            data: {
                task_info: transformedResults
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateTaskByTaskID = async (req, res, next) => {
    try {
        const { title, body } = req.body;
        const results = await db.query('UPDATE tasks SET title = $1, body = $2 WHERE uid = $3 RETURNING *', [title, body, req.params.taskID]);
        
        if (results.rows.length === 0) {
            const error = new EmptyResultError('No tasks found');
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            results: results.rows.length,
            data: {
                task_info: results.rows
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        if (!req.params.taskID) {
            const error = new MissingParameterError('Task ID is required');
            return next(error);
        }

        const result = await db.query('DELETE FROM tasks WHERE uid = $1', [req.params.taskID.toString()]);
        res.status(204).json({ message: 'Task deleted' });
    } catch (error) {
        next(error);
    }
};

exports.deleteAllTasks = async (req, res, next) => {
    try {
        if (!req.params.taskID) {
            const error = new MissingParameterError('Task ID is required');
            return next(error);
        }

        let taskID = req.params.taskID.toString();
        if (taskID.split('-').length > 0) {
            let taskIDList = taskID.split('-');
            taskID = taskIDList[0] + '%';
        }
        const result = await db.query('DELETE FROM tasks WHERE uid LIKE $1', [taskID]);
        res.status(204).json({ message: 'Tasks deleted' });
    } catch (error) {
        next(error);
    }
};

exports.getTasksByUserID = async (req, res, next) => {
    try {
        const results = await db.query('SELECT uid, start_time, end_time, title, body, repeating, repeating_end_time, tags FROM tasks WHERE user_id = $1 AND start_time IS NULL', [req.params.userID]);

        if (results.rows.length === 0) {
            const error = new EmptyResultError('No events found');
            return next(error);
        }
        
        const transformedResults = results.rows.map(row => ({
            uid: row.uid,
            title: row.title,
            start: row.start_time,
            end: row.end_time,
            body: row.body,
            repeating: row.repeating,
            repeating_end_time: row.repeating_end_time,
            tags: row.tags,
        }));
        res.status(200).json({
            status: 'success',
            results: transformedResults.length,
            data: {
                calendar_events: transformedResults
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.createTask = async (req, res, next) => {
    try {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            const { title, tags, user_id, end, repeating, repeating_end_time } = req.body;

            let tagObject = tags.reduce((obj, tag) => {
                obj[tag.name] = tag.id;
                return obj;
            }, {});

            let task_uuid = crypto.randomUUID();

            let insertRepeating = {};
            if (repeating == 'None') {
                insertRepeating = 
                {
                    "frequency": 'None',
                    "end_time": 'None',
                };
            } else {
                insertRepeating = {
                    "frequency": repeating,
                    "end_time": repeating_end_time,
                }
            }

            let insertRepeatingEndTime = null;
            const endDate = new Date(end);

            if (repeating_end_time == '1 Week') {
                endDate.setDate(endDate.getDate() + 7);
                insertRepeatingEndTime = endDate;
            } else if (repeating_end_time == '2 Weeks') {
                endDate.setDate(endDate.getDate() + 14);
                insertRepeatingEndTime = endDate;
            } else if (repeating_end_time == '1 Month') {
                endDate.setMonth(endDate.getMonth() + 1);
                insertRepeatingEndTime = endDate;
            } else if (repeating_end_time == '3 Months') {
                endDate.setMonth(endDate.getMonth() + 3);
                insertRepeatingEndTime = endDate;
            } else {
                insertRepeatingEndTime = null;
            }

            let eventResults = null;
            if (repeating == 'Daily') {
                let id_count = 0;
                for (let newEnd = new Date(end); newEnd <= insertRepeatingEndTime; newEnd.setDate(newEnd.getDate() + 1)) {
                    let current_task_uuid = `${task_uuid}-${id_count}`;
                    eventResults = await client.query('INSERT INTO tasks (uid, title, body, tags, user_id, start_time, end_time, repeating, repeating_end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [current_task_uuid, title, '', tagObject, user_id, null, newEnd, insertRepeating, insertRepeatingEndTime]);
                    id_count++;
                }
            } else if (repeating == 'Weekly') {
                let id_count = -1;
                for (let newEnd = new Date(end); newEnd <= insertRepeatingEndTime; newEnd.setDate(newEnd.getDate() + 7)) {
                    let current_task_uuid = `${task_uuid}-${id_count}`;
                    eventResults = await client.query('INSERT INTO tasks (uid, title, body, tags, user_id, start_time, end_time, repeating, repeating_end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [current_task_uuid, title, '', tagObject, user_id, null, newEnd, insertRepeating, insertRepeatingEndTime]);
                    id_count++;
                }
            } else if (repeating == 'Bi-Weekly') {
                let id_count = -1;
                for (let newEnd = new Date(end); newEnd <= insertRepeatingEndTime; newEnd.setDate(newEnd.getDate() + 14)) {
                    let current_task_uuid = `${task_uuid}-${id_count}`;
                    eventResults = await client.query('INSERT INTO tasks (uid, title, body, tags, user_id, start_time, end_time, repeating, repeating_end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [current_task_uuid, title, '', tagObject, user_id, null, newEnd, insertRepeating, insertRepeatingEndTime]);
                    id_count++;
                }
            } else if (repeating == 'Monthly') {
                let id_count = -1;
                for (let newEnd = new Date(end); newEnd <= insertRepeatingEndTime; newEnd.setMonth(newEnd.getMonth() + 1)) {
                    let current_task_uuid = `${task_uuid}-${id_count}`
                    eventResults = await client.query('INSERT INTO tasks (uid, title, body, tags, user_id, start_time, end_time, repeating, repeating_end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [current_task_uuid, title, '', tagObject, user_id, null, newEnd, insertRepeating, insertRepeatingEndTime]);
                    id_count++;
                }
            } else {
                eventResults = await client.query('INSERT INTO tasks (uid, title, body, tags, user_id, start_time, end_time, repeating, repeating_end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [task_uuid, title, '', tagObject, user_id, null, end, insertRepeating, insertRepeatingEndTime])
            }
            
            if (eventResults.rows.length === 0) {
                const error = new EmptyResultError('No tasks found');
                return next(error);
            }

            await client.query('COMMIT');

            res.status(201).json({
                status: 'success',
                results: eventResults.rows.length,
                data: {
                    task_info: eventResults.rows
                }
            });
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        next(err);
    }
};

exports.createEvent = async (req, res, next) => {
    try {
        const client = await db.getClient();
        try {
            await client.query('BEGIN');

            const { title, tags, user_id, start, end, repeating, repeating_end_time } = req.body;

            let tagObject = tags.reduce((obj, tag) => {
                obj[tag.name] = tag.id;
                return obj;
            }, {});
            
            let task_uuid = crypto.randomUUID();

            let insertRepeating = {};
            if (repeating == 'None') {
                insertRepeating = 
                {
                    "frequency": 'None',
                    "end_time": 'None',
                };
            } else {
                insertRepeating = {
                    "frequency": repeating,
                    "end_time": repeating_end_time,
                }
            }

            let insertRepeatingEndTime = null;
            const endDate = new Date(end);

            if (repeating_end_time == '1 Week') {
                endDate.setDate(endDate.getDate() + 7);
                insertRepeatingEndTime = endDate;
            } else if (repeating_end_time == '2 Weeks') {
                endDate.setDate(endDate.getDate() + 14);
                insertRepeatingEndTime = endDate;
            } else if (repeating_end_time == '1 Month') {
                endDate.setMonth(endDate.getMonth() + 1);
                insertRepeatingEndTime = endDate;
            } else if (repeating_end_time == '3 Months') {
                endDate.setMonth(endDate.getMonth() + 3);
                insertRepeatingEndTime = endDate;
            } else {
                insertRepeatingEndTime = null;
            }

            let eventResults = null;
            if (repeating == 'Daily') {
                let id_count = 0;
                for (let newEnd = new Date(end), newStart = new Date(start); newEnd <= insertRepeatingEndTime; newEnd.setDate(newEnd.getDate() + 1), newStart.setDate(newStart.getDate() + 1)) {
                    let current_task_uuid = `${task_uuid}-${id_count}`;
                    eventResults = await client.query('INSERT INTO tasks (uid, title, body, tags, user_id, start_time, end_time, repeating, repeating_end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [current_task_uuid, title, '', tagObject, user_id, newStart, newEnd, insertRepeating, insertRepeatingEndTime]);
                    id_count++;
                }
            } else if (repeating == 'Weekly') {
                let id_count = -1;
                for (let newEnd = new Date(end), newStart = new Date(start); newEnd <= insertRepeatingEndTime; newEnd.setDate(newEnd.getDate() + 7), newStart.setDate(newStart.getDate() + 7)) {
                    let current_task_uuid = `${task_uuid}-${id_count}`;
                    eventResults = await client.query('INSERT INTO tasks (uid, title, body, tags, user_id, start_time, end_time, repeating, repeating_end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [current_task_uuid, title, '', tagObject, user_id, newStart, newEnd, insertRepeating, insertRepeatingEndTime]);
                    id_count++;
                }
            } else if (repeating == 'Bi-Weekly') {
                let id_count = -1;
                for (let newEnd = new Date(end), newStart = new Date(start); newEnd <= insertRepeatingEndTime; newEnd.setDate(newEnd.getDate() + 14), newStart.setDate(newStart.getDate() + 14)) {
                    let current_task_uuid = `${task_uuid}-${id_count}`;
                    eventResults = await client.query('INSERT INTO tasks (uid, title, body, tags, user_id, start_time, end_time, repeating, repeating_end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [current_task_uuid, title, '', tagObject, user_id, newStart, newEnd, insertRepeating, insertRepeatingEndTime]);
                    id_count++;
                }
            } else if (repeating == 'Monthly') {
                let id_count = -1;
                for (let newEnd = new Date(end), newStart = new Date(start); newEnd <= insertRepeatingEndTime; newEnd.setMonth(newEnd.getMonth() + 1), newStart.setMonth(newStart.getMonth() + 1)) {
                    let current_task_uuid = `${task_uuid}-${id_count}`;
                    eventResults = await client.query('INSERT INTO tasks (uid, title, body, tags, user_id, start_time, end_time, repeating, repeating_end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [current_task_uuid, title, '', tagObject, user_id, newStart, newEnd, insertRepeating, insertRepeatingEndTime]);
                    id_count++;
                }
            } else {
                eventResults = await client.query('INSERT INTO tasks (uid, title, body, tags, user_id, start_time, end_time, repeating, repeating_end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [task_uuid, title, '', tagObject, user_id, start, end, insertRepeating, insertRepeatingEndTime])
            }
            
            if (eventResults.rows.length === 0) {
                const error = new EmptyResultError('No tasks found');
                return next(error);
            }

            await client.query('COMMIT');

            res.status(201).json({
                status: 'success',
                results: eventResults.rows.length,
                data: {
                    task_info: eventResults.rows
                }
            });
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        next(err);
    }
};

exports.updateTaskDateByTaskID = async (req, res, next) => {
    try {
        const { start, end } = req.body;
        const results = await db.query('UPDATE tasks SET start_time = $1, end_time = $2 WHERE uid = $3 RETURNING body, end_time as end, repeating, repeating_end_time, start_time as start, tags, title, uid', [start, end, req.params.taskID]);
        
        if (results.rows.length === 0) {
            const error = new EmptyResultError('No tasks found');
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            results: results.rows.length,
            data: {
                task_info: results.rows
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateTaskTagsByTaskID = async (req, res, next) => {
    try {
        const { tags } = req.body;

        const tagObject = {};
        tags.forEach(tag => {
            tagObject[tag.name] = tag.id;
        });

        const results = await db.query('UPDATE tasks SET tags = $1 WHERE uid = $2 RETURNING *', [tagObject, req.params.taskID]);
        
        if (results.rows.length === 0) {
            const error = new EmptyResultError('No tasks found');
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            results: results.rows.length,
            data: {
                task_info: results.rows
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.completeTaskByTaskID = async (req, res, next) => {
    try {
        const currentTime = new Date();
        const results = await db.query('UPDATE tasks SET completed_time = $1 WHERE uid = $2 RETURNING *', [currentTime, req.params.taskID]);
        
        if (results.rows.length === 0) {
            const error = new EmptyResultError('No tasks found');
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            results: results.rows.length,
            data: {
                task_info: results.rows
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.unCompleteTaskByTaskID = async (req, res, next) => {
    try {
        const results = await db.query('UPDATE tasks SET completed_time = NULL WHERE uid = $1 RETURNING *', [req.params.taskID]);
        
        if (results.rows.length === 0) {
            const error = new EmptyResultError('No tasks found');
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            results: results.rows.length,
            data: {
                task_info: results.rows
            }
        });
    } catch (err) {
        next(err);
    }
};