import React from 'react';
import toast from 'react-hot-toast';

const Form = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    alert(`Submitted:\nName: ${formData.name}\nEmail: ${formData.email}`);
    toast.success('Form submitted successfully!');
  };

  return (
    <div>
      <form className="mt-10 bg-gray-300 p-4 space-y-2">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="block w-full p-2 rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="block w-full p-2 rounded"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="block w-full p-2 rounded"
        />

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
      <div className="mt-4">
        <p className="font-bold">Live Preview:</p>
        <p>Name: {formData.name}</p>
        <p>Email: {formData.email}</p>
      </div>
    </div>
  );
};

export default Form;
