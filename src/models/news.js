const mongoose = require('mongoose');


const newsScema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Reporter'
    }
    // ,
    // timestamps: { currentTime: () => new Date().setHours(new Date().getHours() + 2) }
});


const Reporter = mongoose.model('news', newsScema)
module.exports = Reporter