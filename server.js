require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); //use for convert json format to javaScript
const cors = require("cors");


const app = express();

//import routes
const employeeRoutes = require("./routes/employees");

const recordRoutes = require("./routes/records");

const orderRoutes = require("./routes/orders");
const itemRoutes = require("./routes/items");

const driverRouter = require("./routes/drivers");
const vehicleRouter = require("./routes/vehicles");
const deliveryRouter = require("./routes/deliveries");
const billRoutes = require("./routes/bills");

const postRoutes = require("./routes/posts");
const { Router } = require("express");

//Supplier details
const supplierRoutes = require("./routes/Supplier-routes");
//supplier orders route
const SupplierOrderRoutes = require("./routes/Supplier-order-routes");

const attendRoutes = require("./routes/attends");

//app middleware
app.use(bodyParser.json());
app.use(cors());

//roote middleware
app.use(employeeRoutes);
app.use(recordRoutes);

app.use(billRoutes);

app.use(orderRoutes);
app.use(itemRoutes);

app.use(driverRouter);
app.use(vehicleRouter);
app.use(deliveryRouter);
{
  /** end of delivery */
}
app.use(postRoutes);

app.use("/api/supplier", supplierRoutes);
app.use("/api/supplierorder", SupplierOrderRoutes);

app.use(attendRoutes);

// Define DB_URL from environment variables
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB Connected!");
}).catch((err) => {
  console.log("DB Connection Error!", err);
});