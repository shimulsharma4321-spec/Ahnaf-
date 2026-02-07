
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { VideoProject } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VideoCard from './components/VideoCard';
import VideoModal from './components/VideoModal';
import { Plus, Trash2, ShieldCheck, Mail, Instagram, Twitter, ExternalLink, Info, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'ahnaf_portfolio_videos';

const INITIAL_VIDEOS: VideoProject[] = [
  {
    id: '1',
    title: 'Modern Architecture Documentary',
    driveLink: 'https://drive.google.com/file/d/1X-example-id-1/view',
    category: 'Documentary',
    createdAt: Date.now() - 1000000
  },
  {
    id: '2',
    title: 'Cyberpunk Aesthetic Commercial',
    driveLink: 'https://drive.google.com/file/d/1X-example-id-2/view',
    category: 'Commercial',
    createdAt: Date.now() - 2000000
  },
  {
    id: '3',
    title: 'Urban Exploration Series',
    driveLink: 'https://drive.google.com/file/d/1X-example-id-3/view',
    category: 'Social Media',
    createdAt: Date.now() - 3000000
  }
];

const App: React.FC = () => {
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<VideoProject | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      setProjects(INITIAL_VIDEOS);
    }
  }, []);

  const saveProjects = (newProjects: VideoProject[]) => {
    setProjects(newProjects);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
  };

  const addProject = (title: string, link: string, category: string) => {
    const newProject: VideoProject = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      driveLink: link,
      category,
      createdAt: Date.now()
    };
    saveProjects([newProject, ...projects]);
  };

  const deleteProject = (id: string) => {
    saveProjects(projects.filter(p => p.id !== id));
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#fbfbfd]">
        <Navbar />
        
        <Routes>
          <Route path="/" element={
            <main className="pb-20">
              <Hero />
              
              <section id="work" className="max-w-6xl mx-auto px-6 mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project) => (
                    <VideoCard 
                      key={project.id} 
                      project={project} 
                      onClick={() => setSelectedProject(project)} 
                    />
                  ))}
                </div>
              </section>

              <section id="about" className="max-w-3xl mx-auto px-6 mb-32 text-center">
                <h2 className="text-3xl font-bold mb-8">About Ahnaf</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  With over 5 years of experience in the creative industry, I transform raw footage into compelling narratives. 
                  My style focuses on clean transitions, emotive color grading, and precise sound design. I've worked with international brands
                  to create high-impact visual content.
                </p>
              </section>

              <footer id="contact" className="bg-white border-t border-gray-100 py-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                  <h2 className="text-3xl font-bold mb-10">Let's build something together</h2>
                  <div className="flex justify-center gap-8 mb-12">
                    <a href="mailto:hello@ahnaf.com" className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                      <Mail className="w-6 h-6" />
                    </a>
                    <a href="#" className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                      <Instagram className="w-6 h-6" />
                    </a>
                    <a href="#" className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                      <Twitter className="w-6 h-6" />
                    </a>
                  </div>
                  <p className="text-sm text-gray-400">© 2024 Ahnaf Portfolio. All rights reserved.</p>
                </div>
              </footer>
            </main>
          } />

          <Route path="/admin" element={
            <AdminPanel 
              projects={projects} 
              onAdd={addProject} 
              onDelete={deleteProject} 
            />
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <VideoModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      </div>
    </Router>
  );
};

interface AdminPanelProps {
  projects: VideoProject[];
  onAdd: (title: string, link: string, category: string) => void;
  onDelete: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ projects, onAdd, onDelete }) => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState('Commercial');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !link) return;
    onAdd(title, link, category);
    setTitle('');
    setLink('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-40 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
          <ShieldCheck className="w-12 h-12 mx-auto mb-6 text-blue-500" />
          <h2 className="text-2xl font-bold mb-6">Admin Access</h2>
          <input 
            type="password"
            placeholder="Enter password (hint: admin)"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            onClick={() => password === 'admin' ? setIsAuthenticated(true) : alert('Wrong password')}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-3xl font-bold">Manage Portfolio</h1>
        <div className="text-sm bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full font-medium">
          Logged in as Admin
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="space-y-8 sticky top-24">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add New Project
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Project Title</label>
                  <input 
                    required
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Cinematic Music Video"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Google Drive Link</label>
                  <input 
                    required
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://drive.google.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>Commercial</option>
                    <option>Music Video</option>
                    <option>Social Media</option>
                    <option>Documentary</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-xl font-medium mt-4 hover:bg-gray-800 transition-colors"
                >
                  Publish Project
                </button>
              </div>
            </form>

            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
              <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-3">
                <Info size={18} /> Fixing Playback Issues
              </h4>
              <ul className="text-sm text-blue-800 space-y-3">
                <li className="flex gap-2">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span>Right-click your file in Google Drive &gt; <strong>Share</strong>.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span>Set General Access to <strong>"Anyone with the link"</strong>.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span>Copy that link and paste it here.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold mb-6">Current Projects ({projects.length})</h3>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-lg">{project.title}</h4>
                    <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-gray-100 rounded-md text-gray-500">
                      {project.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <ExternalLink size={14} />
                    <span className="truncate max-w-xs">{project.driveLink}</span>
                  </div>
                </div>
                <button 
                  onClick={() => onDelete(project.id)}
                  className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  title="Delete Project"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400">No projects yet. Add your first one to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
