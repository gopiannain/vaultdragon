var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var DatabaseOp       =   require("./models/mongo");
var router      =   express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

router.route("/vault")
    .post(function(req,res){
        var db = new DatabaseOp();
        var response = {};
        KVobj = req.body;
        
        db.key = Object.keys(KVobj)[0];
        db.value = KVobj[db.key];


        DatabaseOp.findOne({key:db.key}, function (err, exist) {
            if (!err) {
                if(exist) {

                    exist.vc_values.push({name: exist.value, timecreated: exist.timecreated});
                    exist.set('value', db.value);
                    exist.set('timecreated', Date.now());

                    exist.save(function(err, result) {
                        if (err) {
                            console.log('' + err + 'err document updated');
                            response = {"error" : true,"message" : "Error updating data:" + err};
                        } else {
                            console.log('' + db + ' document(s) updated');
                            response = {"error" : false,"message" : "Data updated"};
                        }
                        res.json(response);    
                    });
                }
                else {
                    db.save(function(err){
                        if(err) {
                            response = {"error" : true,"message" : "Error adding data"};
                        } else {
                            response = {"error" : false,"message" : "Data added"};
                        }
                        res.json(response);
                    });
                }
            }
            else 
            if (err) {
                response = {"error" : false,"message" : "Database Error"};
                res.json(response); 
            }   
        });
    });

router.route("/vault/:name")
.get(function(req,res){
        var response = {};
        DatabaseOp.findOne({key:req.params['name']},function(err,exist){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
                res.json(response);
            } else {
                if(exist) {

                    if((typeof (req.query.timestamp) == 'undefined') && !req.query.timestamp)
                    {
                        response = {"error" : false,"Response" : exist.value};
                        res.json(response);

                    }else {
                        var dateTime = new Date(req.query.timestamp * 1000);

                        if ( isNaN( dateTime.toUTCString() ) && dateTime.toISOString() != 'Invalid Date') {
                        DatabaseOp.aggregate([{ $match: { $and:[{'vc_values.timecreated' : {$lt: new Date(req.query.timestamp * 1000)}},{"key":req.params['name']}] }},{ "$project": {"vc_values": 1,"valCopy": "$vc_values"}},{ "$unwind": "$valCopy" },{ "$match": { "valCopy.timecreated": { "$lt": new Date(req.query.timestamp * 1000) }  }},{ "$sort": { "valCopy": -1 } }], function(err, docs){

                            
                            if (!err && (typeof (docs[0]) != 'undefined') && (typeof (docs[0]['vc_values']) != 'undefined')){ console.log(docs[0]['valCopy']['name']);

                            response = {"error" : false, message: "Found Version controlled Value", "Response" : docs[0]['valCopy']['name']};
                            }
                            else {
                              response = {"error" : false, message: "No Version controlled value. Sending actual value", value : exist.value};  
                            }
                            res.json(response);
                        });
                        } else {
                            response = {"error" : false, message: "Invlaid Date. Sending actual value", value : exist.value};
                            res.json(response);
                        }
                    }

                }else {
                    response = {"error" : true, "Response" : "No Key value Found"};
                    res.json(response);
                }
            }
            
        });
    });

app.use('/',router);

app.listen(3000);

console.log("Listening to PORT 3000");
