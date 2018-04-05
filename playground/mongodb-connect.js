const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if(err){
        return console.log('Unable to connect to MongoDb server');
    }
    console.log('Connected to mongodb server');

    // db.collection('Todos').insertOne({
    //     text:'Some text',
    //     completed: false
    // }, (err, result)=>{
    //     if(err){
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.collection('Users').insertOne({
        name:'Diego',
        location: 'San Clemente'
    }, (err, result)=>{
        if(err){
            return console.log('Unable to inset into users', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    })
    db.close();
});