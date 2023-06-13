const request = require('supertest');
const app = require('./app');

describe('app', () => {
  test('POST /reservations', async () => {
    const expectedStatus = 201;
    const expectedbody = {
      partySize: 4,
      date: '2023-11-17T06:30:00.000Z',
      restaurantName: 'Island Grill',
    };

    await request(app)
      .post('/reservations')
      .send(expectedbody)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expect.objectContaining(expectedbody));
        expect(response.body.id).toBeTruthy();
      });
  });

  test('GET /restaurants returns a list of all restaurants', async () => {
    const expectedStatus = 200;
    const expectedbody = [
      {
        id: '616005cae3c8e880c13dc0b9',
        name: 'Curry Place',
        description:
          "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
        image: 'https://i.ibb.co/yftcRcF/indian.jpg',
      },
      {
        id: '616005e26d59890f8f1e619b',
        name: 'Thai Isaan',
        description:
          'We offer guests a modern dining experience featuring the authentic taste of Thailand. Food is prepared fresh from quality ingredients and presented with sophisticated elegance in a stunning dining setting filled with all the richness of Thai colour, sound and art.',
        image: 'https://i.ibb.co/HPjd2jR/thai.jpg',
      },
      {
        id: '616bd284bae351bc447ace5b',
        name: 'Italian Feast',
        description:
          "From the Italian classics, to our one-of-a-kind delicious Italian favourites, all of our offerings are handcrafted from the finest, freshest ingredients available locally. Whether you're craving Italian comfort food like our Ravioli, Pappardelle or something with a little more Flavour like our famous Fettuccine Carbonara.",
        image: 'https://i.ibb.co/0r7ywJg/italian.jpg',
      },
    ];
    await request(app)
      .get('/restaurants')
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expectedbody);
      });
  });

  test('GET /restaurants/:id returns a single restaurant', async () => {
    const expectedStatus = 200;
    const expectedbody = {
      id: '616005cae3c8e880c13dc0b9',
      name: 'Curry Place',
      description:
        "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
      image: 'https://i.ibb.co/yftcRcF/indian.jpg',
    };

    await request(app)
      .get('/restaurants/616005cae3c8e880c13dc0b9')
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expectedbody);
      });
  });

  test('GET /reservations returns a list of all reservations', async () => {
    const expectedStatus = 200;
    const expectedbody = [
      {
        id: '507f1f77bcf86cd799439011',
        partySize: 4,
        date: '2023-11-17T06:30:00.000Z',
        userId: 'mock-user-id',
        restaurantName: 'Island Grill',
      },
      {
        id: '614abf0a93e8e80ace792ac6',
        partySize: 2,
        date: '2023-12-03T07:00:00.000Z',
        userId: 'mock-user-id',
        restaurantName: 'Green Curry',
      },
    ];

    await request(app)
      .get('/reservations')
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expectedbody);
      });
  });

  test('GET /reservations/:id returns a single reservation', async () => {
    const expectedStatus = 200;
    const expectedbody = {
      id: '507f1f77bcf86cd799439011',
      partySize: 4,
      date: '2023-11-17T06:30:00.000Z',
      userId: 'mock-user-id',
      restaurantName: 'Island Grill',
    };

    await request(app)
      .get('/reservations/507f1f77bcf86cd799439011')
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expectedbody);
      });
  });

  test('POST /reservations returns 400 when making a request with an invalid body', async () => {
    const body = {};
    const expectedbody = {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      validation: {
        body: {
          source: 'body',
          keys: ['partySize'],
          message: '"partySize" is required',
        },
      },
    };
    await request(app)
      .post('/reservations')
      .send(body)
      .expect(400)
      .expect((response) => {
        expect(response.body).toEqual(expectedbody);
      });
  });

  test('POST /reservations returns 400 when making a request with an invalid partySize value in the body', async () => {
    const expectedbody = {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      validation: {
        body: {
          source: 'body',
          keys: ['date'],
          message: '"date" must be greater than "now"',
        },
      },
    };

    const body = {
      partySize: -1,
      date: '2023-11-17T06:30:00.000Z',
      restaurantName: 'Island Grill',
    };

    await request(app)
      .post('/reservations')
      .send(body)
      .expect(400)
      .expect((response) => {
        expect(response.body).toEqual(expectedbody);
      });
  });
  test('GET /restaurants/:id returns 400 when request with an invalid id', async () => {
    const expected = {
      error: 'invalid id is provided',
    };

    await request(app)
      .get('/restaurants/bad-url')
      .expect(400)
      .expect((response) => {
        expect(response.body).toEqual(expected);
      });
  });

  test('GET /restaurants/:id returns 404 when request with an id that doesn’t exist on the server', async () => {
    const expected = {
      error: 'restaurant not found',
    };

    await request(app)
      .get('/restaurants/616005cae3c8e880c13dc0b1')
      .expect(404)
      .expect((response) => {
        expect(response.body).toEqual(expected);
      });
  });

  test('GET /reservations/:id returns 400 when request with an invalid id', async () => {
    const expected = {
      error: 'invalid id is provided',
    };

    await request(app)
      .get('/reservations/bad-url')
      .expect(400)
      .expect((response) => {
        expect(response.body).toEqual(expected);
      });
  });

  test('GET /reservations/:id returns 404 when request with an id that doesn’t exist on the server', async () => {
    const expected = {
      error: 'not found',
    };
    await request(app)
      .get('/reservations/616005cae3c8e880c13dc0b9')
      .expect(404)
      .expect((response) => {
        expect(response.body).toEqual(expected);
      });
  });

  test('GET /reservations/:id returns 403 when request with no permission to accsess to the reservation', async () => {
    const expected = {
      error: 'user dose not have permition to access this reservation',
    };
    await request(app)
      .get('/reservations/64813360fa851dcb8793415b')
      .expect(403)
      .expect((response) => {
        expect(response.body).toEqual(expected);
      });
  });
});
