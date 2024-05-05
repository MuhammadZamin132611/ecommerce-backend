const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../config/refreshtoken');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailCtrl');
const crypto = require('crypto');

// Create a user
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        // Create a new user
        const newUser = await User.create(req.body);
        res.json(newUser)
    } else {
        // User already Exists
        throw new Error("User Already Exists")
    }
});


// Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // console.log(email, password);
    // check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser?._id)
        const userUpdate = await User.findByIdAndUpdate(findUser?.id, {
            refreshToken: refreshToken
        }, { new: true });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lstname: findUser?.lstname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        })
    } else {
        throw new Error("Invalid Credentials")
    }
});

// admin login 

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // console.log(email, password);
    // check if user exists or not
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== 'admin') throw new Errorn("Not Authorised");
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findAdmin?._id)
        const userUpdate = await User.findByIdAndUpdate(findAdmin?.id, {
            refreshToken: refreshToken
        }, { new: true });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lstname: findAdmin?.lstname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id)
        })
    } else {
        throw new Error("Invalid Credentials")
    }
});

// handel refresh token
const handelRefreshToekn = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    // console.log(cookie)
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies")
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken)
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No Refresh Present Token present in db or not matched")
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something worng with refresh token");
        }
        const accessToken = generateToken(User?._id)
        res.json({ accessToken });
    })
})

// LogOut funftionality
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // forbidden
    }
    // await User.findOneAndUpdate(refreshToken, {
    //     refreshToken: "",
    // });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); // forbidden
})

// Update a user

const updatedUser = asyncHandler(async (req, res) => {
    // console.log("user Ctrl =>",req.user)
    const { _id } = req.user;
    validateMongoDbId(_id)
    try {
        const updatedaUser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lstname: req?.body?.lstname,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        }, {
            new: true,
        });
        res.json(updatedaUser)
    } catch (error) {
        throw new Error(error)
    }
})

// Get all users

const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find()
        res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
})

// Get a single user

const getaUser = asyncHandler(async (req, res) => {
    // console.log(req.params)
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getaUser = await User.findById(id)
        res.json({
            getaUser,
        })
    } catch (error) {
        throw new Error(error)
    }
})

const deleteaUser = asyncHandler(async (req, res) => {
    // console.log(req.params)
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deleteaUser = await User.findByIdAndDelete(id)
        res.json({
            deleteaUser,
        })
    } catch (error) {
        // throw new Error(error)
    }
})

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
    try {
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: true
        }, {
            new: true
        })
        res.json(block)
    } catch (error) {
        throw new Error(error);
    }
});

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id)
    try {
        const unblock = await User.findByIdAndUpdate(id, {
            isBlocked: false
        }, {
            new: true
        })
        res.json(unblock)
    } catch (error) {
        throw new Error(error);
    }
});

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
        console.log(res.json(updatedPassword))
    } else {
        res.json(user);
    }
});


const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href="http://localhost:5000/api/user/reset-password/${token}">Click Here</>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            htm: resetURL,
        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error);
    }
});


const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').updaye(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) throw new Error(' Token Expired, Please try again later');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});


const addToWishlist = asyncHandler(async (req, res) => {
    const { id } = req.user;
    try {
      const findUser = await User.findById(id).populate("wishlist");
      res.json(findUser);
    } catch (error) {
      throw new Error(error);
    }
  });

module.exports = { createUser, loginUserCtrl, getallUser, getaUser, deleteaUser, updatedUser, blockUser, unblockUser, handelRefreshToekn, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, addToWishlist }