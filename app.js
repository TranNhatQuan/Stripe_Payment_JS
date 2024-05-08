
const dotenv = require('dotenv')
dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SK)
const express = require('express')
const app = express()

var param = {}
param.email = 'test@gmail.com'
param.name = 'testAcc'
const createCustomer = async function (param) {

    const customer = await stripe.customers.create(param)
    console.log(customer)
}
const id = 'cus_Q4C04bJYgIAbyK'
const retrieveCustomer = async function (id) {
    const customer = await stripe.customers.retrieve(id)
    console.log(customer)
}
const card =
{
    number: '4242424242424242',
    exp_month: '5',
    exp_year: '2024',
    cvc: '314',
}
const payment = 'pm_card_visa'
const addPaymentToCustomer = async function (payment) {
    const customersPaymentMethod = await stripe.paymentMethods.attach(payment, { customer: id })
    console.log(customersPaymentMethod)
    const cus = await stripe.customers.update(
        id, { invoice_settings: { default_payment_method: customersPaymentMethod.id } }
    )
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
const plan = [
    {
        price: "price_1PE1KNLmIjNUtlPNydwDYuyl"
    }
]
const createSub = async function (plan) {
    const sub = await stripe.subscriptions.create({
        customer: id,

        items: plan
    })
}
const updateCus = async function () {
    const cus = await stripe.customers.update(
        id, { invoice_settings: { default_payment_method: payment } }
    )
}
const id_sub = "sub_1PE40wLmIjNUtlPNa6IgyTU2"
const getInfoSubByCus = async function (id_sub) {
    const getInfoSubByCus = await stripe.subscriptions.retrieve(id_sub)
    console.log(getInfoSubByCus)
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
//createCustomer(param)
//retrieveCustomer(id)
//addPaymentToCustomer(payment)

//createProduct(productDetail)
//createSub(plan)
//getInfoSubByCus(id_sub)
//infoInvoice(idInvoice)
refund(pi)
app.listen(3000, function () {
    console.log('Server running!')
})