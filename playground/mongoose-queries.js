
const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {User} = require('./../server/model/user');

var id = '5ac5c7577b2107043a490660';

if(!ObjectID.isValid(id)){
    console.log('ID is not valid');
}

User.findById(id).then((users)=>{
    if(!users){
        return console.log('ID not found');
    }
    console.log('User by ID', users);
}).catch((e)=>{
    console.log(e)
})