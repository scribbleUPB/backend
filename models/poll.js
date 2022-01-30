const mongoose = require('mongoose')

const pollSchema = mongoose.Schema({
    creator: String,
    title: String,
    description: String,
    textOptions: [
        { content: String }
    ],

    calendarOptions: [
        {
            day: Date,
            times: [{
                start: {
                    type: String,
                    required: true
                },
                end: {
                    type: String,
                    required: true
                }
            }]
        }
    ],
    needBe: Boolean,
    numberVote: Boolean,
    singleVote: Boolean,
    hidden: Boolean,
    deadline: Boolean,
    invitees: [String],
    participants: Number

})

module.exports = mongoose.model('Poll', pollSchema)

