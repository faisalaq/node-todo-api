// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if(err){
        return console.log('Unable to connect to MongoDb server');
    }
    console.log('Connected to mongodb server');

    // db.collection('Users').deleteMany({
    //     location: 'San Clemente'
    // }).then((result)=>{
    //     console.log(result)
    // }, (err)=>{
    //     console.log('Unable to fetch documents');
    // })

    // db.collection('Users').findOneAndDelete({
    //     name: 'Faisal'
    // }).then((result)=>{
    //     console.log(result)
    // }, (err)=>{
    //     console.log('Unable to fetch documents');
    // })

    db.collection('Users').findOneAndDelete({_id: new ObjectID('5ac593798a8c86b09ce52032')}).then((result)=>{
        console.log(result);
    })
    db.close();
});