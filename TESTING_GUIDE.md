# 🧪 Agricultural Surplus Redistribution - Testing Guide

## 🚀 **Quick Start Testing**

### **Prerequisites**
1. **MySQL Database** installed and running
2. **Node.js** (v14 or higher) installed
3. **Web Browser** (Chrome, Firefox, Safari, Edge)

### **Step 1: Database Setup**
```bash
# 1. Start MySQL service
# Windows: Start MySQL service from Services
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql

# 2. Create database and insert test data
mysql -u root -p < database_setup.sql
```

### **Step 2: Backend Setup**
```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp env.example .env
# Edit .env with your database credentials

# 3. Start the server
npm run dev
# Server will start at http://localhost:3000
```

### **Step 3: Frontend Testing**
```bash
# 1. Open HTML files in browser
# Start with: HTML/login.html
# Or use a local server:
npx http-server HTML -p 8080
# Then visit: http://localhost:8080/login.html
```

---

## 🔍 **Complete Testing Workflow**

### **Test 1: Backend API Health Check**
1. **Start the server**: `npm run dev`
2. **Test database connection**: Visit `http://localhost:3000/health/db`
3. **Expected**: JSON response with `{"status": "ok", "db": {"ok": 1}}`

### **Test 2: Farmer Registration & Crop Upload**
1. **Open**: `HTML/register.html`
2. **Register as Farmer**:
   - Name: Test Farmer
   - Email: farmer@test.com
   - Phone: +91-9876543210
   - Location: Test City, India
   - Role: Farmer
   - Password: test123
3. **Login**: Use the same credentials in `HTML/login.html`
4. **Upload Crop**:
   - Crop Name: Test Tomato
   - Quantity: 100
   - Unit: kg
   - Harvest Date: Today's date
   - Expiry Date: Tomorrow's date
   - Purpose: Commercial
   - Status: Available
5. **Expected**: Success message and crop appears in table

### **Test 3: Buyer Registration & Order Placement**
1. **Register as Buyer**:
   - Name: Test Buyer
   - Email: buyer@test.com
   - Phone: +91-9876543211
   - Location: Test City, India
   - Role: Buyer
   - Password: test123
2. **Login**: Use buyer credentials
3. **View Available Crops**: Should see crops uploaded by farmers
4. **Place Order**:
   - Click "Order" button on any crop
   - Enter quantity (less than available)
   - Select status: Pending
   - Submit order
5. **Expected**: Success message and order appears in orders table

### **Test 4: NGO Registration**
1. **Register as NGO**:
   - Name: Test NGO
   - Email: ngo@test.com
   - Phone: +91-9876543212
   - Location: Test City, India
   - Role: NGO
   - Password: test123
2. **Expected**: Successful registration

### **Test 5: Seller Registration**
1. **Register as Seller**:
   - Name: Test Seller
   - Email: seller@test.com
   - Phone: +91-9876543213
   - Location: Test City, India
   - Role: Seller
   - Password: test123
2. **Expected**: Successful registration

---

## 🛠️ **API Testing with Postman/curl**

### **Test Farmer Registration**
```bash
curl -X POST http://localhost:3000/api/farmers/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test Farmer",
    "phone": "+91-9876543215",
    "location": "API Test City",
    "email": "api.farmer@test.com"
  }'
```

### **Test Crop Addition**
```bash
curl -X POST http://localhost:3000/api/crops/add \
  -H "Content-Type: application/json" \
  -d '{
    "farmer_id": 1,
    "crop_name": "API Test Crop",
    "quantity": 50,
    "unit": "kg",
    "harvest_date": "2024-01-20",
    "expiry_date": "2024-02-20",
    "status": "Available"
  }'
```

### **Test Get Available Crops**
```bash
curl http://localhost:3000/api/crops/available
```

### **Test Buyer Creation**
```bash
curl -X POST http://localhost:3000/api/buyers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test Buyer",
    "phone": "+91-9876543216",
    "location": "API Test City",
    "email": "api.buyer@test.com",
    "buyer_type": "Individual"
  }'
```

### **Test Order Creation**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "crop_id": 1,
    "buyer_id": 1,
    "quantity": 25,
    "status": "Pending"
  }'
```

---

## 🐛 **Troubleshooting Common Issues**

### **Issue 1: Database Connection Failed**
**Error**: `❌ Failed to connect to database`
**Solution**:
1. Check if MySQL is running
2. Verify database credentials in `.env`
3. Ensure database `dbms-cp` exists
4. Run `mysql -u root -p < database_setup.sql`

### **Issue 2: CORS Error**
**Error**: `Access to fetch at 'http://localhost:3000/api/...' from origin 'file://' has been blocked by CORS policy`
**Solution**:
1. Use a local server: `npx http-server HTML -p 8080`
2. Access via `http://localhost:8080/login.html`
3. Or modify CORS settings in `src/server.js`

### **Issue 3: API Endpoint Not Found**
**Error**: `404 Not Found`
**Solution**:
1. Check if server is running on port 3000
2. Verify API endpoint URLs in `HTML/js/api.js`
3. Check server logs for errors

### **Issue 4: Form Validation Errors**
**Error**: Various validation messages
**Solution**:
1. Ensure all required fields are filled
2. Check email format (must contain @)
3. Check phone format (numbers only)
4. Ensure quantity is positive number

---

## 📊 **Expected Test Results**

### **Database Tables Should Contain**:
- **farmers**: 5+ test farmers
- **crops**: 10+ test crops
- **buyers**: 5+ test buyers
- **ngos**: 5+ test NGOs
- **sellers**: 5+ test sellers
- **orders**: 5+ test orders
- **transactions**: 5+ test transactions
- **logistics**: 5+ test logistics records

### **Frontend Should Show**:
- ✅ Login/Register forms working
- ✅ Role-based dashboard access
- ✅ Crop upload functionality
- ✅ Order placement functionality
- ✅ Real-time data loading from API
- ✅ Error handling and validation
- ✅ Success/error messages

### **API Endpoints Should Return**:
- ✅ `GET /health/db` → Database status
- ✅ `GET /api/farmers` → List of farmers
- ✅ `GET /api/crops/available` → Available crops
- ✅ `GET /api/buyers` → List of buyers
- ✅ `POST /api/farmers/register` → New farmer created
- ✅ `POST /api/crops/add` → New crop added
- ✅ `POST /api/orders` → New order created

---

## 🎯 **Complete System Flow Test**

### **End-to-End Test Scenario**:
1. **Farmer Registration** → **Crop Upload** → **Buyer Registration** → **Order Placement** → **Transaction Creation** → **Logistics Assignment**

### **Expected Flow**:
```
Farmer uploads crop → Crop appears in available list → 
Buyer places order → Order created → 
Transaction generated → Logistics assigned → 
Delivery tracking possible
```

---

## 🚀 **Performance Testing**

### **Load Test** (Optional):
```bash
# Install artillery for load testing
npm install -g artillery

# Create load test script
cat > load-test.yml << EOF
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "API Load Test"
    requests:
      - get:
          url: "/api/crops/available"
      - get:
          url: "/api/farmers"
      - get:
          url: "/api/buyers"
EOF

# Run load test
artillery run load-test.yml
```

---

## ✅ **Success Criteria**

Your system is working correctly if:
- ✅ All API endpoints respond with correct data
- ✅ Frontend forms submit data successfully
- ✅ Database contains test data
- ✅ Role-based access works
- ✅ Error handling displays appropriate messages
- ✅ Real-time data updates work
- ✅ Complete user flow can be executed

---

## 📝 **Test Report Template**

After testing, document your results:

```
## Test Report - Agricultural Surplus Redistribution

**Date**: [Current Date]
**Tester**: [Your Name]
**Environment**: [Development/Production]

### ✅ Passed Tests:
- [ ] Database connection
- [ ] Farmer registration
- [ ] Crop upload
- [ ] Buyer registration
- [ ] Order placement
- [ ] API endpoints
- [ ] Frontend integration

### ❌ Failed Tests:
- [ ] [Issue description]

### 🐛 Bugs Found:
- [ ] [Bug description and steps to reproduce]

### 📊 Performance:
- [ ] API response times
- [ ] Database query performance
- [ ] Frontend loading times

### 🎯 Overall Status:
- [ ] System Ready for Production
- [ ] Minor Issues to Fix
- [ ] Major Issues to Address
```


