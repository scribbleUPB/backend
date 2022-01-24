const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
   name:String,
   email:String,
   ownedPolls: [{
   type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll'
    }],
   invitedPolls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll'
    }]

})

module.exports = mongoose.model('User', userSchema)

