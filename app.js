
const dotenv = require('dotenv')
dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SK)

const express = require('express')
const app = express()

var param = {}
param.email = 'test@gmail.com'
param.name = 'testAcc'
param.id = 1
const createCustomer = async function (param) {

    const customer = await stripe.customers.create(param)
    console.log(customer)
}
const id = 'cus_Q4C04bJYgIAbyK'
const retrieveCustomer = async function (id) {
    const customer = await stripe.customers.retrieve(id)
    console.log(customer)
}

const payment = 'pm_card_visa'
const addPaymentToCustomer = async function (payment) {
    const customersPaymentMethod = await stripe.paymentMethods.attach(payment, { customer: "1" })
    console.log(customersPaymentMethod)
    const cus = await stripe.customers.update(
        "1", { invoice_settings: { default_payment_method: customersPaymentMethod.id } }
    )
}
const getInfoPM = async function () {

    const paymentMethod = await stripe.customers.retrievePaymentMethod(
        'cus_Q4C04bJYgIAbyK',
        'pm_1PE3dQLmIjNUtlPNNWey8RLi'
    );
    console.log(paymentMethod)
}
const updatePM = async function () {
    const paymentMethod = await stripe.paymentMethods.update(
        'pm_1PE3dQLmIjNUtlPNNWey8RLi',

    );
}
const detachPm = async function () {

    const paymentMethod = await stripe.paymentMethods.detach(
        'pm_1PE3dQLmIjNUtlPNNWey8RLi'
    );
}
const productDetail = {
    name: "Pro",
    description: "1. ABC\n2. ABD",
    id: '2',
    default_price_data: {
        unit_amount: 500,
        currency: "USD",
        recurring: {
            interval: "month",
            interval_count: 1,
        }
    },

}
const createProduct = async function (productDetail) {

    const product = await stripe.products.create(productDetail);
    console.log(product)
}
const retrieveProduct = async function () {
    const product = await stripe.products.retrieve('2');
    console.log(product)
    const price = await stripe.prices.retrieve(product.default_price);
    console.log(price)
}
const updateProduct = async function () {
    const product = await stripe.products.update(
        '2',
        {
            metadata: {
                order_id: '6735',
            },
        }
    );
    console.log(product)
}
const plan = [
    {
        price: "price_1PE1KNLmIjNUtlPNydwDYuyl"
    },

]
const createSub = async function (plan) {
    const sub = await stripe.subscriptions.create({
        customer: 1,

        items: plan
    })
    return sub
}
const subId = "sub_1PEQgqLmIjNUtlPNVmt9ti1I"
const updateSub = async function () {
    const subscription = await stripe.subscriptions.update(
        'sub_1PEQgqLmIjNUtlPNVmt9ti1I',
        {
            proration_behavior: "always_invoice",
            items: [
                {
                    id: 'si_Q4Zq0GwYYssC1d',
                    deleted: true

                }
            ]
        }
    );
    return subscription
}
const updateCus = async function () {
    const cus = await stripe.customers.update(
        id, { invoice_settings: { default_payment_method: payment } }
    )
}

const getInfoSubByCus = async function (id_sub) {
    const getInfoSubByCus = await stripe.subscriptions.retrieve(id_sub)
    console.log(getInfoSubByCus.items.data)
}
const idInvoice = "in_1PE40wLmIjNUtlPNRTWGqdba"
const pi = "pi_3PE40wLmIjNUtlPN1ecVioBT"
const infoInvoice = async function (idInvoice) {
    const invoice = await stripe.invoices.retrieve(idInvoice);
    console.log(invoice)
}
const refund = async function (pi) {
    const bool = await stripe.refunds.create({
        payment_intent: pi
    })
    console.log(bool)
}
const checkOut = async function () {
    const session = await stripe.checkout.sessions.create({
        success_url: 'https://example.com/success',
        mode: 'subscription',
        line_items: [
            {
                price: "price_1PEOOILmIjNUtlPNtQsTxMIL",
                quantity: 1
            },
        ],
        currency: "USD"
    });
    return session
}
//createCustomer(param)
//retrieveCustomer(id)
//addPaymentToCustomer(payment)

//createProduct(productDetail)
//createSub(plan)
//getInfoSubByCus(subId)
//infoInvoice(idInvoice)
//refund(pi)
//getInfoPM()
//detachPm()
//retrieveProduct()
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/check', async (req, res) => {
    const url = await checkOut()
    res.send(url)
})
app.post('/testSub', async (request, response) => {


    const sub = await createSub(plan)
    console.log(sub)
    console.log(request.ip)
    response.send();
});
app.get("/ip", (request, response) => {
    console.log(request.ip)
    response.send(request.ip);
})
app.post('/updateSub', async (request, response) => {


    const sub = await updateSub()
    console.log(sub)

    response.send();
});
const endpointSecret = "whsec_c4bdfe85543bfb3f3e6312ca0832b4e1aa6e053b53ea9f55daa637dc4a003fa0"
app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {

    const sig = request.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        response.sendStatus(400);
        return;
    }
    // Handle the event
    switch (event.type) {
        case 'customer.subscription.created':
            const subscriptionCreated = event.data.object;
            console.log(subscriptionCreated)
            break;
        case 'customer.subscription.deleted':
            const customerSubscriptionDeleted = event.data.object;
            console.log(customerSubscriptionDeleted)
            break;
        default:

    }


    response.sendStatus(200);
});

app.listen(3000, function () {
    console.log('Server running!')
})