var mongoose    =   require("mongoose");

var options = { server: { socketOptions: { keepAlive: 1 } }, user: "a6cc7a7ecde0b285eee0bf6d85da9d4c",pass: "a6cc7a7ecde0b285eee0bf6d85da9d4c" };

var connectionString = 'mongodb://32-1a.mongo.evennode.com:27017/a6cc7a7ecde0b285eee0bf6d85da9d4c,mongodb://32-1b.mongo.evennode.com:27017/a6cc7a7ecde0b285eee0bf6d85da9d4c?replicaSet=eusbg1';

 mongoose.connect(connectionString, options);


//Add those events to get more info about mongoose connection:

// Connected handler
mongoose.connection.on('connected', function (err) {
  console.log("Connected to DB using chain: " + connectionString);
});

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err);
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
   self.connectToDatabase();
});


var mongoSchema =   mongoose.Schema;
var KVSchema  = {
    "key" : String,
    "value" : String,
    "timecreated" : { type: Date, default: Date.now },
    "vc_values" : {type: Array, default: []},
};
module.exports = mongoose.model('KeyValue',KVSchema);;
