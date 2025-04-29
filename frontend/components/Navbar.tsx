"use client";

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';

const Navbar = () => {
  // Simulate authentication state (replace with real auth logic)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Handlers for demo (replace with real auth logic)
  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button color="inherit" component={Link} href="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} href="/expenses">Expenses</Button>
          <Button color="inherit" component={Link} href="/income">Income</Button>
          <Button color="inherit" component={Link} href="/categories">Categories</Button>
        </Box>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;