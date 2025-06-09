import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

function Courses() {
  const [courseList, setCourseList] = useState([
    {
      name: 'الإنجليزية',
      description: 'تعلم الإنجليزية من الصفر.',
      lessons: ['مقدمة في الإنجليزية', 'الأبجدية والنطق', 'المحادثة الأساسية', 'قواعد اللغة الإنجليزية']
    },
    {
      name: 'الفرنسية',
      description: 'دروس تفاعلية للفرنسية.',
      lessons: ['مقدمة في الفرنسية', 'الأبجدية والنطق', 'المفردات الأساسية', 'التعابير اليومية']
    },
    {
      name: 'الألمانية',
      description: 'ابدأ بالألمانية بسهولة.',
      lessons: ['مقدمة في الألمانية', 'الأبجدية والنطق', 'الجمل الأساسية', 'قواعد اللغة الألمانية']
    }
  ]);

  const [studentsData, setStudentsData] = useState({});
  const [names, setNames] = useState(Array(courseList.length).fill(''));
  const [message, setMessage] = useState('');

  // جلب أسماء المسجلين من Firestore
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

      // تحديث الواجهة فورًا
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

  return (
    <div className="page">
      <h2>الدورات المتاحة</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <div className="cards">
        {courseList.map((course, index) => (
          <div key={index} className="card" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
            <h3>{course.name}</h3>
            <p>{course.description}</p>

            <h4>الدروس:</h4>
            <ul>
              {course.lessons.map((lesson, idx) => (
                <li key={idx}>{lesson}</li>
              ))}
            </ul>

            <h4>المسجلون في الدورة:</h4>
            {studentsData[course.name]?.length > 0 ? (
              <ul>
                {studentsData[course.name].map((student, idx) => (
                  <li key={idx}>{student}</li>
                ))}
              </ul>
            ) : (
              <p>لا يوجد مسجلون حالياً.</p>
            )}

            <input
              type="text"
              placeholder="اسمك للتسجيل في الدورة"
              value={names[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
            <button onClick={() => handleRegister(index)}>سجل الآن</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;