
const cors = require("cors");
require("dotenv").config()
const express = require("express");
const app = express();
const port = 3005
const { connect_db } = require("./config/index");
const { errorEP } = require("./middleware/error_endpoint");
const { error_handle } = require("./middleware/error_handle");
const router = require("./routes/index");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(router)
app.use(errorEP)
app.use(error_handle)


connect_db().then(async (db) => {
    console.log("Success Connected to MongoDB!");
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
});






