const express = require('express');
const { authMiddleware, isAdmin } = require('../middlerwares/authMiddleware');
const { createBlog, udateBlog, getBlog, getAllBlogs, deleteBlog, liketheBlog, disliketheBlog } = require('../controller/blogCtrl');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlog);
router.put('/likes', authMiddleware, liketheBlog);
router.put('/dislikes', authMiddleware, disliketheBlog);
router.put('/:id', authMiddleware, isAdmin, udateBlog);
router.get('/:id', getBlog);
router.get('/', getAllBlogs);
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);

module.exports = router;