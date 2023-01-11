const { ObjectID } = require("bson");
const { Product, User } = require("../model/index.js");

const authorization = async (req, res, next) => {
    try {
        const { id } = req.user

        const find_product = await Product.aggregate(
            [
                {
                    '$match': {
                        'user_id': ObjectID(id)
                    }
                }
            ]
        )


        if (find_product.length === 0) { throw { message: 'User is not authorized' } }

        next();
    } catch (error) {
        console.log(error);
        next(error)
    }
};

module.exports = {
    authorization,
};
