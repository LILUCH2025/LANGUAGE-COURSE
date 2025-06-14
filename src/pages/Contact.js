import { useState } from 'react';
import { auth, db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import './Contact.css';

function Contact() {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const user = auth.currentUser; // المستخدم الحالي

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!user) {
      setError('يجب تسجيل الدخول أولاً لإرسال رسالة.');
      return;
    }

    try {
      await addDoc(collection(db, 'messages'), {
        uid: user.uid,
        email: user.email,
        message: message,
        createdAt: serverTimestamp(),
      });
      setSuccess('تم إرسال الرسالة بنجاح!');
      setMessage('');
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء إرسال الرسالة.');
    }
  };

  return (
    <div className="page">
      <h2>تواصل معنا</h2>
      <form onSubmit={handleSubmit}>
        <textarea
  className="contact-textarea"
  placeholder="اكتب رسالتك هنا..."
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  rows="5"
  required
></textarea>
        <button type="submit" className="btn">إرسال</button>
      </form>
      {success && <p style={{ color: 'green', marginTop: '15px' }}>{success}</p>}
    {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
    </div>
  );
}

export default Contact;  