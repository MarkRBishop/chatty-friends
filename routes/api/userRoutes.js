const router = require('express').Router();
const User = require('../../models/user');
const Thought = require('../../models/thought');

// Define routes for users

router.get('/', (req, res) => {
  try {
      User.find({})
      .then(results => res.status(200).json(results))
  } catch(err) {
      res.status(500).send(err)
  }
});

router.get('/:id', async (req, res) => {
  try {
      await User.findOne({
          _id: req.params.id
      }).populate(['thoughts', 'friends'])
      .then(results => res.status(200).json(results))
  } catch(err) {
      res.status(500).send(err)
  }
});

router.post('/', async (req, res) => {;
  try {
      const newUser = await User.create(req.body)
      res.json(newUser)
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
})

router.put('/:userId', async (req, res) => {
  try {
    const updateUser = await User.updateOne({ _id: req.params.userId }, req.body)

    
    res.json(updateUser)
  } catch (err) {
    console.errer(err)
    res.status(500).json(err)
  }
})

router.delete('/:userId', async (req, res) => {
  try {
    // Get the user's thoughts before deleting
    const user = await User.findById(req.params.userId);
    const userThoughts = user.thoughts;

    await User.deleteOne({ _id: req.params.userId });

    await Thought.deleteMany({ _id: { $in: userThoughts } });

    res.json({ message: 'User and associated thoughts deleted' });
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
});

router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId,
       { $addToSet: { friends: req.params.friendId } },
       { new: true });
    res.json(user);
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
});

router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true });
    res.json(user);
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
});

module.exports = router;