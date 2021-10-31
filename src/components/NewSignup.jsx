import React, { useState, useLayoutEffect } from 'react';
import { TextField } from '@mui/material';
import { Collapse } from '@mui/material';
import { Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { useHistory } from "react-router-dom";
import { signup } from '../services/login';

const NewSignup = () => {
  const [state, setState] = useState({name:"",email:"",password:""})
  const [error, setError] = useState({name:"",email:"",password:"",response:""});
  const [loading , setLoading] = useState(false)

  const history = useHistory();

  useLayoutEffect(()=>{
    const token = localStorage.getItem('JWT_messageME');
    if(token) history.replace("/dashboard/profile");
  },[history]) 

  const handleChange = (e) => {
    setState({...state,[e.currentTarget.name]:e.currentTarget.value});
    setError({name:"",email:"",password:"",response:""});
  }

  const handleSubmit = async() => {
    if(!state.name) return setError({...error,name:"Please enter a name"})
    if(!state.email) return setError({...error,email:"Please enter an email"})
    if(!state.password) return setError({...error,password:"Please enter a password"})
    try {
      setLoading(true);
      const user = { email: state.email, name: state.name, password: state.password }
      const {data} = await signup(user);
      localStorage.setItem("JWT_messageME",data);
      history.push("/dashboard");
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
      name="name"
      sx={{ width: "270px", marginBottom: "20px" }}
      variant="filled"
      value={state.name}
      error={error.name}
      onChange={handleChange}
      label="Name"
      helperText={error.name}
    />
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
      <LoadingButton loading={loading} onClick={handleSubmit} variant="contained">SignUp</LoadingButton>
      <Button onClick={()=>history.push("/login")} variant="outlined">Login</Button>
    </div>
  </div>
  )
}

export default NewSignup
