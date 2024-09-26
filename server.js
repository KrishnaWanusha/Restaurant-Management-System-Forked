require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); //use for convert json format to javaScript
const cors = require("cors");
const { Router } = require("express");
const jwt = require("jsonwebtoken");

const app = express();

// JWT authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Middleware for role-based authorization
const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).send("Access Denied");
    }
    next();
  };
};

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
//Supplier details
const supplierRoutes = require("./routes/Supplier-routes");
//supplier orders route
const SupplierOrderRoutes = require("./routes/Supplier-order-routes");
const attendRoutes = require("./routes/attends");
const userRoutes = require("./routes/user");
//app middleware
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//role based authentication
app.use(
  "/employees",
  authenticateToken,
  authorizeRole("admin"),
  employeeRoutes
);
app.use("/records", authenticateToken, authorizeRole("admin"), recordRoutes);
app.use("/bills", authenticateToken, authorizeRole("manager"), billRoutes);
app.use("/orders", authenticateToken, authorizeRole("employee"), orderRoutes);
app.use("/items", authenticateToken, authorizeRole("manager"), itemRoutes);
app.use("/drivers", authenticateToken, authorizeRole("admin"), driverRouter);
app.use("/vehicles", authenticateToken, authorizeRole("admin"), vehicleRouter);
app.use(
  "/deliveries",
  authenticateToken,
  authorizeRole("admin"),
  deliveryRouter
);
{
  /** end of delivery */
}
app.use("/posts", authenticateToken, postRoutes);

app.use(
  "/api/supplier",
  authenticateToken,
  authorizeRole("admin"),
  supplierRoutes
);
app.use(
  "/api/supplierorder",
  authenticateToken,
  authorizeRole("manager"),
  SupplierOrderRoutes
);
app.use("/attends", authenticateToken, authorizeRole("employee"), attendRoutes);

app.use(userRoutes);

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
