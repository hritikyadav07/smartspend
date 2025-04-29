"use client";
import React, { useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, ListItemIcon, Avatar } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Navbar from '@/components/Navbar';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

interface Income {
  id: number;
  source: string;
  amount: number;
}

const defaultCategories = ['Food', 'Transport', 'Utilities', 'Other'];

export default function DashboardPage() {
  // Demo state for dashboard (in a real app, use context or lift state up)
  const [expenses] = useState<Expense[]>([]);
  const [incomeList] = useState<Income[]>([]);
  const [categories] = useState<string[]>(defaultCategories);

  // Totals
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = incomeList.reduce((sum, i) => sum + i.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Expenses by category
  const expensesByCategory = categories.map(cat => ({
    category: cat,
    total: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
  }));

  return (
    <>
    <Navbar/>
    <Box className="max-w-xl mx-auto p-4 sm:p-8">
      <Typography variant="h3" fontWeight={700} mb={6} align="center">Dashboard</Typography>
      <Box mb={8} display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(3, 1fr)' }} gap={4}>
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary" variant="body2">Total Income</Typography>
          <Typography variant="h5" color="green">${totalIncome.toFixed(2)}</Typography>
        </Paper>
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary" variant="body2">Total Expenses</Typography>
          <Typography variant="h5" color="red">${totalExpenses.toFixed(2)}</Typography>
        </Paper>
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary" variant="body2">Balance</Typography>
          <Typography variant="h5" color="primary">${balance.toFixed(2)}</Typography>
        </Paper>
      </Box>
      <Box mb={8}>
        <Typography variant="h6" mb={2}>Expenses by Category</Typography>
        <Paper elevation={1} sx={{ p: 2 }}>
          <List>
            {expensesByCategory.map((ec, idx) => (
              <React.Fragment key={ec.category}>
                <ListItem secondaryAction={<Typography>${ec.total.toFixed(2)}</Typography>}>
                  <ListItemIcon>
                    <CategoryIcon color="action" />
                  </ListItemIcon>
                  <ListItemText primary={ec.category} />
                </ListItem>
                {idx < expensesByCategory.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
      <Box mb={8}>
        <Typography variant="h6" mb={2}>Recent Expenses</Typography>
        <Paper elevation={1} sx={{ p: 2 }}>
          <List>
            {expenses.slice(-5).reverse().map((e, idx, arr) => (
              <React.Fragment key={e.id}>
                <ListItem secondaryAction={<Typography color="error">-${e.amount.toFixed(2)}</Typography>}>
                  <ListItemIcon>
                    <TrendingDownIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={e.description}
                    secondary={
                      <Typography variant="caption" color="text.secondary">[{e.category}]</Typography>
                    }
                  />
                </ListItem>
                {idx < arr.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
      <Box mb={8}>
        <Typography variant="h6" mb={2}>Recent Income</Typography>
        <Paper elevation={1} sx={{ p: 2 }}>
          <List>
            {incomeList.slice(-5).reverse().map((i, idx, arr) => (
              <React.Fragment key={i.id}>
                <ListItem secondaryAction={<Typography color="success.main">+${i.amount.toFixed(2)}</Typography>}>
                  <ListItemIcon>
                    <TrendingUpIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={i.source} />
                </ListItem>
                {idx < arr.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
      <Typography align="center" color="text.secondary" variant="caption">
        (Note: Data is not shared between pages in this demo. In a real app, use context or global state.)
      </Typography>
    </Box>
    </>
  );
}
