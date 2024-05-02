const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler')
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

const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // console.log(email, password);

    // check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
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
})

// Update a user

const updatedUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updatedaUser = await User.findByIdAndUpdate(id, {
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

const getallUser = asyncHandler(async (re1, res) => {
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
    try {
        const deleteaUser = await User.findByIdAndDelete(id)
        res.json({
            deleteaUser,
        })
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { createUser, loginUserCtrl, getallUser, getaUser, deleteaUser, updatedUser }