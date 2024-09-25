const ConversationModel = require("../model/Conversation"); 
class ConversationController {
  async conversation(req, res) {
    const newConversation = new ConversationModel({
      members: [req.body.senderId, req.body.receiverId],
    });

    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (error) {
      res.status(500).json({ message: "Error saving conversation", error });
    }
  }
  async conversationGet(req, res) {
    try {
        // Ensure _id is in the correct format if it's an ObjectId
        const userId = req.params.userId;

        // Find conversations where the userId is in the members array
        const conversations = await ConversationModel.find({
            members: { $in: [userId] }
        }).sort({updatedAt:-1});

        // Return the conversations
        res.status(200).json(conversations);
    } catch (error) {
        // Return a more descriptive error message
        res.status(500).json({ message: "Error retrieving conversations", error });
    }
}

async  deleteConversation(req, res) {
  try {
    const conversationId = req.params.conversationId;
    const userId = req.params.userId;

    // Pull the user from the 'members' array of the conversation
    const updatedConversation = await ConversationModel.updateOne(
      { _id: conversationId, members: { $in: [userId] } },  
      { $pull: { members: userId } }                         
    );

    // Check if the conversation was updated (i.e., if the user was removed)
    if (updatedConversation.modifiedCount === 0) {
      return res.status(404).json({ message: "Conversation not found or already deleted for this user" });
    }

    res.status(200).json({
      message: "Conversation deleted for this user",
      updatedConversation
    });

  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ message: "Error deleting conversation", error });
  }
}

}

module.exports = new ConversationController();
