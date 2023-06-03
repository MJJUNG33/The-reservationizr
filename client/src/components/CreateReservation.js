import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { useAuth0 } from '@auth0/auth0-react';
import 'react-datepicker/dist/react-datepicker.css';
import './CreateReservation.css';

const CreateReservation = ({ restaurantName }) => {
  const [partySize, setPartySize] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const accessToken = await getAccessTokenSilently();

    setIsLoading(true);

    const reservation = {
      partySize: Number(partySize),
      startDate,
    };

    const response = await fetch('http://localhost:5001/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(reservation),
    });

    if (!response.ok) {
      setIsError(true);
      setErrorStatus(response.status);
    } else {
      setIsLoading(false);
      navigate('/');
    }
  };

  if (isError) {
    return (
      <>
        <p className="no-reservations">
          Error creating a reservation (error status {errorStatus})
        </p>
        <Link to="/" className="button">
          Return to reservations
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="form">
        <h2>Reserve {restaurantName}</h2>
        <form onSubmit={handleSubmit}>
          <p className="form-item">
            <label htmlFor="partySize">Number of guests</label>
            <input
              type="number"
              min="1"
              id="partySize"
              className="form-input"
              value={partySize}
              onChange={(event) => {
                setPartySize(event.target.value);
              }}
              required
            />
          </p>
          <p className="form-item">
            <label htmlFor="date">Date</label>
            <DatePicker
              id="startDate"
              className="form-input"
              value={startDate}
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
              }}
              minDate={new Date()}
              showTimeSelect
              dateFormat="Pp"
              required
            ></DatePicker>
          </p>
          <button className="submit-btn" disabled={isLoading}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
};
export default CreateReservation;
