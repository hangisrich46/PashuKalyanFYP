// src/components/AddAnimalForm.jsx
import React, { useState } from 'react';

export default function AddAnimalForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    age: '',
    gender: '',
    status: '',
    description: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a FormData object
    const data = new FormData();

    // Append all form fields to FormData
    data.append("name", formData.name);
    data.append("type", formData.type);
    data.append("age", formData.age);
    data.append("gender", formData.gender);
    data.append("status", formData.status);
    data.append("description", formData.description);

    // Append the image file (if any)
    if (formData.image) {
      data.append("image", formData.image);
    }

    // Pass the FormData to parent
    onSubmit(data);
  };


  return (
    <form className="mt-4 p-4 border rounded bg-white" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="type"
          placeholder="Type (e.g. Dog, Cow)"
          className="border p-2"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          className="border p-2"
          onChange={handleChange}
          required
        />
        <select name="gender" className="border p-2" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select name="status" className="border p-2" onChange={handleChange} required>
          <option value="">Select Status</option>
          <option value="Available">Available</option>
          <option value="Adopted">Adopted</option>
        </select>
        <input
          type="file"
          name="image"
          accept="image/*"
          className="border p-2"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="border p-2 col-span-2"
          rows="3"
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <div className="mt-4">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">
          Submit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
