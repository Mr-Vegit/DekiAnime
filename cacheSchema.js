const mongoose = require('mongoose');
const CacheSchema = new mongoose.Schema({
    animeData:Array,
    filter:Array,
});
// UserSchema.plugin(uniqueValidator)
const Caches = mongoose.model("Caches", CacheSchema);
module.exports = Caches;