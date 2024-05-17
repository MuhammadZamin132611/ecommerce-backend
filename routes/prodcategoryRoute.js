const express = require('express');
const { authMiddleware, isAdmin } = require('../middlerwares/authMiddleware');
const { createCategory, updateCategory, deletCategory, getCategory, getallCategory } = require('../controller/prodcategoryCtrl');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createCategory);
router.put('/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deletCategory);
router.get('/:id', getCategory);
router.get('/', getallCategory);

module.exports = router