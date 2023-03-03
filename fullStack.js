'use strict';

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg'); //NPM installed before this from nodemon, pg is a library btw
const actorsPath = path.join(__dirname, 'actors.json'); //check dirname
///
const DB_HOST = process.env.DATABASE_HOST || 'localhost' //check docs and purpose
const cors = require('cors')
//app.use(cors());
const port = 8100; //process.env.PORT || 8100;//set the port and or look for any alternatives for express
const express = require('express');//to use express
const app = express();
app.use(express.json());
//const bodyParser = require('body-parser');//to use parser.json
//chrck body parser
//app.use(bodyParser.json());


/////////////POSTGRES or contianers Possibly/////////
const pool = new Pool({ //takes an object as an input, passing this into pool for config
  user: 'postgres',
  host: DB_HOST,
  database: 'onepiece',
  password: 'password',
  port: 5432,
});

/////////////////GET Table DB Places///////////////
app.get('/api/places', (req, res, next) => {
  pool.query('SELECT * FROM places', (err, results) => {
    if (err) {
      return next(err);
    }

    let row = results.rows;
    console.log(row);
    res.send(row);
  })
});


// app.get('/actors/:id', (req, res, next) => {
//   fs.readFile(actorsPath, 'utf8', (err, actorsJSON) => {
//     if (err) {
//       return next(err);
//     }

//     const id = Number.parseInt(req.params.id);
//     const actors = JSON.parse(actorsJSON);

//     if (id < 0 || id >= actors.length || Number.isNaN(id)) {
//       return res.sendStatus(404);
//     }

//     res.send(actors[id]);
//   });
// });

// app.post('/actors', (req, res, next) => {
//   fs.readFile(actorsPath, 'utf8', (readErr, actorsJSON) => {
//     if (readErr) {
//       return next(readErr);
//     }

//     const actors = JSON.parse(actorsJSON);
//     const age = Number.parseInt(req.body.age);
//     const kind = req.body.kind;
//     const name = req.body.name;

//     if (Number.isNaN(age) || !kind || !name) {
//       return res.sendStatus(400);
//     }

//     const actor = { age, kind, name };

//     actors.push(actor);

//     const newactorsJSON = JSON.stringify(actors);

//     fs.writeFile(actorsPath, newactorsJSON, (writeErr) => {
//       if (writeErr) {
//         return next(writeErr);
//       }

//       res.send(actor);
//     });
//   });
// });


// app.patch('/actors/:id', (req, res, next) => {
//   fs.readFile(actorsPath, 'utf8', (readErr, actorsJSON) => {
//     if (readErr) {
//       return next(readErr);
//     }

//     const id = Number.parseInt(req.params.id);
//     const actors = JSON.parse(actorsJSON);

//     if (id < 0 || id >= actors.length || Number.isNaN(id)) {
//       return res.sendStatus(404);
//     }

//     const pet = actors[id];
//     const age = Number.parseInt(req.body.age);
//     const kind = req.body.kind;
//     const name = req.body.name;

//     if (!Number.isNaN(age)) {
//       pet.age = age;
//     }

//     if (kind) {
//       pet.kind = kind;
//     }

//     if (name) {
//       pet.name = name;
//     }

//     const newactorsJSON = JSON.stringify(actors);

//     fs.writeFile(actorsPath, newactorsJSON, (writeErr) => {
//       if (writeErr) {
//         return next(writeErr);
//       }

//       res.send(pet);
//     });
//   });
// });


// app.delete('/actors/:id', (req, res, next) => {
//   fs.readFile(actorsPath, 'utf8', (readErr, actorsJSON) => {
//     if (readErr) {
//       return next(readErr);
//     }

//     const id = Number.parseInt(req.params.id);
//     const actors = JSON.parse(actorsJSON);

//     if (id < 0 || id >= actors.length || Number.isNaN(id)) {
//       return res.sendStatus(404);
//     }

//     const pet = actors.splice(id, 1)[0];
//     const newactorsJSON = JSON.stringify(actors);

//     fs.writeFile(actorsPath, newactorsJSON, (writeErr) => {
//       if (writeErr) {
//         return next(writeErr);
//       }

//       res.send(pet);
//     });
//   });
// });


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

app.use(cors({ origin: "*" }))

app.listen(port, () => {
  console.log('Listening on port', port);
  console.log('DB Host:', DB_HOST);
});


module.exports = app;
