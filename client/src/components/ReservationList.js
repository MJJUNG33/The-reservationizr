import { formatDate } from '../utils/formatDate';
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import './ReservationList.css';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();

      const response = await fetch('http://localhost:5001/reservations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setReservations(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (reservations.length < 1) {
    return (
      <>
        <h1 className="reservations-h1">Upcoming reservations</h1>
        <p>You don't have any reservations.</p>
        <Link to="/" className="reservations-error">
          View the restaurant
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="reservation-list">
        <h1 className="reservations-h1">Upcoming reservations</h1>
        <ul>
          {reservations.map((reservation) => {
            return (
              <li className="reservations" key={reservation.id}>
                <h2 className="restaurant-name-reservations">
                  {reservation.restaurantName}
                </h2>
                <p className="date">{formatDate(reservation.date)}</p>
                <Link to={`/reservations/${reservation.id}`} className="detail">
                  View details &rarr;{' '}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default ReservationList;
