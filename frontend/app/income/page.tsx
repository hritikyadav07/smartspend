'use client';
import React, { useState } from 'react';

interface Income {
  id: number;
  source: string;
  amount: number;
}

export default function IncomePage() {
  const [incomeList, setIncomeList] = useState<Income[]>([]);
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editSource, setEditSource] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !amount) return;
    setIncomeList([
      ...incomeList,
      { id: Date.now(), source, amount: parseFloat(amount) },
    ]);
    setSource('');
    setAmount('');
  };

  const handleDelete = (id: number) => {
    setIncomeList(incomeList.filter(i => i.id !== id));
  };

  const handleEdit = (income: Income) => {
    setEditId(income.id);
    setEditSource(income.source);
    setEditAmount(income.amount.toString());
  };

  const handleEditSave = (id: number) => {
    setIncomeList(incomeList.map(i =>
      i.id === id ? { ...i, source: editSource, amount: parseFloat(editAmount) } : i
    ));
    setEditId(null);
    setEditSource('');
    setEditAmount('');
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Income</h1>
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-6 items-center">
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={e => setSource(e.target.value)}
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
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Add Income</button>
      </form>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {incomeList.map(i => (
          <li key={i.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            {editId === i.id ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="text"
                  value={editSource}
                  onChange={e => setEditSource(e.target.value)}
                  className="border rounded px-2 py-1 w-full sm:w-auto"
                />
                <input
                  type="number"
                  value={editAmount}
                  onChange={e => setEditAmount(e.target.value)}
                  className="border rounded px-2 py-1 w-full sm:w-auto"
                />
                <button onClick={() => handleEditSave(i.id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">Save</button>
                <button onClick={() => setEditId(null)} className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition">Cancel</button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
                <span className="flex-1">{i.source}: <span className="text-green-600 dark:text-green-400 font-medium">${i.amount.toFixed(2)}</span></span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(i)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition">Edit</button>
                  <button onClick={() => handleDelete(i.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}