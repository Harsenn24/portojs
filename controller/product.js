const { ObjectID } = require("bson")
const { date2number } = require("../helper/date2number")
const { encrypt, encrypt_word, decrypt_word, encrypt_id } = require("../helper/encrypt-decrypt-account")
const { result_data } = require("../helper/result")
const { Product } = require("../model")
const path = require('path');
const global_path = path.resolve()
var fs = require('fs');
const { search_something } = require("../helper/search_something")

class ProductController {
    static async create_product(req, res, next) {

        let image = req.files[0].filename

        await fs.renameSync(`${global_path}/uploads/${image}`, `${global_path}/uploads/${image}.jpg`)

        const { name, quantity, description, price } = req.body

        if (!name) { throw { message: 'Name is required' } }
        if (!quantity) { throw { message: 'Quantity is required' } }
        if (!description) { throw { message: 'Description is required' } }
        if (!price) { throw { message: 'Price is required' } }


        let insert_data = {
            epoch: date2number(''),
            name,
            quantity,
            user_id: ObjectID(req.user.id),
            description,
            price,
            image
        }

        const new_product = await new Product(insert_data)

        await new_product.save()

        res.status(200).json(result_data('Success add new product'))

    }



    static async id_product_image(req, res, next) {
        try {

            let id_product_image = await Product.aggregate(
                [
                    {
                        '$project': {
                            'name': '$name',
                        }
                    }
                ]
            )

            encrypt_id(id_product_image)

            res.status(200).json(result_data(id_product_image))

        } catch (error) {
            console.log(error)
            next(error)
        }
    }


    static async product_image(req, res, next) {
        try {
            const { id_product } = req.query

            const id_decrypt = decrypt_word(id_product, 12)

            const [find_product] = await Product.aggregate(
                [
                    {
                        '$match': { '_id': ObjectID(id_decrypt) }
                    },
                    {
                        '$project': {
                            'image_name': '$image'
                        }
                    }
                ]
            )

            res.sendFile(`${find_product.image_name}.jpg`, { root: path.join(__dirname, '../uploads') })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }


    static async get_product(req, res, next) {
        try {

            const { search_product } = req.query
            let get_product = await Product.aggregate(
                [
                    {
                        '$lookup': {
                            'from': 'users',
                            'localField': 'user_id',
                            'foreignField': '_id',
                            'as': 'data_user',
                            'pipeline': [
                                {
                                    '$project': {
                                        'full_name': {
                                            '$reduce': {
                                                'input': '$full_name',
                                                'initialValue': '',
                                                'in': {
                                                    '$concat': [
                                                        '$$value',
                                                        { '$cond': [{ '$eq': ['$$value', ''] }, '', ' '] },
                                                        '$$this'
                                                    ]
                                                }
                                            }
                                        },
                                        'status': {
                                            '$cond': {
                                                'if': { '$eq': ['$status', true] },
                                                'then': 'Aktif',
                                                'else': 'Tidak Aktif'
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    {
                        '$addFields': {
                            'full_name': { '$ifNull': [{ '$first': '$data_user.full_name' }, '-'] },
                            'status': { '$ifNull': [{ '$first': '$data_user.status' }, '-'] },
                        }
                    },
                    {
                        '$match': { 'status': 'Aktif' }
                    },
                    {
                        '$match': search_something('name', search_product)
                    },
                    {
                        '$project': {
                            'product_name': '$name',
                            'price': '$price',
                            'owner': '$full_name',
                            'quantity': '$quantity',

                        }
                    }
                ]
            )

            encrypt_id(get_product)

            res.status(200).json(result_data(get_product))
        } catch (error) {
            console.log(error);
            next(error)
        }
    }


    static async edit_product(req, res, next) {
        try {
            const { id } = req.params
            const product_id_decrypt = decrypt_word(id, 12)

            const { name, quantity, description, price } = req.body

            let data_update = {
                name,
                quantity,
                description,
                price,
                epoch_update : date2number('')
            }

            console.log(data_update)        

            // const edit_data = await Product.findByIdAndUpdate(
            //     { _id: ObjectID(product_id_decrypt) },
            //     {
            //         '$set': req.body
            //     }
            // )

            // res.status(200).json(result_data())




        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

module.exports = { ProductController }