// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if(err){
        return console.log('Unable to connect to MongoDb server');
    }
    console.log('Connected to mongodb server');

    

    db.collection('Users').findOneAndUpdate({
        name: "Zaid"
    }, {$set : { 
        location: "MP"
    }}, {
        returnOriginal: false
    }).then((result)=>{
        console.log(result);
    })
    db.close();
});