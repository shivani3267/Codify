import { useEffect, useState } from 'react'
import {Routes, Route, Navigate} from "react-router"
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import HomePage from './pages/HomePage.jsx'
import { checkAuth } from './authSlice.js'
import {useDispatch, useSelector} from "react-redux"
import AdminPanel from './components/AdminPanel.jsx'
import ProblemPage from './pages/ProblemPage.jsx'
import Admin from './pages/Admin.jsx'
import AdminDelete from './components/AdminDelete.jsx'
import Loader from './components/Loader.jsx'


function App() {

  //check if authenticated
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector( (state) => state.auth)

   useEffect(()=> {
    dispatch(checkAuth());
  },[dispatch]);
  
  //loader
  if(loading){
    return <Loader/>
  }

  return (
    <>
      <Routes>
        <Route path='/' element={isAuthenticated ? <HomePage/> : <Navigate to="/signup" /> }></Route>
        <Route path='/login'  element={isAuthenticated ? <Navigate to="/" /> : <Login/>}></Route>
        <Route path='/signup'  element={isAuthenticated ? <Navigate to="/" /> : <Signup/>}></Route>
        <Route path="/problem/:problemId" element={ <ProblemPage/> }></Route>
        
        <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} /> 
        <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} /> 
      </Routes>
    </>
  )
}

export default App
