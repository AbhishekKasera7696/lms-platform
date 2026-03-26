const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');

dotenv.config();

const courses = [
  {
    title: "React Fundamentals",
    description: "Learn the basics of React including components, props, state, and hooks. Build interactive user interfaces with confidence.",
    instructor: "John Doe",
    duration: "4 weeks",
    totalModules: 10
  },
  {
    title: "Node.js Advanced",
    description: "Master Node.js development with Express, MongoDB, and building RESTful APIs. Learn authentication, authorization, and deployment.",
    instructor: "Jane Smith",
    duration: "6 weeks",
    totalModules: 12
  },
  {
    title: "MongoDB Essentials",
    description: "Comprehensive guide to MongoDB - from basic CRUD operations to advanced aggregation pipelines and indexing strategies.",
    instructor: "Alice Johnson",
    duration: "3 weeks",
    totalModules: 8
  },
  {
    title: "Full Stack Development",
    description: "Complete MERN stack development course covering React, Node.js, Express, and MongoDB. Build real-world applications.",
    instructor: "Bob Wilson",
    duration: "8 weeks",
    totalModules: 15
  },
  {
    title: "JavaScript: The Complete Guide",
    description: "Deep dive into JavaScript - from fundamentals to advanced concepts like closures, promises, async/await, and ES6+ features.",
    instructor: "Sarah Brown",
    duration: "5 weeks",
    totalModules: 20
  }
];

async function seedCourses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    await Course.deleteMany({});
    console.log('Cleared existing courses');
    
    const insertedCourses = await Course.insertMany(courses);
    console.log(`✅ Added ${insertedCourses.length} courses`);
    
    console.log('\n📚 Courses added:');
    insertedCourses.forEach(course => {
      console.log(`  - ${course.title} (${course.duration})`);
    });
    
    await mongoose.disconnect();
    console.log('\n✅ Seeding completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedCourses();