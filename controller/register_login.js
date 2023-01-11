const { send_email } = require("../helper/email");
const { encrypt_word, decrypt_word } = require("../helper/encrypt-decrypt-account");
const { hashPassword, checkPassword, custom_jwt } = require("../helper/encrypt_decrypt_pass");
const { result_data } = require("../helper/result");
const { User, Temp_code } = require("../model/index");
const md5 = require('md5');
const { ObjectID } = require("bson");

class StoreController {
    static async register_user(req, res, next) {
        try {

            let { username, birthday_date, password, email, full_name } = req.body

            if (!username) { throw { message: 'Username is required' } }
            if (!birthday_date) { throw { message: 'Birthday is required' } }
            if (!password) { throw { message: 'Password is required' } }
            if (!email) { throw { message: 'Email is required' } }
            if (!full_name) { throw { message: 'Full name is required' } }

            full_name = full_name.split(" ")

            const epoch = (new Date().getTime()) / 1000
            birthday_date = (new Date(birthday_date).getTime()) / 1000

            password = hashPassword(password, 12)

            const status = false

            email = encrypt_word(email, 8)

            let check_username = await User.find({ username })

            if (check_username.length > 0) {
                throw { message: 'Try another username' }
            }

            let insert_data = { username, birthday_date, password, email, epoch, status, full_name }

            const new_user = await new User(insert_data)

            let data_temp = {
                code: md5((ObjectID(new_user._id))),
                email: decrypt_word(email, 8),
                user_id: ObjectID(new_user._id)
            }

            await new_user.save()

            await send_email(data_temp)

            const new_temp = await new Temp_code(data_temp)

            await new_temp.save()

            res.status(200).json(result_data('Success add user data'))

        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async active_user(req, res, next) {
        try {
            const { unique_code } = req.body

            const find_data = await Temp_code.find({ code: unique_code })

            if (find_data.length === 0) { throw { message: 'Your code is wrong' } }

            const update_store = await User.findByIdAndUpdate(
                {
                    '_id': find_data[0].user_id
                },
                {
                    'status': true
                }
            )

            await Temp_code.findByIdAndDelete({ _id: find_data[0]._id })

            res.status(200).json(result_data('Success activating user'))

        } catch (error) {
            console.log(error)
            next(error)
        }
    }


    static async login_user(req, res, next) {
        try {
            const { username_email, password } = req.body

            if (!password) { throw { message: 'Password is required' } }

            if (!username_email) { throw { message: 'Username or email is required' } }

            let find_user

            if (username_email.split("@").length > 1) {
                const encrypt_email = encrypt_word(username_email, 8)
                find_user = await User.findOne({ email: encrypt_email })
            }

            if (username_email.split("@").length === 1) {
                find_user = await User.findOne({ username: username_email })
            }


            if (!find_user) { throw { message: 'Invalid username or email' } }

            const check_pass = checkPassword(password, find_user.password)

            if (check_pass === false) { throw { message: 'Password is incorrect' } }

            const payload_jwt = {
                _id: find_user._id.toString(),
                email: decrypt_word(find_user.email, 8),
                username: find_user.username
            }

            const create_token = custom_jwt(payload_jwt, 'encrypt', 'User')

            let result_token = {
                token: create_token
            }

            res.status(200).json(result_data(result_token))

        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

module.exports = { StoreController }