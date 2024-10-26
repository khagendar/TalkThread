import { Box, Stack, IconButton, Typography, InputBase, styled, Avatar, Badge } from '@mui/material';
import React, { useEffect, useState } from 'react';
import edit from '../chatApplication/images/editsquare.png';
import SearchIcon from '@mui/icons-material/Search';
import close from '../chatApplication/images/close.png';
import { faker } from '@faker-js/faker';
import { Users } from 'phosphor-react';
import Friends from '../chatApplication/CreateGroup/friends';
import { useAuth } from '../Routes/AuthContex'; // Ensure correct path
import axios from 'axios';
import SearchChat from './Search';
import MessageConversation from'../chatApplication/chat'
import { format } from 'timeago.js';
import './chatList.css';
const ChatAccounts = ({ conversation, currentUser }) => {
  const [userDetails, setUserDetails] = useState([]); // Array to store user details
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const friendId = conversation.members.find(m => m !== currentUser._id);

        // Fetch user details by friend ID
        const res = await axios.get(`http://localhost:5000/sign/user/${friendId}`);
        const userData = res.data;

        // Store user details as an array and add the updated time from the conversation
        const userArray = [{ ...userData, updatedAt: conversation.updatedAt }];
        
        setUserDetails(prevDetails => {
          const newDetails = [...prevDetails, ...userArray];
          // Sort the user details by `updatedAt` in ascending order (oldest first)
          return newDetails.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
        });
        
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [conversation, currentUser]);  // Re-run when `conversation` or `currentUser` changes

  if (isLoading) {
    return <Typography>Loading...</Typography>; // Show loading state
  }

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 2,
        // backgroundColor: '#fff',
        '&:hover': { backgroundColor: 'lightgray' },
        cursor: 'pointer',
      }}
      p={1}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <Badge
            
          >
            <Avatar src={faker.image.avatar()} sx={{ cursor: 'pointer' }} />
          </Badge>
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">
              {userDetails.length > 0 ? userDetails[0].name : 'Khagendar'}
            </Typography>
            <Typography variant="caption">
              {conversation.latestMessage || 'What are you doing?'}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems="center">
          <Typography sx={{ fontWeight: '600' }} variant="caption">
          {format(conversation.updatedAt)}

          </Typography>
          <Badge color="primary" badgeContent={conversation.unread || 2} />
        </Stack>
      </Stack>
    </Box>
  );
};






// Styled components
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '10px',
  backgroundColor: 'whitesmoke',
  border: '1px solid black',
  boxShadow: '0px 2px 0px blue',
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
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

export default function ChatList() {
  const [chatOpen, setChatOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [conversation, setConversation] = useState([]);  // All conversations
  const [currentChat, setCurrentChat] = useState(null);

  const { user } = useAuth();
  console.log("user",user);
  const [open, setOpen] = useState(true);

  // Reset and re-open search chat
  const handleNewChat = () => {
    setChatOpen(false); // Close to force remount
    setTimeout(() => {
      setChatOpen(true); // Re-open after a short delay
    }, 10); // Slight delay to trigger re-render
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleClose = () => setChatOpen(false);

  const handleChatSelect = (chat) => {
    setCurrentChat(chat);
    setOpen(true);
    setCurrentChat(currentChat);
  };
  
  const fetchConversations = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/sign/conversation/${user._id}`);
      setConversation(res.data);
    } catch (error) {
      console.error("Error fetching conversations:", error.response || error.message);

    }
  };

  useEffect(() => {
    if (user._id) fetchConversations();
  }, [user._id]);

  return (
    <>
      <Stack direction="row">
        <Box height={'100vh'} sx={{borderRight:"1px solid black"}}>
        <Box
          sx={{
            height: '95vh',
            width: 320,
            // boxShadow: '2px 0px 1px rgba(0, 0, 0, 0.2), -2px 0px 1px rgba(0, 0, 0, 0.2)',
            // backgroundColor: '#F8FAFF',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
          p={2}
        >
          {/* Header */}
          <Stack p={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h5" fontWeight={500} fontFamily="'Pacifico',cursive">
                Chats
              </Typography>
              <IconButton onClick={handleNewChat}>
                <img src={edit} width={25} height={25} alt="Edit" />
              </IconButton>
            </Stack>
          </Stack>

          {/* Chat List */}
          <Stack
            direction="column"
            spacing={2}
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              paddingBottom: '20px',
              height: 'calc(100vh - 160px)',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'white',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'gray',
                borderRadius: '4px',
              },
            }}
          >
            <Stack display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant="h6" sx={{ paddingBottom: '15px' }}>
                Messages
              </Typography>
              {/* <IconButton sx={{ marginRight: "10px" }} onClick={handleOpenDialog}>
                <Users width={25} height={25} alt="Users" />
              </IconButton> */}
            </Stack>

            {conversation.map((c) => (
              <Stack
                key={c._id}  // Unique key for mapping
                onClick={() => { 
                  setCurrentChat(c);  // Set the clicked conversation as the current chat
                  setOpen(true);      // Open the chat
                }}  
                sx={{
                  backgroundColor: currentChat?._id === c._id ? '#E8F5FE' : 'transparent',  // Highlight the active chat
                  cursor: 'pointer',
                  borderRadius:'5px'
                }}
              >
                <ChatAccounts conversation={c} currentUser={user} />
              </Stack>
            ))}
          </Stack>

          {/* New Chat Window */}
          {chatOpen && (
            <SearchChat
            handleClose={() => setChatOpen(false)}
            CUser={user}
            onSelectChat={(newChat) => {
              handleChatSelect(newChat);
              fetchConversations(); 
            }}
          />
          )}
        </Box>
        </Box>
        {/* Display the Messages component when a chat is selected */}
        {currentChat && open && (
          <MessageConversation conversation={currentChat} open={open} CUser={user} fetchConversations={fetchConversations}/>  // Display the Messages component based on the currentChat
        )}
      </Stack>

      {/* Dialog for adding friends */}
      {openDialog && <Friends open={openDialog} handleClose={handleCloseDialog} />}
    </>
  );
}