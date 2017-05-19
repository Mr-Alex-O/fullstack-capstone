var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    complete: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Item', ItemSchema);
