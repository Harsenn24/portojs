const { result_data } = require("../helper/result")

function error_handle(err, req, res, next) {

    let code = 0
    let code_number = 0
    let message = 0
    let data = '-'

    switch (err.message) {
        case 'Invalid Method':
            code = 400
            code_number = 4
            message = err.message
            break;

        case 'Email is required':
            code = 400
            code_number = 5
            message = err.message
            break;

        case 'Username is required':
            code = 400
            code_number = 6
            message = err.message
            break;

        case 'Password is required':
            code = 400
            code_number = 7
            message = err.message
            break;

        case 'Birthday is required':
            code = 400
            code_number = 8
            message = err.message
            break;

        case 'Email is required':
            code = 400
            code_number = 9
            message = err.message
            break;

        case 'Try another username':
            code = 400
            code_number = 10
            message = err.message
            break;

        case 'Your code is wrong':
            code = 400
            code_number = 10
            message = err.message
            break;

        case 'Username or email is required':
            code = 400
            code_number = 11
            message = err.message
            break;

        case 'Invalid username or email':
            code = 400
            code_number = 12
            message = err.message
            break;

        case 'Password is incorrect':
            code = 400
            code_number = 13
            message = err.message
            break;

        case 'User is not authorized':
            code = 400
            code_number = 14
            message = err.message
            break;

        default:
            code = 500
            code_number = 999
            message = `Custom Error : ${err}`
            break;
    }

    res.status(code).json(result_data(message, 'ERROR!', code, code_number))
}

module.exports = { error_handle }