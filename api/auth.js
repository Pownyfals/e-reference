const express = require ('express'); 
const bcrypt = require('bcryptjs') ;
const router = express.Router(); 
const Users = require('../models/users')
const Reference = require('../models/reference')


router.post('/login', (req, res) => {
  Users.findOne({email:req.body.email}, (err, docs) => {
    if (!err) {
        if (docs) {
          bcrypt.compare(req.body.password, docs.password, function(err, result) {
            if (err) {
              console.log(err);
              res.render('login', {msg : "Terdapat kesalahan, silahkan login kembali!", auth : false})
            }
            else {
                if (result) {
                  if (docs.status === 'author') {
                    res.redirect('/admin')
                  }
                  else {
                    res.redirect('/home')
                  }
                }else{
                  res.render('login', {msg : "Password salah!", auth : false})
                }
            }
          });
        } else {
          res.render('login', {msg : "Akun salah!", auth : false})
        }
    } else {
        console.error(err);
    }
  })
})

router.post('/register', (req, res) => {
    Users.findOne({email:req.body.email}, async(err, docs) => {
        if (!err) {
            if (docs) {
              res.render('login', {msg : "Akun gagal dibuat karena sudah ter-registrasi!", auth : false})
            } else {
              let hashedPassword = await bcrypt.hash(req.body.password, 8);
              Users.create({
                email : req.body.email,
                password : hashedPassword,
                status: req.body.status
              }, (err, doc) =>{
                if (!err) {
                  console.log("Created new user.");
                  res.render('login', {msg : "Akun berhasil dibuat!", auth : true, email : req.body.email})
                } else {
                  console.log(err);
                }
              })
            }
        } else {
            console.error(err);
        }
      })
})


//create in account
router.post('/create',(req,res)=>{
  let data={
    title:req.body.title,
    summary:req.body.summary,
    date:req.body.date
  };
  try{
      Users.findOneAndUpdate(
        {email:req.body.email},
        {
          $push:{
            references:data,
          },
        },
        (err, doc) =>{
          if (!err) {
            console.log("Reference added for user with email "+req.body.email);
            res.render('home', {msg : "References updated!", auth : true, email : req.body.email})
          } else {
            console.log(err);
            res.render('home', {msg : "Update reference failed!", email : req.body.email})
          }
        }
      );
  }catch(err){
    res.render('home', {msg : "gagal", auth : false})
  }
})

//delete in account
router.post('/delete',(req, res)=>{
  console.log("doing delete")
	try{
    const reference = Users.findOneAndUpdate(
      {email:req.body.email},
      {
        $pull:{
          references:{title:req.body.title},
        },
      },
      (err, doc) =>{
        if (!err) {
          console.log("deleting reference "+req.body.title);
          res.render('home', {msg : "references deleted!", auth : true})
        } else {
          console.log(err);
        }
      }
    );
  }catch(err){
    console.log(err)
    res.render('home', {msg : "gagal", auth : false})
  }
})

//create reference 
router.post('/createReference',(req,res)=>{
  let data={
    title:req.body.title,
    summary:req.body.summary,
    date:req.body.date,
    imgUrl:req.body.imgUrl
  };
  try{
    Reference.updateOne(
      {_id : '63b6ef35f74e3ce342e7ef11'},
      {
        $push:{
          references:data,
        },
      },
      (err, doc) =>{
        if (!err) {
          console.log("Reference added!");
          res.redirect('/admin')
        } else {
          console.log(err);
          res.redirect('/admin')
        }
      }
    );
  }catch(err){
    res.redirect('/admin')
  }
})

router.get('/createReference', async(req,res)=>{
  try{
    Reference.find({}, 'references', (err, doc)=>{
      if(!err){
        res.json(doc[0].references)
      }else{
        console.log(err)
      }
    })
  }catch(err){
    res.redirect('/admin')
  }
})

// delete reference 
router.post('/deleteReference',async(req, res)=>{
  const title = req.body.title;
  try{
    await Reference.updateMany({},{$set:{references:{ title: title}}}) 
    console.log("Reference deleted!");
    res.redirect('/admin')
  }catch(err){
    res.redirect('/admin')
  }
});

// // update reference
// router.post('/updateReference',async(req, res)=>{
//   const title = req.body.title;
//   try{
//     await Reference.updateMany({},{$set:{references:{ summary: title}}}) 
//     console.log("Reference deleted!");
//     res.redirect('/admin')
//   }catch(err){
//     res.redirect('/admin')
//   }
// });

router.post('/updateReference',(req, res)=>{
  const title = req.body.title;

  Reference.findOne({_id:'63b6ef35f74e3ce342e7ef11'},  (err, docs)=> {
    if(!err){
      if(docs){
        docs.references.forEach(element => {
          if (element.title === title) {
            element.summary = req.body.summary;
            element.imgUrl = req.body.imgUrl;
          }
        });

        docs.save();
        console.log("Reference updated!");
        res.redirect('/admin')
      }
    }
    
  })
  
});





module.exports = router; 
