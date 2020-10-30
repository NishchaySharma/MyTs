const express = require('express');
const { getUserById } = require('../controllers/user');
const { isSignedIn, isAdmin, isAuthenticated } = require('../controllers/auth');
const { createCategory, getAllCategories, getCategory, getCategoryById , updateCategory, removeCategory} = require('../controllers/category');

const router = express.Router();
//Params
router.param('userId', getUserById);
router.param('categoryId', getCategoryById);

//Create
router.post('/category/create/:userId', isSignedIn, isAuthenticated, isAdmin, createCategory);

//Read
router.get('/category/:categoryId', getCategory);
router.get('/categories', getAllCategories);

//Update
router.put('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, updateCategory);

//Delete
router.delete('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, removeCategory);

module.exports = router;