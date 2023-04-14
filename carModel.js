const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({

    carName: {
        type: String,
        required: true
    },
    carPrice: {
        type: Number,
        required: true
    },
    Quantity: {
        type: Number,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    mileage: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    carTransmission: {
        type: String,
        required: true
    },
    engineSize: {
        type: Number,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    }

});

const Car = mongoose.model('Car', carSchema);
module.exports = Car;



    
