const MessageModel = require("../model/Message");
const ConversationModel = require("../model/Conversation");

class MessageController {
  // Create a new message and update conversation's updatedAt field
  async Message(req, res) {
    const { conversationId } = req.body;
    const newMessage = new MessageModel(req.body);

    try {
      // Save the new message
      const savedMessage = await newMessage.save();

      // Explicitly update the conversation's updatedAt field
      await ConversationModel.findByIdAndUpdate(
        conversationId,
        { updatedAt: new Date() },
        { new: true } // Ensures the updated document is returned
      );

      // Respond with the saved message
      res.status(200).json(savedMessage);
    } catch (error) {
      // Handle errors gracefully
      res.status(500).json({ message: "Error saving message", error });
    }
  }

  // Retrieve messages for a specific conversation
  async MessageGet(req, res) {
    try {
      // Find all messages belonging to the specified conversationId
      const messages = await MessageModel.find({
        conversationId: req.params.conversationId,
      });

      // Return the messages in the response
      res.status(200).json(messages);
    } catch (error) {
      // Handle errors gracefully
      res.status(500).json({ message: "Error retrieving messages", error });
    }
  }
}

module.exports = new MessageController();
