import React from 'react';
import logo from "../assets/loading.gif"

const Loader = () => {
  return (
    <div style={{width:"100%",height:"100%",display:"flex",justifyContent:'center',alignItems:'center'}} className="loader-wrapper">
      <img width="64px" src={logo} alt="" />
    </div>
  )
}

export default Loader
