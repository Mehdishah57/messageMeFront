import React from 'react';
import dummyImg from '../assets/dummyUser.png';

import './searchItem.css';
function SearchItem({ item, handleSIClick }) {
  return (
    <div onClick={() => handleSIClick(item)} className="search-item-wrapper">
      <div className="item-img">
        {item && item.imageUri ? <img src={item.imageUri} alt="" /> : <img src={dummyImg} alt="" />}
      </div>
      <div className="item-name">
        {item && item.name}
      </div>
    </div>
  );
}

export default SearchItem;