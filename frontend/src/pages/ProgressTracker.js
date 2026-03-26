import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';

const ProgressTracker = () => {
  const { courseId } = useParams();
  const [progress, setProgress] = useState(null);
  const [completedModules, setCompletedModules] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await API.get(`/progress/${courseId}`);
        setProgress(res.data);
        setCompletedModules(res.data.completedModules);
      } catch (err) {
        console.error('Error fetching progress:', err);
        setMessage('No progress found for this course');
      }
    };
    
    fetchProgress();
  }, [courseId]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await API.put(`/progress/${courseId}`, { completedModules });
      setProgress(res.data);
      setMessage('Progress updated successfully! 🎉');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setUpdating(false);
    }
  };

  if (!progress) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p>{message || 'Loading progress...'}</p>
          <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Course Progress</h2>
        
        <div style={styles.stats}>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>{progress.completedModules}</div>
            <div>Modules Completed</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>{progress.totalModules}</div>
            <div>Total Modules</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>{progress.percentage}%</div>
            <div>Complete</div>
          </div>
        </div>
        
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress.percentage}%` }}></div>
        </div>
        
        <div style={styles.updateSection}>
          <h3>Update Progress</h3>
          <div style={styles.updateControls}>
            <input
              type="number"
              min="0"
              max={progress.totalModules}
              value={completedModules}
              onChange={(e) => setCompletedModules(Number(e.target.value))}
              style={styles.input}
            />
            <button 
              onClick={handleUpdate} 
              disabled={updating}
              style={styles.updateBtn}
            >
              {updating ? 'Updating...' : 'Update Progress'}
            </button>
          </div>
          <p style={styles.hint}>Mark how many modules you've completed</p>
        </div>
        
        {message && (
          <div style={message.includes('successfully') ? styles.successMsg : styles.errorMsg}>
            {message}
          </div>
        )}
        
        <div style={styles.actions}>
          <Link to={`/course/${courseId}`} style={styles.courseLink}>
            Back to Course
          </Link>
          <Link to="/dashboard" style={styles.dashboardLink}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem'
  },
  card: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    margin: '2rem 0'
  },
  statBox: {
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#3498db'
  },
  progressBar: {
    width: '100%',
    height: '30px',
    backgroundColor: '#ecf0f1',
    borderRadius: '15px',
    overflow: 'hidden',
    marginBottom: '2rem'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2ecc71',
    transition: 'width 0.3s ease'
  },
  updateSection: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  updateControls: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  input: {
    width: '100px',
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    textAlign: 'center'
  },
  updateBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  hint: {
    fontSize: '0.9rem',
    color: '#7f8c8d'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '1rem'
  },
  courseLink: {
    padding: '0.5rem 1rem',
    backgroundColor: '#95a5a6',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px'
  },
  dashboardLink: {
    padding: '0.5rem 1rem',
    backgroundColor: '#2ecc71',
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

export default ProgressTracker;