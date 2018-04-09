const {ObjectID} = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./model/user');
var {Todo} = require('./model/todo');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
    var todo = new Todo({
        text : req.body.text
    });

    todo.save().then((doc)=>{
        res.send(doc);
    }, (e)=>{
        res.status(400).send(e);
    })
})

app.get('/todos', (req, res)=>{
    Todo.find().then((todos)=>{
        res.send({
            todos
        })
    }, (e)=>{
        res.status(400).send(e);
    })
})

app.get('/todos/:id', (req, res)=>{
    var id = req.params.id
    console.log(id);
    if(!ObjectID.isValid(id)){
        return res.status(404).send({});
    }

    Todo.findById(id).then((todos)=>{
        if(!todos){
            return res.status(404).send({});
        }
        res.send({todos});
    }, (e)=>{
        res.status(400).send({});
    })
})

app.listen(3000, ()=>{
    console.log('Starting app on port 3000');
})

module.exports = {app}; 

