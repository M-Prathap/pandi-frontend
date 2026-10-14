import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import GalleryPage from './pages/public/GalleryPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import ProjectStagePage from './pages/public/ProjectStagePage';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProjectsPage from './pages/admin/ProjectsPage';
import ProjectEditPage from './pages/admin/ProjectEditPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import MediaPage from './pages/admin/MediaPage';
import PagesPage from './pages/admin/PagesPage';
import SettingsPage from './pages/admin/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<GalleryPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="project/:id" element={<ProjectStagePage />} />
            </Route>

            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/new" element={<ProjectEditPage />} />
              <Route path="projects/:id" element={<ProjectEditPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="media" element={<MediaPage />} />
              <Route path="pages" element={<PagesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}
