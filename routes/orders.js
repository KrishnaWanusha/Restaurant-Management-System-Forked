const express = require("express");
const Orders = require("../models/orders");
const Joi = require("joi");

const router = express.Router();
// Order validation schema using Joi
const orderSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
  address: Joi.string().required(),
  deliveryMethod: Joi.string().required(),
  paymentMethod: Joi.string().required(),
  status: Joi.string().required(),
  cartItems: Joi.array().required(),
  address: Joi.string().required(),
  orderId: Joi.string().required(),
  total: Joi.number().required(),
});

//save Order
router.post(`/order/save`, async (req, res) => {
  const { error } = orderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  let newOrder = new Orders(req.body);
  try {
    await newOrder.save(); // Save the order
    return res.status(200).json({ success: "Order Saved successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message }); // Send the error message
  }
});

//get Orders
router.get("/orders", (req, res) => {
  Orders.find().exec((err, orders) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    return res.status(200).json({
      success: true,
      existingOrders: orders,
    });
  });
});

//update
router.put("/order/update/:id", (req, res) => {
  Orders.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err, order) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      return res.status(200).json({
        success: "update succesfully",
      });
    }
  );
});

//delete
router.delete("/order/delete/:id", (req, res) => {
  Orders.findByIdAndRemove(req.params.id).exec((err, deleteOrder) => {
    if (err)
      return res.status(400).json({
        message: "Delete unsuccess",
        err,
      });
    return res.json({
      message: "Delete success",
      deleteOrder,
    });
  });
});

//get specific order
router.get("/order/:id", (req, res) => {
  let orderId = req.params.id;
  Orders.findById(orderId, (err, order) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }
    return res.status(200).json({
      success: true,
      order,
    });
  });
});

module.exports = router;
