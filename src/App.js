import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';  // استيراد صفحة التسجيل الجديدة
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />  {/* إضافة المسار */}
      </Routes>
    </Router>
  );
}

export default App;