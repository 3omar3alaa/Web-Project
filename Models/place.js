const mongoose = require('mongoose');
const Schema = mongoose.Schema;

AvailabilityIntervalSchema = new Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate:{
        type: Date,
        required: true
    }
});

OfferLogSchema = new Schema({
    tenantId:{
        type: String,
        required: true
    },
    offerInterval:{
        type: AvailabilityIntervalSchema,
        required: true
    },
    status:{
        type: String, //pending, accepted, rejected
        required: true
    }
});

ReviewSchema = new Schema({
    tenantId: {
        type: String,
        required: true
    },
    review_text: {
        type: String,
        required: true
    },
    review_score: {
        type: Number, //out of 5
        required: true
    }
});

PlaceSchema = new Schema({
    ownerId: {
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    size:{
        type: Number,
        required: true
    },
    availabilityIntervals:{
        type: [AvailabilityIntervalSchema],
        required: true
    },
    title:{
      type : String,
      required : true
    },
    description: {
        type: String,
        required: true
    },
    offersLog: {
        type: [OfferLogSchema],
        required: true
    },
    reviews:{
        type: [ReviewSchema],
        required: true
    }
});

const PlaceModel = mongoose.model('Place', PlaceSchema);

module.exports = PlaceModel;