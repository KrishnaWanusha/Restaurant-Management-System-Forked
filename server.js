const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); //use for convert json format to javaScript
const cors = require("cors");
const { Router } = require("express");
const jwt = require("jsonwebtoken");

const app = express();

// JWT authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);

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
      return res.status(403).send('Access Denied'); 
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
//app middleware
app.use(bodyParser.json());
app.use(cors());

//role based authentication
app.use("/employees", authenticateToken, authorizeRole('admin'), employeeRoutes);
app.use("/records", authenticateToken, authorizeRole('admin'), recordRoutes);
app.use("/bills", authenticateToken, authorizeRole('manager'), billRoutes);
app.use("/orders", authenticateToken, authorizeRole('manager'), orderRoutes);
app.use("/items", authenticateToken, authorizeRole('manager'), itemRoutes);
app.use("/drivers", authenticateToken, authorizeRole('admin'), driverRouter);
app.use("/vehicles", authenticateToken, authorizeRole('admin'), vehicleRouter);
app.use("/deliveries", authenticateToken, authorizeRole('admin'), deliveryRouter);
{
  /** end of delivery */
}
app.use("/posts", authenticateToken, postRoutes);

app.use("/api/supplier", authenticateToken, authorizeRole('admin'), supplierRoutes);
app.use("/api/supplierorder", authenticateToken, authorizeRole('manager'), SupplierOrderRoutes);
app.use("/attends", authenticateToken, authorizeRole('employee'), attendRoutes);


const PORT = 8000; // sever port
// const DB_URL = `mongodb+srv://Admin:admin321@project.0tb9c.mongodb.net/highGarden_Db?retryWrites=true&w=majority`;
const DB_URL = `mongodb+srv://admin:X5lNCJY7mFkgsTiI@timetable-management.wk03sxf.mongodb.net/highGarden_Db?retryWrites=true&w=majority`;

//crate options
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//db Connection
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => console.log("DB Connection Error!", err));

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
