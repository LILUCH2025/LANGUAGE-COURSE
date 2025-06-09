import { useState } from 'react';
import { auth } from '../firebase';  // تأكد أنك عندك ملف firebase.js في المشروع
import { createUserWithEmailAndPassword } from 'firebase/auth';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('تم إنشاء الحساب بنجاح، يمكنك الآن تسجيل الدخول');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <h2>إنشاء حساب جديد</h2>
      <form onSubmit={handleSignUp}>
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
          minLength={6}  // على الأقل 6 أحرف
        />
        <button type="submit" className="btn">تسجيل</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

export default SignUp;