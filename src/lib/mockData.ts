import { FileText, Image, FileSpreadsheet, File as FileIcon } from 'lucide-react';
import { DocFile, Rule, Activity } from '../types';

// CURSOR-TODO: Estos datos son simulados (Mocks). 
// Cuando implementes el backend, debes reemplazar estas variables por estados de React (useState)
// que se llenen haciendo fetch a tus endpoints de Express/Supabase.

export const MOCK_FILES: DocFile[] = [
  {
    id: '1',
    name: 'Contrato_Venta_Inmueble.pdf',
    folder: 'Legal',
    subfolder: 'Contratos',
    type: 'pdf',
    size: 2500000,
    date: 'Hace 2 horas',
    summary: 'Contrato de compra-venta. Partes: Juan Pérez y María González.',
    tags: ['Importante', 'Firmado'],
    status: 'completed'
  },
  {
    id: '2',
    name: 'Factura_Servicios_Marzo.pdf',
    folder: 'Facturas',
    subfolder: 'Pendientes',
    type: 'pdf',
    size: 1200000,
    date: 'Hace 5 horas',
    summary: 'Factura por servicios de consultoría. Total: $1,500.',
    tags: ['Por pagar'],
    status: 'completed'
  },
  {
    id: '3',
    name: 'Presupuesto_Anual_2024.xlsx',
    folder: 'Oficina',
    subfolder: 'Reportes',
    type: 'xlsx',
    size: 3400000,
    date: 'Ayer',
    summary: 'Presupuesto anual 2024. Gastos proyectados: $45,000.',
    tags: ['Finanzas'],
    status: 'completed'
  },
  {
    id: '4',
    name: 'Apuntes_Derecho_Penal.docx',
    folder: 'Estudio',
    subfolder: 'Apuntes',
    type: 'docx',
    size: 800000,
    date: 'Ayer',
    summary: 'Apuntes sobre teoría del delito y casos prácticos.',
    tags: ['Universidad'],
    status: 'completed'
  }
];

export const MOCK_RULES: Rule[] = [
  {
    id: '1',
    keyword: 'factura',
    targetFolder: 'Facturas',
    targetSubfolder: 'Pendientes',
    active: true
  },
  {
    id: '2',
    keyword: 'contrato',
    targetFolder: 'Legal',
    targetSubfolder: 'Contratos',
    active: true
  }
];

export const MOCK_FOLDERS = {
  'Estudio': ['Apuntes', 'Exámenes', 'Trabajos'],
  'Legal': ['Contratos', 'Casos', 'Jurisprudencia'],
  'Facturas': ['Pagadas', 'Pendientes'],
  'Oficina': ['Reportes', 'Reuniones']
};

export const MOCK_ANALYTICS_DATA = [
  { name: 'Lun', estudio: 12, oficina: 8, facturas: 4, legal: 2 },
  { name: 'Mar', estudio: 18, oficina: 12, facturas: 7, legal: 5 },
  { name: 'Mié', estudio: 15, oficina: 15, facturas: 3, legal: 8 },
  { name: 'Jue', estudio: 25, oficina: 10, facturas: 12, legal: 4 },
  { name: 'Vie', estudio: 20, oficina: 18, facturas: 8, legal: 6 },
  { name: 'Sáb', estudio: 10, oficina: 5, facturas: 2, legal: 1 },
  { name: 'Dom', estudio: 8, oficina: 3, facturas: 1, legal: 0 },
];

export const MOCK_MONTHLY_DATA = [
  { name: 'Sem 1', estudio: 45, oficina: 30, facturas: 15, legal: 10 },
  { name: 'Sem 2', estudio: 52, oficina: 35, facturas: 20, legal: 12 },
  { name: 'Sem 3', estudio: 48, oficina: 40, facturas: 18, legal: 15 },
  { name: 'Sem 4', estudio: 60, oficina: 45, facturas: 25, legal: 20 },
];
