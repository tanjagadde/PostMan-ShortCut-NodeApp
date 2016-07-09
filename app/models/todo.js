var mongoose = require('mongoose');
var textSearch = require('mongoose-text-search');
//todoSchema.plugin(textSearch);
var todoSchema = mongoose.Schema({
    text : String
});
todoSchema.plugin(textSearch);
todoSchema.index({ text: 'text' });
module.exports = mongoose.model('Todo', todoSchema);