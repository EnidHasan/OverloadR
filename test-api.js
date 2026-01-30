// Quick API test script
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🔍 Testing Workout Tracker API...\n');

  // Test 1: Health check
  try {
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Server health:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  // Test 2: Create a test user (signup)
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    age: 25,
    weight: 70
  };

  let userId, token;

  try {
    console.log('\n📝 Creating test user...');
    const signupResponse = await axios.post(`${API_URL}/users/register`, testUser);
    userId = signupResponse.data._id;
    token = signupResponse.data.token;
    console.log('✅ User created:', { userId, name: signupResponse.data.name });
  } catch (error) {
    console.log('❌ Signup failed:', error.response?.data?.message || error.message);
    return;
  }

  // Test 3: Create a plan
  try {
    console.log('\n📋 Creating a test workout plan...');
    const planData = {
      userId: userId,
      name: 'Test Plan',
      exercises: [
        {
          name: 'Bench Press',
          group: 'Chest',
          muscleDetail: 'Pectoralis major',
          sets: [
            { reps: 10, weight: 135 },
            { reps: 8, weight: 155 }
          ]
        }
      ]
    };

    const planResponse = await axios.post(`${API_URL}/plans`, planData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Plan created:', { id: planResponse.data._id, name: planResponse.data.name });
  } catch (error) {
    console.log('❌ Plan creation failed:', error.response?.data?.message || error.message);
    console.log('Full error:', error.response?.data);
  }

  // Test 4: Get plans for user
  try {
    console.log('\n📚 Fetching plans for user...');
    const plansResponse = await axios.get(`${API_URL}/plans/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Plans retrieved:', plansResponse.data.length, 'plan(s)');
    console.log('Plans:', plansResponse.data.map(p => ({ id: p._id, name: p.name })));
  } catch (error) {
    console.log('❌ Getting plans failed:', error.response?.data?.message || error.message);
  }

  console.log('\n✨ API test complete!');
}

testAPI().catch(console.error);
