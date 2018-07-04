var MongoClent=require('mongodb').MongoClient;
var util=require('util');
var express=require('express');

var app=express();
var port=3000;
var myString;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

var myPromise=util.promisify(MongoClent.connect);
myPromise('mongodb://127.0.0.1:27017/myMongoDB2').then(function(client){
    const db=client.db('myMongoDB2');
    db.collection('restaurant').findOne({},function(err,data){
        if(err) throw err;
        myString=data;
        client.close();
    });

}).catch(err=>{console.log('Error: ',err)});

app.get('/restaurants',function(req,res){

     res.send(myString)
});

app.get('/restaurants/near/:name',function(req,res){
    var loc;
    db.restaurant.findOne({'name':req.params.name},function(err,doc)
    {
        loc=doc.coord;
        console.log(loc);
        db.location.find({coord:{$near:loc}}).limit(3).toArray(function(err,docs)
            {
                if(err) console.log(err);
                res.json(docs);
            });
    });
   
});
app.listen(port,()=>{
    console.log('Server is running on port %s',port);
})