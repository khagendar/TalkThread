import { Stack, Typography, Divider, Box, Link, IconButton,Menu,MenuItem } from "@mui/material";
import React,{useState} from "react";
import { DotsThreeVertical, DownloadSimple, Image } from "@phosphor-icons/react";
import { format } from 'timeago.js';
export function MessageOption() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Stack >
            <DotsThreeVertical 
                style={{ cursor: 'pointer' }} 
                onClick={handleClick} 
                size={20}
                color="black"
                 weight="bold"
                 
            />
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleClose}>Reply</MenuItem>
                <MenuItem onClick={handleClose}>React to Message</MenuItem>
                <MenuItem onClick={handleClose}>Forward to Message</MenuItem>
                <MenuItem onClick={handleClose}>Delete Message</MenuItem>
            </Menu>
        </Stack>
    );
}


// export function LinkMessage({ele}){
//     const [hovered, setHovered] = useState(false);
//  return(
//     <Stack direction={"row"} justifyContent={ele.incoming?"start":"end"} alignItems={"center"} spacing={2} onMouseEnter={() => setHovered(true)}
//     onMouseLeave={() => setHovered(false)}>
//             <Box p={1.5} sx={{backgroundColor:ele.incoming?"whitesmoke":"skyblue",borderRadius:"20px",width:"max-content"}}>
//                 <Stack spacing={2}>
//                     <Stack alignItems={"start"} sx={{borderRadius:1}} spacing={2}>
//                         <img src={ele.preview} alt={ele.message} style={{maxHeight:210,borderRadius:"10px"}}/>
//                         <Stack spacing={2}>
//                             <Typography variant="subtitle2">Create chatApp</Typography>
//                             <Typography variant="subtitle2" sx={{color:"blue",cursor:"pointer"}} component={Link} to="//https://www.youtube.com/">www.youtube.com</Typography>
//                         </Stack>
//                         <Typography variant="body2" >
//                             {ele.message}
//                         </Typography>
//                     </Stack>
//                 </Stack>
//             </Box>
//             {hovered && <MessageOption />}
//         </Stack>
//  );
// };
export function ReplyMessage({ele})
{
    const [hovered, setHovered] = useState(false);
    return(
        <Stack direction={"row"}  justifyContent={ele ? "start" : "end"} alignItems={"center"} spacing={2} onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
            <Box p={1.5} sx={{backgroundColor:ele?"whitesmoke":"skyblue",borderRadius:"10px",width:"max-content"}}>
                <Stack spacing={2}>
                  <Stack p={2} direction={"column"} alignItems={"center"} spacing={1} sx={{backgroundColor:"white",borderRadius:1}}>
                    <Typography variant="body2" color={"black"}>{ele.message}</Typography>
                  </Stack>
                  <Typography variant="body2" >
                    {ele.reply}
                  </Typography>
                </Stack>
            </Box>
            {hovered && <MessageOption />}
        </Stack>
    );
};
export function MediaMessage({ ele,own }) {
    const [hovered, setHovered] = useState(false);

    return (
        <Stack
            direction={"row"}
            justifyContent={own ? "start" : "end"}  // Assuming ele has an incoming property
            alignItems={"center"}
            spacing={2}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Box p={1.5} sx={{ backgroundColor: own? "whitesmoke" : "skyblue", borderRadius: "20px", width: "max-content" }}>
                <Stack spacing={1}>
                    {/* <img src={ele.img} alt={ele.message} style={{ maxHeight: 210, borderRadius: "10px" }} /> */}
                    <Typography variant="body2" color={"green"} p={0.5}>
                        {ele.text}
                    </Typography>
                </Stack>
            </Box>
            {hovered && <MessageOption />}  {/* Assuming MessageOption is defined elsewhere */}
        </Stack>
    );
}
export function TextMessage({ ele, own }) {
    const [hovered, setHovered] = useState(false);
  
    return (
      <Stack
        direction={"row"}
        justifyContent={own ?  "start":"end"}
        spacing={2}
        alignItems={"center"}
      >
        <Stack direction={"column"}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Box
              p={1.5}
              paddingLeft={2}
              paddingRight={2}
              sx={{
                backgroundColor: own ? "whitesmoke":"skyblue" ,
                borderRadius: "10px",
                width: "auto", // Width adjusts dynamically based on content
                maxWidth: "400px", // Limits the width to prevent overflow
                wordBreak: "break-word", // Ensures long words or URLs break properly
              }}
            >
              <Typography variant="body2" color={"black"}>
                {ele.text}
              </Typography>
            </Box>
  
            {hovered && <MessageOption />}
          </Stack>
  
          <Typography
            direction={"row"}
            variant="body2"
            color={"black"}
            justifyContent={"start"}
            sx={{ fontSize: "0.75rem" }}
          >
            {format(ele.createdAt)}
          </Typography>
        </Stack>
        
      </Stack>
    );
  }
export function Timeline({ele}) {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Divider sx={{ width: '46%' }} />
            <Typography variant="caption" sx={{color:"blue"}}>{ele.text}</Typography>
            <Divider sx={{ width: '46%' }} />
        </Stack>
    );
};
