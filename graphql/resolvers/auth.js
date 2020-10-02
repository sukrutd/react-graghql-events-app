const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

module.exports = {
  createUser: async ({ userInput }) => {
    try {
      const existingUser = await User.findOne({ email: userInput.email });
      if (existingUser) throw new Error('User already exists!');
      const hashedPassword = await bcrypt.hash(userInput.password, 12);
      const user = new User({
        email: userInput.email,
        password: hashedPassword
      });
      const savedUser = await user.save();
      return { ...savedUser._doc, password: null };
    } catch (error) {
      throw new Error(error);
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials!');
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) throw new Error('Invalid credentials!');
    const token = jwt.sign({ userId: user.id, email: user.email }, 'mysupersecretkey', { expiresIn: '1h' });
    return { userId: user.id, token, tokenExpiration: 1 };
  }
};
