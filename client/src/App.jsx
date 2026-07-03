import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useParams, Link, useNavigate } from 'react-router-dom';
import { Download, Star, ExternalLink, ShieldCheck, Search, Sun, Moon, X, User, LogOut, LayoutGrid, CheckCircle, Globe, Github, Share2, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Constants ---
const GITHUB_URL = "https://raw.githubusercontent.com/My-Store-Group/My-Store/main/apps.json";

// --- Helper: Generate Unique Slug ---
const getAppSlug = (app) => {
  const pName = app.packageName || app.name.toLowerCase().replace(/ /g, '.');
  const suffix = app.category.toLowerCase().includes('game') ? '.game' : '.app';
  return `${pName}${suffix}`;
};

// --- Navbar Component ---
const Navbar = ({ darkMode, setDarkMode, search, setSearch, userData, handleLogout, setShowAuthModal }) => (
  <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${darkMode ? 'bg-zinc-950/80 border-zinc-900' : 'bg-white/80 border-zinc-100'} backdrop-blur-xl border-b`}>
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:rotate-6 transition-transform">
          <LayoutGrid className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight">My Store</span>
      </Link>

      <div className="hidden md:flex flex-1 max-w-lg relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
        <input
          type="text"
          placeholder="Search for apps, games and more..."
          className={`w-full h-11 pl-12 pr-6 rounded-2xl outline-none text-sm font-medium transition-all border ${darkMode ? 'bg-zinc-900 border-zinc-800 focus:border-indigo-500/50' : 'bg-zinc-50 border-zinc-200 focus:border-indigo-500/50 focus:bg-white'}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setDarkMode(!darkMode)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${darkMode ? 'hover:bg-zinc-800 text-yellow-400' : 'hover:bg-zinc-100 text-zinc-500'}`}>
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {userData ? (
          <div className="flex items-center gap-3 pl-2 border-l border-zinc-800 ml-2 group relative">
            <div className="w-10 h-10 bg-zinc-800 text-white rounded-xl flex items-center justify-center font-bold text-sm cursor-pointer border border-zinc-700">
              {userData.username[0].toUpperCase()}
            </div>
            <div className="absolute top-12 right-0 hidden group-hover:block w-48 p-2 rounded-2xl shadow-2xl border bg-white dark:bg-zinc-900 dark:border-zinc-800 mt-2">
              <div className="px-4 py-2 border-b dark:border-zinc-800 mb-2">
                <p className="text-xs font-bold opacity-50 uppercase">Signed in as</p>
                <p className="text-sm font-bold truncate">{userData.username}</p>
              </div>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-500/10 text-red-500 rounded-xl font-bold transition-colors text-sm"><LogOut className="w-4 h-4"/> Sign Out</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAuthModal(true)} className="bg-indigo-600 text-white px-6 h-10 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">Sign In</button>
        )}
      </div>
    </div>
  </nav>
);

// --- Home Component ---
const Home = ({ apps, loading, search, activeCategory, setActiveCategory, darkMode }) => {
  const categories = ["All", ...new Set(apps.map(app => app.category))];
  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) || app.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || app.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-6">
      <header className="pt-40 pb-16">
        <div className="flex flex-col items-center text-center space-y-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-bold tracking-wider uppercase">Premium App Hub</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-extrabold tracking-tight">Find your next <br/> <span className="text-indigo-600">favorite app.</span></motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg md:text-xl text-zinc-500 max-w-2xl font-medium leading-relaxed">Discover a handpicked collection of verified, secure, and fast Android applications for every need.</motion.p>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="sticky top-20 z-50 py-6 bg-inherit">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0 border ${activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-600/20' : 'bg-zinc-500/5 border-transparent opacity-60 hover:opacity-100 hover:bg-zinc-500/10'}`}>{cat}</button>
          ))}
        </div>
      </div>

      <main className="pb-32 mt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-[340px] rounded-3xl bg-zinc-500/5 animate-pulse border border-zinc-500/10" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredApps.map((app, index) => (
                <motion.div key={index} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Link to={`/details/${getAppSlug(app)}`} className={`flex flex-col group p-5 rounded-[2rem] border transition-all duration-300 ${darkMode ? 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900' : 'bg-white border-zinc-100 hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-200/50'}`}>
                    <div className="relative overflow-hidden rounded-2xl aspect-square mb-5">
                       <img src={app.iconUrl} alt={app.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-xl scale-90 group-hover:scale-100 transition-transform duration-300">
                             <ArrowRight className="w-5 h-5" />
                          </div>
                       </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">{app.category}</span>
                         <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-xs font-bold">{app.stars}</span>
                         </div>
                      </div>
                      <h3 className="text-lg font-bold leading-snug truncate">{app.name}</h3>
                      <p className="text-xs font-medium text-zinc-500 truncate">by {app.owner}</p>
                    </div>

                    <div className="mt-5 pt-4 border-t dark:border-zinc-800 flex items-center justify-between">
                       <span className="text-xs font-bold opacity-40">{app.fileSize}</span>
                       <div className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase tracking-tighter">
                          <CheckCircle className="w-3 h-3" /> Verified
                       </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredApps.length === 0 && (
          <div className="text-center py-20 bg-zinc-500/5 rounded-[3rem] border border-dashed border-zinc-500/20">
            <p className="text-zinc-500 font-bold text-lg">No results for "{search}"</p>
            <button onClick={() => setSearch("")} className="mt-4 text-indigo-600 font-bold text-sm hover:underline">Clear search</button>
          </div>
        )}
      </main>
    </div>
  );
};

// --- Details Component ---
const Details = ({ apps, darkMode }) => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const app = apps.find(a => getAppSlug(a) === appId);

  useEffect(() => { window.scrollTo(0, 0); }, [appId]);

  if (!app) return <div className="pt-40 text-center font-bold text-2xl">App not found</div>;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard! 🔗");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-40 px-6 max-w-6xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold text-sm opacity-50 hover:opacity-100 transition-opacity mb-10"><ArrowLeft className="w-4 h-4" /> Store</button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Info */}
        <div className="lg:col-span-8 space-y-12">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={app.iconUrl} className="w-40 h-40 rounded-[2.5rem] shadow-2xl border border-zinc-500/10 object-cover" />
            <div className="flex-1 space-y-5 pt-2">
              <div>
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2">{app.name}</h2>
                <p className="text-xl font-bold text-indigo-600">{app.owner}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-1.5 bg-zinc-500/10 rounded-xl text-xs font-bold uppercase tracking-widest">{app.category}</span>
                <span className="px-4 py-1.5 bg-green-500/10 text-green-600 rounded-xl text-xs font-bold flex items-center gap-2 uppercase tracking-widest"><ShieldCheck className="w-4 h-4"/> Verified</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-zinc-500/5 rounded-[2rem] border border-zinc-500/10 text-center">
            <div><p className="text-2xl font-black">{app.stars}</p><p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Stars</p></div>
            <div><p className="text-2xl font-black">{app.fileSize}</p><p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Size</p></div>
            <div><p className="text-2xl font-black">{app.version}</p><p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Version</p></div>
            <div><p className="text-2xl font-black">1M+</p><p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Users</p></div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight">About this app</h3>
            <p className="text-lg leading-relaxed opacity-70 font-medium whitespace-pre-line">{app.description}</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight">Screenshots</h3>
            <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar scroll-smooth">
              {app.screenshots.map((url, i) => (
                <motion.img whileHover={{ scale: 1.02 }} key={i} src={url} className="h-[450px] rounded-[2rem] shadow-xl flex-shrink-0 border border-zinc-500/10" />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Sidebar Action */}
        <div className="lg:col-span-4">
          <div className={`p-8 rounded-[2.5rem] border sticky top-32 transition-all ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100 shadow-2xl shadow-zinc-200/50'}`}>
            <h4 className="text-lg font-bold mb-6">Installation</h4>
            <div className="space-y-3">
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(app.downloadUrl);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${app.name.replace(/\s+/g, '_')}.apk`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                  } catch (e) {
                    window.location.href = app.downloadUrl;
                  }
                }}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-[0.98]"
              >
                <Download className="w-5 h-5" /> Download APK
              </button>
              <p className="text-xs text-center font-black opacity-70 px-2 leading-tight">
                *Note: Chrome may show a "File might be harmful" warning. This is normal for all APKs outside Play Store.
                <span className="text-green-600 inline-flex items-center gap-1 ml-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified & Secure
                </span>
              </p>
              <button onClick={handleShare} className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 border transition-all ${darkMode ? 'border-zinc-800 hover:bg-zinc-800' : 'border-zinc-200 hover:bg-zinc-50'}`}>
                <Share2 className="w-5 h-5" /> Share
              </button>
            </div>

            <div className="mt-8 pt-8 border-t dark:border-zinc-800 space-y-5">
               <a href={app.repoUrl} target="_blank" className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-500/10 flex items-center justify-center"><Github className="w-4 h-4"/></div>
                    <span className="text-sm font-bold opacity-60 group-hover:opacity-100 transition-opacity">View Source</span>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
               </a>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-green-500"/></div>
                  <span className="text-sm font-bold opacity-60">Verified & Secure</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App Component ---
const App = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userData, setUserData] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [authError, setAuthError] = useState("");

  let baseApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  if (!baseApiUrl.endsWith('/api')) {
    baseApiUrl = baseApiUrl.endsWith('/') ? `${baseApiUrl}api` : `${baseApiUrl}/api`;
  }
  const API_URL = baseApiUrl;

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await axios.get(GITHUB_URL);
        setApps(response.data);
        setLoading(false);
      } catch (error) { setLoading(false); }
    };
    fetchApps();
    if (darkMode) document.documentElement.classList.add('dark');
  }, []);

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
        alert("Account created! You can now sign in.");
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

  return (
    <Router>
      <div className={`min-h-screen transition-all duration-500 selection:bg-indigo-500 selection:text-white ${darkMode ? 'bg-[#09090b] text-zinc-100' : 'bg-white text-zinc-900'}`}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} search={search} setSearch={setSearch} userData={userData} handleLogout={handleLogout} setShowAuthModal={setShowAuthModal} />

        <AnimatePresence>
          {showAuthModal && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAuthModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
              <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className={`relative w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100'}`}>
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-bold tracking-tight">{isLogin ? "Sign In" : "Register"}</h2>
                  <button onClick={() => setShowAuthModal(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"><X /></button>
                </div>
                <form onSubmit={handleAuth} className="space-y-6">
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest opacity-50 ml-1">Username</label>
                      <input type="text" required className={`w-full h-14 px-6 rounded-2xl outline-none border-2 transition-all ${darkMode ? 'bg-zinc-800 border-zinc-800 focus:border-indigo-500' : 'bg-zinc-50 border-zinc-50 focus:border-indigo-500 focus:bg-white'}`} onChange={(e) => setFormData({...formData, username: e.target.value})}/>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-50 ml-1">Email</label>
                    <input type="email" required className={`w-full h-14 px-6 rounded-2xl outline-none border-2 transition-all ${darkMode ? 'bg-zinc-800 border-zinc-800 focus:border-indigo-500' : 'bg-zinc-50 border-zinc-50 focus:border-indigo-500 focus:bg-white'}`} onChange={(e) => setFormData({...formData, email: e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-50 ml-1">Password</label>
                    <input type="password" required className={`w-full h-14 px-6 rounded-2xl outline-none border-2 transition-all ${darkMode ? 'bg-zinc-800 border-zinc-800 focus:border-indigo-500' : 'bg-zinc-50 border-zinc-50 focus:border-indigo-500 focus:bg-white'}`} onChange={(e) => setFormData({...formData, password: e.target.value})}/>
                  </div>
                  {authError && <p className="text-red-500 text-sm font-bold text-center">{authError}</p>}
                  <button className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">{isLogin ? "Continue" : "Create Account"}</button>
                </form>
                <div className="mt-10 text-center">
                   <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold text-zinc-500 hover:text-indigo-600 transition-colors">
                     {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
                   </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <Routes>
          <Route path="/" element={<Home apps={apps} loading={loading} search={search} activeCategory={activeCategory} setActiveCategory={setActiveCategory} darkMode={darkMode} />} />
          <Route path="/details/:appId" element={<Details apps={apps} darkMode={darkMode} />} />
        </Routes>

        <footer className={`py-20 px-6 border-t ${darkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-50 border-zinc-100'}`}>
          <div className="max-w-7xl mx-auto flex flex-col items-center space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
              <span className="font-bold tracking-tight">My Store</span>
            </div>
            <p className="text-xs font-bold opacity-30 uppercase tracking-[0.4em]">
              © {new Date().getFullYear()} My Store • Handcrafted for you
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
