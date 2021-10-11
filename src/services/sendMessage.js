import axios from 'axios';

export const sendMessage = async (conversation, msg) => {
  axios.defaults.baseURL = process.env.REACT_APP_localServer
  const { member_1, member_2 } = conversation;
  const message = [{ ...msg }]
  try {
    await axios.post(`api/messages`, { member_1, member_2, message },{headers:{messageMeToken:localStorage.getItem('JWT_messageME')}});
  } catch (error) {
    console.log(error);
    return null;
  }
}