import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Star, ExternalLink, ShieldCheck, Search } from 'lucide-react';

const App = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // GitHub Raw Link (Direct fetch)
  const GITHUB_URL = "https://raw.githubusercontent.com/My-Store-Group/My-Store/main/apps.json";

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const response = await axios.get(GITHUB_URL);
      setApps(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching apps:", error);
      setLoading(false);
    }
  };

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase()) ||
    app.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">M</div>
          <h1 className="text-xl font-bold tracking-tight">My Store</h1>
        </div>

        <div className="relative w-full max-w-md mx-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search apps and games..."
            className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
           <button className="text-gray-600 font-medium hover:text-indigo-600 transition">Dev Tools</button>
           <button className="bg-indigo-600 text-white px-5 py-2 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">Sign In</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 py-12 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4">Discover Amazing Apps</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Download verified, secure, and high-quality Android applications curated specifically for you.</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredApps.map((app, index) => (
              <div key={index} className="group bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-start gap-5">
                  <img src={app.iconUrl} alt={app.name} className="w-20 h-20 rounded-2xl shadow-md object-cover" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{app.name}</h3>
                    <p className="text-indigo-600 font-semibold text-sm mb-1">{app.owner}</p>
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider">
                      <span>{app.category}</span>
                      <span>•</span>
                      <span>{app.fileSize}</span>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-gray-600 text-sm line-clamp-2 min-h-[40px]">
                  {app.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                    <Star className="w-4 h-4 fill-yellow-500 border-none" />
                    {app.stars}
                  </div>
                  <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                    <ShieldCheck className="w-5 h-5" />
                    Verified
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <a
                    href={app.downloadUrl}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </a>
                  <a
                    href={app.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredApps.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl font-medium">No apps found matching "{search}"</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-6 bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
             <p className="font-bold text-gray-900">My Store</p>
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
