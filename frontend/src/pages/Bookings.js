import React, { Component } from 'react';
import Spinner from '../components/Spinner/Spinner';
import BookingList from '../components/BookingList/BookingList';
import AuthContext from '../context/auth-context';

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: []
  };

  isActive = true;

  static contextType = AuthContext;

  fetchBookings = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
            query {
                bookings {
                    _id
                    createdAt
                    event {
                      _id
                      title
                      date
                    }
                }
            }
        `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then((response) => response.json())
      .then((response) => {
        const { bookings = [] } = response.data;
        if (this.isActive) this.setState({ bookings, isLoading: false });
      })
      .catch((error) => {
        console.log(error);
        if (this.isActive) this.setState({ isLoading: false });
      });
  };

  deleteBooking = (bookingId) => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
            mutation {
                cancelBooking (bookingId: "${bookingId}") {
                    _id
                    title
                }
            }
        `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then((response) => response.json())
      .then((response) => {
        if (this.isActive) {
          this.setState((prevState) => {
            const updatedBookings = prevState.bookings.filter((booking) => booking._id !== bookingId);
            return { bookings: updatedBookings, isLoading: false };
          });
        }
      })
      .catch((error) => {
        console.log(error);
        if (this.isActive) this.setState({ isLoading: false });
      });
  };

  componentDidMount() {
    this.fetchBookings();
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    const { isLoading, bookings } = this.state;
    return <>{isLoading ? <Spinner /> : <BookingList bookings={bookings} onCancelBooking={this.deleteBooking} />}</>;
  }
}

export default BookingsPage;
