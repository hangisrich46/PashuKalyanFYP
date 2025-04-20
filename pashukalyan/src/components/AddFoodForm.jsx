import React, { useState } from 'react';

export default function AddFoodForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a FormData object
    const data = new FormData();

    // Append all form fields to FormData
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);

    // Append the image file (if any)
    if (image) {
      data.append("image", image);
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
          placeholder="Food Name"
          className="border p-2"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price (USD)"
          step="0.01"
          min="0"
          className="border p-2"
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          className="border p-2 col-span-2"
          onChange={handleImageChange}
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