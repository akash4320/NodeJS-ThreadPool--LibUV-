const express = require("express");
const dotenv = require("dotenv");
const app = express();
const { Worker } = require("worker_threads");

// configraration with env.
dotenv.config();

const port = process.env.PORT || 3000;

app.get("/non-blocking/", (req, res) => {
    res.status(200).send("This page is non-blocking");
});

// app.get("/blocking", (req, res) => {
//     let counter = 0;
//     for (let i = 0; i < 20_000_000_000; i++) {
//         counter++;
//     }
//     res.status(200).send(`result is ${counter}`);
// });

// Cannot solve blocking CPU intensive work with Promises

// function calculateCount() {
//   return new Promise((resolve, reject) => {
//     let counter = 0;
//     for (let i = 0; i < 20_000_000_000; i++) {
//       counter++;
//     }
//     resolve(counter);
//   });
// }
// app.get("/blocking", async (req, res) => {
//   const counter = await calculateCount();
//   res.status(200).send(`result is ${counter}`);
// });

app.get("/blocking", async (req, res) => {
    const worker = new Worker("./worker.js");
    worker.on("message", (data) => {
      res.status(200).send(`result is ${data}`);
    });
    worker.on("error", (msg) => {
      res.status(404).send(`An error occurred: ${msg}`);
    });
  });

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
