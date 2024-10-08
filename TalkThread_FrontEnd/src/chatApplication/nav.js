import React, { useState } from 'react';
import { Box, Divider, Stack, IconButton, Avatar, Menu, MenuItem, Typography, Modal } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { faker } from '@faker-js/faker';
import logo from '../chatApplication/images/logo1.png';
import home from '../chatApplication/images/home.png';
import group from '../chatApplication/images/group.png';
import menuIcon from '../chatApplication/images/menu.png';
import { Gear } from '@phosphor-icons/react';
import Group from './CreateGroup/Group';
import { useAuth } from '../Routes/AuthContex';
import { useNavigate } from 'react-router-dom';
const Chat = () => {
  const theme = useTheme();
  const [activeButton, setActiveButton] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility
  const auth = useAuth();
  const navigate = useNavigate();
  // Handle button clicks and menu visibility
  const handleButtonClick = (button, event) => {
    setActiveButton(button);
    if (button === 'menu') {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null); // Close the menu if another button is clicked
    }

    if (button === 'group') {
      setOpenModal(true); // Open the modal when group button is clicked
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveButton(null);
    setOpenModal(false); 
  };
  const handleLogout = ()=>{
    console.log("LogOut");
    auth.logout();
    navigate("/");
  }
  return (
    <Box
      p={2}
      component="section"
      sx={{
        height: '95vh',
        display: 'flex',
        boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.1)',
        backgroundColor: theme.palette.background.paper,
        justifyContent: 'space-between',
        position: 'relative', 
      }}
    >
      
      <Box sx={{ width: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        <Stack direction="column" alignItems="center" width="100%" spacing={3}>
          
          <IconButton aria-label="logo" size="large">
            <img src={logo} alt="logo" style={{ width: 30, height: 30, objectFit: 'contain' }} />
          </IconButton>

          <Stack direction="column" alignItems="center" width="max-content">
            <Divider sx={{ width: '100%', my: 2 }} />
            
            <IconButton
              aria-label="home"
              size="large"
              onClick={(event) => handleButtonClick('home', event)}
              sx={{
                border: activeButton === 'home' ? '2px solid black' : 'transparent',
                transition: 'border 0.3s ease',
              }}
            >
              <img src={home} alt="home" style={{ width: 30, height: 30, objectFit: 'contain' }} />
            </IconButton>
            <Divider sx={{ width: '100%', my: 1 }} />
            
            <IconButton
              aria-label="group"
              size="large"
              onClick={(event) => handleButtonClick('group', event)}
              sx={{
                border: activeButton === 'group' ? '2px solid black' : 'transparent',
                transition: 'border 0.3s ease',
              }}
            >
              <img src={group} alt="group" style={{ width: 30, height: 30, objectFit: 'contain' }} />
            </IconButton>
          </Stack>
        </Stack>

       
        <Stack direction="column" alignItems="center" width="100%">
          
          <IconButton
            aria-label="profile"
            size="large"
            onClick={(event) => handleButtonClick('profile', event)}
            sx={{
              border: activeButton === 'profile' ? '2px solid black' : 'transparent',
              transition: 'border 0.3s ease',
            }}
          >
            <Avatar src={faker.image.avatar()} sx={{ cursor: 'pointer' }} />
          </IconButton>

          {/* Menu Button */}
          <IconButton
            aria-label="menu"
            size="large"
            onClick={(event) => handleButtonClick('menu', event)}
            sx={{
              border: activeButton === 'menu' ? '2px solid black' : 'transparent',
              transition: 'border 0.3s ease',
            }}
          >
            <img src={menuIcon} alt="menu" style={{ width: 30, height: 30, objectFit: 'contain' }} />
          </IconButton>
        </Stack>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          MenuListProps={{ 'aria-labelledby': 'basic-button' }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={handleClose}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Gear size={25} />
              <Typography variant="body2" fontSize="15px">
                Settings
              </Typography>
            </Stack>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Stack direction="row" justifyContent="flex-end" width="100%" onClick={()=>handleLogout()}>
              <Typography variant="body2" fontSize="15px">
                Log out
              </Typography>
            </Stack>
          </MenuItem>
        </Menu>
      </Box>

      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-group"
        aria-describedby="modal-group-description"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        }}
      >
        <Box>
          <Group open={openModal} handleClose={handleClose}/>
        </Box>
      </Modal>
    </Box>
  );
};

export default Chat;
