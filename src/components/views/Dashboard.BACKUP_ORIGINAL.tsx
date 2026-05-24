// ============================================================
// BACKUP: Dashboard ORIGINAL (pre-redesign Versión 1)
// Guardado el 2026-02-26. Para restaurar: copia este contenido
// a Dashboard.tsx y reemplaza el archivo.
// ============================================================

import React, { useState, DragEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UploadCloud,
    FileText,
    Bot,
    Zap,
    Clock,
    MoreVertical,
    ExternalLink,
    ShieldCheck,
    TrendingUp,
    X,
    Download,
    Share2,
    Trash2,
    ArrowUpRight,
    Plus,
    Sparkles,
    Folder,
    ArrowLeft,
    FolderSearch
} from 'lucide-react';
import { MOCK_FILES } from '../../lib/mockData';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../hooks/useTranslation';

const MOCK_SMART_FILES = [
    { id: 'f1', name: 'Factura_Servicios_Feb.pdf', type: 'Factura', suggestionFolder: 'Contabilidad 2026' },
    { id: 'f2', name: 'Recibo_Internet.pdf', type: 'Factura', suggestionFolder: 'Contabilidad 2026' },
    { id: 'f3', name: 'Honorarios_Consultoria.pdf', type: 'Factura', suggestionFolder: 'Contabilidad 2026' },
    { id: 'c1', name: 'Contrato_Arrendamiento.docx', type: 'Contrato', suggestionFolder: 'Legal' },
    { id: 'c2', name: 'Acuerdo_Confidencialidad.pdf', type: 'Contrato', suggestionFolder: 'Legal' }
];

export default function Dashboard({
    onNavigate,
    files,
    folders = {},
    userPlan,
    userName,
    searchQuery = ''
}: {
    onNavigate: (view: string) => void,
    files: any[],
    folders?: Record<string, string[]>,
    userPlan: string,
    userName: string,
    searchQuery?: string
}) {
    const { t } = useTranslation();
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const [uploadingFile, setUploadingFile] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showAllRecent, setShowAllRecent] = useState(false);
    const [showPlusMenu, setShowPlusMenu] = useState(false);
    const [currentVisualFolder, setCurrentVisualFolder] = useState<string | null>(null);
    const [currentVisualSubfolder, setCurrentVisualSubfolder] = useState<string | null>(null);
    const [hiddenWidgets, setHiddenWidgets] = useState<string[]>([]);

    // Smart Upload states
    const [smartUploadState, setSmartUploadState] = useState<'idle' | 'analyzing' | 'suggestions' | 'routing'>('idle');
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

    const foldersList = Object.keys(folders);

    const toggleWidget = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setHiddenWidgets(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
    };

    const filteredFiles = files.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.folder.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const recentFiles = showAllRecent ? filteredFiles : filteredFiles.slice(0, 5);
    const selectedFile = files.find(f => f.id === selectedFileId);

    const [showImageLimitModal, setShowImageLimitModal] = useState(false);
    const [imageCountThisMonth, setImageCountThisMonth] = useState(2);

    const simulateUpload = (fileName: string) => {
        const isImage = /\.(jpg|jpeg|png|webp)$/i.test(fileName);
        if (userPlan === 'Free' && isImage && imageCountThisMonth >= 3) {
            setShowImageLimitModal(true);
            return;
        }
        setUploadingFile(fileName);
        setUploadProgress(0);
        const isFree = userPlan === 'Free';
        const stepTime = isFree ? 150 : 30;
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setUploadingFile(null);
                        if (isImage) setImageCountThisMonth(v => v + 1);
                    }, isFree ? 3000 : 500);
                    return 100;
                }
                return prev + 2;
            });
        }, stepTime);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) initiateSmartUpload();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) initiateSmartUpload();
    };

    const initiateSmartUpload = () => {
        setUploadedFiles(MOCK_SMART_FILES);
        setSmartUploadState('analyzing');
        setTimeout(() => {
            setSmartUploadState('suggestions');
        }, 3000);
    };

    const confirmSmartUpload = () => {
        setSmartUploadState('routing');
        // TODO: Supabase Insert
        setTimeout(() => {
            setSmartUploadState('idle');
        }, 1500);
    };

    return (
        <>
            <div className="space-y-12 animate-fade-in pb-20">

                {/* Welcome & Stats */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Hola, {userName}</h2>
                        <p className="text-gray-500 max-w-xl">{t('summary')}</p>
                        <div className="mt-2 inline-block">
                            <span className="text-[12px] font-extrabold text-gray-900 tracking-widest uppercase pb-1 border-b-[3px] border-gray-900/10">
                                Powered by Anthropic Claude & OpenAI
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { id: 'docs', label: 'Documentos', value: files.length, color: 'text-indigo-600' },
                            { id: 'spaces', label: 'Espacios', value: '4', color: 'text-gray-900' },
                            { id: 'slots', label: 'IA Slots', value: userPlan === 'Free' ? '4/10' : '4/150', color: 'text-gray-900' },
                        ].filter(w => !hiddenWidgets.includes(w.id)).map((s, i) => (
                            <div key={s.id} className="relative group bg-white p-5 rounded-3xl border border-gray-200/50 shadow-sm min-w-[120px] transition-all">
                                <button onClick={(e) => toggleWidget(s.id, e)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 p-1 rounded-full">
                                    <X size={12} strokeWidth={3} />
                                </button>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                                <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
                            </div>
                        ))}
                        <div className="relative">
                            <button
                                onClick={() => setShowPlusMenu(!showPlusMenu)}
                                className="w-full h-full min-h-[96px] flex items-center justify-center p-5 bg-gray-900 text-white rounded-3xl shadow-xl hover:bg-black transition-all active:scale-[0.95]"
                            >
                                <Plus size={24} className={cn("transition-transform duration-300", showPlusMenu && "rotate-45")} />
                            </button>
                            {showPlusMenu && (
                                <div className="absolute top-[calc(100%+0.5rem)] right-0 w-64 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-3xl p-3 z-50 animate-slide-up origin-top-right">
                                    <p className="px-3 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Crear Nuevo</p>
                                    <button onClick={() => setShowPlusMenu(false)} className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-2xl transition-colors flex items-center gap-3">
                                        <FileText size={18} className="text-indigo-500" /> Documento
                                    </button>
                                    <button onClick={() => setShowPlusMenu(false)} className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-2xl transition-colors flex items-center gap-3">
                                        <FolderSearch size={18} className="text-purple-500" /> Carpeta Inteligente
                                    </button>
                                    <button onClick={() => setShowPlusMenu(false)} className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-2xl transition-colors flex items-center gap-3">
                                        <UploadCloud size={18} className="text-emerald-500" /> Conectar Drive
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                    {/* Main Content Area */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Upload Area */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={cn(
                                "relative group overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                "rounded-[3rem] border-2 border-dashed p-12 text-center",
                                isDragging
                                    ? "border-indigo-500 bg-indigo-50/30 scale-[0.99]"
                                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-2xl hover:shadow-gray-200/50"
                            )}
                        >
                            <div className="space-y-6">
                                <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                                    <UploadCloud size={32} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Desbloquea el conocimiento</h3>
                                    <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">Arrastra tus archivos aquí para que nuestra IA los organice de forma inteligente.</p>
                                </div>
                                <label className="inline-flex px-10 py-4 bg-gray-900 text-white rounded-[1.5rem] font-bold text-sm hover:bg-black shadow-lg shadow-gray-200 transition-all active:scale-95 cursor-pointer">
                                    Subida Inteligente
                                    <input type="file" multiple className="hidden" onChange={handleFileSelect} />
                                </label>
                            </div>
                        </div>

                        {/* Recent Items List */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-4">
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Actividad Reciente</h3>
                                <button onClick={() => setShowAllRecent(!showAllRecent)} className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">
                                    {showAllRecent ? 'Ver Menos' : 'Ver Todo'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {recentFiles.map(file => (
                                    <div
                                        key={file.id}
                                        onClick={() => setSelectedFileId(file.id)}
                                        className={cn(
                                            "group p-5 bg-white border border-gray-200/50 rounded-[2rem] flex items-center justify-between cursor-pointer",
                                            "transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-0.5",
                                            selectedFileId === file.id && "ring-2 ring-indigo-500 bg-indigo-50/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={cn(
                                                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                                                file.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                            )}>
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{file.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{file.folder}</span>
                                                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{file.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 pr-2">
                                            <div className="flex gap-1">
                                                {file.tags?.slice(0, 1).map((tag: string) => (
                                                    <span key={tag} className="px-2 py-1 bg-gray-100 text-[10px] font-bold text-gray-500 rounded-lg uppercase">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <ArrowUpRight size={20} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Library / Folder Visualization */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-4">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                                    {currentVisualFolder ? (
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => {
                                                    if (currentVisualSubfolder) {
                                                        setCurrentVisualSubfolder(null);
                                                    } else {
                                                        setCurrentVisualFolder(null);
                                                    }
                                                }}
                                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                                            >
                                                <ArrowLeft size={24} />
                                            </button>
                                            {currentVisualSubfolder ? `${currentVisualFolder} / ${currentVisualSubfolder}` : currentVisualFolder}
                                        </div>
                                    ) : 'Tu Biblioteca Principal'}
                                </h3>
                            </div>

                            {!currentVisualFolder ? (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-1">
                                    {foldersList.map(folder => (
                                        <div
                                            key={folder}
                                            onClick={() => setCurrentVisualFolder(folder)}
                                            className="group bg-white p-6 rounded-[2rem] border border-gray-200/50 shadow-sm cursor-pointer hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center"
                                        >
                                            <div className="w-16 h-16 bg-blue-50/50 group-hover:bg-blue-100/50 rounded-3xl flex items-center justify-center mb-4 transition-colors">
                                                <Folder size={32} className="text-blue-500 fill-blue-500/20 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 text-sm truncate w-full">{folder}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                                {(folders[folder] || []).length} subcarpetas
                                            </p>
                                        </div>
                                    ))}
                                    {foldersList.length === 0 && (
                                        <div className="col-span-full border-2 border-dashed border-gray-200 bg-gray-50/50 text-center p-12 rounded-[2rem]">
                                            <p className="text-sm font-bold text-gray-400">No tienes carpetas creadas. Usa el botón '+' para empezar.</p>
                                        </div>
                                    )}
                                </div>
                            ) : !currentVisualSubfolder ? (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-1 animate-fade-in">
                                    {(folders[currentVisualFolder] || []).map(subfolder => (
                                        <div
                                            key={subfolder}
                                            onClick={() => setCurrentVisualSubfolder(subfolder)}
                                            className="group bg-white p-6 rounded-[2rem] border border-gray-200/50 shadow-sm cursor-pointer hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center"
                                        >
                                            <div className="w-16 h-16 bg-purple-50/50 group-hover:bg-purple-100/50 rounded-3xl flex items-center justify-center mb-4 transition-colors">
                                                <Folder size={32} className="text-purple-500 fill-purple-500/20 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 text-sm truncate w-full">{subfolder}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                                {files.filter(f => f.folder === currentVisualFolder && f.subfolder === subfolder).length} archivos
                                            </p>
                                        </div>
                                    ))}
                                    {(folders[currentVisualFolder] || []).length === 0 && (
                                        <div className="col-span-full border-2 border-dashed border-gray-200 bg-gray-50/50 text-center p-12 rounded-[2rem]">
                                            <p className="text-sm font-bold text-gray-400">Esta carpeta no tiene subcarpetas.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in px-1">
                                    {files.filter(f => f.folder === currentVisualFolder && f.subfolder === currentVisualSubfolder).map(file => (
                                        <div key={file.id} className="bg-white border border-gray-200/50 rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:shadow-gray-200/50 transition-all cursor-pointer">
                                            <div className="h-44 bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden group-hover:bg-indigo-50/30 transition-colors border-b border-gray-100">
                                                <FileText size={48} className="text-gray-300 group-hover:text-indigo-300 transition-colors group-hover:scale-110 duration-500 mb-2" strokeWidth={1} />
                                                <span className="text-xs text-gray-400 font-medium">Previsualización del Documento</span>
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/40 backdrop-blur-[2px]">
                                                    <button onClick={() => setSelectedFileId(file.id)} className="px-6 py-3 bg-gray-900 text-white rounded-full font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all">Abrir Lector</button>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h4 className="font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{file.name}</h4>
                                                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{file.summary || "Generando resumen inteligente..."}</p>
                                                <div className="flex items-center gap-2 mt-4">
                                                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-widest">{file.type}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{file.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {files.filter(f => f.folder === currentVisualFolder && f.subfolder === currentVisualSubfolder).length === 0 && (
                                        <div className="col-span-1 border-2 border-dashed border-gray-200 bg-gray-50/50 text-center p-12 rounded-[2rem]">
                                            <p className="text-sm font-bold text-gray-400">Esta subcarpeta está vacía.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Side Info Layer */}
                    <div className="space-y-8">
                        {/* Insights Card */}
                        <div className="bg-white rounded-[3rem] border border-gray-200/50 p-8 shadow-sm space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Sugerencias IA</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Octubre 2026</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-5 bg-[#F5F5F7] rounded-3xl space-y-2">
                                    <p className="text-xs font-bold text-gray-900">Organización inteligente</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">Hemos detectado 4 facturas nuevas que podrían ir en la carpeta 'Impuestos'.</p>
                                </div>
                                <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all">
                                    Revisar Ahora
                                </button>
                            </div>
                        </div>

                        {/* Quota Card */}
                        <div className="bg-gray-900 rounded-[3rem] p-8 text-white space-y-8 shadow-2xl shadow-gray-900/20">
                            <div className="flex justify-between items-center">
                                <h4 className="text-xs font-bold uppercase tracking-[0.2em] opacity-40">Tu Cuota</h4>
                                <Zap size={18} className="text-indigo-400 fill-indigo-400" />
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-end mb-3 px-1">
                                        <span className="text-3xl font-black">40<span className="text-sm opacity-40 ml-1">/100</span></span>
                                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Slots Usados</span>
                                    </div>
                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{ width: '40%' }} />
                                    </div>
                                </div>
                                {userPlan === 'Free' && (
                                    <button onClick={() => onNavigate('pricing')} className="w-full py-4 bg-white text-gray-900 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                                        Mejorar a Pro
                                        <Zap size={14} className="fill-current" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* File Detail Modal */}
            {selectedFile && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 outline-none">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl animate-fade-in" onClick={() => setSelectedFileId(null)} />
                    <div className="relative w-full max-w-3xl bg-white rounded-[4rem] shadow-2xl overflow-hidden animate-slide-up border border-white max-h-[90vh] flex flex-col">
                        <div className="p-10 pb-0 flex justify-between items-start">
                            <div className="flex items-center gap-6">
                                <div className={cn(
                                    "w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg",
                                    selectedFile.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                )}>
                                    <FileText size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">{selectedFile.name}</h3>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedFile.folder}</span>
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Analizado</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedFileId(null)} className="p-3 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-10 flex-1 overflow-y-auto custom-scrollbar space-y-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 opacity-40">
                                    <Sparkles size={16} />
                                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Resumen de Inteligencia</span>
                                </div>
                                <div className="bg-[#F5F5F7] p-8 rounded-[2.5rem] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                                    <p className="text-lg text-gray-800 leading-relaxed font-medium">{selectedFile.summary}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tamaño</p>
                                    <p className="text-sm font-bold text-gray-900">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fecha</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedFile.date}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Modelo</p>
                                    <p className="text-sm font-bold text-gray-900">Claude 3.5</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Confianza</p>
                                    <p className="text-sm font-bold text-emerald-600">98%</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 pt-0 flex gap-4">
                            <button className="flex-1 py-5 bg-gray-900 text-white rounded-3xl font-bold hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-xl shadow-gray-200">
                                <Download size={20} />
                                Visualizar Documento
                            </button>
                            <div className="flex gap-4">
                                <button className="w-16 h-16 bg-white border border-gray-200 rounded-3xl flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all">
                                    <Share2 size={24} />
                                </button>
                                <button className="w-16 h-16 bg-white border border-gray-200 rounded-3xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-all">
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Smart Upload Modal */}
            <AnimatePresence>
                {smartUploadState !== 'idle' && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
                        />
                        {smartUploadState === 'analyzing' && (
                            <motion.div key="analyzing" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="relative z-10 w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-10 flex flex-col items-center justify-center text-center overflow-hidden border border-white"
                            >
                                <motion.div animate={{ y: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-0 w-full h-[30%] bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent blur-md pointer-events-none"
                                />
                                <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center justify-center mb-8 relative">
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                        className="absolute -inset-2 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(99,102,241,0.3)_360deg)] rounded-[3rem] blur-md"
                                    />
                                    <Bot size={40} className="text-indigo-600 relative z-10" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Claude está analizando...</h3>
                                <p className="text-gray-500 font-medium">Clasificando {uploadedFiles.length} documentos encontrados.</p>
                            </motion.div>
                        )}

                        {smartUploadState === 'suggestions' && (
                            <motion.div key="suggestions" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                                className="relative z-10 w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl p-0 overflow-hidden border border-gray-200/50 flex flex-col h-[85vh] max-h-[800px]"
                            >
                                <div className="p-10 pb-6 border-b border-gray-100 flex justify-between items-center bg-white z-20">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg">
                                            <Sparkles size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Sugerencia de Organización</h3>
                                            <p className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-widest leading-relaxed">Evaluación IA basada en tu historial.</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSmartUploadState('idle')} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-[#F5F5F7] space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Folder size={20} className="text-blue-500" />
                                            <h4 className="text-lg font-extrabold text-gray-900">
                                                Sugerencia: Crear <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">Contabilidad 2026</span>
                                            </h4>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {uploadedFiles.filter(f => f.suggestionFolder === 'Contabilidad 2026').map(file => (
                                                <div key={file.id} className="bg-white p-5 rounded-[1.5rem] border border-gray-200 shadow-sm flex items-start gap-4 hover:border-indigo-300 transition-all cursor-pointer">
                                                    <FileText size={24} className="text-indigo-400 shrink-0 mt-1" />
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-gray-900 text-sm truncate">{file.name}</p>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{file.type}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Folder size={20} className="text-purple-500" />
                                            <h4 className="text-lg font-extrabold text-gray-900">
                                                Mover a existente: <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">Legal</span>
                                            </h4>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {uploadedFiles.filter(f => f.suggestionFolder === 'Legal').map(file => (
                                                <div key={file.id} className="bg-white p-5 rounded-[1.5rem] border border-gray-200 shadow-sm flex items-start gap-4 hover:border-indigo-300 transition-all cursor-pointer">
                                                    <FileText size={24} className="text-indigo-400 shrink-0 mt-1" />
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-gray-900 text-sm truncate">{file.name}</p>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{file.type}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 border-t border-gray-100 bg-white flex justify-end gap-4 z-20">
                                    <button onClick={() => setSmartUploadState('idle')} className="px-8 py-5 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all">Cancelar</button>
                                    <button onClick={confirmSmartUpload} className="px-10 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-sm hover:bg-black shadow-xl shrink-0 transition-all active:scale-95 flex items-center gap-3">
                                        <Sparkles size={18} />
                                        Aceptar y Rutear Todo
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {smartUploadState === 'routing' && (
                            <motion.div key="routing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 text-center">
                                <motion.div initial={{ scale: 0.5, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
                                    <div className="w-24 h-24 bg-emerald-400 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(52,211,153,0.5)]">
                                        <ShieldCheck size={48} />
                                    </div>
                                    <h3 className="text-4xl font-black text-white tracking-tight">¡Organizado Correctamente!</h3>
                                </motion.div>
                            </motion.div>
                        )}
                    </div>
                )}
            </AnimatePresence>

            {/* Image Limit Modal */}
            {showImageLimitModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl animate-fade-in" onClick={() => setShowImageLimitModal(false)} />
                    <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-10 animate-slide-up border border-white text-center">
                        <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-indigo-100">
                            <Zap size={40} className="text-indigo-600 fill-indigo-600" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Límite de Imágenes</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-10">
                            Has alcanzado el límite de 3 imágenes mensuales del Plan Free. Mejora a Pro para obtener análisis ilimitado con GPT-4o Vision.
                        </p>
                        <div className="space-y-4">
                            <button onClick={() => { setShowImageLimitModal(false); onNavigate('pricing'); }}
                                className="w-full py-5 bg-gray-900 text-white rounded-3xl font-bold shadow-xl hover:bg-black transition-all active:scale-[0.98]">
                                Mejorar a Pro - $7/mes
                            </button>
                            <button onClick={() => setShowImageLimitModal(false)} className="w-full py-5 bg-gray-100 text-gray-500 rounded-3xl font-bold hover:bg-gray-200 transition-all">
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
