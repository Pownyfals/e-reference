const express = require('express');
const router = express.Router();
const Reference = require('../models/reference')

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
    Reference.find({}, 'references', (err, doc)=>{
        if(!err){
          let arr = (doc[0].references)
          res.render('home', {array: arr})

        }else{
          console.log(err)
        }
      })
})




module.exports = router;