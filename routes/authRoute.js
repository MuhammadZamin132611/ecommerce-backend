const express = require('express');
const { createUser, loginUserCtrl, getallUser, getaUser, deleteaUser, updatedUser, unblockUser, blockUser, handelRefreshToekn, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, addToWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrder, updateOrderStatus, getAllOrder } = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlerwares/authMiddleware');
const router = express.Router();
router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);
router.put('/update-order/:id', authMiddleware, updateOrderStatus);

router.put('/password', authMiddleware, isAdmin, updatePassword);
router.post('/login', loginUserCtrl);
router.post('/admin-login', loginAdmin);
router.post('/cart', authMiddleware, userCart);
router.post('/cart/applycoupon', authMiddleware, applyCoupon);
router.post('/cart/cash-order', authMiddleware, createOrder)

router.get('/get-orders', authMiddleware, getOrder);
router.get('/getallorders', authMiddleware, isAdmin, getAllOrder);
router.get('/all-users', getallUser);
router.get('/refresh', handelRefreshToekn);
router.get('/logout', logout);
router.get('/wishlist', authMiddleware, addToWishlist);
router.get('/cart', authMiddleware, getUserCart);

router.get('/:id', authMiddleware, isAdmin, getaUser);
router.delete('/empty-cart', authMiddleware, emptyCart);
router.delete('/:id', deleteaUser);

router.put('/edit-user', authMiddleware, updatedUser);
router.put('/save-address', authMiddleware, saveAddress);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);
module.exports = router;
