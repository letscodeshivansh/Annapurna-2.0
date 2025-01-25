const Food = require('../models/food');  // Updated model name
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const foods = await Food.find({});
    res.render('foods/index', { foods });
}

module.exports.renderNewForm = (req, res) => {
    res.render('foods/new');
}

module.exports.createFood = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.food.location,
        limit: 1
    }).send()

    const food = new Food(req.body.food);
    food.geometry = geoData.body.features[0].geometry;
    food.images = req.files.map(f => ({ url: f.path, filename: f.filename })); 
    food.author = req.user._id;
    
    await food.save();
    req.flash('success', 'Successfully added new food item!');
    res.redirect(`/foods/${food._id}`);
}

module.exports.showFood = async (req, res) => {
    const food = await Food.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!food) {
        req.flash('error', "Can't find that food item");
        return res.redirect('/foods');
    }

    res.render('foods/show', { food });
}

module.exports.renderEditForm = async (req, res) => {
    const food = await Food.findById(req.params.id);
    if (!food) {
        req.flash('error', "Can't find that food item");
        return res.redirect('/foods');
    }
    res.render('foods/edit', { food });
}

module.exports.updateFood = async (req, res, next) => {
    const { id } = req.params;
    const food = await Food.findByIdAndUpdate(id, req.body.food, { runValidators: true, new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    food.images.push(...imgs);
    await food.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await food.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }

    req.flash('success', 'Successfully updated food item!');
    res.redirect(`/foods/${food._id}`);
}

module.exports.deleteFood = async (req, res) => {
    const { id } = req.params;
    await Food.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted food item');
    res.redirect('/foods');
}
