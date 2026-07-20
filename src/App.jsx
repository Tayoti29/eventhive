import { Routes, Route, useLocation } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import CategoryEvents from './pages/CategoryEvents'
import EventDetail from './pages/EventDetail'
import CreateEvent from './pages/CreateEvent'
import Memes from './pages/Memes'
import MemeDetail from './pages/MemeDetail'
import CreateMeme from './pages/CreateMeme'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import CreateBlog from './pages/CreateBlog'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Search from './pages/Search'
import Saved from './pages/Saved'
import MyUploads from './pages/MyUploads'
import ContactUs from './pages/ContactUs'
import AdminLogin from './pages/AdminLogin'
import AdminAds from './pages/AdminAds'


function App() {
  const location = useLocation()
  const backgroundLocation = location.state?.backgroundLocation

  return (
    <>
      <ScrollToTop />
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<CategoryEvents />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/memes" element={<Memes />} />
        <Route path="/memes/create" element={<CreateMeme />} />
        <Route path="/memes/:id" element={<MemeDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/create" element={<CreateBlog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/my-uploads" element={<MyUploads />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/ads" element={<AdminAds />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </>
  )
}

export default App