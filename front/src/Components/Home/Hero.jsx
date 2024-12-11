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
              <h1 id="custom-h1">
                Discover and Share Amazing Recipes! &nbsp;
                {/* <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"  fill="#f1423a"><path d="M198.16-547.9q9.38-34.46.26-62.08-9.11-27.61-33.26-60.23-29.93-39.61-39.85-73-9.92-33.38-4.85-77h59.16q-5.7 35.69.96 60.85 6.65 25.15 30.81 57.77 32.99 43.3 42.92 76.69 9.92 33.38 3 77h-59.15Zm158.46 0q9.38-34.46.57-62.08-8.8-27.61-32.96-60.23-29.92-39.61-40.15-73-10.23-33.38-5.16-77h59.16q-5.7 35.69.96 60.85 6.65 25.15 30.81 57.77 33 43.3 42.92 76.69 9.92 33.38 3 77h-59.15Zm160 0q9.38-34.46.38-62.08-9-27.61-33.15-60.23-29.93-39.61-39.96-73-10.04-33.38-4.97-77h59.16q-5.7 35.69.96 60.85 6.65 25.15 30.81 57.77 33 43.3 42.92 76.69 9.92 33.38 3 77h-59.15ZM200-180q-41.92 0-70.96-29.04Q100-238.08 100-280v-180h540.62q3.07-32.08 22.96-56.81 19.88-24.73 50.34-34.96l176.54-59.3 18.85 56.76L732.77-495q-14.69 4.77-23.73 17.58-9.04 12.81-9.04 28.5V-280q0 41.54-29.04 70.77Q641.92-180 600-180H200Zm0-60h400q17 0 28.5-11.5T640-280v-120H160v120q0 17 11.5 28.5T200-240Zm200-80Z" /></svg> */}
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