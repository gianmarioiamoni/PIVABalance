# API Integration Documentation

## 🔄 **Migration to Next.js API Routes Complete**

This document describes the completed migration from Express backend to Next.js API Routes.

---

## 📋 **Overview**

### **Previous Architecture:**

- **Frontend**: Next.js client (`client/p-iva-balance/`)
- **Backend**: Separate Express server (localhost:5000)
- **Communication**: Axios with CSRF tokens + Session cookies

### **New Architecture:**

- **Unified**: Next.js with API Routes (`/api/*`)
- **Authentication**: JWT Bearer tokens
- **Response Format**: Standardized `ApiResponse<T>`
- **Client**: Enhanced API client with TypeScript

---

## 🚀 **Migrated Services**

### **1. Authentication Service**

- **Endpoints**: `/api/auth/login`, `/api/auth/register`, `/api/auth/me`
- **Features**: JWT token management, automatic token refresh
- **File**: `src/services/authService.ts`

### **2. Settings Service**

- **Endpoints**: `/api/settings` (GET, PUT)
- **Features**: User tax and pension settings management
- **File**: `src/services/settingsService.ts`

### **3. Cost Service**

- **Endpoints**: `/api/costs`, `/api/costs/[id]`
- **Features**: CRUD operations, year filtering, validation
- **File**: `src/services/costService.ts`

### **4. Invoice Service**

- **Endpoints**: `/api/invoices`, `/api/invoices/[id]`
- **Features**: Invoice management, VAT calculations
- **File**: `src/services/invoiceService.ts`

### **5. Professional Fund Service**

- **Endpoints**: `/api/professional-funds`, `/api/professional-funds/[id]`
- **Features**: Professional fund data, contribution calculations
- **File**: `src/services/professionalFundService.ts`

---

## 🔧 **API Client Architecture**

### **Enhanced API Client** (`src/services/api.ts`)

```typescript
// Usage Example
import { api } from "@/services/api";

// GET request
const users = await api.get<User[]>("/users");

// POST request
const newUser = await api.post<User>("/users", userData);

// Authenticated requests (automatic)
api.setAuthToken(token);
const settings = await api.get<UserSettings>("/settings");
```

### **Features:**

- ✅ **TypeScript strict typing** (zero 'any')
- ✅ **JWT authentication** (automatic header injection)
- ✅ **Error handling** with custom ApiError class
- ✅ **Retry logic** for network failures
- ✅ **Request/response interceptors**
- ✅ **ApiResponse format** handling

---

## 📝 **API Response Format**

All API endpoints follow the standardized format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
```

### **Examples:**

**Successful Response:**

```json
{
  "success": true,
  "data": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Email o password non validi",
  "errors": ["Email non valida"]
}
```

---

## 🔐 **Authentication Flow**

### **1. Login Process:**

```typescript
// 1. User submits credentials
const response = await authService.signIn(credentials);

// 2. Server validates and returns JWT
// 3. Token automatically stored and used for subsequent requests
// 4. All API calls include: Authorization: Bearer <token>
```

### **2. Authentication Check:**

```typescript
// Automatic token validation
const user = await authService.checkAuth();
if (!user) {
  // Redirect to login
  router.push("/auth/signin");
}
```

### **3. Logout:**

```typescript
// Client-side token removal (JWT is stateless)
await authService.logout();
```

---

## 🛠 **Error Handling**

### **API Client Error Handling:**

```typescript
try {
  const data = await api.get("/endpoint");
} catch (error) {
  if (error instanceof ApiError) {
    console.log("Status:", error.status);
    console.log("Message:", error.message);
    console.log("Data:", error.data);
  }
}
```

### **Service-Level Error Handling:**

- **Network errors**: Automatic retry with exponential backoff
- **Authentication errors**: Automatic token removal and redirect
- **Validation errors**: Structured error messages
- **Server errors**: Graceful degradation

---

## 📊 **Migration Benefits**

### **Performance:**

- ✅ **Reduced latency** (no separate backend)
- ✅ **Better caching** with Next.js optimizations
- ✅ **Smaller bundle size** (no axios dependency)

### **Development Experience:**

- ✅ **Single codebase** (frontend + backend)
- ✅ **Simplified deployment** (one process)
- ✅ **Hot reload** for API changes
- ✅ **TypeScript end-to-end**

### **Security:**

- ✅ **Modern JWT authentication**
- ✅ **Enhanced security headers**
- ✅ **No CSRF vulnerabilities**
- ✅ **Stateless authentication**

### **Maintainability:**

- ✅ **SOLID principles** throughout
- ✅ **Zero 'any' types**
- ✅ **Consistent error handling**
- ✅ **Centralized API logic**

---

## 🔧 **Configuration**

### **Environment Variables:**

```bash
# No longer needed (was for Express backend):
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Database (for API Routes):
MONGODB_URI=mongodb://localhost:27017/p-iva-balance
JWT_SECRET=your-secret-key
```

### **Next.js Config:**

- **Removed**: External API connections
- **Added**: Enhanced security headers
- **Updated**: CSP for same-origin API calls

---

## 🧪 **Testing**

### **API Routes Testing:**

```typescript
// Example test for API route
import { GET } from "@/app/api/users/route";
import { NextRequest } from "next/server";

test("GET /api/users returns users list", async () => {
  const request = new NextRequest("http://localhost:3000/api/users");
  const response = await GET(request);
  const data = await response.json();

  expect(data.success).toBe(true);
  expect(Array.isArray(data.data)).toBe(true);
});
```

### **Service Testing:**

```typescript
// Example service test
import { authService } from "@/services/authService";

test("authService.signIn with valid credentials", async () => {
  const result = await authService.signIn({
    email: "test@example.com",
    password: "password123",
  });

  expect(result.token).toBeDefined();
  expect(result.user.email).toBe("test@example.com");
});
```

---

## 🚀 **Next Steps**

### **Completed ✅**

- [x] API client migration
- [x] Authentication service integration
- [x] All core services migrated
- [x] TypeScript strict typing
- [x] Error handling standardization

### **Future Enhancements**

- [ ] API route rate limiting
- [ ] Request/response logging
- [ ] API documentation generation
- [ ] Performance monitoring
- [ ] Caching optimization

---

## 📚 **Resources**

- **Next.js API Routes**: https://nextjs.org/docs/api-routes/introduction
- **JWT Authentication**: https://jwt.io/introduction/
- **TypeScript Best Practices**: https://typescript-eslint.io/
- **Project Structure**: `/src/services/` for all API integrations

---

**🎉 Migration to Next.js API Routes completed successfully!**

All components now use the unified API system with enhanced security, performance, and maintainability.
