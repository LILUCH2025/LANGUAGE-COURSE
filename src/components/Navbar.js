import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <h1>📘 دورة اللغات</h1>
      <div>
        <Link to="/">الرئيسية</Link>
        <Link to="/courses">الدورات</Link>
        <Link to="/contact">تواصل</Link>
        <Link to="/login">تسجيل الدخول</Link>
      </div>
    </nav>
  );
}

export default Navbar;