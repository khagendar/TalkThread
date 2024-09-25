import {
  Box,
  Stack,
  styled,
  Avatar,
  Badge,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Fab,
  Tooltip,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { faker } from '@faker-js/faker';
import {
  VideoCamera,
  Phone,
  Info,
  LinkSimple,
  Smiley,
  PaperPlaneTilt,
  Sticker,
  Camera,
  Image,
  File,
  User,
} from '@phosphor-icons/react';
import Messages from './message';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Contact } from '../ContactDetails/contact';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useAuth } from '../../Routes/AuthContex';
import {io} from "socket.io-client";
const StyledInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderRadius: '30px',
    marginLeft: '5px',
    flexGrow: 1,
    width: '97.5%',
    marginTop: '3px',
  },
  '& .MuiInputBase-input': {
    paddingTop: '15px',
    paddingBottom: '15px',
    alignItems: 'center',
    paddingLeft: '5px',
    flexGrow: 1,
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const Action = [
  {
    color: '#4da5fe',
    icon: <Image size={24} />,
    y: 102,
    title: '#photo/videos',
  },
  {
    color: '#4da5fe',
    icon: <Sticker size={24} />,
    y: 172,
    title: 'Stickers',
  },
];

const ChatInput = ({ setOpenPicker, newMessage, setNewMessage, handleSendMessage }) => {
  const [Document, setDocument] = useState(false);

  return (
    <StyledInput
      fullWidth
      placeholder="Write a message"
      variant="filled"
      onChange={(e) => setNewMessage(e.target.value)}
      value={newMessage}
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <Stack sx={{ width: 'max-content' }}>
            <Stack
              sx={{
                position: 'relative',
                bottom: 280,
                display: Document ? 'inline-block' : 'none',
              }}
            >
              {Action.map((el, index) => (
                <Tooltip key={index} placement="right" title={el.title}>
                  <Fab
                    sx={{
                      position: 'absolute',
                      top: el.y,
                      backgroundColor: el.color,
                    }}
                  >
                    {el.icon}
                  </Fab>
                </Tooltip>
              ))}
            </Stack>
            <InputAdornment>
              <IconButton onClick={() => setDocument((prev) => !prev)}>
                <LinkSimple color="black" />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
        endAdornment: (
          <InputAdornment>
            <IconButton onClick={() => setOpenPicker((prev) => !prev)}>
              <Smiley color="black" />
            </IconButton>
            <IconButton onClick={()=>handleSendMessage()} disabled={!newMessage.trim()}>
              <PaperPlaneTilt color={newMessage.trim() ? 'blue' : 'gray'} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default function Conversation({ conversation, open, CUser,fetchConversations }) {
  // Redux state management and local state initialization
  const app = useSelector((state) => state.app);
  const [openPicker, setOpenPicker] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const socket = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const[receiver,setReceiver]=useState(null);
  const { user: authUser } = useAuth(); // Assuming authentication hook is used to get the logged-in user

  // Effect hook to initialize socket connection on mount and set up message listener
  // 1. Initialize socket connection and set up message listener
  useEffect(() => {
    socket.current = io("ws://localhost:8900");

    socket.current.on("getMessage", (message) => {
      if (message.conversationId === conversation._id) {
        setArrivalMessage(message); // Capture new incoming messages
      }
    });

    return () => {
      socket.current.disconnect(); // Cleanup on component unmount
    };
  }, [conversation]);
  console.log("Conversations"+conversation);
  // 2. Update conversation messages when a new message arrives
  useEffect(() => {
    if (arrivalMessage) {
      setConversationMessages((prevMessages) => [...prevMessages, arrivalMessage]);
    }
  }, [arrivalMessage]);

  // 3. Fetch conversation user data (the other person in the conversation)
  useEffect(() => {
    const getUser = async () => {
      try {
        const friendId = conversation?.members.find((m) => m !== CUser._id);
        const res = await axios.get(`http://localhost:5000/sign/user/${friendId}`);
        setReceiver(friendId);
        setUser(res.data); // Set the user info of the conversation partner
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (conversation) {
      getUser(); // Only fetch when conversation exists
    }
  }, [conversation, CUser]);

  // 4. Add user to socket's active user list when CUser is available
  useEffect(() => {
    if (CUser?._id) {
      socket.current.emit("addUser", CUser._id); // Send the current user ID to the socket server
    }
  }, [CUser]);

  // 5. Handle sending messages (with optimistic UI update)
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const messageData = {
        conversationId: conversation._id,
        sender: CUser._id,
        text: newMessage,
        type: "msg",
        subtype: "TextMessage",
      };
  
      // Optimistically add the message to the UI
      setConversationMessages((prev) => [...prev, messageData]);
  
      // Emit the message via socket
      socket.current.emit("sendMessage", {
        ...messageData,
        receiverId: receiver,
      });
  
      try {
        // Send message to the backend to save it
        const res = await axios.post(
          "http://localhost:5000/sign/conversation/messages/",
          messageData
        );
        
        // Replace the optimistic message with the server response (with ID, etc.)
        setConversationMessages((prev) =>
          prev.map((msg) => (msg === messageData ? res.data : msg))
        );
        
        // Immediately refresh the chat list
        fetchConversations();
  
        // Clear input field after sending
        setNewMessage(""); 
        
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  
  // Scroll to the bottom of the messages when conversationMessages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);
  
  // Refresh the conversation's messages from the server
  const refreshMessages = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/sign/conversation/messages/${conversation._id}`
    );
    console.log("Messages fetched:", res.data); // Log to check the fetched messages
    setConversationMessages(res.data);
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};
  
  // Fetch new messages from the server when the conversation changes
  useEffect(() => {
    if (conversation) {
      refreshMessages(); // Fetch all messages when a new conversation is opened
    }
  }, [conversation]);
  
  return (
    <Stack height="100%" maxHeight="100vh" sx={{ width: "100%" }}>
      {open ? (
        <>
          {/* Header section showing user's avatar, name, and some controls */}
          <Box
            p={1}
            sx={{
              height: 60,
              width: "100%",
              backgroundColor: "#F8FAFF",
              boxShadow: "0px 0px 5px rgba(0,0,0,0.25)",
            }}
          >
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              sx={{ width: "100%", height: "100%" }}
            >
              <Stack direction="row" spacing={2}>   

                <Box>
                  {/* Displays user's avatar */}
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar alt="User Avatar" src={faker.image.avatar()} />
                  </Badge>
                </Box>
                <Stack spacing={0.3}>
                  {/* User's name and online status */}
                  <Typography variant="subtitle2">{user?.name}</Typography>
                  <Typography variant="caption">Online</Typography>
                </Stack>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={3}   
 marginRight={"40px"}>
                {/* Call and info buttons */}
                <IconButton>
                  <Phone />
                </IconButton>
                <IconButton onClick={() => setShowInfo((prev) => !prev)}>
                  <Info />
                </IconButton>
              </Stack>
            </Stack>
            {showInfo && <Contact showInfo={showInfo} setShowInfo={setShowInfo} />}
          </Box>

          {/* Message display section */}
          <Box
            sx={{
              width: "100%",
              height: "calc(100vh - 60px)",
              backgroundColor: "#F0F4FA",
              overflowY: "scroll",
            }}
          >
            {/* Renders all messages in the conversation */}
            {conversationMessages.map((m) => (
              <div key={m._id}>
                <Messages message={m} own={m.sender === user?._id} />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input section for sending a message */}
          <Box
            sx={{
              height: 60,
              width: "100%",
              backgroundColor: "#F8FAFF",
              boxShadow: "0px 0px 5px rgba(0,0,0,0.25)",
            }}
            p={2}
          >
            <Stack direction="row" alignItems="center" spacing={3}>
              <Box width="100%">
                {/* Chat input component */}
                <ChatInput
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  handleSendMessage={handleSendMessage}
                  setOpenPicker={setOpenPicker}
                />
                {/* Emoji picker that appears when openPicker is true */}
                {openPicker && (
                  <Box
                    sx={{
                      display: "inline",
                      zIndex: 10,
                      position: "fixed",
                      bottom: 81,
                      right: 100,
                    }}
                  >
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji) =>
                        setNewMessage((prev) => prev + emoji.native)
                      }
                    />
                  </Box>
                )}
              </Box>
            </Stack>
          </Box>
        </>
      ) : (
        <Stack justifyContent="center" alignItems="center" height="100%">
          <Typography variant="h6" color="textSecondary">
            Start Conversation
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
