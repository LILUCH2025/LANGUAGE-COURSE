import { useParams } from 'react-router-dom';
import courseList from '../data/courseList';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import './CourseDetails.css'; // استيراد ملف CSS

function CourseDetails() {
  const { id } = useParams();
  const course = courseList.find(c => c.id === id);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!course) return;

      try {
        const q = query(
          collection(db, 'registrations'),
          where('course', '==', course.name)
        );
        const snapshot = await getDocs(q);
        const names = snapshot.docs.map(doc => doc.data().name);
        setStudents(names);
      } catch (error) {
        console.error("فشل تحميل المسجلين:", error);
      }
    };

    fetchStudents();
  }, [course]);

  if (!course) {
    return <h2 style={{ color: 'red' }}>❌ الدورة غير موجودة</h2>;
  }

  return (
    <div className="course-details-container">
      <div className="course-box">
        <h2>{course.name}</h2>
        <p>{course.description}</p>
      </div>

      <div className="course-box">
        <h3>📚 الدروس</h3>
        <ul>
          {course.lessons.map((lesson, index) => (
            <li key={index}>{lesson}</li>
          ))}
        </ul>
      </div>

      <div className="course-box">
        <h3>👨‍🎓 الطلاب المسجلون</h3>
        {students.length > 0 ? (
          <ul>
            {students.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
        ) : (
          <p>لا يوجد طلاب مسجلين حالياً.</p>
        )}
      </div>
    </div>
  );
}

export default CourseDetails;
