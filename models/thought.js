const { Schema, Types, model } = require('mongoose')
const reactionSchema = require('./reaction')

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp)
    },
    username: {
      type: String,
      required: true
    },
    reactions: [reactionSchema]
  },
  { toJson: {
    getters: true,
  },
  id: false
}
);

//date helper function
function formatTimestamp(timestamp) {
  return `${timestamp.toLocaleDateString()} at ${timestamp.toLocaleTimeString()}`
}

// Virtual to get the length of the thought's reactions array
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;