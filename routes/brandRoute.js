const express = require('express');
const { authMiddleware, isAdmin } = require('../middlerwares/authMiddleware');
const { createBrand, updateBrand, deletBrand, getBrand, getallBrand } = require('../controller/brandCtrl');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBrand);
router.put('/:id', authMiddleware, isAdmin, updateBrand);
router.delete('/:id', authMiddleware, isAdmin, deletBrand);
router.get('/:id', getBrand);
router.get('/', getallBrand);
 
module.exports = router;