import React, { useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '4 weeks',
    totalModules: 10
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    fetchCourses();
  }, [user, navigate]);

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/courses', formData);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        instructor: '',
        duration: '4 weeks',
        totalModules: 10
      });
      fetchCourses();
      alert('Course created successfully!');
    } catch (err) {
      console.error('Error creating course:', err);
      alert('Failed to create course');
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await API.delete(`/courses/${courseId}`);
        fetchCourses();
        alert('Course deleted successfully!');
      } catch (err) {
        console.error('Error deleting course:', err);
        alert('Failed to delete course');
      }
    }
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Admin - Course Management</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
          {showForm ? 'Cancel' : '+ Add New Course'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formContainer}>
          <h3>Create New Course</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              name="title"
              placeholder="Course Title"
              value={formData.title}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
            <textarea
              name="description"
              placeholder="Course Description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              style={styles.textarea}
            />
            <input
              type="text"
              name="instructor"
              placeholder="Instructor Name"
              value={formData.instructor}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
            <input
              type="text"
              name="duration"
              placeholder="Duration (e.g., 4 weeks)"
              value={formData.duration}
              onChange={handleInputChange}
              style={styles.input}
            />
            <input
              type="number"
              name="totalModules"
              placeholder="Total Modules"
              value={formData.totalModules}
              onChange={handleInputChange}
              style={styles.input}
            />
            <button type="submit" style={styles.submitBtn}>Create Course</button>
          </form>
        </div>
      )}

      <div style={styles.courseGrid}>
        {courses.map(course => (
          <div key={course._id} style={styles.courseCard}>
            <h3>{course.title}</h3>
            <p><strong>Instructor:</strong> {course.instructor}</p>
            <p><strong>Duration:</strong> {course.duration}</p>
            <p><strong>Modules:</strong> {course.totalModules}</p>
            <p><strong>Enrolled:</strong> {course.enrolledCount} students</p>
            <p style={styles.description}>{course.description.substring(0, 100)}...</p>
            <button onClick={() => handleDelete(course._id)} style={styles.deleteBtn}>
              Delete Course
            </button>
          </div>
        ))}
      </div>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  addBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  formContainer: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  textarea: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'inherit'
  },
  submitBtn: {
    padding: '0.75rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem'
  },
  courseCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0',
    position: 'relative'
  },
  description: {
    color: '#7f8c8d',
    marginTop: '0.5rem'
  },
  deleteBtn: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%'
  }
};

export default AdminCourses;