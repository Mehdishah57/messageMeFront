import axios from 'axios';
axios.defaults.baseURL = process.env.REACT_APP_localServer
const URL = `api/messages/userMessages`;

export const fetchUserMessage = async (id, length) => {
  try {
    const { data } = await axios.post(URL, { id, length },{headers:{messageMeToken:localStorage.getItem('JWT_messageME')}});
    return data;
  } catch (error) {
    console.log(error)
  }
}