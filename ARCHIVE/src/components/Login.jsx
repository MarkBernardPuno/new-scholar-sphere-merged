import { useState, useRef, useEffect } from 'react';
import { authAPI, lookupAPI } from '../services/api.js';

const _style = document.createElement('style');
_style.innerHTML = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; height: 100%; overflow: hidden; }
  input[type="file"] { display: none; }
  .sideBtn:hover  { background-color: #fdf3d8 !important; color: #b8860b !important; }
  .actionBtn:hover { opacity: 0.8; }
  .uploadArea:hover { border-color: #d4a017 !important; background: #fdf8ec !important; }
  tr:hover td { background-color: #fffcf2 !important; }
  select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
  .settingsBtn:hover { background-color: #f5f5f5 !important; }
  .overlay-panel { animation: slideIn 0.25s ease; }
  @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
`;
document.head.appendChild(_style);

const loginBg = '/cover.png';
const signupBg = '/back.png';
const landingBg = '/backdesign.png';
const logo = '/tipLogo.png';
const F = 'Georgia, serif';

const MENU_ITEMS = [
  'Author', 'Campus', 'College', 'Department',
  'Research Output', 'Research', 'Role', 'School Year', 'Semester',
];

let _uid = 1;
const uid = () => _uid++;

// ── SVG Illustrations ──────────────────────────────────────────────

const LoginIllustration = () => (
  <div style={{
    width: '100%', height: '100%',
    backgroundImage: `url(${loginBg})`,
    backgroundSize: 'cover',
  }} />
);

// ...rest of the file...
