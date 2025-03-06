import React, { useState, useEffect, useCallback } from 'react';
import { fetchFirstTagByID } from '../../actions';

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const DayEvent = ({ title, tagName, tagValue, endDate }) => {
    const [color, setColor] = useState('#000'); // Default color
    const [isPastEvent, setIsPastEvent] = useState(false);

    const fetchTagColor = async (tagValue) => {
        try {
            const tagInfo = await fetchFirstTagByID(tagValue);
            setColor(tagInfo.color); 
        } catch (error) {
            console.error('Error fetching tag color:', error);
        }
    };

    const checkIfPastEvent = useCallback(() => {
        const now = new Date();
        const eventEndDate = new Date(endDate);
        if (eventEndDate < now) {
            setIsPastEvent(true);
        }
    }, [endDate]);

    useEffect(() => {
        if (tagName) {
            fetchTagColor(tagValue);
        }
        checkIfPastEvent();
    }, [tagName, tagValue, checkIfPastEvent]);

    const rgb = color ? hexToRgb(color) : null;

    const style = {
        container: {
            backgroundColor: isPastEvent ? `rgba(255, 64, 64, 0.2)` : rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)` : color,
            color: '#fff', 
            padding: '5px',
            marginBottom: '10px',
            borderRadius: '5px',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '100%',
        },
        title: {
            fontSize: '14px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            marginLeft: '5px',
        },
        rectangle: {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '.5%',
            backgroundColor: isPastEvent ? `rgba(255, 64, 64, 0.8)` : rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)` : color, 
        },
    };
    
    return (
        <div style={style.container}>
            <div style={style.title}>{title}</div>
            <div style={style.rectangle}></div>
        </div>
    );
};

export default DayEvent;