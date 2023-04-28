var express = require("express");
var router = express.Router();
const { getProducts } = require("../lib/methods");
const { client } = require("../lib/connection");
const mp = require("mercadopago");
const config = require("../lib/mp_config");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "JSON Store" });
});

/* GET products page */
router.get("/products", async function (req, res, next) {
  getProducts()
    .then((products) => {
      res.render("products", { title: "JSON Store-Products", products });
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/");
    })
    .finally(() => {
      client.close();
      console.log("Finished");
    });
});

/* MERCADOPAGO methods */
// -----------------------------------------------------------------
/* POST payment process */
router.post("/mercadopago/:id", async function (req, res) {
  mp.configure({
    access_token: config.access_token,
  });
  const preference = {
    items: [
      {
        title: String(req.body.title),
        quantity: 1,
        current_id: "MX",
        unit_price: Number(req.body.price),
      },
    ],
    back_urls: {
      success: "http://localhost:3000/mercadopago/success",
      failure: "http://localhost:3000/mercadopago/failure",
      pending: "http://localhost:3000/mercadopago/pending",
    },
    auto_return: "approved",
  };
  await mp.preferences
    .create(preference)
    .then((response) => {
      res.redirect(response.body.init_point);
    })
    .catch((error) => {
      res.redirect(`/?${error}`);
    });
});

// ----------------------------------------------------------------------
/* GET backurls */
router.get("/mercadopago/success", function (req, res) {
  const data = req.query;
  console.log(data);
  res.render("payment/success", { title: "Success!", data });
});
router.get("/mercadopago/pending", function (req, res) {
  const data = req.query;
  console.log(data);
  res.render("payment/pending", { title: "Pending!", data });
});
router.get("/mercadopago/failure", function (req, res) {
  const data = req.query;
  console.log(data);
  res.render("payment/failure", { title: "Failure!", data });
});

module.exports = router;
