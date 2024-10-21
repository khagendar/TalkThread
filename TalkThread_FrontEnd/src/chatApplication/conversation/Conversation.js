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
import React, { useEffect, useRef, useState,useCallback } from 'react';
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

const ChatInput = ({ setOpenPicker, newMessage, setNewMessage, handleSendMessage,receiverBlocked }) => {
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
              {/* Disable the send button if `receiverBlocked` is true or no message is typed */}
              <IconButton
                onClick={() => handleSendMessage()}
                disabled={!newMessage.trim()} // Add `receiverBlocked` condition here
              >
                <PaperPlaneTilt
                  color={newMessage.trim() ? 'blue' : 'gray'}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );
}    


export default function Conversation({ conversation, open, CUser, fetchConversations }) {
    const [openPicker, setOpenPicker] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [conversationMessages, setConversationMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState(null);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const messagesEndRef = useRef(null);
    const [receiver, setReceiver] = useState(null);
    const { user: authUser } = useAuth(); 
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [isBlocked, setIsBlockedLocal] = useState(false);
    const socket = useRef(null);
    const [receiverBlocked,setReceiverBlocked]=useState(false);
    // Initialize socket connection once when the app starts
    useEffect(() => {
        socket.current = io("ws://localhost:8900");

        // Cleanup the socket when the component unmounts
        return () => {
            socket.current.disconnect();
        };
    }, []);
    // console.log("ConversationMembers:",conversation);
        const getUsersData = async () => {
          try {
            
            const friendId = conversation?.members.find((m) => m !== CUser?._id);
            console.log(friendId);
            const response = await axios.get(`http://localhost:5000/sign/user/${friendId}` ); 
            const friendData = response.data;
            console.log("frienddata",friendData);
            // Check if the senderId is in the blockedUsers array
            const isSenderBlocked = friendData.blockedUsers.includes(CUser._id);

            if(isSenderBlocked)
            {
                setReceiverBlocked(true);
                console.log("receiverBlocked",receiverBlocked);
            }
            else{
                setReceiverBlocked(false);
                console.log("receiverBlocked",receiverBlocked);
            }
           
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
       

    // Handle receiving messages
    useEffect(() => {
        if (socket.current) {
            socket.current.on("getMessage", (message) => {
                if (message.conversationId === conversation?._id) {
                    setArrivalMessage(message);
                }
                fetchConversations();
            });
        }

        return () => {
            socket.current?.off("getMessage");
        };
    }, [conversation,fetchConversations]);

    // Update conversation messages when a new message arrives
    useEffect(() => {
        if (arrivalMessage) {
            setConversationMessages((prevMessages) => [...prevMessages, arrivalMessage]);
        }
    }, [arrivalMessage]);

    // Fetch the user data of the conversation (other participant)
    useEffect(() => {
        const getUser = async () => {
            if (!conversation) return;

            try {
                const friendId = conversation?.members.find((m) => m !== CUser?._id);
                const res = await axios.get(`http://localhost:5000/sign/user/${friendId}`);
                setReceiver(friendId);
                setUser(res.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        getUser();
    }, [conversation, CUser]);

    // Add the current user to the socket's active user list
    useEffect(() => {
        if (CUser?._id) {
            socket.current.emit("addUser", CUser._id);
            socket.current.on("getUsers", (users) => {
                setOnlineUsers(users.map((user) => user.userId));
            });
        }

        return () => {
            socket.current?.off("getUsers");
        };
    }, [CUser]);

    // Handle sending messages
    const handleSendMessage = async () => {
      // Check if the user is blocked
       await getUsersData();
      if (receiverBlocked) {
        alert('User is blocked'); // Show a toast notification
        return; // Exit the function if the user is blocked
      }
  
      if (newMessage.trim()) {
          const tempMessage = {
              conversationId: conversation._id,
              sender: CUser._id,
              text: newMessage,
              type: 'msg',
              subtype: 'TextMessage',
          };
  
          setConversationMessages((prev) => [...prev, tempMessage]);
  
          // Emit the message via socket
          socket.current.emit('sendMessage', {
              ...tempMessage,
              receiverId: receiver,
          });
  
          try {
              const res = await axios.post(
                  'http://localhost:5000/sign/conversation/messages/',
                  tempMessage
              );
  
              // Replace the optimistic message with the server response
              setConversationMessages((prev) =>
                  prev.map((msg) => (msg === tempMessage ? res.data : msg))
              );
  
              // Refresh the chat list
              fetchConversations();
  
              // Clear input field
              setNewMessage('');
          } catch (error) {
              console.error('Error sending message:', error);
              setConversationMessages((prev) => prev.filter((msg) => msg !== tempMessage));
          }
      }
  };
  
    // Scroll to the bottom of the messages when they change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversationMessages]);

    // Fetch block status when the conversation changes
    useEffect(() => {
        const checkIfBlocked = async () => {
            if (receiver) {
                try {
                    const res = await axios.get(`http://localhost:5000/check/${receiver}/${CUser._id}`);
                    console.log("Block status response:", res);
                    const blockedStatus = res.data.isBlocked; // Assume the response returns an object with `isBlocked`
                    setIsBlockedLocal(blockedStatus);
                } catch (error) {
                    console.error('Error checking block status:', error);
                }
            }
        };

        checkIfBlocked();
    }, [receiver, CUser, conversation]);

    // Fetch new messages when the conversation changes
    useEffect(() => {
        if (conversation) {
            const refreshMessages = async () => {
                try {
                    const res = await axios.get(
                        `http://localhost:5000/sign/conversation/messages/${conversation._id}`
                    );
                    setConversationMessages(res.data);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };

            refreshMessages();
        }
    }, [conversation]);

    // Function to refresh conversation messages
    const refreshConversation = async () => {
        if (conversation) {
            try {
                const res = await axios.get(
                    `http://localhost:5000/sign/conversation/messages/${conversation._id}`
                );
                setConversationMessages(res.data);
            } catch (error) {
                console.error('Error refreshing conversation:', error);
            }
        }
    };

    return (
        <Stack height="100%" maxHeight="100vh" sx={{ width: '100%' }}>
            {open ? (
                <>
                    {/* Header section */}
                    <Box p={1} sx={{ height: 60, width: '100%', borderBottom: '1px solid black' }}>
                        <Stack alignItems="center" direction="row" justifyContent="space-between" sx={{ width: '100%', height: '100%' }}>
                            <Stack direction="row" spacing={2}>
                                <Box>
                                    {/* Display user's avatar */}
                                    <Badge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant={onlineUsers.includes(user?._id) ? 'dot' : 'undefined'}
                                        sx={{ '& .MuiBadge-badge': { backgroundColor: '#44b700', color: '#44b700' } }}
                                    >
                                        <Avatar alt="User Avatar" src={user?.profile || ''} />
                                    </Badge>
                                </Box>
                                <Stack spacing={0.3}>
                                    {/* User's name and online status */}
                                    <Typography variant="subtitle2">{user?.name}</Typography>
                                    {onlineUsers.includes(user?._id) ? 'Online' : 'Offline'}
                                </Stack>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={3} marginRight="40px">
                                {/* Call and info buttons */}
                                <IconButton>
                                    <Phone />
                                </IconButton>
                                <IconButton onClick={() => setShowInfo((prev) => !prev)}>
                                    <Info />
                                </IconButton>
                            </Stack>
                        </Stack>
                        {/* Pass refreshConversation to Contact component */}
                        <Contact 
                            showInfo={showInfo} 
                            setShowInfo={setShowInfo} 
                            isBlocked={isBlocked} 
                            setIsBlocked={setIsBlockedLocal} 
                            receiver={receiver} 
                            CurrentUser={CUser} 
                            refreshConversation={refreshConversation} 
                            conversation={conversation}
                        />
                    </Box>

                    {/* Messages section */}
                    <Box sx={{ width: '100%', height: 'calc(100vh - 60px)', backgroundColor: '#F0F4FA', overflowY: 'scroll' }}>
                        {conversationMessages.map((m) => (
                            <div key={m._id}>
                                <Messages message={m} own={m.sender === CUser._id} />
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input section */}
                    {!isBlocked && (
                        <Box sx={{ height: 60, width: '100%' }} p={2}>
                            <Stack direction="row" alignItems="center" spacing={3}>
                                <Box width="100%">
                                    <ChatInput
                                        newMessage={newMessage}
                                        setNewMessage={setNewMessage}
                                        handleSendMessage={handleSendMessage}
                                        setOpenPicker={setOpenPicker}
                                        receiverBlocked={receiverBlocked}
                                    />
                                    {openPicker && (
                                        <Box sx={{ display: 'inline', zIndex: 10, position: 'fixed', bottom: 81, right: 100 }}>
                                            <Picker onEmojiSelect={(emoji) => setNewMessage((prev) => prev + emoji.native)} />
                                        </Box>
                                    )}
                                </Box>
                            </Stack>
                        </Box>
                    )}
                    <Stack direction={'row'} justifyContent={'center'}>
                        <Typography variant="body2">
                            {isBlocked ? "User is blocked" : ""}
                        </Typography>
                    </Stack>
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
