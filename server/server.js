var env = process.env.NODE_ENV || 'development';
console.log('env **************', env);

if(env === 'development'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
}else if(env === 'test'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}

const _ = require('lodash');
const {ObjectID} = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator')

var {mongoose} = require('./db/mongoose');
var {User} = require('./model/user');
var {Todo} = require('./model/todo');
var {authenticate} = require('./middleware/authenticate');

var app = express();
var port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res)=>{
    var todo = new Todo({
        text : req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc)=>{
        res.send(doc);
    }, (e)=>{
        res.status(400).send(e);
    })
})

app.get('/todos', authenticate, (req, res)=>{
    Todo.find({
        _creator: req.user._id
    }).then((todos)=>{
        res.send({
            todos
        })
    }, (e)=>{
        res.status(400).send(e);
    })
})

app.get('/todos/:id', authenticate, (req, res)=>{
    var id = req.params.id
    console.log(id);
    if(!ObjectID.isValid(id)){
        return res.status(404).send({});
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todos)=>{
        if(!todos){
            return res.status(404).send({});
        }
        res.send({todos});
    }, (e)=>{
        res.status(400).send({});
    })
});

app.delete('/todos/:id', authenticate, (req, res)=>{
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }, (e)=>{
        res.status(400).send();
    })
});

app.patch('/todos/:id', authenticate, (req, res)=>{
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
        return res.status(400).send();
    }

    if(_.isBoolean(body.completed && body.completed)){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo)=>{
      if(!todo){
          return res.status(404).send();
      }  
      res.send({todo});
    }).catch((e)=>{
        res.status(400).send();   
    })

});

app.post('/users', (req, res)=>{
    var id = req.params.id;
    var body = _.pick(req.body, ["email", "password"]);

    // if(!ObjectID.isValid(id)){
    //     return res.status(400).send();
    // }
    var user = new User(body);

    user.save().then(()=>{
        return user.generateAuthToken()        
    }).then((token)=>{
        res.header('x-auth', token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res)=>{
    res.send(req.user);
    
})

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

//delete a token from the Users database
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, ()=>{
    console.log(`Starting app on port ${port}`);
})

module.exports = {app}; 

