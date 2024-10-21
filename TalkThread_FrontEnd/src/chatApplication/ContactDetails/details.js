import React, { useEffect } from 'react';
import { Stack, Typography, Avatar, IconButton } from '@mui/material';
import axios from 'axios';

const Profile = ({ isBlocked, setIsBlocked, receiverDetails, CurrentUser, refreshConversation, conversation }) => {
    const currentUserId = CurrentUser._id;

    const handleBlockUser = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/block/${receiverDetails._id}`, {
                currentUserId,
            });
            console.log(response.data.message); // Log response message
            setIsBlocked(true);
            refreshConversation(); // Refresh conversation after blocking

            // // Update conversation by setting senderId to null
            // const res = await axios.put('http://localhost:5000/sign/conversation', {
            //     conversationId: conversation._id,
            //     senderId: null, // Set senderId to null when blocking
            //     isBlocked: true, // Indicate the user is blocked
            // });

            // console.log("Updated conversation:", res.data);
        } catch (error) {
            console.error('Error blocking user:', error.response ? error.response.data.message : error.message);
        }
    };

    const handleUnblockUser = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/unblock/${receiverDetails._id}`, {
                currentUserId,
            });
            console.log(response.data.message); // Log response message
            setIsBlocked(false);
            refreshConversation(); // Refresh conversation after unblocking

            // // Update conversation by restoring senderId
            // const res = await axios.put('http://localhost:5000/sign/conversation', {
            //     conversationId: conversation._id,
            //     senderId: currentUserId, // Restore senderId when unblocking
            //     isBlocked: false, // Indicate the user is unblocked
            // });

            // console.log("Updated conversation:", res.data);
        } catch (error) {
            console.error('Error unblocking user:', error.response ? error.response.data.message : error.message);
        }
    };

    useEffect(() => {
        console.log("isBlocked state changed:", isBlocked);
    }, [isBlocked]);

    return (
        <Stack display={"flex"} flexDirection={'column'} justifyContent={'space-between'}>
            <Stack alignItems="center" spacing={2} padding={7}>
                <Avatar alt="" src={receiverDetails.avatar || ''} sx={{ width: 100, height: 100 }} />
                <Stack alignItems={"center"}>
                    <Typography variant="h6" component="div">
                        {receiverDetails.name}
                    </Typography>
                    <Typography variant='body2' color="textSecondary">
                        Keep always smile on your face
                    </Typography>
                </Stack>
            </Stack>
            <Stack display={'flex'} flexDirection={'row'} justifyContent={'space-evenly'}>
                <IconButton
                    sx={{
                        width: '45%',
                        borderRadius: '0px',
                        padding: 0.5,
                        marginRight: 1,
                        textAlign: 'center',
                        border: "2px solid black",
                        '&:hover': {
                            backgroundColor: !isBlocked ? 'red' : 'green',
                            color: 'white'
                        }
                    }}
                    onClick={!isBlocked ? handleBlockUser : handleUnblockUser}
                >
                    <Typography variant="body2" color={'black'}>
                        {!isBlocked ? "Block" : "Unblock"}
                    </Typography>
                </IconButton>
                <IconButton
                    sx={{
                        width: '45%',
                        borderRadius: '0px',
                        padding: 0.5,
                        textAlign: 'center',
                        border: "2px solid black",
                        '&:hover': {
                            backgroundColor: 'skyblue',
                            color: 'white'
                        }
                    }}
                >
                    <Typography variant="body2" color={'black'}>
                        Delete Chat
                    </Typography>
                </IconButton>
            </Stack>
        </Stack>
    );
};

export default Profile;
