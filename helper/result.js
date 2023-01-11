function result_data(
    data = { 'success': true },
    status_comments = 'ok!',
    status_code = 200,
    code_number = 1,
) {
    return {
        status_code: status_code,
        code_number: code_number,
        comments: status_comments,
        data: data
    }
}



module.exports = { result_data }