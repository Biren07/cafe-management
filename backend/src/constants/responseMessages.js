export const RESPONSE_MESSAGES = Object.freeze({
  SUCCESS: 'Operation completed successfully.',
  CREATED: 'Resource created successfully.',
  UPDATED: 'Resource updated successfully.',
  DELETED: 'Resource deleted successfully.',
  NOT_FOUND: 'Resource not found.',
  BAD_REQUEST: 'Invalid request data.',
  UNAUTHORIZED: 'Unauthorized access.',
  FORBIDDEN: 'Access forbidden.',
  INTERNAL_ERROR: 'Internal server error occurred.',
  HEALTH_CHECK_SUCCESS: 'Cafe Management System API is healthy and operational.',
  TOO_MANY_REQUESTS: 'Too many requests from this IP, please try again later.',
  
  // Auth Response Messages
  REGISTER_SUCCESS: 'User registered successfully.',
  LOGIN_SUCCESS: 'User logged in successfully.',
  LOGOUT_SUCCESS: 'User logged out successfully.',
  TOKEN_REFRESH_SUCCESS: 'Access token refreshed successfully.',
  PASSWORD_CHANGE_SUCCESS: 'Password changed successfully.',
  PROFILE_FETCH_SUCCESS: 'User profile fetched successfully.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token.',
  UNAUTHORIZED_TOKEN: 'Invalid or missing authentication token.',
  USER_NOT_FOUND: 'User account not found.',
  USER_INACTIVE: 'User account is inactive.',
  EMAIL_ALREADY_EXISTS: 'User with this email already exists.',
  INVALID_CURRENT_PASSWORD: 'Current password provided is incorrect.',

  // Category Response Messages
  CATEGORY_CREATED: 'Category created successfully.',
  CATEGORY_FETCHED: 'Category fetched successfully.',
  CATEGORIES_FETCHED: 'Categories list retrieved successfully.',
  CATEGORY_UPDATED: 'Category updated successfully.',
  CATEGORY_DELETED: 'Category deleted successfully.',
  CATEGORY_NOT_FOUND: 'Category not found.',
  CATEGORY_ALREADY_EXISTS: 'Category with this name or slug already exists.',

  // Menu Response Messages
  MENU_ITEM_CREATED: 'Menu item created successfully.',
  MENU_ITEM_FETCHED: 'Menu item fetched successfully.',
  MENU_ITEMS_FETCHED: 'Menu items list retrieved successfully.',
  MENU_ITEM_UPDATED: 'Menu item updated successfully.',
  MENU_ITEM_DELETED: 'Menu item deleted successfully.',
  MENU_ITEM_NOT_FOUND: 'Menu item not found.',
  MENU_ITEM_ALREADY_EXISTS: 'Menu item with this name already exists.',
  INVALID_CATEGORY_ID: 'Invalid or non-existent Category ID.',

  // Order Response Messages
  ORDER_CREATED: 'Order created successfully.',
  ORDER_FETCHED: 'Order fetched successfully.',
  ORDERS_FETCHED: 'Orders list retrieved successfully.',
  ORDER_STATUS_UPDATED: 'Order status updated successfully.',
  ORDER_UPDATED: 'Order updated successfully.',
  ORDER_DELETED: 'Order deleted successfully.',
  ORDER_NOT_FOUND: 'Order not found.',
  INVALID_ORDER_ITEMS: 'Order must contain at least one valid menu item.',
  MENU_ITEM_UNAVAILABLE: 'One or more selected menu items are unavailable.',

  // Payment Response Messages
  PAYMENT_PROCESSED: 'Payment processed successfully.',
  PAYMENT_FETCHED: 'Payment fetched successfully.',
  PAYMENTS_FETCHED: 'Payments list retrieved successfully.',
  PAYMENT_STATUS_UPDATED: 'Payment status updated successfully.',
  PAYMENT_DELETED: 'Payment record deleted successfully.',
  PAYMENT_NOT_FOUND: 'Payment record not found.',
  INVALID_ORDER_FOR_PAYMENT: 'Invalid or non-existent Order ID for payment.',
  PAYMENT_ALREADY_COMPLETED: 'Order has already been fully paid and completed.',

  // Inventory Response Messages
  INVENTORY_ITEM_CREATED: 'Inventory item created successfully.',
  INVENTORY_ITEM_FETCHED: 'Inventory item fetched successfully.',
  INVENTORY_FETCHED: 'Inventory items list retrieved successfully.',
  LOW_STOCK_FETCHED: 'Low stock items list retrieved successfully.',
  INVENTORY_HISTORY_FETCHED: 'Inventory item transaction history retrieved successfully.',
  INVENTORY_ITEM_UPDATED: 'Inventory item updated successfully.',
  INVENTORY_ITEM_DELETED: 'Inventory item deleted successfully.',
  INVENTORY_ITEM_NOT_FOUND: 'Inventory item not found.',
  INVENTORY_ITEM_ALREADY_EXISTS: 'Inventory item with this name already exists.',
  STOCK_IN_SUCCESS: 'Stock added successfully.',
  STOCK_OUT_SUCCESS: 'Stock removed successfully.',
  INSUFFICIENT_STOCK: 'Insufficient stock available for this operation.',

  // Employee Response Messages
  EMPLOYEE_CREATED: 'Employee created successfully.',
  EMPLOYEE_FETCHED: 'Employee fetched successfully.',
  EMPLOYEES_FETCHED: 'Employees list retrieved successfully.',
  ATTENDANCE_RECORDED: 'Attendance recorded successfully.',
  ATTENDANCE_FETCHED: 'Employee attendance history retrieved successfully.',
  EMPLOYEE_UPDATED: 'Employee updated successfully.',
  EMPLOYEE_DELETED: 'Employee record deleted successfully.',
  EMPLOYEE_NOT_FOUND: 'Employee not found.',
  EMPLOYEE_EMAIL_ALREADY_EXISTS: 'Employee with this email address already exists.',

  // Table Response Messages
  TABLE_CREATED: 'Table created successfully.',
  TABLE_FETCHED: 'Table fetched successfully.',
  TABLES_FETCHED: 'Tables list retrieved successfully.',
  TABLE_UPDATED: 'Table updated successfully.',
  TABLE_STATUS_UPDATED: 'Table status updated successfully.',
  TABLE_DELETED: 'Table deleted successfully.',
  TABLE_NOT_FOUND: 'Table not found.',
  TABLE_NUMBER_EXISTS: 'Table with this table number already exists.',
  CANNOT_DELETE_OCCUPIED_TABLE: 'Cannot delete an occupied table. Please clear or complete active orders first.',
  CANNOT_OCCUPY_INACTIVE_TABLE: 'Cannot set status to OCCUPIED for an inactive table.',

  // Billing Response Messages
  BILL_GENERATED: 'Bill generated successfully.',
  BILL_FETCHED: 'Bill fetched successfully.',
  BILLS_FETCHED: 'Bills list retrieved successfully.',
  BILL_STATUS_UPDATED: 'Bill status updated successfully.',
  BILL_SPLIT_SUCCESS: 'Bill split successfully.',
  BILL_PRINTED_SUCCESS: 'Printable invoice JSON generated successfully.',
  BILL_NOT_FOUND: 'Bill not found.',
  BILL_ALREADY_EXISTS: 'Bill already exists for this order.',
  INVALID_ORDER_FOR_BILLING: 'Invalid or non-existent order for billing.',

  // Dashboard Response Messages
  DASHBOARD_METRICS_FETCHED: 'Dashboard analytics metrics fetched successfully.',

  // Expense Response Messages
  EXPENSE_CREATED: 'Expense record created successfully.',
  EXPENSE_FETCHED: 'Expense record fetched successfully.',
  EXPENSES_FETCHED: 'Expenses list retrieved successfully.',
  EXPENSE_UPDATED: 'Expense record updated successfully.',
  EXPENSE_DELETED: 'Expense record deleted successfully.',
  EXPENSE_NOT_FOUND: 'Expense record not found.',

  // Settings Response Messages
  SETTINGS_FETCHED: 'Cafe settings retrieved successfully.',
  SETTINGS_UPDATED: 'Cafe settings updated successfully.',
});
