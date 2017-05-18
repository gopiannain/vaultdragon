var mongoose    =   require("mongoose");

var mongoSchema =   mongoose.Schema;
var KVSchema  = {
    "key" : String,
    "value" : String,
    "timecreated" : { type: Date, default: Date.now },
    "vc_values" : {type: Array, default: []},
};
module.exports = mongoose.model('KeyValue',KVSchema);;
