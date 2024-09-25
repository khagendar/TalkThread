import React from 'react';
import { Stack, Typography, Avatar, IconButton } from '@mui/material';
import { faker } from '@faker-js/faker';

const Profile = ({ name }) => {
  const DeleteConversation= async()=>{

  }
  return (
    <Stack display={"flex"} flexDirection={'column'} justifyContent={'space-between'}>
      <Stack alignItems="center" spacing={2} padding={7}>
        <Avatar alt={name} src={faker.image.avatar()} sx={{ width: 100, height: 100 }}/>
        <Stack alignItems={"center"}>
          <Typography variant="h6" component="div">
            Khagendar
          </Typography>
          <Typography variant='body2' color="textSecondary">
            Keep always smile on your space
          </Typography>
        </Stack>
      </Stack>
      <Stack display={'flex'} flexDirection={'row'} justifyContent={'space-evenly'}>
        <IconButton 
          sx={{ 
            width: '45%', 
            borderRadius: '0px', 
            padding: 0.5,
            marginRight:1,
            textAlign: 'center',
            border:"2px solid black",
            '&:hover': {
              backgroundColor: 'red',
              color: 'white'
            }
          }}
        >
          <Typography variant="body2" color={'black'}>
            Block
          </Typography>
        </IconButton>
        <IconButton 
          sx={{ 
            width: '45%', 
            borderRadius: '0px', 
            padding: 0.5, 
            textAlign: 'center',
            border:"2px solid black",
            '&:hover': {
              backgroundColor: 'skyblue',
              color: 'white'
            }
          }}
        >
          <Typography variant="body2" color={'black'} >
            Delete Chat
          </Typography>
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default Profile;
