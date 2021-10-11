import React, { useContext, useState, useRef } from 'react';
import { UserContext } from './../UserContext';
import jwtDecode from 'jwt-decode';
import updateImage from './../services/updateImage';
import './Profile.css';

const Profile = (props) => {
  const user = useContext(UserContext);
  const currentUser = jwtDecode(user);
  const [loading, setLoading] = useState(false);
  const [dispImg, setDispImg] = useState(null);
  const selectedImage = useRef(null);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!selectedImage.current) { alert("Please Select an Image"); return setLoading(false); };
    const formData = new FormData();
    formData.append('file', selectedImage.current);
    formData.append('email', currentUser.email)
    let image = await updateImage(formData);
    setTimeout(()=>{props.setImage(image);setLoading(false)}, 5000);
  }
  const handleImgChange = async (e) => {
    selectedImage.current = e.currentTarget.files[0]
    setDispImg(URL.createObjectURL(e.currentTarget.files[0]));
  };

  const revealId = () => alert(currentUser._id)

  return (
    <div className="profile-wrapper">
      <form onSubmit={handleSubmit}>
        <div className="image-wrapper">
          {
            props.image ? 
            <img className="actual-img" src={props.image} alt="" /> : 
            <img className="actual-img" src={dispImg} alt="" />
          }
        </div>
        <div className="wrapper-input-file" style={{position:'relative'}}>
          <input className="profile-image-input" type="file" accept="image/*" hidden onChange={(e) => handleImgChange(e)} />
          <div className="input-upload-design">Select</div>
        </div>
        <button disabled={loading} type='submit' className="submit-profile-pic">Upload</button>
        {loading ? <span style={{ marginLeft: 20 }}>Uploading Please Wait........</span> : null}
      </form>
      <div className="user-name">
        {currentUser.name}
      </div>
      <div className="myId">
        <button onClick={revealId} className="reveal">Click to Reveal Private Id</button>
      </div>
    </div>
  );
}

export default Profile;