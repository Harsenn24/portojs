const { ObjectID } = require("bson");
const { decrypt_word } = require("../helper/encrypt-decrypt-account.js");
const { custom_jwt } = require("../helper/encrypt_decrypt_pass.js");
const { User } = require("../model/index.js");

const authentif = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (authorization.split(' ')[0] !== 'User') {
            throw { message: "JSON Web Token Error" };
        }

        const payload = custom_jwt(authorization, 'decrypt');

        const user_logged = await User.findById({ _id: ObjectID(payload._id) })

        if (!user_logged) {
            throw { message: "JSON Web Token Error" };
        }

        req.user = {
            email: decrypt_word(user_logged.email, 8),
            username: user_logged.username,
            id: user_logged._id
        };

        next();
    } catch (error) {
        console.log(error);
        next(error)
    }
};

module.exports = {
    authentif,
};
