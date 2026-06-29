import { useEffect, useState } from 'react'
import {Routes, Route, Navigate} from "react-router"
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import HomePage from './pages/HomePage.jsx'
import { checkAuth } from './authSlice.js'
import {useDispatch, useSelector} from "react-redux"
import AdminPanel from './components/AdminPanel.jsx'


function App() {

  //check if authenticated
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector( (state) => state.auth)

   useEffect(()=> {
    dispatch(checkAuth());
  },[dispatch]);
  
  //loader
  if(loading){
    return <div className='min-h-screen flex items-center justify-center'>
      <span className='loading loading-spinner loading-lg'></span>
    </div>
  }


  return (
    <>
      <Routes>
        <Route path='/' element={isAuthenticated ? <HomePage/> : <Navigate to="/signup" /> }></Route>
        <Route path='/login'  element={isAuthenticated ? <Navigate to="/" /> : <Login/>}></Route>
        <Route path='/signup'  element={isAuthenticated ? <Navigate to="/" /> : <Signup/>}></Route>
        <Route path='/admin' element={isAuthenticated && user?.role === 'admin'? <AdminPanel/> : <Navigate to="/"/> } ></Route>
      </Routes>
    </>
  )
}

export default App
