import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RestaurantList.css';

const RestaurantList = () => {
  const [RestaurantList, setRestaurantList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:5001/restaurants');
      const data = await response.json();
      setRestaurantList(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Restaurants</h1>
      <ul className="restaurants-list">
        {RestaurantList.map((restaurant) => {
          return (
            <li className="restaurants" key={restaurant.id}>
              <img
                className="restaurant-img"
                src={restaurant.image}
                alt={restaurant.name}
              />
              <div className="restaurant-rightSide">
                <h2 className="restaurant-name">{restaurant.name}</h2>
                <p className="restaurant-description">
                  {restaurant.description}
                </p>
                <Link to={`/restaurant/${restaurant.id}`}>
                  <button className="reserve-button">
                    Reserve now &rarr;{' '}
                  </button>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default RestaurantList;
