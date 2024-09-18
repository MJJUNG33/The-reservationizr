import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { useAuth0 } from '@auth0/auth0-react';
import 'react-datepicker/dist/react-datepicker.css';
import './CreateReservation.css';

const CreateReservation = ({ restaurantName }) => {
  const [partySize, setPartySize] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const accessToken = await getAccessTokenSilently();

    setIsLoading(true);

    const reservation = {
      partySize: partySize,
      date: startDate,
      restaurantName: restaurantName,
    };

    await fetch('http://localhost:5001/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(reservation),
    });

    navigate('/reservations');
  };

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  return (
    <>
      <div className="form">
        <h2>Reserve {restaurantName}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-item">
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
          </div>
          <div className="form-item">
            <label htmlFor="startDate">Date</label>
            <DatePicker
              id="startDate"
              className="form-input"
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
              }}
              minDate={new Date()}
              filterTime={filterPassedTime}
              showTimeSelect
              dateFormat="Pp"
              required
            ></DatePicker>
          </div>
          <button className="submit-btn" disabled={isLoading}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
};
export default CreateReservation;
