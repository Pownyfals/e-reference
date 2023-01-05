const express = require('express');
const router = express.Router();
const Users = require('../models/users')

router.get('/', (req, res) => {
    res.render('login', {msg: '', auth: false});
})

router.get('/register', (req, res) => {
    res.render('register')
})


router.get('/admin', (req, res) => {
    res.render('adminDashboard')
})

router.get('/home', (req, res) => {
    res.render('home')
})




module.exports = router;