import React from 'react'
import { IoSearch } from "react-icons/io5";


function Hospitalsearch(props) {
  return (
    <>
    <label>
                    <span className="screen-reader-text">{props.search}</span>
                    <input type="search" className="search-field" placeholder="Search..." />
                  </label>
                  <button type="submit"><IoSearch /></button>
    
    
    
    </>
  )
}

export default Hospitalsearch