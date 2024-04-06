const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const driverRouter = require("./routes/driverRoutes");
const rideRouter = require("./routes/rideRoutes");
const passengerRouter = require("./routes/passengerRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Security HTTP headers
app.use(helmet({ contentSecurityPolicy: false }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same IP address
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against xss
app.use(xss());

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.cookies);
  next();
});

app.use(express.json());

//ROUTES
app.get("/api/welcome", (req, res) => {
  res.status(200).send({ message: "WELCOME TO ALONG APP API😁" });
});

app.use("/api/v1/passengers", passengerRouter);
app.use("/api/v1/drivers", driverRouter);
app.use("/api/v1/rides", rideRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// global.onlineDrivers = new Map();

// global.rideSocket = io;

// WebSocket setup
io.on("connection", (socket) => {
  // const { type, dID } = socket.handshake.headers;
  socket.on("driver", (driverlocation) => {
    console.log(driverlocation);
  });
  // if(type === driver)
  // onlineDrivers.set(socket.id , )
  // console.log(`User connected: ${socket.id}`);

  // socket.on("joinRideRoom", (rideId) => {
  //   socket.join(rideId);
  //   console.log(`User ${socket.id} joined ride ${rideId}`);
  // });

  // socket.on("leaveRideRoom", (rideId) => {
  //   socket.leave(rideId);
  //   console.log(`User ${socket.id} left ride ${rideId}`);
  // });

  // socket.on("updateLocation", ({ rideId, location }) => {
  //   io.to(rideId).emit("locationChanged", location);
  // });
});

module.exports = { app, server };

//socket.on(select, (driverId) )
//
