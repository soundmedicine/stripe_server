// require('dotenv').load()

// const express = require("express")
// const router = express.Router()
// const stripe = require("stripe")(process.env.STRIPE_KEY)
// const cors = require('cors')
// const bodyParser = require('body-parser')
// const app = express()

// app.use(bodyParser.json())
// app.use(cors())

// router.post("/", (request, response) => {
//     const options = {
//         amount: +request.body.amount,
//         currency: "usd",
//         description: request.body.description,
//         source: request.body.token,
//     }
//     stripe.charges.create(options, (error, charge) => {
//         error
//             ? response.status(400).json({error: error.message})
//             : response.json({data: charge});
//     })
// })
// const port = process.env.PORT || 5000
// app.use(router)
// app.listen(port, () => {
//   console.log(`Listening on ${port}`)
// })

require('dotenv').load()
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const stripe = require("stripe")(process.env.STRIPE_KEY);
const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World! 🌈'
  });
});

app.post('/', (req, res) => {
  const token = req.body.stripeToken
  const payAmount = req.body.amount
  const charge = stripe.charges.create({
    amount: payAmount * 100,
    currency: 'usd',
    source: token,
  })
  .then(res.send(`Successfully submitted payment of $${payAmount}`))
  .catch(err => console.error(err))
})

app.use((req, res, next) => {
  res.status(404);
  const error = new Error('Not Found. 🔍');
  next(error);
});

app.use((error, req, res, next) => {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message,
    error: error.stack
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
