import { useParams, Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './Reservation.css';

const Reservation = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();

      const response = await fetch(`http://localhost:5001/reservations/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      setReservation(data);
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  if (!isAuthenticated) {
    return (
      <>
        <p className="error">Sorry! We can't find that reservation</p>
        <Link to="/reservations">
          <button className="btn">&larr; Back to reservations</button>
        </Link>
      </>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <ul>
        <li className="reservation">
          <h2 className="restaurant-name-reservation">
            {reservation.restaurantName}
          </h2>
          <p>{formatDate(reservation.date)}</p>
          <p className="partysize">
            <strong>Party size</strong>: {reservation.partySize}
          </p>
        </li>
      </ul>

      <Link to="/reservations">
        <button className="btn">&larr; Back to reservations</button>
      </Link>
    </>
  );
};
export default Reservation;
