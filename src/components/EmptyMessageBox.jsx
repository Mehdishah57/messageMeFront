import React from 'react';
import logo from '../assets/48-489657_mini-tomato-icons-png-tomato-clipart-png-icon.png';

const EmptyMessageBox = () => {
  return (
    <div className="empty-message-box">
      <img src={logo} alt="" width="300px" height="300px" />
      <div>
        <span style={{ color: 'grey' }}>Stay Connected with Friends Via Tomato</span>
      </div>
    </div>
  );
}

export default EmptyMessageBox;