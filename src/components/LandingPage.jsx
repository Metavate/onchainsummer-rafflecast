"use client"; 

import React from 'react'
import { usePrivy } from "@privy-io/react-auth";

const LandingPage = () => {
  const { login } = usePrivy();
  
  return (
    <div className='LandingContainer flex flex-col justify-center items-center'>
        <h1 className='text-7xl text-white'>RaffleCast</h1>
        <div className="LandingWrapper">
        <button
                className="bg-violet-600 hover:bg-violet-700 py-3 px-6 text-white rounded-lg"
                onClick={login}
              >
                Log in
              </button>
        </div>
    </div>
  )
}

export default LandingPage