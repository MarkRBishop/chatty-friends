const { Schema, Types, model } = require('mongoose')

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp)
    }
  },
);


//date helper function.
function formatTimestamp(timestamp) {
  return `${timestamp.toLocaleDateString()} at ${timestamp.toLocaleTimeString()}`
}

module.exports = reactionSchema;