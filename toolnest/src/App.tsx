import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import AllTools from './pages/AllTools';
import { CategoriesIndex, CategoryPage } from './pages/Categories';
import ToolPage from './pages/ToolPage';
import { About, Contact } from './pages/Static';
import { Disclaimer, Privacy, Terms } from './pages/Legal';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tools" element={<AllTools />} />
        <Route path="tools/:slug" element={<ToolPage />} />
        <Route path="categories" element={<CategoriesIndex />} />
        <Route path="categories/:id" element={<CategoryPage />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="disclaimer" element={<Disclaimer />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
