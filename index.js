const express = require('express');
const cors = require('cors');
const countriesDb = require('./db/country');
const getNextId = require( './helpers/getNextId' );

const app = express();

app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/country', (req, res) => {
   res.json(countriesDb);
});

app.get('/country/:nameOrId', (req, res) => {
   const nameOrId = req.params.nameOrId;

   let country;

   if (!isNaN(nameOrId)) {
      country = countriesDb.find(
         (c) => c.id.toString() === nameOrId.toString()
      );
   } else {
      country = countriesDb.find(
         (c) => c.name.toLowerCase() === nameOrId.toLowerCase()
      );
   }

   if (country) {
      res.json(country);
   } else {
      res.status(404).send('Country not found');
   }
});

app.post('/country', (req, res) => {
   const { name, population, continent } = req.body;

   if (!name || !population || !continent) {
      return res
         .status(400)
         .send('Name, population and continent are required');
   }

   const id = getNextId();

   const newCountry = {
      id,
      name,
      population,
      continent,
   };

   countriesDb.push(newCountry);

   res.json(newCountry);
});

app.put('/country/:id', (req, res) => {
  const { id } = req.params;
  const { name, population, continent } = req.body;

  const country = countriesDb.find(c => c.id.toString() === id.toString());

  if (!country) {
    return res.status(404).send('Country not found');
  }

  if (name) {
    country.name = name;
  }

  if (population) {
    country.population = population;
  }

  if (continent) {
    country.continent = continent;
  }

  res.json(country);
});

app.delete('/country/:id', (req, res) => {
  const { id } = req.params;

  const index = countriesDb.findIndex(c => c.id.toString() === id.toString());

  if (index === -1) {
    return res.status(404).send('Country not found');
  }

  countriesDb.splice(index, 1);

  res.status(204).send();
});

app.get('/seed', (req, res) => {
  const newCountries = [
    {
      id: 1,
      name: 'Argentina',
      population: 45817233,
      continent: 'South America',
    },
    {
      id: 2,
      name: 'Brazil',
      population: 214293922,
      continent: 'South America',
    },
    {
      id: 3,
      name: 'France',
      population: 67059887,
      continent: 'Europe',
    },
  ];

  clearCountries();
  seedCountries(newCountries);

  res.send('Countries seeded successfully');
});

function clearCountries() {
  countriesDb.splice(0, countriesDb.length);
}

function seedCountries(countries) {
  countriesDb.push(...countries);
}

app.listen(3000, () => {
   console.log('Server listening on port 3000');
});
