import React, { useState, useEffect } from "react";
import getSearchResults from "./../services/getSearchResults";
import SearchCard from "./SearchCard";
import SearchIcon from '@mui/icons-material/Search';
import { Button, TextField } from "@mui/material";

const SearchUsers = ({ handleSIClick , current_user, onClick}) => {
  const [value, setValue] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [searchResults, setSearchResults] = useState([]);

  const displayItems = async () => {
    if (!value) return;
    const data = await getSearchResults(value, pageNumber, pageSize);
    setSearchResults(data);
  };

  const handleNext = (e) => {
    if (pageNumber === pageSize) setPageNumber((prevNo) => prevNo + 1);
  };

  const handlePrev = (e) => {
    if (pageNumber !== 1) setPageNumber((prevNo) => prevNo - 1);
  };

  return (
    <div
    onClick={onClick}
      style={{
        display:'flex',
        justifyContent:'center',
        flexDirection:'column',
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div style={{ display:'flex',justifyContent:'center',width: "100%", marginTop: "10px" }}>
        <TextField
          variant="outlined"
          sx={{ width: "80%" , maxWidth:'500px' }}
          label="Search"
          type="text"
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
        <Button
          sx={{ width: "10%" , maxWidth:'70px' }}
          variant="outlined"
          onClick={displayItems}
        >
          <SearchIcon />
        </Button>
      </div>
      <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap',width:'100%',marginTop:'10px',overflow:'hidden'}}>
        {searchResults.length > 0
          ? searchResults.map((result) => (
              <SearchCard
                handleSIClick={handleSIClick}
                key={result._id}
                item={result}
                current_user={current_user}
              />
            ))
          : null}
        {/* {searchResults.length > 0 ? (
          <div className="page-buttons">
            <div id="prev" className="to-prev" onClick={handlePrev}>
              <i className="fa fa-arrow-left to-ls-icon" aria-hidden="true"></i>
              <span className="to-prev-tag">Prev</span>
            </div>
            <div className="current-search-no">{pageNumber}</div>
            <div id="next" className="to-next" onClick={handleNext}>
              <span className="to-next-tag">Next</span>
              <i
                className="fa fa-arrow-right to-ls-icon"
                aria-hidden="true"
              ></i>
            </div>
          </div>
        ) : null} */}
      </div>
    </div>
  );
};

export default SearchUsers;
