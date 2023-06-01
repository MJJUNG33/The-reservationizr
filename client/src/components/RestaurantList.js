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
    </>
  );
};

export default RestaurantList;
