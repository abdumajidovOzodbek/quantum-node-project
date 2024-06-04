const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // Adjust the path as needed

router.get('/messages/:senderId/:receiverId', async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        }).sort({ createdAt: 1 }); // Sort messages by creation time
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;