const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description : {
        type: String
    },
    unitPrice : {
        type: Number,
        required:true
    },
    image: {
        type:String,
    }
})

module.exports = mongoose.model('dishModel', dishSchema);
