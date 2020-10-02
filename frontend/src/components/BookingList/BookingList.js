import React from 'react';

const BookingList = ({ bookings, onCancelBooking }) => (
  <>
    {bookings.length > 0 ? (
      <ul className="list">
        {bookings.map((booking) => (
          <li className="list-item" key={booking._id}>
            <div className="left-column">
              <h3>
                {booking.event.title} - {new Date(booking.event.date).toLocaleDateString('en-IN')}
              </h3>
            </div>
            <div className="right-column">
              <div className="booking-actions">
                <button className="btn" onClick={onCancelBooking.bind(this, booking._id)}>
                  Cancel Booking
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    ) : null}
  </>
);

export default BookingList;
