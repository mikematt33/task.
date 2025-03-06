const { EmptyResultError, MissingParameterError } = require('../errors');
const db = require('../db');
const crypto = require('crypto');

exports.getTagsByID = async (req, res, next) => {
    try {
        const results = await db.query('SELECT tag_id, tag_name, rgb_value FROM tags WHERE tag_id = $1', [req.params.tagID]);

        if (results.rows.length === 0) {
            const error = new EmptyResultError('No tags found');
            return next(error);
        }

        const transformedResults = results.rows.map(row => ({
            id: row.tag_id,
            name: row.tag_name,
            color: row.rgb_value,
            text: row.tag_name,
        }));
        res.status(200).json({
            status: 'success',
            results: transformedResults.length,
            data: {
                tags: transformedResults
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteTag = async (req, res, next) => {
    try {
        const { tagID } = req.params;
        const userID = req.query.userId;

        if (!tagID) {
            const error = new MissingParameterError('Tag ID is required');
            return next(error);
        }

        if (!userID) {
            const error = new MissingParameterError('User ID is required');
            return next(error);
        }

        const taskResults = await db.query('SELECT tags, uid FROM tasks WHERE user_id = $1', [userID]);

        if (taskResults.rows.length > 0) {
            const tasks = taskResults.rows;
            for (const task of tasks) {
                const tags = task.tags;
                const taskID = task.uid;
                if (typeof tags === 'object' && tags !== null) {
                    for (const tag in tags) {
                        if (tags[tag] === tagID) {
                            delete tags[tag];
                        }
                    }
                    // Update the task in the database
                    
                    await db.query('UPDATE tasks SET tags = $1 WHERE uid = $2', [tags, taskID]);
                } else {
                    // console.error('Tags is not an object:', tags);
                }
            }
        }

        const result = await db.query('DELETE FROM tags WHERE tag_id = $1', [req.params.tagID]);
        res.status(200).json({ message: 'Tag deleted' });
    } catch (error) {
        next(error);
    }
};

exports.getAllTagsByUserID = async (req, res, next) => {
    try {
        const results = await db.query('SELECT tag_id, tag_name, rgb_value FROM tags WHERE user_id = $1', [req.params.userID]);

        if (results.rows.length === 0) {
            const error = new EmptyResultError('No tags found');
            return next(error);
        }

        const transformedResults = results.rows.map(row => ({
            id: row.tag_id,
            name: row.tag_name,
            color: row.rgb_value,
        }));
        
        res.status(200).json({
            status: 'success',
            results: transformedResults.length,
            data: {
                tags: transformedResults
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.createTag = async (req, res, next) => {
    try {
        const { name, color, user_id } = req.body;

        let tag_uuid = crypto.randomUUID();

        const tagResults = await db.query('INSERT INTO tags (tag_id, user_id, tag_name, rgb_value, use_count) VALUES ($1, $2, $3, $4, $5) RETURNING *', [tag_uuid, user_id, name, color, 1]);

        res.status(200).json({
            status: 'success',
            results: tagResults.rows.length,
            data: {
                tag_info: tagResults.rows
            }
        });
    } catch (error) {
        next(error);
    }
};