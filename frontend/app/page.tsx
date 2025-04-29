'use client';
import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper elevation={3} sx={{ p: 6, minWidth: 340, textAlign: 'center' }}>
        <Typography variant="h4" mb={2} fontWeight={700}>
          Welcome to SmartSpend
        </Typography>
        <Typography variant="body1" mb={4}>
          Take control of your finances. Please login or sign up to continue.
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <Button component={Link} href="/login" variant="contained" color="primary" size="large">
            Login
          </Button>
          <Button component={Link} href="/signup" variant="outlined" color="primary" size="large">
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
