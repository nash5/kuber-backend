const mongoose=require('mongoose');
const bcryt=require('bcrypt');
const saltrounds=10;

const UserSchema = mongoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    password:String,
    resetPasswordToken: String,
    resetPasswordExpires: Date

});
// UserSchema.pre('save', function(next){
//     this.password = bcrypt.hashSync(this.password, saltRounds);
//     next();
//     });
    module.exports = mongoose.model('User', UserSchema);
const Users = mongoose.model('user', UserSchema);
UserSchema.plugin(AutoIncrement, {inc_field: 'id'});
module.exports = {
    userModel: Users,
    UserSchema: UserSchema
}