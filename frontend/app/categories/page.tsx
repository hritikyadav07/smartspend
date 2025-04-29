'use client';
import React, { useState } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>(['Food', 'Transport', 'Utilities', 'Other']);
  const [newCategory, setNewCategory] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim() || categories.includes(newCategory.trim())) return;
    setCategories([...categories, newCategory.trim()]);
    setNewCategory('');
  };

  const handleDelete = (idx: number) => {
    setCategories(categories.filter((_, i) => i !== idx));
  };

  const handleEdit = (idx: number) => {
    setEditIndex(idx);
    setEditValue(categories[idx]);
  };

  const handleEditSave = (idx: number) => {
    if (!editValue.trim() || categories.includes(editValue.trim())) return;
    setCategories(categories.map((cat, i) => (i === idx ? editValue.trim() : cat)));
    setEditIndex(null);
    setEditValue('');
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Categories</h1>
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-6 items-center">
        <input
          type="text"
          placeholder="New category"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          required
          className="border rounded px-3 py-2 w-full sm:w-auto"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Add</button>
      </form>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {categories.map((cat, idx) => (
          <li key={cat} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            {editIndex === idx ? (
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="text"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  className="border rounded px-2 py-1 w-full sm:w-auto"
                />
                <button onClick={() => handleEditSave(idx)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">Save</button>
                <button onClick={() => setEditIndex(null)} className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition">Cancel</button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
                <span className="flex-1">{cat}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(idx)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition">Edit</button>
                  <button onClick={() => handleDelete(idx)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}