const mongoose = require('mongoose');

const referenceSchema = new mongoose.Schema({ 
  references : [{
    title: String,
    summary: String,
    date: String,
    imgUrl: String
  }]
});



module.exports = mongoose.model('Reference', referenceSchema);