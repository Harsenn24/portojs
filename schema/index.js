const { ObjectId } = require("mongodb")

const user_schema = {
    username: { type: String },
    birthday_date: { type: Number },
    password: { type: String },
    email: { type: String },
    status: { type: Boolean },
    epoch: { type: Number },
    full_name: { type: Array }
}

const temp_code = {
    code: { type: String },
    email: { type: String },
    user_id: { type: ObjectId }
}

const product_schema = {
    epoch: { type: Number },
    epoch_update: { type: Number },
    name: { type: String },
    quantity: { type: Number },
    user_id: { type: ObjectId },
    description: { type: String },
    price: { type: Number },
    image: { type: String }
}

module.exports = { user_schema, temp_code, product_schema }