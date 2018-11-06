const mongoose=require('mongoose');
const UserSchema = mongoose.Schema({
    creditCard:Number,
    debitCard:Number,
}); 
 module.exports = mongoose.model('User', UserSchema);
const Users = mongoose.model('user', UserSchema);
module.exports = {
    userModel: Users,
    UserSchema: UserSchema
}