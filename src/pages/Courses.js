import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc
} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import courseList from '../data/courseList';

function Courses() {
  const [studentsData, setStudentsData] = useState({});
  const [names, setNames] = useState(Array(courseList.length).fill(''));
  const [message, setMessage] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      const snapshot = await getDocs(collection(db, 'registrations'));
      const data = {};

      snapshot.forEach((doc) => {
        const { course, name } = doc.data();
        if (!data[course]) data[course] = [];
        data[course].push(name);
      });

      setStudentsData(data);
    };

    fetchRegistrations();
  }, []);

  const handleInputChange = (index, value) => {
    const updated = [...names];
    updated[index] = value;
    setNames(updated);
  };

  const handleRegister = async (index) => {
    const user = auth.currentUser;
    if (!user) {
      setMessage('يجب تسجيل الدخول أولاً.');
      return;
    }

    const name = names[index].trim();
    const courseName = courseList[index].name;

    if (!name) {
      setMessage('يرجى إدخال اسمك.');
      return;
    }

    try {
      await addDoc(collection(db, 'registrations'), {
        course: courseName,
        name,
        email: user.email,
        uid: user.uid,
        createdAt: new Date()
      });

      setStudentsData(prev => ({
        ...prev,
        [courseName]: [...(prev[courseName] || []), name]
      }));

      const updatedNames = [...names];
      updatedNames[index] = '';
      setNames(updatedNames);
      setMessage(`تم تسجيلك بنجاح في دورة ${courseName}`);
    } catch (error) {
      console.error(error);
      setMessage('حدث خطأ أثناء التسجيل.');
    }
  };

  const startEditing = (course, idx, currentName) => {
    setEditingIndex(`${course}-${idx}`);
    setEditedName(currentName);
  };

  const saveEditedName = async (course, idx) => {
    const studentName = studentsData[course][idx];

    const q = query(
      collection(db, 'registrations'),
      where('course', '==', course),
      where('name', '==', studentName)
    );

    const snapshot = await getDocs(q);
    snapshot.forEach(async (docSnap) => {
      await addDoc(collection(db, 'registrations'), {
        ...docSnap.data(),
        name: editedName,
        createdAt: new Date()
      });
      await deleteDoc(docSnap.ref);
    });

    const updatedList = [...studentsData[course]];
    updatedList[idx] = editedName;
    setStudentsData({ ...studentsData, [course]: updatedList });
    setEditingIndex(null);
    setEditedName('');
  };

  const deleteStudent = async (course, studentName) => {
    const confirmDelete = window.confirm(`هل تريد حذف ${studentName} من دورة ${course}؟`);
    if (!confirmDelete) return;

    const q = query(
      collection(db, 'registrations'),
      where('course', '==', course),
      where('name', '==', studentName)
    );

    const snapshot = await getDocs(q);
    snapshot.forEach(async (docSnap) => {
      await deleteDoc(docSnap.ref);
    });

    const updated = {
      ...studentsData,
      [course]: studentsData[course].filter((name) => name !== studentName)
    };
    setStudentsData(updated);
  };

  return (
    <div className="page">
      <h2>الدورات المتاحة</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <div className="cards">
        {courseList.map((course, index) => (
          <div key={index} className="card" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
            <h3>{course.name}</h3>
            <p>{course.description}</p>

            <h4>الدروس</h4>
            <ul>
              {course.lessons.map((lesson, idx) => (
                <li key={idx}>{lesson}</li>
              ))}
            </ul>

            <h4>المسجلون في الدورة</h4>
            {studentsData[course.name]?.length > 0 ? (
              <ul>
                {studentsData[course.name]
                  .filter((student) => student && student.trim() !== '')
                  .map((student, idx) => (
                    <li key={idx}>
                      {editingIndex === `${course.name}-${idx}` ? (
                        <>
                          <input
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                          />
                          <button onClick={() => saveEditedName(course.name, idx)}>💾 حفظ</button>
                          <button onClick={() => setEditingIndex(null)}>❌ إلغاء</button>
                        </>
                      ) : (
                        <>
                          {student}{' '}
                          <button onClick={() => startEditing(course.name, idx, student)}>📝</button>{' '}
                          <button onClick={() => deleteStudent(course.name, student)}>🗑️</button>
                        </>
                      )}
                    </li>
                  ))}
              </ul>
            ) : (
              <p>لا يوجد مسجلون حالياً.</p>
            )}

            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <input
                type="text"
                placeholder="اسمك للتسجيل في الدورة"
                value={names[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                style={{
                  padding: '12px',
                  width: '80%',
                  fontSize: '18px',
                  borderRadius: '10px',
                  border: '2px solid #ff69b4',
                  marginBottom: '10px',
                  outline: 'none',
                }}
              />
              <br />
              <button
                onClick={() => handleRegister(index)}
                style={{
                  backgroundColor: '#ff69b4',
                  color: 'white',
                  border: 'none',
                  padding: '12px 25px',
                  fontSize: '18px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#ff4d94')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#ff69b4')}
              >
                ✅ سجل الآن
              </button>
            </div>

            {/* ✅ هذا هو الجزء الجديد المبسط لزر "📘 المزيد" */}
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              <Link to={`/courses/${course.id}`}>📘 المزيد</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;

