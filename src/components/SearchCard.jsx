import { Avatar, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";
import { LoadingButton } from '@mui/lab';
import { useHistory } from "react-router-dom";
import socket from "./../socketConfig";
import { sendMessage } from './../services/sendMessage';

const SearchCard = ({ handleSIClick, item, current_user }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const history = useHistory();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
  };

  const handleMessage = async(e) => {
    e.preventDefault();
    if(item._id === current_user._id) return;
    setLoading(true);
    handleClickOpen();
  }

  const handleBlock = (e) => {
    e.preventDefault();
    setLoading(true);

    setLoading(false);
  }

  const handleSearchMessage = async() => {
    if(!message) return;
    setSending(true);
    const thisMessage = {sender: current_user.email , text: message}
    const conversation = {
      member_1: current_user.email,
      member_2: item.email,
      message: []
    }
    socket.emit("joinRoom", item._id);
    socket.emit("searchedMessage",{conversation,item,thisMessage});
    await sendMessage(conversation , thisMessage);
    setSending(false);
  }

  return (
    <Card  sx={{ maxWidth: 345, margin:'10px' }}>
      <CardHeader
        avatar={
          <Avatar sx={{width:'100px',height:'100px',backgroundColor:'dodgerblue',fontSize:'40px'}} src={item.imageUri}>
            {(!item.imageUri || item.imagePrivacy) && item.name[0]}
          </Avatar>
        }
        title={item.name}
        subheader="........."
      ></CardHeader>
      <CardContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
          <LoadingButton
            loading={loading}
            sx={{ height: "100%", marginTop: { sm: "none", xs: "10px" }, marginRight:'10px' }}
            variant="outlined"
            onClick={handleMessage}
          >
            Message
          </LoadingButton>
          <LoadingButton
            loading={loading}
            sx={{ height: "100%", marginTop: { sm: "none", xs: "10px" } }}
            variant="outlined"
            type='submit'
            color="error"
            onClick={handleBlock}
          >
            Block
          </LoadingButton>
      </CardContent>
      <div>
      <Dialog open={open} onClose={sending?handleClose:undefined}>
        <DialogTitle>Connect with <strong>{item.name}</strong></DialogTitle>
        <DialogContent>
          <DialogContentText>
            Say Hi to <strong>{item.name}</strong>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Send Message"
            type="type"
            fullWidth
            value={message}
            onChange={e=>setMessage(e.currentTarget.value)}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={sending} onClick={handleClose}>Cancel</LoadingButton>
          <LoadingButton loading={sending} onClick={handleSearchMessage}>Send</LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
    </Card>
  );
};

export default SearchCard;
