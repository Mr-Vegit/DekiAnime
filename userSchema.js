const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    recent: Array,
    bookmark: Array
});
// UserSchema.plugin(uniqueValidator)
const User = mongoose.model("Users", UserSchema);
module.exports = User;