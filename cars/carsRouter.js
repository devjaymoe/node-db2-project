const express = require("express");

const db = require("../data/dbConnection.js");

const router = express.Router();

router.get("/", (req, res) => {
  db("cars")
    .then(cars => {
      res.json(cars);
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to retrieve cars" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  db("cars")
    .where({ id })
    .first()
    .then(cars => {
      if(cars) {
        res.status(201).json({data: cars})
      } else {
        res.status(404).json({message: 'record not found by that id'})
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to retrieve cars" });
    });
});

router.post("/", (req, res) => {
  const carsData = req.body;
  db("cars")
    .insert(carsData)
    .then(ids => {
      db("cars")
        .where({ id: ids[0] })
        .then(newCarEntry => {
          res.status(201).json(newCarEntry);
        });
    })
    .catch(err => {
      console.log("POST error", err);
      res.status(500).json({ message: "Failed to store data" });
    });
});

router.put('/:id', (req, res) => {
  const carUpdate = req.body;
  db('cars')
    .where({ id: req.params.id })
    .update(carUpdate)
    .then(count => {
      // the count is the number of records updated
      // if the count is 0, it means, the record was not found
      if(count) {
        res.status(201).json({data: count})
      } else {
        res.status(404).json({message: 'record not found by that id'})
      }
    })
    .catch(error => {
      // save the error to a log somewhere
      console.log(error);
      res.status(500).json({ message: error.messsage });
    });
});

router.delete('/:id', (req, res) => {
  // validate the data
  db('cars')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      // the count is the number of records updated
      // if the count is 0, it means, the record was not found
      if(count) {
        res.status(201).json({data: count})
      } else {
        res.status(404).json({message: 'record not found by that id'})
      }
    })
    .catch(error => {
      // save the error to a log somewhere
      console.log(error);
      res.status(500).json({ message: error.messsage });
    });
});

module.exports = router;