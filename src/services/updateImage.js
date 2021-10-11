import axios from 'axios';

const updateImage = async (formData) => {
  axios.defaults.baseURL = process.env.REACT_APP_localServer
  try {
    const { data } = await axios.put(`api/users/img`, formData, {
      headers: {
        'Content-Type': "multipart/form-data",
        'messageMeToken':localStorage.getItem('JWT_messageME')
      }
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default updateImage;