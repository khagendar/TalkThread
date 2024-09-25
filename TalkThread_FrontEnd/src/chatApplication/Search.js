import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Avatar } from '@mui/material';
import close from '../chatApplication/images/close.png'; // Ensure the path is correct

// Chat Account Component: Displays user details
const ChatAccounts = ({ user }) => {
  return (
    <Box
      sx={{
        width: '95%',
        borderRadius: 2,
        backgroundColor: '#fff',
        '&:hover': { backgroundColor: 'lightgray' },
        cursor: 'pointer',
        mb: 1,
      }}
      p={1}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <Avatar src={user?.avatar || '/default-avatar.png'} />
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{user?.name || 'User'}</Typography>
            <Typography variant="caption">{'Keep always smile on your face'}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

ChatAccounts.propTypes = {
  user: PropTypes.object.isRequired,
};

// Function to add or retrieve a chat between sender and receiver
const addNewChat = async (senderId, receiverId) => {
  try {
    console.log(`Creating conversation between ${senderId} and ${receiverId}`);

    // Create or get a conversation
    const res = await axios.post("http://localhost:5000/sign/conversation", {
      senderId,
      receiverId,
    });

    console.log('Conversation created or retrieved:', res.data);

    // Check if res.data is an array or an object
    const conversation = Array.isArray(res.data) ? res.data : [res.data];

    // Sort conversations if it's an array
    const sortedConversations = conversation.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    console.log( sortedConversations); // Return the sorted list
  } catch (error) {
    console.error('Error creating or retrieving conversation:', error);
  }
};


const SearchAndChat = ({ handleClose, CUser, onSelectChat }) => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  // Fetch data from API
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/sign/Search");
      setResults(res.data);
    } catch (error) {
      console.error('Error fetching search data:', error);
    }
  };

  // Filter results based on input
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInput(newValue);

    if (newValue) {
      const filtered = results.filter((user) =>
        user?.name.toLowerCase().includes(newValue.toLowerCase())
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults([]);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Handle clicking on a user to start a chat
  const handleChatClick = async (receiverId) => {
    try {
      const conversation = await addNewChat(CUser._id, receiverId);
      
      // Ensure the conversation is passed correctly
      onSelectChat(conversation); // Just pass the conversation directly
      handleCloseSearch(); // Close the search component
    } catch (error) {
      console.error('Error initiating chat:', error);
    }
  };
  // Reset the component state and close the search dialog
  const handleCloseSearch = () => {
    setInput("");            // Reset the input field
    setFilteredResults([]);   // Clear the filtered results
    handleClose();            // Close the dialog
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 90,
        left: 280,
        height: "490px",
        width: "390px",
        backgroundColor: "#fff",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        zIndex: 10,
        borderRadius: "10px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>New Chat</h3>
        <img
          src={close}
          alt="close"
          width={"20px"}
          height={"20px"}
          style={{ cursor: "pointer" }}
          onClick={handleClose}
        />
      </div>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Search Users..."
        style={{
          width: "calc(100% - 20px)",
          padding: "10px",
          borderRadius: "4px",
          border: "1px solid #ddd",
          color: "black",
        }}
      />
      {input && (
        <div
          style={{
            maxHeight: "350px",
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: "4px",
            margin: "0 10px",
          }}
        >
          {filteredResults.length > 0 ? (
            filteredResults.map((user) => (
              <div
                key={user._id || user.name}
                onClick={() => handleChatClick(user._id)}
              >
                <ChatAccounts user={user} />
              </div>
            ))
          ) : (
            <div
              style={{
                padding: "10px",
                textAlign: "center",
                color: "#888",
              }}
            >
              No user found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

SearchAndChat.propTypes = {
  handleClose: PropTypes.func.isRequired,
  CUser: PropTypes.object.isRequired,
  setConversations: PropTypes.func.isRequired,  // Pass this function from parent to refresh conversations
};

export default SearchAndChat;
