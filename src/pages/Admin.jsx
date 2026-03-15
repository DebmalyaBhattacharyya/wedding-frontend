import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ id: '', pass: '' });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Hardcoded Login Check for Testing
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.id === 'admin' && loginData.pass === 'admin123') {
      setIsAuthenticated(true);
      fetchAllBookings();
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  const fetchAllBookings = async () => {
    try {
      const res = await axios.get('https://weddings-backend.onrender.com/api/bookings/admin/all');
      setBookings(res.data);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIN VIEW ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-brand-dark mb-2">Agency Portal</h1>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Secure Admin Access</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="text" placeholder="Admin ID" required
              className="w-full p-4 border rounded-xl outline-none focus:border-brand"
              onChange={(e) => setLoginData({...loginData, id: e.target.value})}
            />
            <input 
              type="password" placeholder="Password" required
              className="w-full p-4 border rounded-xl outline-none focus:border-brand"
              onChange={(e) => setLoginData({...loginData, pass: e.target.value})}
            />
            <button type="submit" className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all">
              Login to Dashboard
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-dashed text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">Testing Credentials</p>
            <p className="text-sm text-brand-dark font-mono bg-brand-light/30 py-2 rounded">
              ID: admin | Pass: admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW (The "Excel" Sheet) ---
  return (
    <div className="p-8 md:p-12 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 pb-6 border-b-2 border-brand-light">
        <div>
          <h1 className="text-4xl font-serif text-brand-dark mb-2">Master Booking Ledger</h1>
          <p className="text-gray-500 text-sm">Real-time overview of all agency reservations.</p>
        </div>
        <div className="bg-brand-light px-6 py-3 rounded-lg text-brand-dark font-bold text-sm">
          Total Bookings: {bookings.length}
        </div>
      </div>

      <div className="overflow-x-auto shadow-2xl rounded-2xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-dark text-white uppercase text-[10px] tracking-[0.2em]">
              <th className="p-5 font-bold">Client Details</th>
              <th className="p-5 font-bold">Package</th>
              <th className="p-5 font-bold">Event Date</th>
              <th className="p-5 font-bold">Venue / Location</th>
              <th className="p-5 font-bold">Total Investment</th>
              <th className="p-5 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="6" className="p-20 text-center animate-pulse font-serif text-xl">Loading master data...</td></tr>
            ) : bookings.map((b) => (
              <tr key={b.id} className="hover:bg-brand-light/10 transition-colors">
                <td className="p-5">
                  <p className="font-bold text-brand-dark">{b.client_name}</p>
                  <p className="text-[10px] text-gray-400">{b.client_email}</p>
                </td>
                <td className="p-5">
                  <span className="bg-brand-light text-brand text-[10px] font-bold px-3 py-1 rounded uppercase">
                    {b.package_name}
                  </span>
                </td>
                <td className="p-5 text-sm font-medium text-gray-600">
                  {new Date(b.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="p-5 text-sm text-gray-500 max-w-[200px] truncate">
                  {b.event_location}
                </td>
                <td className="p-5 font-serif font-bold text-[#5C0A16] text-lg">
                  ₹{Number(b.total_price).toLocaleString()}
                </td>
                <td className="p-5">
                  <span className="bg-green-100 text-green-700 px-3 py-1 text-[10px] font-bold rounded-full uppercase border border-green-200">
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}