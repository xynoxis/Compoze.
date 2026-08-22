import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './layouts/Layout';

// Import Pages
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Article } from './pages/Article';
import { Write } from './pages/Write';
import { Profile } from './pages/Profile';
import { Dashboard } from './pages/Dashboard';
import { Bookmarks } from './pages/Bookmarks';
import { Notifications } from './pages/Notifications';
import { Search } from './pages/Search';
import { Topic } from './pages/Topic';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/write" element={<Write />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/search" element={<Search />} />
            <Route path="/topics/:topic" element={<Topic />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
