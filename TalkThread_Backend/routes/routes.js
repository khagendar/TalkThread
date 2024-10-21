const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/user'); 
const ConversationController = require('../controllers/conversation'); 
const MessageController=require('../controllers/message');
const userController =require('../controllers/userController');
const CreateUserProfile=require('../controllers/CreateProfile');
// const message = require('../controllers/message'); 
// Route for user signup
router.post('/signup', LoginController.signup);

// Route for user signin
router.post('/signin', LoginController.signin);
router.post('/conversation',ConversationController.conversation);
router.get('/conversation/:userId',ConversationController.conversationGet);
router.post('/conversation/messages',MessageController.Message);
router.get('/conversation/messages/:conversationId',MessageController.MessageGet);
router.delete('/conversation/:conversationId/:userId', ConversationController.deleteConversation);
router.get('/user/:id', userController.getUserById);
router.get('/Search',userController.getAllUsers);
// router.post('/message',Conversation.message );
router.get('/conversation',ConversationController.ConversationDetails);
router.put('/conversation', ConversationController.updateConversation);
router.put('/forgotPassword', LoginController.forgotPassword);
module.exports = router;
