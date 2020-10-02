import React, { Component, createRef } from 'react';
import Modal from '../components/Modal/Modal';
import Spinner from '../components/Spinner/Spinner';
import EventList from '../components/EventList/EventList';
import AuthContext from '../context/auth-context';
import './styles/events.css';

class EventsPage extends Component {
  state = {
    events: [],
    createEvent: false,
    isLoading: false,
    selectedEvent: null
  };

  isActive = true;

  constructor(props) {
    super(props);
    this.titleRef = createRef();
    this.priceRef = createRef();
    this.dateRef = createRef();
    this.descriptionRef = createRef();
  }

  static contextType = AuthContext;

  createEventHandler = () => {
    this.setState({ createEvent: true });
  };

  modalCancelHandler = () => {
    this.setState({ createEvent: false, selectedEvent: null });
  };

  modalConfirmHandler = () => {
    const title = this.titleRef.current.value;
    const price = +this.priceRef.current.value;
    const date = this.dateRef.current.value;
    const description = this.descriptionRef.current.value;

    if (title.trim().length === 0 || description.trim().length === 0 || date.trim().length === 0) return;

    //const event = { title, description, price, date };

    const requestBody = {
      query: `
            mutation {
                createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                    _id
                    title
                    description
                    price
                    date
                    creator {
                      _id
                      email
                    }
                }
            }
        `
    };

    const token = this.context.token;
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then((response) => response.json())
      .then((response) => {
        const newEvent = response.data.createEvent;
        this.setState((prevState) => {
          const updatedEvents = [...prevState.events];
          updatedEvents.push(newEvent);
          return { events: updatedEvents };
        });
      })
      .catch((error) => console.log(error));
    this.setState({ createEvent: false });
  };

  showDetailHandler = (eventId) => {
    this.setState((prevState) => {
      const selectedEvent = prevState.events.find((e) => e._id === eventId);
      return { selectedEvent };
    });
  };

  bookEventHandler = () => {
    const requestBody = {
      query: `
            mutation {
                bookEvent(eventId: "${this.state.selectedEvent._id}") {
                    _id
                    createdAt
                    updatedAt
                }
            }
        `
    };

    const token = this.context.token;
    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        this.setState({ selectedEvent: null });
      })
      .catch((error) => console.log(error));
  };

  fetchEvents = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
            query {
                events {
                    _id
                    title
                    description
                    price
                    date
                    creator {
                      _id
                      email
                    }
                }
            }
        `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((response) => {
        const { events = [] } = response.data;
        if (this.isActive) this.setState({ events, isLoading: false });
      })
      .catch((error) => {
        console.log(error);
        if (this.isActive) this.setState({ isLoading: false });
      });
  };

  componentDidMount() {
    this.fetchEvents();
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    const { selectedEvent, events, isLoading, createEvent } = this.state;
    const { token, userId } = this.context;
    return (
      <>
        {createEvent && (
          <Modal title="Add Event" onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea rows="3" id="description" ref={this.descriptionRef} />
              </div>
            </form>
          </Modal>
        )}
        {token && (
          <div className="events-control">
            <p>Create your Events!</p>
            <button className="btn" onClick={this.createEventHandler}>
              Create Event
            </button>
          </div>
        )}
        {selectedEvent && (
          <Modal
            title={selectedEvent.title}
            canConfirm={!!token}
            onCancel={this.modalCancelHandler}
            onConfirm={!!token && this.bookEventHandler}
            confirmText="Book"
          >
            <h3>{selectedEvent.description}</h3>
            <h4>
              ${selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString()}
            </h4>
          </Modal>
        )}
        {isLoading ? (
          <Spinner />
        ) : (
          <EventList events={events} authUserId={userId} onViewDetail={this.showDetailHandler} />
        )}
      </>
    );
  }
}

export default EventsPage;
