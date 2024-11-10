const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

//local imports
const {MONGO_URL} = require('./config.js');
const userRoutes = require('./routes/user.js');
const staticRoutes = require('./routes/static.js');
const dashboardRoutes = require('./routes/dashboard.js');

mongoose.connect(MONGO_URL)
    .then(() => console.log("Successfully Established connection to DataBase."))
    .catch((error) => console.log(error));

const app = express();
const PORT = 8000;

// middleware
app.use(cors({
    origin: ["http://localhost:8000", "http://localhost:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', "Cookie", "user-info"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

//API routes
app.use('/', staticRoutes);
app.use('/user', userRoutes);
app.use('/dashboard', dashboardRoutes);

app.listen(PORT, () => {
    console.log(`Server Running on PORT: ${PORT}.`);
});