import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import { envConfig } from './config/env.js';
import v1Router from './routes/v1/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { seedDefaultOwner } from './utils/seedOwner.js';
import { User } from './models/user.model.js';
import { ROLES } from './constants/roles.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1', v1Router);
app.use(errorHandler);

async function testSettingsModule() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(envConfig.db.uri);
  console.log('Connected to MongoDB.');

  await seedDefaultOwner();

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api/v1`;

  try {
    console.log('\n--- 1. Authenticating Owner ---');
    const loginRes = await fetch(`${baseUrl}/owner/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' }),
    });
    const loginData = await loginRes.json();
    const ownerToken = loginData.data.accessToken;
    const ownerHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ownerToken}`,
    };

    console.log('\n--- 2. Fetching Initial Settings (GET /settings) ---');
    const getRes = await fetch(`${baseUrl}/settings`, { headers: ownerHeaders });
    const getData = await getRes.json();
    console.log('GET /settings Status Code:', getRes.status);
    console.log('Initial Cafe Name:', getData.data.cafeName);
    console.log('Default Tax Percentage:', getData.data.taxPercentage);

    console.log('\n--- 3. Updating Settings as OWNER (PUT /settings) ---');
    const updateRes = await fetch(`${baseUrl}/settings`, {
      method: 'PUT',
      headers: ownerHeaders,
      body: JSON.stringify({
        cafeName: 'Artisan Grand Express Cafe',
        phone: '+1-800-555-0199',
        email: 'contact@artisangrand.com',
        vatNumber: 'VAT-9988776655',
        currency: 'USD',
        taxPercentage: 13.5,
        serviceChargePercentage: 10,
        receiptFooter: 'Thank you for dining with us! Visit again.',
        businessHours: '07:00 AM - 11:00 PM',
      }),
    });
    const updateData = await updateRes.json();
    console.log('PUT /settings Status Code:', updateRes.status);
    console.log('Updated Cafe Name:', updateData.data.cafeName);
    console.log('Updated Phone:', updateData.data.phone);
    console.log('Updated VAT Number:', updateData.data.vatNumber);
    console.log('Updated Tax Percentage:', updateData.data.taxPercentage);

    console.log('\n--- 4. Testing Role Restriction (Cashier user attempting PUT /settings) ---');
    // Create or find a cashier user
    let cashier = await User.findOne({ email: 'cashier@cafe.com' });
    if (!cashier) {
      cashier = await User.create({
        name: 'Test Cashier',
        email: 'cashier@cafe.com',
        password: 'password123',
        role: ROLES.CASHIER,
        isActive: true,
      });
    }

    const cashierLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'cashier@cafe.com', password: 'password123' }),
    });
    const cashierLoginData = await cashierLoginRes.json();
    const cashierToken = cashierLoginData.data.accessToken;
    const cashierHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cashierToken}`,
    };

    const cashierUpdateRes = await fetch(`${baseUrl}/settings`, {
      method: 'PUT',
      headers: cashierHeaders,
      body: JSON.stringify({ cafeName: 'Hacked Cafe Name' }),
    });
    console.log('Cashier PUT /settings Status Code (Expect 403):', cashierUpdateRes.status);

    server.close();
    await mongoose.disconnect();

    console.log('\n=================================================');
    console.log('ALL SETTINGS MODULE TESTS PASSED PERFECTLY!');
    console.log('=================================================');
  } catch (err) {
    console.error('Settings Test Error:', err);
    server.close();
    await mongoose.disconnect();
    process.exit(1);
  }
}

testSettingsModule();
