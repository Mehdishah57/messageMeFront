import React, { useState } from 'react'
import './Search.css';
import SearchItem from './SearchItem';
import getSearchResults from './../services/getSearchResults';

const Search = ({ handleSIClick }) => {
  const [value, setValue] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [searchResults, setSearchResults] = useState([]);

  const displayItems = async () => {
    if (!value) return;
    const data = await getSearchResults(value, pageNumber, pageSize);
    setSearchResults(data);
  }

  const handleNext = e => {
    if (pageNumber === pageSize)
      setPageNumber(prevNo => prevNo + 1);
  }

  const handlePrev = e => {
    if (pageNumber !== 1)
      setPageNumber(prevNo => prevNo - 1);
  }

  return (
    <div className="search-wrapper">
      <div className="search-bar">
        <input className="search-input" placeholder="Search by Name or ID" type="text" value={value} onChange={e => setValue(e.currentTarget.value)} />
        <button onClick={displayItems} className="search-btn">Search</button>
      </div>
      {
        searchResults.length > 0 ?
          searchResults.map(result => <SearchItem handleSIClick={handleSIClick} key={result._id} item={result} />) : null
      }
      {
        searchResults.length > 0 ?
          <div className="page-buttons">
            <div id="prev" className="to-prev" onClick={handlePrev}>
              <i className="fa fa-arrow-left to-ls-icon" aria-hidden="true"></i>
              <span className="to-prev-tag">Prev</span>
            </div>
            <div className="current-search-no">{pageNumber}</div>
            <div id="next" className="to-next" onClick={handleNext}>
              <span className="to-next-tag">Next</span>
              <i className="fa fa-arrow-right to-ls-icon" aria-hidden="true"></i>
            </div>
          </div>
          : null
      }
    </div>
  )
}

export default Search;
