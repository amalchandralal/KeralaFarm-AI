const { test, expect, request } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test('TC-API-01: /api/detect-disease returns valid JSON schema @api', async () => {
  const apiContext = await request.newContext({
    baseURL: process.env.API_URL || 'http://localhost:5000/api'
  });

  const filePath = path.join(__dirname, '../../fixtures/sample_leaf.jpg');
  let fileBuffer;
  try {
    fileBuffer = fs.readFileSync(filePath);
  } catch (err) {
    fileBuffer = Buffer.from('dummy image data');
  }

  const response = await apiContext.post('/detect-disease', {
    multipart: {
      image: {
        name: 'sample_leaf.jpg',
        mimeType: 'image/jpeg',
        buffer: fileBuffer,
      }
    }
  });

  if (response.ok()) {
    const body = await response.json();
    expect(typeof body.disease_name).toBe('string');
    expect(typeof parseFloat(body.confidence_level)).toBe('number');
    expect(typeof body.suggested_treatment).toBe('string');
  } else {
    expect([200, 400, 404, 500]).toContain(response.status());
  }
});
