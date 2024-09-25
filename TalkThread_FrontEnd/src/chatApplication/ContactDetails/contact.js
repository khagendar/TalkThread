import React, { useState } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import close from '../images/close.png';
import Details from './details';
const Contact = ({ showInfo, setShowInfo }) => {
  const [currentView, setCurrentView] = useState('details');

  if (!showInfo) return null;

  const handleClick = (view) => {
    setCurrentView(view);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 35,
        left: 480,
        width: '25vw',
        height: '70vh',
        padding: 2,
        backgroundColor: 'white',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        zIndex: 10,
        overflow: 'auto',
      }}
    >
      <Box display={'flex'} justifyContent={'flex-end'} marginBottom={"2px"}>
        <img
          src={close}
          alt='Close'
          width={22}
          height={22}
          style={{ cursor: 'pointer' }}
          onClick={() => setShowInfo(false)}
        />
      </Box>
      <Stack direction={'row'} width={"100%"} height={"65vh"}>
        {/* Fixed-width Sidebar */}
        <Box sx={{
          width: "30%",
          backgroundColor: "whitesmoke",
          padding: 2,
        }}>
          <IconButton 
            sx={{ 
              width: '100%', 
              borderRadius: '0px', 
              justifyContent: 'flex-start',
              padding: 1,
              textAlign: 'left',
            }} 
            onClick={() => handleClick('details')}
          >
            <Typography variant="body2" color={'black'}>
              Details
            </Typography>
          </IconButton>
          
          
        </Box>
        
        {/* Main Content Area */}
        <Box sx={{
          flexGrow: 1,
          backgroundColor: "#f0f0f0",
          padding: 2, // Added padding for better spacing
        }}>
          {currentView === 'details' && <Details />}
        </Box>
      </Stack>
    </Box>
  );
};

export { Contact };
