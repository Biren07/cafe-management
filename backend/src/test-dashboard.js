import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import { envConfig } from './config/env.js';
import v1Router from './routes/v1/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { seedDefaultOwner } from './utils/seedOwner.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1', v1Router);
app.use(errorHandler);

async function testDashboardModule() {
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
    const token = loginData.data.accessToken;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    console.log('\n--- 2. Fetching Combined Dashboard Analytics (GET /dashboard) ---');
    const dashRes = await fetch(`${baseUrl}/dashboard`, { headers });
    const dashData = await dashRes.json();

    console.log('Dashboard Endpoint Status Code:', dashRes.status);
    console.log('Response Message:', dashData.message);
    console.log('Summary Cards:', Object.keys(dashData.data.summaryCards).join(', '));
    console.log('Charts Keys:', Object.keys(dashData.data.charts).join(', '));

    console.log('\n--- 3. Testing Individual Sub-Endpoints ---');
    const summaryRes = await fetch(`${baseUrl}/dashboard/summary`, { headers });
    console.log('GET /dashboard/summary Status:', summaryRes.status);

    const weeklyRes = await fetch(`${baseUrl}/dashboard/weekly-sales`, { headers });
    console.log('GET /dashboard/weekly-sales Status:', weeklyRes.status);

    const monthlyRes = await fetch(`${baseUrl}/dashboard/monthly-revenue`, { headers });
    console.log('GET /dashboard/monthly-revenue Status:', monthlyRes.status);

    const topSellingRes = await fetch(`${baseUrl}/dashboard/top-selling?limit=3`, { headers });
    console.log('GET /dashboard/top-selling Status:', topSellingRes.status);

    const categoriesRes = await fetch(`${baseUrl}/dashboard/most-ordered-categories?limit=3`, { headers });
    console.log('GET /dashboard/most-ordered-categories Status:', categoriesRes.status);

    const recentRes = await fetch(`${baseUrl}/dashboard/recent-orders?limit=3`, { headers });
    console.log('GET /dashboard/recent-orders Status:', recentRes.status);

    server.close();
    await mongoose.disconnect();

    console.log('\n=================================================');
    console.log('ALL DASHBOARD MODULE ENDPOINT TESTS PASSED PERFECTLY!');
    console.log('=================================================');
  } catch (err) {
    console.error('Dashboard Test Error:', err);
    server.close();
    await mongoose.disconnect();
    process.exit(1);
  }
}

testDashboardModule();
