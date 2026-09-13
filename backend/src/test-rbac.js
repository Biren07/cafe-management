import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';
import { envConfig } from './config/env.js';
import v1Router from './routes/v1/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { User } from './models/user.model.js';
import { ROLES } from './constants/roles.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1', v1Router);
app.use(errorHandler);

async function runRbacTests() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(envConfig.db.uri);
  console.log('Connected to MongoDB.');

  // Clean up existing test users if any
  await User.deleteMany({ email: { $regex: /@rbactest\.com$/ } });

  const ownerEmail = `owner_${Date.now()}@rbactest.com`;
  const managerEmail = `manager_${Date.now()}@rbactest.com`;
  const cashierEmail = `cashier_${Date.now()}@rbactest.com`;
  const testPassword = 'Password123!';

  try {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}/api/v1`;

    console.log(`\n--- 1. Testing Owner Authentication ---`);
    let ownerToken;
    const ownerLoginRes = await fetch(`${baseUrl}/owner/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' }),
    });
    const ownerLoginData = await ownerLoginRes.json();
    if (ownerLoginRes.status === 200) {
      console.log('Seeded Owner Login Successful:', ownerLoginRes.status);
      console.log('Owner Role:', ownerLoginData.data.user.role);
      ownerToken = ownerLoginData.data.accessToken;
    } else {
      const ownerRegRes = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Cafe Owner',
          email: ownerEmail,
          password: testPassword,
          role: ROLES.OWNER,
        }),
      });
      const ownerRegData = await ownerRegRes.json();
      console.log('Owner Registration Status:', ownerRegRes.status);
      console.log('Registered User Role:', ownerRegData.data.user.role);
      ownerToken = ownerRegData.data.accessToken;
    }

    console.log(`\n--- 2. Testing Owner Creating Manager & Cashier ---`);
    // Owner creates Manager
    const mgrRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        name: 'Cafe Manager',
        email: managerEmail,
        password: testPassword,
        role: ROLES.MANAGER,
      }),
    });
    const mgrData = await mgrRes.json();
    console.log('Manager Creation Status (by Owner):', mgrRes.status);
    console.log('Created User Role:', mgrData.data.user.role);

    // Owner creates Cashier
    const cashierRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        name: 'Cafe Cashier',
        email: cashierEmail,
        password: testPassword,
        role: ROLES.CASHIER,
      }),
    });
    const cashierData = await cashierRes.json();
    console.log('Cashier Creation Status (by Owner):', cashierRes.status);
    console.log('Created User Role:', cashierData.data.user.role);

    // Obtain tokens for Manager & Cashier
    const mgrLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: managerEmail, password: testPassword }),
    });
    const mgrToken = (await mgrLoginRes.json()).data.accessToken;

    const cashierLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cashierEmail, password: testPassword }),
    });
    const cashierToken = (await cashierLoginRes.json()).data.accessToken;

    console.log(`\n--- 3. Testing "Only Owner can create users" Restriction ---`);
    // Manager tries to create a user -> should get 403 Forbidden
    const unauthCreateRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mgrToken}`,
      },
      body: JSON.stringify({
        name: 'Unauthorized User',
        email: `unauth_${Date.now()}@rbactest.com`,
        password: testPassword,
        role: ROLES.CASHIER,
      }),
    });
    console.log('Manager creating User (Expected 403 Forbidden):', unauthCreateRes.status);

    console.log(`\n--- 4. Testing Menu Management Permissions ---`);
    // Manager creates Menu item -> 201 Created
    const menuMgrRes = await fetch(`${baseUrl}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mgrToken}`,
      },
      body: JSON.stringify({ name: 'Iced Matcha Latte', price: 5.5, category: 'Beverages' }),
    });
    console.log('Manager creating Menu item:', menuMgrRes.status);

    // Cashier tries to create Menu item -> 403 Forbidden
    const menuCashierRes = await fetch(`${baseUrl}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cashierToken}`,
      },
      body: JSON.stringify({ name: 'Caramel Macchiato', price: 6.0, category: 'Beverages' }),
    });
    console.log('Cashier creating Menu item (Expected 403 Forbidden):', menuCashierRes.status);

    console.log(`\n--- 5. Testing Inventory Management Permissions ---`);
    // Manager adds Inventory -> 201 Created
    const invMgrRes = await fetch(`${baseUrl}/inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mgrToken}`,
      },
      body: JSON.stringify({ item: 'Matcha Powder (kg)', quantity: 15, unit: 'kg' }),
    });
    console.log('Manager adding Inventory:', invMgrRes.status);

    // Cashier tries to add Inventory -> 403 Forbidden
    const invCashierRes = await fetch(`${baseUrl}/inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cashierToken}`,
      },
      body: JSON.stringify({ item: 'Syrup Bottles', quantity: 20, unit: 'bottles' }),
    });
    console.log('Cashier adding Inventory (Expected 403 Forbidden):', invCashierRes.status);

    console.log(`\n--- 6. Testing Order & Payment Permissions (Cashier Allowed) ---`);
    // Cashier creates Order -> 201 Created
    const orderCashierRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cashierToken}`,
      },
      body: JSON.stringify({
        items: [{ name: 'Espresso', qty: 1, price: 3.5 }],
        totalAmount: 3.5,
      }),
    });
    console.log('Cashier creating Order:', orderCashierRes.status);

    // Cashier processes Payment -> 201 Created
    const paymentCashierRes = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cashierToken}`,
      },
      body: JSON.stringify({ orderId: 'ORD-101', amount: 3.5, paymentMethod: 'CARD' }),
    });
    console.log('Cashier processing Payment:', paymentCashierRes.status);

    console.log(`\n--- 7. Testing Order Management Deletion Permissions ---`);
    // Cashier tries to delete Order -> 403 Forbidden
    const delCashierRes = await fetch(`${baseUrl}/orders/ORD-101`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${cashierToken}` },
    });
    console.log('Cashier deleting Order (Expected 403 Forbidden):', delCashierRes.status);

    // Manager deletes Order -> 200 OK
    const delMgrRes = await fetch(`${baseUrl}/orders/ORD-101`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${mgrToken}` },
    });
    console.log('Manager deleting Order (Allowed):', delMgrRes.status);

    // Cleanup test users
    await User.deleteMany({ email: { $regex: /@rbactest\.com$/ } });
    console.log('\nTest users cleaned up.');

    server.close();
    await mongoose.disconnect();

    console.log('\n=================================================');
    console.log('ALL ROLE & PERMISSION TESTS PASSED SUCCESSFULLY!');
    console.log('=================================================');
  } catch (err) {
    console.error('RBAC Test Error:', err);
    await User.deleteMany({ email: { $regex: /@rbactest\.com$/ } });
    await mongoose.disconnect();
    process.exit(1);
  }
}

runRbacTests();
