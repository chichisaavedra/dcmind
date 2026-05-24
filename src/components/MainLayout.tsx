import React, { useState } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Bot,
  Settings,
  LogOut,
  FolderKanban,
  Search,
  Bell,
  FolderOpen,
  Plus,
  ChevronRight,
  Zap,
  FolderPlus,
  X,
  User,
  BrainCircuit,
  Compass,
  Layers,
  Sparkles,
  FileText,
  Trash2,
  HelpCircle,
  CornerDownRight
} from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import { MOCK_FOLDERS } from '../lib/mockData';
import { cn } from '../lib/utils';
import { useTranslation } from '../hooks/useTranslation';
import { HelpTooltip } from './OnboardingTour';

/**
 * Propiedades para el componente de envoltura principal
 */
interface MainLayoutProps {
  onLogout: () => void;
  children: React.ReactNode;
  currentView: string;
  setCurrentView: (view: string) => void;
  /** Jerarquía de carpetas: { 'Carpeta Principal': ['Subcarpeta1', 'Subcarpeta2'] } */
  folders: Record<string, string[]>;
  onCreateFolder: (name: string) => void;
  onCreateSubfolder: (folder: string, subfolder: string) => void;
  userPlan: string;
  files: any[];
  userName: string;
}

/**
 * `MainLayout`
 * 
 * Este componente es el "Shell" o contenedor principal de la aplicación.
 * Renderiza la barra lateral (Sidebar) estilo Apple, la barra de búsqueda global superior (Header),
 * y proyecta el `children` (la vista activa) en el área principal content.
 * 
 * Contiene la lógica profunda de estados para el Menú Acordeón recursivo de la biblioteca.
 */
export default function MainLayout({
  onLogout,
  children,
  currentView,
  setCurrentView,
  folders,
  onCreateFolder,
  onCreateSubfolder,
  userPlan,
  files,
  userName
}: MainLayoutProps) {
  const { t } = useTranslation();

  // -- Estados de Búsqueda Global --
  const [searchQuery, setSearchQuery] = useState('');

  // -- Estados de Interfaz Base --
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [parentFolder, setParentFolder] = useState<string | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [expandedSubfolders, setExpandedSubfolders] = useState<string[]>([]);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  /** Abre o cierra una carpeta principal en el sidebar */
  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => prev.includes(folder) ? prev.filter(f => f !== folder) : [...prev, folder]);
  };

  /** Abre o cierra una subcarpeta en el sidebar */
  const toggleSubfolder = (folder: string, subfolder: string) => {
    const id = `${folder}-${subfolder}`;
    setExpandedSubfolders(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredQuickFiles = searchQuery.trim()
    ? files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  const navItems = [
    { id: 'dashboard', label: 'Escritorio', icon: LayoutDashboard },
    { id: 'analytics', label: t('analytics'), icon: BarChart3 },
    {
      id: 'rules', label: 'Automatización', icon: Sparkles, navId: 'rules-nav',
      tooltip: 'Crea reglas para clasificar archivos automáticamente. Soporta palabras clave simples o instrucciones en lenguaje natural.'
    },
    { id: 'ai', label: 'Asistente IA', icon: Bot },
    { id: 'settings', label: t('settings'), icon: Settings },
  ];

  const notifications = [
    { id: 1, text: 'IA organizó 3 facturas nuevas', time: 'Hace 5m', icon: Bot },
    { id: 2, text: 'Límite de archivos al 90%', time: 'Hace 1h', icon: Bell },
  ];

  /** 
   * Maneja la creación de una nueva carpeta o subcarpeta a través del modal
   */
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    if (parentFolder) {
      onCreateSubfolder(parentFolder, newFolderName);
    } else {
      onCreateFolder(newFolderName);
    }

    setNewFolderName('');
    setParentFolder(null);
    setShowNewFolderModal(false);
  };

  const openNewSubfolderModal = (folder: string) => {
    setParentFolder(folder);
    setShowNewFolderModal(true);
  };

  return (
    <div className="flex h-screen bg-[#F5F5F7] overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900 relative">
      <ParticleBackground density={0.00003} globalOpacity={0.4} />

      {/* Floating Left Sidebar (Apple Style) */}
      <aside className="fixed top-4 left-4 bottom-4 z-[100] apple-sidebar rounded-[32px] flex flex-col py-6 overflow-hidden">

        {/* Brand */}
        <div className="flex items-center px-6 mb-8 gap-4 flex-shrink-0">
          <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-gray-200">
            <BrainCircuit size={22} className="text-white" />
          </div>
          <div className="apple-sidebar-fade-in flex-shrink-0">
            <span className="font-bold text-lg tracking-tight text-gray-900 block leading-tight">DocMind</span>
            <span className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold">Studio</span>
          </div>
        </div>

        {/* Main Nav Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 pb-4 min-h-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={cn("apple-sidebar-nav-item", isActive && "active")}
              >
                <div className="apple-sidebar-nav-item-icon"><Icon size={20} /></div>
                <span className="apple-sidebar-nav-item-text">{item.label}</span>
              </div>
            );
          })}

          <div className="w-full h-[1px] bg-gray-200/50 my-2 mx-2 max-w-[calc(100%-16px)] shrink-0" />

          {/* Secondary Nav */}
          <div
            onClick={() => setCurrentView('trash')}
            className={cn("apple-sidebar-nav-item", currentView === 'trash' && "active text-red-500")}
          >
            <div className="apple-sidebar-nav-item-icon"><Trash2 size={20} className={currentView === 'trash' ? "" : "text-gray-400 group-hover:text-red-500"} /></div>
            <span className="apple-sidebar-nav-item-text text-red-500">Papelera</span>
          </div>

          <div className="w-full h-[1px] bg-gray-200/50 my-2 mx-2 max-w-[calc(100%-16px)] shrink-0" />

          {/* Folders Section */}
          <div className="mt-2 apple-sidebar-fade-in px-4 mb-2 flex justify-between items-center group/title shrink-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              Biblioteca
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setParentFolder(null); setShowNewFolderModal(true); }}
              className="p-1 opacity-0 group-hover/title:opacity-100 hover:bg-gray-100 rounded-lg text-gray-400 transition-all"
            >
              <FolderPlus size={14} />
            </button>
          </div>

          <div className="space-y-0.5 pb-2">
            {Object.entries(folders).map(([folder, subfolders]) => {
              const isOpen = expandedFolders.includes(folder);
              return (
                <div key={folder} className="flex flex-col relative w-full">
                  <div
                    onClick={() => toggleFolder(folder)}
                    className={cn(
                      "apple-sidebar-nav-item select-none group/folder",
                      isOpen ? "bg-black/5" : "hover:bg-gray-100/50 hover:text-gray-900"
                    )}
                  >
                    <div className="apple-sidebar-nav-item-icon relative">
                      <FolderOpen size={16} className={cn("transition-colors duration-300", isOpen ? "text-indigo-500" : "text-gray-400 group-hover/folder:text-indigo-500")} />
                      {!isOpen && subfolders.length > 0 && (
                        <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-indigo-400 rounded-full border border-white apple-sidebar-collapsed-only" />
                      )}
                    </div>
                    <span className={cn("apple-sidebar-nav-item-text truncate flex-1 transition-colors duration-300", isOpen ? "text-indigo-900 font-bold" : "text-gray-600")}>{folder}</span>

                    <div className="apple-sidebar-fade-in mr-2 flex items-center">
                      <ChevronRight size={14} className={cn("text-gray-400 transition-transform duration-300", isOpen && "rotate-90")} />
                    </div>

                    {/* Plus button only visible on hover of the expanded sidebar */}
                    <div className="apple-sidebar-fade-in absolute right-8 opacity-0 group-hover/folder:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); openNewSubfolderModal(folder); }}
                        className="p-1 hover:bg-white shadow-sm rounded-md text-gray-400 hover:text-indigo-500 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Subfolders expanding section - Instant render to prevent lag */}
                  {isOpen && (
                    <div className="pb-1 pt-0.5 animate-slide-up" style={{ animationDuration: '0.2s' }}>
                      {subfolders.map(sub => {
                        const subId = `${folder}-${sub}`;
                        const isSubOpen = expandedSubfolders.includes(subId);
                        const subFiles = files.filter(f => f.folder === folder && f.subfolder === sub);

                        return (
                          <div key={sub} className="flex flex-col relative w-full">
                            <div
                              onClick={() => toggleSubfolder(folder, sub)}
                              className="apple-sidebar-subfolder select-none group/sub"
                            >
                              <div className="apple-sidebar-subfolder-icon relative">
                                <div className="apple-sidebar-collapsed-only w-1.5 h-1.5 rounded-full bg-gray-300 group-hover/sub:bg-gray-400 transition-colors" />
                                <div className="apple-sidebar-expanded-only">
                                  <CornerDownRight size={14} className={cn("transition-colors duration-300", isSubOpen ? "text-indigo-400" : "text-gray-400")} />
                                </div>
                                {!isSubOpen && subFiles.length > 0 && (
                                  <div className="absolute top-[14px] right-[26px] w-[5px] h-[5px] bg-indigo-400 rounded-full border border-white apple-sidebar-collapsed-only" />
                                )}
                              </div>
                              <span className={cn("apple-sidebar-subfolder-text flex-1 truncate transition-colors duration-300", isSubOpen ? "text-indigo-800 font-bold" : "text-gray-500")}>{sub}</span>
                              <div className="apple-sidebar-fade-in mr-3 flex items-center">
                                <ChevronRight size={12} className={cn("text-gray-300 transition-transform duration-300", isSubOpen && "rotate-90 text-indigo-300")} />
                              </div>
                            </div>

                            {isSubOpen && (
                              <div className="pb-1 animate-fade-in" style={{ animationDuration: '0.2s' }}>
                                {subFiles.map(file => (
                                  <div
                                    key={file.id}
                                    onClick={() => {
                                      setCurrentView('dashboard');
                                      setTimeout(() => window.dispatchEvent(new CustomEvent('open-file', { detail: { id: file.id } })), 50);
                                    }}
                                    className="apple-sidebar-file select-none group/file"
                                    title={file.name}
                                  >
                                    <div className="apple-sidebar-file-icon relative">
                                      <div className="apple-sidebar-collapsed-only w-1 h-1 rounded-full bg-gray-200 group-hover/file:bg-gray-300 transition-colors" />
                                      <div className="apple-sidebar-expanded-only">
                                        <FileText size={12} className="text-gray-400 group-hover/file:text-indigo-500 transition-colors duration-300" />
                                      </div>
                                    </div>
                                    <span className="apple-sidebar-file-text truncate pr-4 text-gray-500 group-hover/file:text-indigo-700 transition-colors">{file.name}</span>
                                  </div>
                                ))}
                                {subFiles.length === 0 && (
                                  <div className="apple-sidebar-file opacity-60 cursor-default">
                                    <div className="apple-sidebar-file-icon"></div>
                                    <span className="apple-sidebar-file-text italic text-gray-400 text-[10px]">Vacío</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {subfolders.length === 0 && (
                        <div className="apple-sidebar-subfolder opacity-60 cursor-default">
                          <div className="apple-sidebar-subfolder-icon"></div>
                          <span className="apple-sidebar-subfolder-text italic text-gray-400 text-[11px]">Sin subcarpetas</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Section (Premium, Support, User) */}
        <div className="mt-auto flex flex-col gap-4">

          {/* Always Visible Premium Call to Action */}
          {userPlan === 'Free' && (
            <div className="px-3" title="Mejora a Pro">
              <div
                onClick={() => setCurrentView('pricing')}
                className="bg-gradient-to-tr from-indigo-50 to-blue-50 border border-indigo-100/60 hover:border-indigo-300 hover:shadow-lg rounded-2xl cursor-pointer flex items-center h-[48px] overflow-hidden transition-all duration-300 group"
              >
                <div className="w-[64px] h-[48px] flex items-center justify-center shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap size={16} className="text-indigo-500 fill-indigo-500 animate-pulse" />
                  </div>
                </div>
                <div className="apple-sidebar-fade-in flex flex-col justify-center pr-3 min-w-0 flex-1">
                  <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 leading-tight block truncate">Mejora a Pro</span>
                  <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block truncate">Análisis Ilimitado</span>
                </div>
              </div>
            </div>
          )}

          <div className="w-full h-[1px] bg-gray-200/50 my-1 px-4" />

          {/* Support */}
          <div onClick={() => setCurrentView('support')} className={cn("apple-sidebar-nav-item my-0", currentView === 'support' && "active")}>
            <div className="apple-sidebar-nav-item-icon"><HelpCircle size={20} /></div>
            <span className="apple-sidebar-nav-item-text">Ayuda y Soporte</span>
          </div>

          {/* User Profile Area */}
          <div className="apple-sidebar-nav-item h-auto py-2 !mt-1 items-center">
            <div className="apple-sidebar-nav-item-icon">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
                {userName.charAt(0)}
              </div>
            </div>
            <div className="apple-sidebar-nav-item-text flex flex-col items-start pr-4 justify-center">
              <span className="font-bold text-gray-900 leading-tight block">{userName}</span>
              <button onClick={(e) => { e.stopPropagation(); onLogout(); }} className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-wider mt-1 whitespace-nowrap">
                <LogOut size={10} /> Salir
              </button>
            </div>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full pl-[104px] z-10 transition-all">
        {/* Top Header - Kept Apple/Mac style but adapted for left dock */}
        <header className="bg-white/40 backdrop-blur-3xl border-b border-gray-200/50 px-8 py-5 flex items-center justify-between flex-shrink-0 z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              {navItems.find(i => i.id === currentView)?.label || 'Buscador'}
              {userPlan !== 'Free' && (
                <div className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-indigo-100">
                  Pro
                </div>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Same search bar logic... */}
            {currentView === 'dashboard' && (
              <div className="relative hidden md:block group z-50">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <Search size={16} />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onFocus={() => setShowSearchResults(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  className="block w-64 pl-11 pr-12 py-2.5 bg-gray-100/50 border border-transparent rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-gray-200 transition-all outline-none"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <kbd className="hidden sm:inline-block border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-white shadow-sm">
                    ⌘K
                  </kbd>
                </div>
                {/* Result dropdown... */}
              </div>
            )}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all"
            >
              <Bell size={20} />
              <span className="absolute top-3 right-3 block h-1.5 w-1.5 rounded-full bg-indigo-500 ring-4 ring-white" />
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all"
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-y-auto px-10 pt-10 pb-32 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, { searchQuery });
              }
              return child;
            })}
          </div>
        </div>
      </main>

      {/* Modal - Redesigned Modal */}
      {
        showNewFolderModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md animate-fade-in" onClick={() => setShowNewFolderModal(false)} />
            <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-10 animate-slide-up border border-white">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                    {parentFolder ? `Subcarpeta en ${parentFolder}` : 'Nueva Carpeta'}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">Organiza tu biblioteca con espacios dedicados</p>
                </div>
              </div>
              <form onSubmit={handleCreateFolder} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nombre del espacio</label>
                  <input
                    autoFocus
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder={parentFolder ? "Ej: Facturas Enero" : "Ej: Contabilidad 2024"}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-gray-900 focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-gray-200 outline-none transition-all text-base"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewFolderModal(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black shadow-lg shadow-gray-200 transition-all active:scale-[0.98]"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </div >
  );
}

