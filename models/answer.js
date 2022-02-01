const mongoose = require("mongoose");

const answerSchema = mongoose.Schema({
  pollId: { type: String, unique: true },
  responses: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: String,
      responses: [
        {
          type: String,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Answer", answerSchema);
