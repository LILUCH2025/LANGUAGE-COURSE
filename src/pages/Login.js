import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('تم تسجيل الدخول بنجاح');
      setTimeout(() => {
        navigate('/courses'); // توجيه المستخدم إلى صفحة الدورات بعد تسجيل الدخول
      }, 1500);
    } catch (err) {
      setMessage('فشل تسجيل الدخول: ' + err.message);
    }
  };

  return (
    <div className="page">
      <h2>تسجيل الدخول</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn">دخول</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        لا تملك حساب؟ <Link to="/signup">أنشئ حساب جديد</Link>
      </p>
    </div>
  );
}

export default Login;