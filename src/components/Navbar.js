import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="navbar-logo">📘 دورة اللغات</h1>
      <div className="navbar-links">
        <Link to="/">الرئيسية</Link>
        <Link to="/courses">الدورات</Link>
        <Link to="/contact">تواصل</Link>
        <Link to="/login">تسجيل الدخول</Link>
        <Link to="/logout" className="logout-btn">تسجيل الخروج</Link>
      </div>
    </nav>
  );
}

export default Navbar;
