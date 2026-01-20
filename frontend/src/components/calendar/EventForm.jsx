import React from 'react';

const EventForm = () => {
    return (
        <div className="card">
            <h3>Schedule New Shoot</h3>
            <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
                <input placeholder="Event Title" style={{ padding: '8px' }} />
                <input type="date" style={{ padding: '8px' }} />
                <button className="btn-primary">Schedule</button>
            </div>
        </div>
    );
};

export default EventForm;
