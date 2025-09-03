// routes.ts
import React from 'react';
import Home from './pages/Home';
import Fretboard from './pages/Fretboard';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import Contact from './pages/Contact';

export interface RouteItem {
  path: string;
  label: string;
  component: React.ComponentType;
}

export const routes: RouteItem[] = [
  { path: '/', label: 'Home', component: Home },
  { path: '/about', label: 'Fretboard', component: Fretboard },
  { path: '/services', label: '???', component: Services },
  { path: '/portfolio', label: '???', component: Portfolio },
  { path: '/blog', label: '???', component: Blog },
  { path: '/contact', label: 'Quiz', component: Contact },
];

