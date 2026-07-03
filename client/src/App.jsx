import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Star, ExternalLink, ShieldCheck, Search, Sun, Moon, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem('user')));

  // Form States
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [authError, setAuthError] = useState("");

  const GITHUB_URL = "https://raw.githubusercontent.com/My-Store-Group/My-Store/main/apps.json";
  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    fetchApps();
    if (darkMode) document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const fetchApps = async () => {
    try {
      const response = await axios.get(GITHUB_URL);
      setApps(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, formData);
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUserData(res.data.user);
        setShowAuthModal(false);
      } else {
        setIsLogin(true);
        alert("Registration successful! Please login.");
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserData(null);
  };

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase()) ||
    app.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-zinc-950 text-white' : 'bg-white text-gray-900'}`}>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-md rounded-3xl p-8 shadow-2xl ${darkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{isLogin ? "Welcome Back" : "Create Account"}</h2>
                <button onClick={() => setShowAuthModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="text-sm font-semibold mb-1 block">Username</label>
                    <input
                      type="text" required
                      className={`w-full p-3 rounded-xl outline-none border focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold mb-1 block">Email Address</label>
                  <input
                    type="email" required
                    className={`w-full p-3 rounded-xl outline-none border focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block">Password</label>
                  <input
                    type="password" required
                    className={`w-full p-3 rounded-xl outline-none border focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200'}`}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>

                {authError && <p className="text-red-500 text-sm font-medium">{authError}</p>}

                <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25">
                  {isLogin ? "Sign In" : "Register"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  {isLogin ? "Create One" : "Login Now"}
                </button>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className={`sticky top-0 z-50 border-b px-6 py-4 flex items-center justify-between transition-colors duration-300 ${darkMode ? 'bg-zinc-900/80 backdrop-blur-md border-zinc-800' : 'bg-white/80 backdrop-blur-md border-gray-100'}`}>
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">M</div>
          <h1 className="text-xl font-bold tracking-tight">My Store</h1>
        </motion.div>

        <div className="relative w-full max-w-md mx-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search apps and games..."
            className={`w-full border-none rounded-full py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${darkMode ? 'bg-zinc-800 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-400'}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
           <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-xl transition-all ${darkMode ? 'bg-zinc-800 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}>
             {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>

           {userData ? (
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 bg-indigo-600/10 text-indigo-500 px-4 py-2 rounded-full font-bold">
                 <User className="w-4 h-4" />
                 {userData.username}
               </div>
               <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition">
                 <LogOut className="w-5 h-5" />
               </button>
             </div>
           ) : (
             <button
               onClick={() => { setAuthError(""); setShowAuthModal(true); }}
               className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20"
             >
               Sign In
             </button>
           )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className={`px-6 py-20 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-b from-indigo-900/20 to-zinc-950' : 'bg-gradient-to-b from-indigo-50 to-white'}`}>
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="text-6xl font-extrabold mb-6">Discover Amazing Apps</motion.h2>
          <motion.p initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="text-xl max-w-2xl mx-auto opacity-70">Download verified, secure, and high-quality Android applications curated specifically for you.</motion.p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></motion.div>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredApps.map((app, index) => (
                <motion.div key={index} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`group rounded-3xl border p-6 transition-all duration-300 transform hover:-translate-y-2 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 hover:shadow-2xl'}`}>
                  <div className="flex items-start gap-5">
                    <img src={app.iconUrl} alt={app.name} className="w-20 h-20 rounded-2xl shadow-md object-cover" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold line-clamp-1">{app.name}</h3>
                      <p className="text-indigo-400 font-semibold text-sm mb-1">{app.owner}</p>
                      <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider">
                        <span>{app.category}</span>
                        <span>•</span>
                        <span>{app.fileSize}</span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm line-clamp-2 min-h-[40px] opacity-70">{app.description}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${darkMode ? 'bg-yellow-500/10 text-yellow-500' : 'bg-yellow-50 text-yellow-700'}`}>
                      <Star className="w-4 h-4 fill-yellow-500" />
                      {app.stars}
                    </div>
                    <div className="flex items-center gap-2 text-green-500 text-sm font-bold"><ShieldCheck className="w-5 h-5" />Verified</div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <a href={app.downloadUrl} className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition">
                      <Download className="w-5 h-5" /> Download
                    </a>
                    <a href={app.repoUrl} target="_blank" rel="noreferrer" className="w-12 h-12 border border-gray-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-gray-400 hover:text-indigo-600 transition">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-12 px-6 mt-20 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-gray-50 border-gray-100'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
             <p className="font-bold">My Store</p>
           </div>
           <p className="text-gray-500 text-sm">© 2024 My Store. All rights reserved.</p>
           <div className="flex gap-6 text-sm font-semibold text-gray-600">
              <a href="#" className="hover:text-indigo-600">Terms</a>
              <a href="#" className="hover:text-indigo-600">Privacy</a>
              <a href="#" className="hover:text-indigo-600">About</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
