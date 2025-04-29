'use client'
import React, { useState } from 'react';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

const defaultCategories = ['Food', 'Transport', 'Utilities', 'Other'];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [editId, setEditId] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('Food');

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        description,
        amount: parseFloat(amount),
        category,
      },
    ]);
    setDescription('');
    setAmount('');
    setCategory(categories[0] || 'Food');
  };

  const handleDelete = (id: number) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const handleEdit = (expense: Expense) => {
    setEditId(expense.id);
    setEditDescription(expense.description);
    setEditAmount(expense.amount.toString());
    setEditCategory(expense.category);
  };

  const handleEditSave = (id: number) => {
    setExpenses(expenses.map(exp =>
      exp.id === id
        ? { ...exp, description: editDescription, amount: parseFloat(editAmount), category: editCategory }
        : exp
    ));
    setEditId(null);
    setEditDescription('');
    setEditAmount('');
    setEditCategory(categories[0] || 'Food');
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Expenses</h1>
      <form onSubmit={handleAddExpense} className="flex flex-col sm:flex-row gap-2 mb-6 items-center">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          className="border rounded px-3 py-2 w-full sm:w-auto"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          min="0"
          step="0.01"
          className="border rounded px-3 py-2 w-full sm:w-auto"
        />
        <select value={category} onChange={e => setCategory(e.target.value)} className="border rounded px-3 py-2 w-full sm:w-auto">
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Add Expense</button>
      </form>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {expenses.map(expense => (
          <li key={expense.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            {editId === expense.id ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="text"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="border rounded px-2 py-1 w-full sm:w-auto"
                />
                <input
                  type="number"
                  value={editAmount}
                  onChange={e => setEditAmount(e.target.value)}
                  className="border rounded px-2 py-1 w-full sm:w-auto"
                />
                <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className="border rounded px-2 py-1 w-full sm:w-auto">
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button onClick={() => handleEditSave(expense.id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">Save</button>
                <button onClick={() => setEditId(null)} className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition">Cancel</button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
                <span className="flex-1">{expense.description}: <span className="text-red-600 dark:text-red-400 font-medium">${expense.amount.toFixed(2)}</span> <span className="text-xs text-gray-400">[{expense.category}]</span></span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(expense)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition">Edit</button>
                  <button onClick={() => handleDelete(expense.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}