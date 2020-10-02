const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) throw new Error('Unauthorized Request');
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => transformBooking(booking));
    } catch (error) {
      throw new Error(error);
    }
  },
  bookEvent: async ({ eventId }, req) => {
    if (!req.isAuth) throw new Error('Unauthorized Request');
    try {
      const fetchedEvent = await Event.findOne({ _id: eventId });
      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (error) {
      throw new Error(error);
    }
  },
  cancelBooking: async ({ bookingId }, req) => {
    if (!req.isAuth) throw new Error('Unauthorized Request');
    try {
      const booking = await Booking.findById(bookingId).populate('event');
      const bookedEvent = transformEvent(booking.event);
      await Booking.deleteOne({ _id: bookingId });
      return bookedEvent;
    } catch (error) {
      throw new Error(error);
    }
  }
};
