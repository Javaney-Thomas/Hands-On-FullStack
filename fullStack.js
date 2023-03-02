'use strict';

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg'); //NPM installed before this from nodemon
const actorsPath = path.join(__dirname, 'actors.json');

const express = require('express');//to use express
const bodyParser = require('body-parser');//to use parser.json
const app = express();

const port = process.env.PORT || 8000;//set the port and or look for any alternatives

app.use(bodyParser.json());



app.get('/actors', (_req, res, next) => {
  fs.readFile(actorsPath, 'utf8', (err, actorsJSON) => {
    if (err) {
      return next(err);
    }

    const actors = JSON.parse(actorsJSON);

    res.send(actors);
  });
});


app.get('/actors/:id', (req, res, next) => {
  fs.readFile(actorsPath, 'utf8', (err, actorsJSON) => {
    if (err) {
      return next(err);
    }

    const id = Number.parseInt(req.params.id);
    const actors = JSON.parse(actorsJSON);

    if (id < 0 || id >= actors.length || Number.isNaN(id)) {
      return res.sendStatus(404);
    }

    res.send(actors[id]);
  });
});


app.post('/actors', (req, res, next) => {
  fs.readFile(actorsPath, 'utf8', (readErr, actorsJSON) => {
    if (readErr) {
      return next(readErr);
    }

    const actors = JSON.parse(actorsJSON);
    const age = Number.parseInt(req.body.age);
    const kind = req.body.kind;
    const name = req.body.name;

    if (Number.isNaN(age) || !kind || !name) {
      return res.sendStatus(400);
    }

    const pet = { age, kind, name };

    actors.push(pet);

    const newactorsJSON = JSON.stringify(actors);

    fs.writeFile(actorsPath, newactorsJSON, (writeErr) => {
      if (writeErr) {
        return next(writeErr);
      }

      res.send(pet);
    });
  });
});


app.patch('/actors/:id', (req, res, next) => {
  fs.readFile(actorsPath, 'utf8', (readErr, actorsJSON) => {
    if (readErr) {
      return next(readErr);
    }

    const id = Number.parseInt(req.params.id);
    const actors = JSON.parse(actorsJSON);

    if (id < 0 || id >= actors.length || Number.isNaN(id)) {
      return res.sendStatus(404);
    }

    const pet = actors[id];
    const age = Number.parseInt(req.body.age);
    const kind = req.body.kind;
    const name = req.body.name;

    if (!Number.isNaN(age)) {
      pet.age = age;
    }

    if (kind) {
      pet.kind = kind;
    }

    if (name) {
      pet.name = name;
    }

    const newactorsJSON = JSON.stringify(actors);

    fs.writeFile(actorsPath, newactorsJSON, (writeErr) => {
      if (writeErr) {
        return next(writeErr);
      }

      res.send(pet);
    });
  });
});


app.delete('/actors/:id', (req, res, next) => {
  fs.readFile(actorsPath, 'utf8', (readErr, actorsJSON) => {
    if (readErr) {
      return next(readErr);
    }

    const id = Number.parseInt(req.params.id);
    const actors = JSON.parse(actorsJSON);

    if (id < 0 || id >= actors.length || Number.isNaN(id)) {
      return res.sendStatus(404);
    }

    const pet = actors.splice(id, 1)[0];
    const newactorsJSON = JSON.stringify(actors);

    fs.writeFile(actorsPath, newactorsJSON, (writeErr) => {
      if (writeErr) {
        return next(writeErr);
      }

      res.send(pet);
    });
  });
});


app.get('/boom', (_req, _res, next) => {
  next(new Error('BOOM!'));
});


app.use((_req, res) => {
  res.sendStatus(404);
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.sendStatus(500);
});


app.listen(port, () => {
  console.log('Listening on port', port);
});


module.exports = app;