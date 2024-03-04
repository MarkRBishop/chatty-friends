const router = require('express').Router();
const User = require('../../models/user');
const Thought = require('../../models/thought');

// Define routes for thoughts

router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find({});
    res.status(200).json(thoughts);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId).populate('reactions');
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.status(200).json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const { thoughtText, userId, username } = req.body;

    // Check if the required fields are present
    if (!thoughtText || !userId || !username) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newThought = await Thought.create({
      thoughtText,
      username, 
    });

    // Update the user's thoughts
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { thoughts: newThought._id } },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: 'No user attached to thought' });
    }

    res.json(newThought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.put('/:thoughtId', async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const { thoughtText } = req.body;

    if (!thoughtText) {
      return res.status(400).json({ message: 'Please provide thoughtText for modification' });
    }

    const updatedThought = await Thought.findByIdAndUpdate(thoughtId, { thoughtText }, { new: true });

    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    res.json(updatedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.delete('/:thoughtId', async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(req.params.thoughtId);
    if (!deletedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    // Remove the thought reference from the user's thoughts array
    const userId = deletedThought.username;
    await User.findByIdAndUpdate(userId, { $pull: { thoughts: req.params.thoughtId } });

    // Delete the reactions associated with the thought
    await Reaction.deleteMany({ _id: { $in: deletedThought.reactions } });

    res.status(200).json(deletedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $addToSet: { reactions: req.body } },
      { new: true }
    );
    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.status(201).json(updatedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const { thoughtId, reactionId } = req.params;
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $pull: { reactions: {  _id: reactionId } } },
      { new: true }
    );
    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.status(200).json(updatedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;