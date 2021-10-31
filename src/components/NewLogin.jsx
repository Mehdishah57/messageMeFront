import React, { useState, useLayoutEffect } from "react";
import login from "../services/login";
import { useHistory } from "react-router-dom";
import { Alert, Button, Collapse, TextField } from "@mui/material";
import { LoadingButton } from '@mui/lab';

const NewLogin = () => {
  const [state, setState] = useState({email:"",password:""})
  const [error, setError] = useState({email:"",password:"",response:""});
  const [loading , setLoading] = useState(false)

  const history = useHistory();

  useLayoutEffect(()=>{
    const token = localStorage.getItem('JWT_messageME');
    if(token) history.replace("/dashboard/profile");
  },[history]) 

  const handleChange = (e) => {
    setState({...state,[e.currentTarget.name]:e.currentTarget.value});
    setError({email:"",password:"",response:""})
  }

  const handleSubmit = async() => {
    if(!state.email) return setError({...error,email:"Please enter an email"})
    if(!state.password) return setError({...error,password:"Please enter a password"})
    try {
      setLoading(true);
      const user = { email: state.email, password: state.password }
      const { data } = await login(user);
      localStorage.setItem('JWT_messageME', data);
      history.push("/dashboard/messages");
    } catch (error) {
      setError({response:error.response? error.response.data:"An Error has Occured"});
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
        height: "100vh"
      }}
    >
      <TextField
        name="email"
        sx={{ width: "270px", marginBottom: "20px" }}
        variant="filled"
        value={state.email}
        error={error.email}
        onChange={handleChange}
        label="Email"
        helperText={error.email}
      />
      <TextField
        name="password"
        sx={{ width: "270px", marginBottom: "20px" }}
        variant="filled"
        value={state.password}
        error={error.password}
        onChange={handleChange}
        label="Password"
        type="password"
        helperText={error.password}
      />
      <Collapse sx={{marginBottom:'10px'}} in={error.response}>
        <Alert severity="error">Login Failed <strong>{error.response}</strong></Alert>
      </Collapse>
      <div style={{display:'flex',flexDirection:'row',width:'200px',justifyContent:'space-between'}}>
        <LoadingButton loading={loading} onClick={handleSubmit} variant="contained">Login</LoadingButton>
        <Button onClick={()=>history.push("/signup")} variant="outlined">SignUp</Button>
      </div>
    </div>
  );
};

export default NewLogin;
