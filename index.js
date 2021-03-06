require('dotenv').load()

const express = require("express")
const router = express.Router()
const stripe = require("stripe")(process.env.STRIPE_KEY)
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(cors())

router.post("/", (request, response) => {
    const options = {
        amount: +request.body.amount,
        currency: "usd",
        description: request.body.description,
        source: request.body.stripeToken
    }
    console.log(options)
    stripe.charges.create(options, (error, charge) => {
        error
            ? response.status(400).json({error: error.message})
            : response.redirect("https://stripety-stripe.firebaseapp.com/success.html")
            
    })
})
const port = process.env.PORT || 5000
app.use(router)
app.listen(port, () => {
  console.log(`Listening on ${port}`)
})