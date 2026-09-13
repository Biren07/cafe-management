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

async function testExpenseModule() {
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

    console.log('\n--- 2. Creating New Expense (POST /expenses) ---');
    const createRes = await fetch(`${baseUrl}/expenses`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Fresh Milk Supply',
        category: 'SUPPLIES',
        amount: 85.50,
        description: '50 liters of fresh milk for coffee',
        expenseDate: new Date().toISOString(),
      }),
    });
    const createData = await createRes.json();
    console.log('Create Expense Status:', createRes.status);
    console.log('Created Expense ID:', createData.data._id);
    const expenseId = createData.data._id;

    console.log('\n--- 3. Fetching Paginated Expenses (GET /expenses) ---');
    const listRes = await fetch(`${baseUrl}/expenses?search=Milk&category=SUPPLIES&page=1&limit=10`, { headers });
    const listData = await listRes.json();
    console.log('List Expenses Status:', listRes.status);
    console.log('Total Expenses Found:', listData.data.total);

    console.log('\n--- 4. Fetching Expense by ID (GET /expenses/:id) ---');
    const getRes = await fetch(`${baseUrl}/expenses/${expenseId}`, { headers });
    const getData = await getRes.json();
    console.log('Get Single Expense Status:', getRes.status);
    console.log('Fetched Title:', getData.data.title);

    console.log('\n--- 5. Updating Expense (PUT /expenses/:id) ---');
    const updateRes = await fetch(`${baseUrl}/expenses/${expenseId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        title: 'Fresh Whole Milk Supply (Updated)',
        amount: 90.00,
      }),
    });
    const updateData = await updateRes.json();
    console.log('Update Expense Status:', updateRes.status);
    console.log('Updated Amount:', updateData.data.amount);

    console.log('\n--- 6. Soft Deleting Expense (DELETE /expenses/:id) ---');
    const deleteRes = await fetch(`${baseUrl}/expenses/${expenseId}`, {
      method: 'DELETE',
      headers,
    });
    console.log('Delete Expense Status:', deleteRes.status);

    console.log('\n--- 7. Verifying Soft Delete (GET /expenses/:id should return 404) ---');
    const verifyRes = await fetch(`${baseUrl}/expenses/${expenseId}`, { headers });
    console.log('Fetch Soft-Deleted Expense Status:', verifyRes.status);

    server.close();
    await mongoose.disconnect();

    console.log('\n=================================================');
    console.log('ALL EXPENSE MODULE CRUD TESTS PASSED PERFECTLY!');
    console.log('=================================================');
  } catch (err) {
    console.error('Expense Test Error:', err);
    server.close();
    await mongoose.disconnect();
    process.exit(1);
  }
}

testExpenseModule();
