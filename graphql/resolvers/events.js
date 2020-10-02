const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => transformEvent(event));
    } catch (error) {
      throw new Error(error);
    }
  },
  createEvent: async ({ eventInput }, req) => {
    if (!req.isAuth) throw new Error('Unauthorized Request');
    const event = new Event({
      title: eventInput.title,
      description: eventInput.description,
      price: +eventInput.price,
      date: new Date(eventInput.date),
      creator: req.userId
    });
    let createdEvent;
    try {
      const resultEvent = await event.save();
      createdEvent = transformEvent(resultEvent);
      const existingUser = await User.findById(req.userId);
      if (!existingUser) throw new Error('User not found');
      existingUser.createdEvents.push(event);
      await existingUser.save();
      return createdEvent;
    } catch (error) {
      throw new Error(error);
    }
  }
};
