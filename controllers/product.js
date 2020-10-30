const fs = require('fs');
const _ = require('lodash');
const express = require('express');
const formidable = require('formidable');
const Product = require('../models/product');

const router = express.Router();

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    .populate('category')
    .exec((err, product) => {
        if (err) {
            return res.status(400).json({
                error: 'Product not found!'
            });
        }
        req.product = product;
        next();
    });
};

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if(err) {
            return res.status(400).json({
                error: 'Problem with the image'
            });
        }
        //Destructure the field
        const { name, description, price, category, stock } = fields;
        
        if(!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: 'Please include all fields'
            });
        }

        //TODO: restrictions on field
        let product = new Product(fields);

        //Handle file here
        if(file.photo) {
            if(file.photo.size > 3000000) {
                return res.status('400').json({
                    error: 'File size too big'
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //Save in the DB
        product.save((err, product) => {
            if(err) {
                return res.status(400).json({
                    error: 'Saving TShirt in DB Failed!'
                });
            }
            res.json(product);
        });
    });
};