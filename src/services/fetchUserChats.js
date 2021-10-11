import axios from 'axios';


const fetchUserChats = async email => {
  try {
    axios.defaults.baseURL = process.env.REACT_APP_localServer
    const { data } = await axios.post(`api/messages/get`, { email },{headers:{messageMeToken:localStorage.getItem('JWT_messageME')}})
    return data;
  } catch (error) {
    error.name = "error"
    return error;
  }
  
}

export default fetchUserChats;