import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useNavigate } from '@tanstack/react-router';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('https://weddings-backend.onrender.com/api/auth/login', data, {
        withCredentials: true 
      });
      
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate({ to: '/' }); // We will change this to redirect to the dashboard later!
    } catch (error) {
      setServerError(error.response?.data?.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 border border-brand/20 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-brand-dark mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Sign in to manage your inquiries.</p>
        </div>

        {serverError && (
          <div className="bg-red-50 text-red-600 p-3 text-sm mb-6 text-center border border-red-100">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-dark mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-brand"
              {...register('email', { required: 'Email is required' })} 
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-dark mb-2">Password</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-brand"
              {...register('password', { required: 'Password is required' })} 
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" className="w-full bg-brand-dark text-brand-light py-4 uppercase tracking-widest text-sm hover:bg-brand-medium transition-colors mt-4">
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <Link to="/signup" className="text-brand font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}