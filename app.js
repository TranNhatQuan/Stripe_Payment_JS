const dotenv = require("dotenv");
dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const express = require("express");
const app = express();

var param = {};
param.email = "testa@gmail.com";
param.name = "testAcc";
param.id = 1;
param.currency = "SGD";
const createCustomer = async function (param) {
  const customer = await stripe.customers.create(param);
  console.log(customer);
};
const id = "cus_Q67ciQa43WRhmn";
const data = {};
const retrieveCustomer = async function (id) {
  const customer = await stripe.customers.listPaymentMethods(id, {
    starting_after: data.startingAfter,
    limit: data.limit,
  });
  console.log(customer);
};

const payment = "pm_1PGBrILmIjNUtlPNh3WAUolv";
const addPaymentToCustomer = async function (payment) {
  const customersPaymentMethod = await stripe.paymentMethods.attach(payment, {
    customer: "cus_Q67ciQa43WRhmn",
  });
  console.log(customersPaymentMethod);
  const cus = await stripe.customers.update("cus_Q67ciQa43WRhmn", {
    invoice_settings: { default_payment_method: customersPaymentMethod.id },
  });
};
const getInfoPM = async function () {
  const paymentMethod = await stripe.customers.retrievePaymentMethod(
    "cus_Q67ciQa43WRhmn",
    "pm_1PGCEnLmIjNUtlPNOvqSsZjs"
  );
  console.log(paymentMethod);
};
const updatePM = async function () {
  const paymentMethod = await stripe.paymentMethods.update(
    "pm_1PE3dQLmIjNUtlPNNWey8RLi"
  );
};
const detachPm = async function () {
  const paymentMethod = await stripe.paymentMethods.detach(
    "pm_1PE3dQLmIjNUtlPNNWey8RLi"
  );
};
const productDetail = {
  name: "Pro",
  description: "1. ABC\n2. ABD",
  id: "2",
  default_price_data: {
    unit_amount: 500,
    currency: "USD",
    recurring: {
      interval: "month",
      interval_count: 1,
    },
  },
};
const createProduct = async function (productDetail) {
  const product = await stripe.products.create(productDetail);
  console.log(product);
};
const retrieveProduct = async function () {
  const product = await stripe.products.retrieve("2");
  console.log(product);
  const price = await stripe.prices.retrieve(product.default_price);
  console.log(price);
};
const updateProduct = async function () {
  const product = await stripe.products.update("2", {
    metadata: {
      order_id: "6735",
    },
  });
  console.log(product);
};
const plan = [
  {
    price: "price_1PE1KNLmIjNUtlPNydwDYuyl",
  },
];
const createSub = async function (plan) {
  const sub = await stripe.subscriptions.create({
    customer: 1,

    items: plan,
  });
  return sub;
};
const subId = "sub_1PEQgqLmIjNUtlPNVmt9ti1I";
const updateSub = async function () {
  const subscription = await stripe.subscriptions.update(
    "sub_1PEQgqLmIjNUtlPNVmt9ti1I",
    {
      proration_behavior: "always_invoice",
      items: [
        {
          id: "si_Q4Zq0GwYYssC1d",
          deleted: true,
        },
      ],
    }
  );
  return subscription;
};
const updateCus = async function () {
  const cus = await stripe.customers.update(id, {
    invoice_settings: { default_payment_method: payment },
  });
};

const getInfoSubByCus = async function (id_sub) {
  const getInfoSubByCus = await stripe.subscriptions.retrieve(id_sub);
  console.log(getInfoSubByCus.items.data);
};
const idInvoice = "in_1PE40wLmIjNUtlPNRTWGqdba";
const pi = "pi_3PE40wLmIjNUtlPN1ecVioBT";
const infoInvoice = async function (idInvoice) {
  const invoice = await stripe.invoices.retrieve(idInvoice);
  console.log(invoice);
};
const refund = async function (pi) {
  const bool = await stripe.refunds.create({
    payment_intent: pi,
  });
  console.log(bool);
};
const checkOut = async function () {
  const session = await stripe.checkout.sessions.create({
    success_url: "https://example.com/success",
    mode: "subscription",
    customer: "cus_QcgDmwqlcK3ZJk",
    currency: "SGD",
    line_items: [
      {
        price: "price_1PlStdRwwUhSk2xPLHuBXJsj",
        quantity: 1,
      },
    ],
  });
  console.log(session);
};
const retrieveSession = async function () {
  const session = await stripe.checkout.sessions.retrieve(
    "cs_test_c1x3uhhvpLo1c74X4HwVrvsvSQyFAF8sdggZlOpTRFmOo7DnUF7OmPNoIC"
  );
  console.log(session);
  const setup = await stripe.setupIntents.retrieve(
    "seti_1PGC5YLmIjNUtlPNgEBLwGmH"
  );
  console.log(setup);
};

const retrievebill = async function () {
  const bill = await stripe.invoices.retrieve("in_1PjbW2RwwUhSk2xPily5k6Wz", {
    expand: ["charge.balance_transaction"],
  });
  let feeStripe = 0;
  const charge = bill.charge;
  const exchangeRate = charge.balance_transaction.exchange_rate ?? 1;
  feeStripe = Math.round(charge.balance_transaction.fee / exchangeRate);
  console.log(bill.charge.balance_transaction.fee_details);
  console.log([exchangeRate, feeStripe]);
};
//retrieveSession()
retrievebill();
// checkOut();
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/check", async (req, res) => {
  const url = await checkOut();
  res.send(url);
});
app.post("/testSub", async (request, response) => {
  const sub = await createSub(plan);
  console.log(sub);
  console.log(request.ip);
  response.send();
});
app.get("/ip", (request, response) => {
  console.log(request.ip);
  response.send(request.ip);
});
app.post("/updateSub", async (request, response) => {
  const sub = await updateSub();
  console.log(sub);

  response.send();
});
const endpointSecret =
  "whsec_c4bdfe85543bfb3f3e6312ca0832b4e1aa6e053b53ea9f55daa637dc4a003fa0";
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.sendStatus(400);
      return;
    }
    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
        const subscriptionCreated = event.data.object;
        console.log(subscriptionCreated);
        break;
      case "customer.subscription.deleted":
        const customerSubscriptionDeleted = event.data.object;
        console.log(customerSubscriptionDeleted);
        break;
      default:
    }

    response.sendStatus(200);
  }
);

app.listen(3000, function () {
  console.log("Server running!");
});
