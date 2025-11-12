import React from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import AppRouter from './UI/AppRouter'
import About from './pages/About'
import Posts from './pages/Posts'
import ListPage from './pages/ListPage'
import ItemPage from './pages/ItemPage'
import StatsPage from './pages/StatsPage'

// import './App.css'


function App() {
  return (
    <>
    <BrowserRouter>
      <div>
        <nav>
          <Link to="/">Home</Link>
            <br />
          <Link to="/ListPage">ListPage</Link>
            <br />
          <Link to="/ItemPage">ItemPage</Link>
            <br />
          <Link to="/StatsPage">StatsPage</Link>
        </nav>
      </div>

      <AppRouter />
      
    </BrowserRouter>
    
    </>
  )
}

export default App
