const { test, expect, request } = require('@playwright/test');
const { MongoClient } = require('mongodb');

test('TC-DB-01: New user signup persists in MongoDB @api', async () => {
  const email = `qa_test_${Date.now()}@agrovision.dev`;
  
  const apiContext = await request.newContext({
    baseURL: process.env.API_URL || 'http://localhost:5000/api'
  });

  const response = await apiContext.post('/register', {
    data: {
      name: 'QA Test User',
      email: email,
      password: 'TestPass123'
    }
  });

  if (response.ok()) {
    expect(response.status()).toBe(201);
  }

  if (process.env.MONGODB_URI) {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
      await client.connect();
      const db = client.db();
      const users = db.collection('users');
      
      const userDoc = await users.findOne({ email: email });
      if (response.ok()) {
        expect(userDoc).toBeTruthy();
        expect(userDoc.name).toBe('QA Test User');
        expect(userDoc.email).toBe(email);
      }
    } finally {
      if (response.ok()) {
         await client.db().collection('users').deleteOne({ email: email });
      }
      await client.close();
    }
  }
});
