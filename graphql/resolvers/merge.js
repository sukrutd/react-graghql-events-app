const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return { ...user._doc, password: null, createdEvents: events.bind(this, user.createdEvents) };
  } catch (error) {
    throw new Error(error);
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (error) {
    throw new Error(error);
  }
};

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => transformEvent(event));
  } catch (error) {
    throw new Error(error);
  }
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    date: dateToString(event.date),
    creator: user.bind(this, event.creator)
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: user.bind(this, booking.user),
    event: singleEvent.bind(this, booking.event),
    createdAt: dateToString(booking.createdAt),
    updatedAt: dateToString(booking.updatedAt)
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
