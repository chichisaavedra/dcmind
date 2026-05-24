import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import MainLayout from './components/MainLayout';
import Dashboard from './components/views/Dashboard';
import Analytics from './components/views/Analytics';
import AutomationRules from './components/views/AutomationRules';
import AIAssistant from './components/views/AIAssistant';
import Pricing from './components/views/Pricing';
import Settings from './components/views/Settings';
import OnboardingTour from './components/OnboardingTour';
import LandingPage from './components/views/LandingPage';
import Terms from './components/views/Terms';
import Privacy from './components/views/Privacy';


import { MOCK_FILES, MOCK_RULES, MOCK_FOLDERS } from './lib/mockData';
import { Trash2, HelpCircle } from 'lucide-react';
import { supabase } from './lib/supabase';

function AppContent() {
  const [authState, setAuthState] = useState<'login' | 'onboarding' | 'app' | 'loading'>('loading');
  const [currentView, setCurrentView] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  const [files, setFiles] = useState(MOCK_FILES);
  const [rules, setRules] = useState(MOCK_RULES);
  const [folders, setFolders] = useState(MOCK_FOLDERS);
  const [userPlan, setUserPlan] = useState('Free');
  const [userName, setUserName] = useState('Invitado');

  const [rawFiles, setRawFiles] = useState<File[]>([]);

  useEffect(() => {
    // Para el modo "Waitlist", forzamos siempre el estado 'login'
    // Limpiamos cualquier usuario mock guardado previamente en el local storage
    localStorage.removeItem('docmind_user');
    setAuthState('login');
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('docmind_onboarded');
    setAuthState('login');
    navigate('/login');
  };

  const handleCreateFolder = (name: string) => {
    setFolders(prev => ({ ...prev, [name]: [] }));
  };

  const handleCreateSubfolder = (folder: string, subfolder: string) => {
    setFolders(prev => ({
      ...prev,
      [folder]: [...(prev[folder as keyof typeof prev] || []), subfolder]
    }));
  };

  const handleCreateRule = (rule: any) => {
    setRules(prev => [...prev, { ...rule, id: Math.random().toString(36).substr(2, 9), active: true }]);
  };

  const handleUpgrade = (plan: string) => {
    setUserPlan(plan);
    setCurrentView('dashboard');
  };

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Helper for onboarding complete
  const handleOnboardingComplete = () => {
    setAuthState('app');
    navigate('/dashboard');
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/login" element={
        authState === 'app' ? <Navigate to="/dashboard" replace /> :
          authState === 'onboarding' ? <Onboarding onComplete={handleOnboardingComplete} /> :
            <Login onLogin={() => { setAuthState('onboarding'); }} />
      } />
      <Route path="/dashboard" element={
        authState === 'login' ? <Navigate to="/login" replace /> :
          authState === 'onboarding' ? <Navigate to="/login" replace /> :
            <>
              <OnboardingTour />
              <MainLayout
                onLogout={handleLogout}
                currentView={currentView}
                setCurrentView={setCurrentView}
                folders={folders}
                onCreateFolder={handleCreateFolder}
                onCreateSubfolder={handleCreateSubfolder}
                userPlan={userPlan}
                files={files}
                userName={userName}
              >
                {currentView === 'dashboard' && (
                  <Dashboard
                    onNavigate={setCurrentView}
                    files={files}
                    setFiles={setFiles}
                    folders={folders}
                    setFolders={setFolders}
                    userPlan={userPlan}
                    userName={userName}
                    rawFiles={rawFiles}
                    setRawFiles={setRawFiles}
                  />
                )}
                {currentView === 'analytics' && <Analytics filesCount={files.length} />}
                {currentView === 'rules' && (
                  <AutomationRules
                    rules={rules}
                    setRules={setRules}
                    onCreateRule={handleCreateRule}
                  />
                )}
                {currentView === 'ai' && <AIAssistant files={files} rawFiles={rawFiles} />}
                {currentView === 'pricing' && <Pricing onUpgrade={handleUpgrade} />}
                {currentView === 'settings' && (
                  <Settings
                    userPlan={userPlan}
                    onUpgrade={() => setCurrentView('pricing')}
                  />
                )}
                {currentView === 'support' && (
                  <div className="flex flex-col items-center justify-center p-20 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                      <HelpCircle size={32} className="text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Centro de Ayuda y Soporte</h2>
                    <p className="text-gray-500 max-w-md">Encuentra respuestas rápidas o contacta con nuestro equipo para recibir asistencia técnica personalizada.</p>
                    <button className="mt-8 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all">Contactar Soporte</button>
                  </div>
                )}
                {currentView === 'trash' && (
                  <div className="flex flex-col items-center justify-center p-20 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                      <Trash2 size={32} className="text-red-500" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Papelera de Reciclaje</h2>
                    <p className="text-gray-500 max-w-md">Los documentos eliminados permanecerán aquí durante 30 días antes de ser borrados permanentemente.</p>
                    <div className="mt-8 min-h-[200px] flex items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-[2rem] w-full max-w-3xl mx-auto">
                      <p className="text-gray-400 font-medium text-sm">No hay archivos en la papelera.</p>
                    </div>
                  </div>
                )}
              </MainLayout>
            </>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AppContent />
    </Router>
  );
}
