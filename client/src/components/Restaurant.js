import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CreateReservation from './CreateReservation';
import './Restaurant.css';

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:5001/restaurants/${id}`);
      const data = await response.json();
      setRestaurant(data);
      // FIXME: Make a fetch request and call setRestaurant with the response body
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <ul className="restaurants-list">
        <li className="restaurants single-restaurant">
          <img
            className="restaurant-img"
            src={restaurant.image}
            alt={restaurant.name}
          />
          <div className="restaurant-rightSide">
            <h1 className="restaurant-name">{restaurant.name}</h1>
            <p className="restaurant-description">{restaurant.description}</p>
          </div>
        </li>
        <CreateReservation restaurantName={restaurant.name} />
      </ul>
    </>
  );
};

export default Restaurant;
