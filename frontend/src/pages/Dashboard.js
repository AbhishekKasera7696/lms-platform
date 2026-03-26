import React, { useState, useEffect } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [allEnrollments, setAllEnrollments] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-enrollments');
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user's own enrollments (for both admin and student)
        const myEnrollRes = await API.get('/enroll');
        setMyEnrollments(myEnrollRes.data);
        
        // If admin, fetch all enrollments and users
        if (isAdmin) {
          // Fetch all enrollments from admin API
          const allEnrollRes = await API.get('/admin/enrollments');
          setAllEnrollments(allEnrollRes.data);
          
          // Fetch all users
          const usersRes = await API.get('/admin/users');
          setAllUsers(usersRes.data);
          
          // Fetch all courses with stats
          const coursesRes = await API.get('/admin/courses');
          setAllCourses(coursesRes.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user, isAdmin]);

  if (loading) {
    return <div style={styles.container}>Loading your dashboard...</div>;
  }

  // Render admin dashboard
  if (isAdmin) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Admin Dashboard 👑</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>
        
        {/* Admin Tabs */}
        <div style={styles.tabs}>
          <button 
            onClick={() => setActiveTab('my-enrollments')}
            style={{...styles.tab, ...(activeTab === 'my-enrollments' ? styles.activeTab : {})}}
          >
            My Enrollments ({myEnrollments.length})
          </button>
          <button 
            onClick={() => setActiveTab('all-enrollments')}
            style={{...styles.tab, ...(activeTab === 'all-enrollments' ? styles.activeTab : {})}}
          >
            📊 All Enrollments ({allEnrollments.length})
          </button>
          <button 
            onClick={() => setActiveTab('all-users')}
            style={{...styles.tab, ...(activeTab === 'all-users' ? styles.activeTab : {})}}
          >
            👥 All Users ({allUsers.length})
          </button>
          <button 
            onClick={() => setActiveTab('all-courses')}
            style={{...styles.tab, ...(activeTab === 'all-courses' ? styles.activeTab : {})}}
          >
            📚 All Courses ({allCourses.length})
          </button>
        </div>
        
        {/* My Enrollments Tab */}
        {activeTab === 'my-enrollments' && (
          <div>
            <h2>My Enrolled Courses</h2>
            {renderCourseList(myEnrollments, 'my')}
          </div>
        )}
        
        {/* All Enrollments Tab - This shows ALL users' enrollments */}
        {activeTab === 'all-enrollments' && (
          <div>
            <h2>All Student Enrollments</h2>
            <p style={styles.subtitle}>Track all enrollments across the platform</p>
            {allEnrollments.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No enrollments yet.</p>
              </div>
            ) : (
              <div style={styles.enrollmentsList}>
                {allEnrollments.map((enrollment) => (
                  <div key={enrollment._id} style={styles.enrollmentCard}>
                    <div style={styles.enrollmentHeader}>
                      <div style={styles.userInfo}>
                        <div style={styles.userAvatar}>
                          {enrollment.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4>{enrollment.user.name}</h4>
                          <p style={styles.userEmail}>{enrollment.user.email}</p>
                          <span style={styles.roleBadge}>{enrollment.user.role}</span>
                        </div>
                      </div>
                      <div style={styles.enrollmentDate}>
                        Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div style={styles.courseInfo}>
                      <h3>{enrollment.course.title}</h3>
                      <p>Instructor: {enrollment.course.instructor}</p>
                      <p>Duration: {enrollment.course.duration}</p>
                      <p>Total Modules: {enrollment.course.totalModules}</p>
                    </div>
                    
                    <div style={styles.cardActions}>
                      <Link to={`/course/${enrollment.course._id}`} style={styles.viewBtn}>
                        View Course
                      </Link>
                      <Link to={`/progress/${enrollment.course._id}`} style={styles.progressBtn}>
                        Track Progress
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* All Users Tab */}
        {activeTab === 'all-users' && (
          <div>
            <h2>All Registered Users</h2>
            <div style={styles.userGrid}>
              {allUsers.map(user => (
                <div key={user._id} style={styles.userCard}>
                  <div style={styles.userAvatar}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={styles.userInfo}>
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                    <span style={{
                      ...styles.roleBadge,
                      backgroundColor: user.role === 'admin' ? '#e74c3c' : '#2ecc71'
                    }}>
                      {user.role}
                    </span>
                    <p style={styles.userDate}>
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* All Courses Tab */}
        {activeTab === 'all-courses' && (
          <div>
            <h2>All Courses</h2>
            <div style={styles.courseGrid}>
              {allCourses.map(course => (
                <div key={course._id} style={styles.courseCard}>
                  <h3>{course.title}</h3>
                  <p>Instructor: {course.instructor}</p>
                  <p>Duration: {course.duration}</p>
                  <p>Total Modules: {course.totalModules}</p>
                  <p>Total Enrollments: {course.totalEnrollments || course.enrolledCount || 0} students</p>
                  <Link to={`/course/${course._id}`} style={styles.viewBtn}>
                    View Course
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render student dashboard (only their own enrollments)
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Welcome back, {user?.name}! 👋</h1>
        <p>Track your learning journey</p>
      </div>
      
      <div style={styles.section}>
        <h2>My Enrolled Courses</h2>
        {renderCourseList(myEnrollments, 'student')}
      </div>
    </div>
  );

  // Helper function to render course list
  function renderCourseList(enrollments, type) {
    if (enrollments.length === 0) {
      return (
        <div style={styles.emptyState}>
          <p>You haven't enrolled in any courses yet.</p>
          <Link to="/courses" style={styles.browseBtn}>Browse Courses</Link>
        </div>
      );
    }
    
    return (
      <div style={styles.courseGrid}>
        {enrollments.map((enrollment) => (
          <div key={enrollment._id} style={styles.courseCard}>
            <h3>{enrollment.course.title}</h3>
            <p>Instructor: {enrollment.course.instructor}</p>
            <p>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
            {type === 'admin-all' && (
              <p>Student: {enrollment.user?.name || 'Unknown'}</p>
            )}
            <div style={styles.cardActions}>
              <Link to={`/course/${enrollment.course._id}`} style={styles.viewBtn}>
                View Course
              </Link>
              <Link to={`/progress/${enrollment.course._id}`} style={styles.progressBtn}>
                Track Progress
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }
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
  subtitle: {
    color: '#7f8c8d',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  tabs: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '2rem',
    borderBottom: '2px solid #e0e0e0',
    flexWrap: 'wrap'
  },
  tab: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#7f8c8d',
    transition: 'all 0.3s',
    fontWeight: '500'
  },
  activeTab: {
    color: '#3498db',
    borderBottom: '2px solid #3498db',
    marginBottom: '-2px'
  },
  section: {
    marginTop: '2rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    background: '#f9f9f9',
    borderRadius: '8px'
  },
  browseBtn: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    background: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    marginTop: '1rem'
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
    border: '1px solid #e0e0e0'
  },
  cardActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  viewBtn: {
    padding: '0.5rem 1rem',
    background: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    textAlign: 'center',
    flex: 1
  },
  progressBtn: {
    padding: '0.5rem 1rem',
    background: '#2ecc71',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    textAlign: 'center',
    flex: 1
  },
  enrollmentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  enrollmentCard: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0'
  },
  enrollmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e0e0e0'
  },
  userInfo: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  userAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: '#3498db',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  userEmail: {
    fontSize: '0.85rem',
    color: '#7f8c8d',
    marginTop: '0.25rem'
  },
  enrollmentDate: {
    fontSize: '0.85rem',
    color: '#7f8c8d'
  },
  courseInfo: {
    marginBottom: '1rem'
  },
  userGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem'
  },
  userCard: {
    display: 'flex',
    gap: '1rem',
    background: 'white',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    alignItems: 'center'
  },
  roleBadge: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    color: 'white',
    marginTop: '0.5rem'
  },
  userDate: {
    fontSize: '0.75rem',
    color: '#7f8c8d',
    marginTop: '0.5rem'
  }
};

export default Dashboard;