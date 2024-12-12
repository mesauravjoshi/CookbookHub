import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'

function Hero() {

  return (
    <>

      <div className='welcome-title' >
        <div className="tagline">
          <div className="heading">
            <center>
              <h1 className="mulish-bold">
                Discover and Share Amazing Recipes!
              </h1>
            </center>
          </div>

          <div className='tagline-but'>
            <Link to='/recipe' className="link-style">
              <button >Browse Recipes </button>
            </Link>
            <Link to='/login' className="link-style">
              <button>Sign Up</button>
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}

export default Hero;