import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await API.get(`/courses/${id}`);
        setCourse(res.data);
        
        if (user) {
          const enrollmentsRes = await API.get('/enroll');
          const isEnrolled = enrollmentsRes.data.some(e => e.course._id === id);
          setEnrolled(isEnrolled);
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setMessage('Course not found');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseDetails();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setEnrolling(true);
    try {
      await API.post(`/enroll/${id}`);
      setEnrolled(true);
      setMessage('Successfully enrolled in the course! 🎉');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Enrollment failed');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading course details...</div>;
  }

  if (!course) {
    return <div style={styles.container}>Course not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>{course.title}</h1>
        
        <div style={styles.info}>
          <span>👨‍🏫 {course.instructor}</span>
          <span>⏱️ {course.duration}</span>
          <span>📚 {course.totalModules} modules</span>
          <span>👥 {course.enrolledCount} students enrolled</span>
        </div>
        
        <div style={styles.description}>
          <h3>Course Description</h3>
          <p>{course.description}</p>
        </div>
        
        {message && (
          <div style={message.includes('Successfully') ? styles.successMsg : styles.errorMsg}>
            {message}
          </div>
        )}
        
        {enrolled ? (
          <div style={styles.enrolledBox}>
            <p>✅ You are enrolled in this course!</p>
            <Link to={`/progress/${course._id}`} style={styles.progressBtn}>
              Track Your Progress
            </Link>
          </div>
        ) : (
          <button 
            onClick={handleEnroll} 
            disabled={enrolling}
            style={styles.enrollBtn}
          >
            {enrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>
        )}
        
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Back to Courses
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem'
  },
  card: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  title: {
    color: '#2c3e50',
    marginBottom: '1rem'
  },
  info: {
    display: 'flex',
    gap: '1.5rem',
    padding: '1rem 0',
    borderTop: '1px solid #e0e0e0',
    borderBottom: '1px solid #e0e0e0',
    marginBottom: '1.5rem',
    color: '#7f8c8d'
  },
  description: {
    marginBottom: '2rem'
  },
  enrollBtn: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.1rem',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '1rem'
  },
  progressBtn: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px'
  },
  backBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  enrolledBox: {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: '#d4edda',
    borderRadius: '4px',
    marginBottom: '1rem'
  },
  successMsg: {
    padding: '0.75rem',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  errorMsg: {
    padding: '0.75rem',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center'
  }
};

export default CourseDetail;