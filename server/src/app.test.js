const request = require('supertest');
const app = require('./app');

describe('app', () => {
  test('POST /reservations', async () => {
    const expectedStatus = 201;
    const expectedbody = {
      partySize: 4,
      date: '2023-11-17T06:30:00.000Z',
      userId: 'mock-user-id',
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

  test('GET /restaurants/:id returns a single restaurants', async () => {
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

  test('GET /restaurants/:id returns 400 when request with an invalid id', async () => {
    const expectedStatus = 400;

    await request(app).get('/restaurants/bad-url').expect(expectedStatus);
  });

  test('GET /restaurants/:id returns 404 when request with an id that doesn’t exist on the server', async () => {
    const expectedStatus = 404;

    await request(app)
      .get('/restaurants/616005cae3c8e880c13dc0b1')
      .expect(expectedStatus);
  });
});
