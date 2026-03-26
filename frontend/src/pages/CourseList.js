import React, { useState, useEffect } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import LeadForm from '../components/LeadForm';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get('/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  if (loading) {
    return <div style={styles.container}>Loading courses...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Available Courses</h1>
        <p>Choose from our wide range of courses</p>
      </div>
      
      <div style={styles.courseGrid}>
        {courses.map((course) => (
          <div key={course._id} style={styles.courseCard}>
            <h3 style={styles.courseTitle}>{course.title}</h3>
            <p style={styles.description}>{course.description.substring(0, 120)}...</p>
            <div style={styles.courseInfo}>
              <span>👨‍🏫 {course.instructor}</span>
              <span>⏱️ {course.duration}</span>
              <span>📚 {course.totalModules} modules</span>
              <span>👥 {course.enrolledCount} enrolled</span>
            </div>
            <Link to={`/course/${course._id}`} style={styles.viewBtn}>
              View Details →
            </Link>
          </div>
        ))}
      </div>
      
      <LeadForm />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem'
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  },
  courseCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s'
  },
  courseTitle: {
    color: '#2c3e50',
    marginBottom: '1rem'
  },
  description: {
    color: '#7f8c8d',
    lineHeight: '1.6',
    marginBottom: '1rem'
  },
  courseInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
    color: '#95a5a6'
  },
  viewBtn: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    background: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    textAlign: 'center',
    transition: 'background 0.3s'
  }
};

export default CourseList;