const mongoose = require('mongoose');
const { foodSchema } = require('../schemas');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
// Virtual property to generate thumbnail versions of images

const opts = { toJSON: { virtuals: true } }; 
// Ensure virtual properties are included when converting to JSON

const FoodSchema = new Schema({
    name: String,  // Changed from title to name for food items
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

}, opts);

FoodSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/foods/${this._id}">${this.name}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`;
});

// Middleware to delete associated reviews when a food item is deleted
FoodSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

module.exports = mongoose.model('Food', FoodSchema);
