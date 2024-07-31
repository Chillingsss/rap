"use client";

import React from 'react'
import Dashboard from './dashboard'
import Link from 'next/link'
import Listing from './components/listing'
import Login from './components/login'
import { Route, Routes } from 'react-router-dom';

const page = () => {
  return (
    <>
      {/* <Dashboard /> */}
      <Login />


      {/* 
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path="/dashboard" element={<dashboard />} />
      </Routes> */}



    </>
  )
}

export default page
