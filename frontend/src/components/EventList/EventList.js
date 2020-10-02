import React from 'react';

const EventList = ({ events, authUserId, onViewDetail }) => (
  <ul className="list">
    {events.map((event) => (
      <li className="list-item" key={event._id}>
        <div className="left-column">
          <h3>{event.title}</h3>
          <p>
            <strong>
              ${event.price} - {new Date(event.date).toLocaleDateString('en-IN')}
            </strong>
          </p>
        </div>
        <div className="right-column">
          {event.creator._id === authUserId && <p>Organizer</p>}
          <button className="btn" onClick={onViewDetail.bind(this, event._id)}>
            View Details
          </button>
        </div>
      </li>
    ))}
  </ul>
);

export default EventList;
