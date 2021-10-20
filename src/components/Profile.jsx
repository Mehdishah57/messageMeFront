import React, { useState, useRef, useLayoutEffect } from "react";
import jwtDecode from "jwt-decode";
import updateImage from "./../services/updateImage";
import "./Profile.css";
import {
  Alert,
  AlertTitle,
  Avatar,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Switch,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import updateUserName from './../services/updateUserName';
import changeMyPrivacy from './../services/changeMyPrivacy';

const Profile = (props) => {
  const currentUser = jwtDecode(localStorage.getItem("JWT_messageME"));
  const [loading, setLoading] = useState(false);
  const [dispImg, setDispImg] = useState(null);
  const [checked, setChecked] = useState(true);
  const [idBox, setIdBox] = useState(false);
  const [userName, setUserName] = useState(props.username);
  const [nameError, setNameError] = useState("");
  const [privacyChangeError,setShowPrivacyChangeError] = useState(false);
  const [showErrorNameAlert,setShowErrorNameAlert] = useState(false);
  const [showNameUpdateAlert, setShowNameUpdateAlert] = useState(false);
  const [showPrivacyChangeAlert, setShowPrivacyChangeAlert] = useState(false);
  const selectedImage = useRef(null);

  useLayoutEffect(()=>{
    if(props.userStatus) setChecked(!props.userStatus);
  },[props.userStatus]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!selectedImage.current) {
      alert("Please Select an Image");
      return setLoading(false);
    }
    const formData = new FormData();
    formData.append("file", selectedImage.current);
    formData.append("email", currentUser.email);
    let image = await updateImage(formData);
    setTimeout(() => {
      props.setImage(image);
      selectedImage.current = null;
      setLoading(false);
    }, 5000);
  };
  
  const handleImgChange = async (e) => {
    selectedImage.current = e.currentTarget.files[0];
    setDispImg(URL.createObjectURL(e.currentTarget.files[0]));
  };

  const revealId = () => setIdBox(true);

  const changeAccountPrivacy = async(e) => {
    setChecked(e.currentTarget.checked);
    const { error } = await changeMyPrivacy(e.currentTarget.checked);
    if(error) {
      setShowPrivacyChangeError(true);
      setTimeout(() => {
        setShowPrivacyChangeError(false);
      }, 4000);
      return;
    }
    setShowPrivacyChangeAlert(true);
    setTimeout(() => {
      setShowPrivacyChangeAlert(false);
    }, 4000);
  };

  const handleNameChange = (e) => {
    setUserName(e.currentTarget.value)
    if (userName === props.username || !userName || userName.length < 5)
      return setNameError("error");
    if(nameError) setNameError("");
  };

  const handleUpdateName = async() => {
    if(nameError) return;
    if(userName === props.username) return;
    const {data, error} = await updateUserName(userName);
    if(error) {
      setShowErrorNameAlert(true);
      setTimeout(()=>{setShowErrorNameAlert(false)},4000)
      return;
    };
    props.updateName(userName, data);
    localStorage.setItem("JWT_messageME",data);
    setShowNameUpdateAlert(true);
    setTimeout(()=>{setShowNameUpdateAlert(false)},4000);
  }

  return (
    <div onClick={props.onClick} className="profile-wrapper">
      <form onSubmit={handleSubmit}>
        <div className="image-wrapper">
          <Avatar src={dispImg || props.image} sx={{ width:'100%',height:'100%', fontSize:'80px', backgroundColor:'dodgerblue' }}>{!props.image && props.username[0]}</Avatar>
        </div>
        <Button sx={{ marginTop: "10px" }} variant="outlined">
          Select an Image
          <input
            style={{
              position: "absolute",
              opacity:"0",
              width: "100%",
            }}
            type="file"
            accept="image/*"
            onChange={(e) => handleImgChange(e)}
          />
        </Button>
        <LoadingButton
          sx={{ marginTop: "10px" }}
          loading={loading}
          variant="outlined"
          type="submit"
        >
          Upload
        </LoadingButton>
      </form>
      <div style={{display:"flex",justifyContent:'center',alignItems:"center"}}>
        <TextField
          id="outlined-basic"
          value={userName}
          onChange={handleNameChange}
          label="Name"
          error={nameError}
          variant="outlined"
        />
        <LoadingButton
          variant="outlined"
          sx={{height:"100%",width:"50px"}}
          onClick={handleUpdateName}
        >
          <CheckCircleOutlineIcon sx={{width:"100%"}}/>
        </LoadingButton>
      </div>
      <Collapse in={showNameUpdateAlert}>
        <Alert sx={{ marginTop: "10px" }} severity="success">
          <AlertTitle>Success</AlertTitle>
          Updated your name to <strong>{props.username}</strong>
        </Alert>
      </Collapse>
      <Collapse in={showErrorNameAlert}>
        <Alert sx={{ marginTop: "10px" }} severity="error">
          <AlertTitle>Error</AlertTitle>
          Couldn't Update Your Name to <strong>{userName}</strong>
        </Alert>
      </Collapse>
      <div style={{ marginTop: 10 }}>
        <Button color={checked ? "success" : "primary"} variant="outlined">
          {checked ? "Public" : "Private"}
        </Button>
        <Switch checked={checked} onChange={changeAccountPrivacy} />
      </div>
      <Collapse in={showPrivacyChangeAlert}>
        <Alert sx={{ marginTop: "10px" }} severity="success">
          <AlertTitle>Success</AlertTitle>
          Your Account is now <strong>{checked ? "Public" : "Private"}!</strong>
        </Alert>
      </Collapse>
      <Collapse in={privacyChangeError}>
        <Alert sx={{ marginTop: "10px" }} severity="error">
          <AlertTitle>Error</AlertTitle>
          Couldn't change your account to <strong>{checked ? "Public" : "Private"}!</strong>
        </Alert>
      </Collapse>
      <Dialog
        open={idBox}
        onClose={() => setIdBox(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Keep it a secret!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your Id is <strong>{currentUser._id}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIdBox(false)} autoFocus>
            Got it
          </Button>
        </DialogActions>
      </Dialog>
      <Button sx={{ marginTop: "10px" }} onClick={revealId} variant="outlined">
        Reveal Private ID
      </Button>
    </div>
  );
};

export default Profile;
