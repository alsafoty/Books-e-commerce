# Perfumes E-commerce Codebase Instructions

## Architecture Overview

This is a **Vue 3 + Node.js e-commerce platform** with Arabic RTL support, featuring:

- **Frontend**: Vue 3 with Composition API, Bootstrap 5, Arabic RTL layout
- **Backend**: Express.js with Prisma ORM, PostgreSQL database
- **Auth**: JWT tokens with localStorage persistence
- **Images**: Cloudinary integration (migrated from Google Drive)
- **Database**: Supabase PostgreSQL with Prisma migrations

## Key Patterns & Conventions

### Frontend (Vue 3 Composition API)

```javascript
// Standard component structure - follow WishlistView.vue pattern
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import axios from "axios";

// Reactive variables
const items = ref([]);
const loading = ref(true);
const message = ref("");
const messageType = ref("success");

// User ID from localStorage
const userId = ref(
  localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo")).id
    : null
);

// API calls with consistent error handling
const fetchData = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("token");

    const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/endpoint`, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    items.value = response.data.items || [];
  } catch (error) {
    showMessage("حدث خطأ في تحميل البيانات", "danger");
  } finally {
    loading.value = false;
  }
};

// Unified message system
const showMessage = (msg, type = "success") => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => message.value = "", 5000);
};
</script>
```

### Backend API Structure

- **Controllers**: Handle business logic in `Server/src/controllers/`
- **Routes**: Define endpoints in `Server/src/routes/` with `verifyToken` middleware
- **Middleware**: Auth (`verifyToken`), image upload (`imageUpload.js`), RBAC, OTP verification
- **Base URL**: `${process.env.VUE_APP_API_BASE_URL}/` (not 8000)

### Authentication Flow

```javascript
// Frontend: Token stored as "token" in localStorage (not "authToken")
const token = localStorage.getItem("token");
const userId = JSON.parse(localStorage.getItem("userInfo")).id;

// Backend: All protected routes use verifyToken middleware
router.get("/user/:userId", verifyToken, getUserWishlist);
```

### Image Upload (Cloudinary)

```javascript
// Use imageUpload middleware with multer configuration
const { upload, uploadMultipleFiles } = require("../middleware/imageUpload");

// Controller pattern for image handling
router.post("/", verifyToken, upload.any(), async (req, res) => {
  const imageUrls = await uploadMultipleFiles(req.files);
  // Save imageUrls to ProductImages table
});
```

## Critical Developer Workflows

### Development Setup

```bash
# Backend (Server directory)
npm run dev  # Starts nodemon on port 3000

# Frontend (client directory)
npm run serve  # Vue dev server with hot reload

# Database migrations
npx prisma migrate dev --name "description"
npx prisma generate  # Regenerate client after schema changes
```

### Database Schema Key Points

- **User**: Has one Cart, multiple Wishlist items, Orders, Addresses
- **Product**: Has ProductImages (Cloudinary URLs), belongs to Category
- **Cart/Wishlist**: Many-to-many through CartItem/Wishlist tables
- **Images**: Store Cloudinary URLs in ProductImages.url field (not imageUrl)

### Arabic/RTL Conventions

- All views use `dir="rtl"` containers
- Text content in Arabic with Bootstrap RTL classes (`me-2`, `ms-3`)
- Currency format: `{{ price.toFixed(2) }} د. أ` (Lebanese Pound)
- Empty states with Arabic messaging

### Error Handling Pattern

```javascript
// Frontend: Unified message system
catch (error) {
  console.error("Error description:", error);
  showMessage("حدث خطأ في الاتصال بالخادم", "danger");
}

// Backend: Consistent error responses
catch (error) {
  console.error("Controller error:", error);
  res.status(500).json({ error: "Internal server error" });
}
```

## File Structure Conventions

- **Views**: Use Composition API (`<script setup>`), import Navbar component
- **Routes**: Protected routes have `meta: { requiresAuth: true }`
- **Services**: AuthService class for token management (`client/src/services/`)
- **Middleware**: Reusable functions in `Server/src/middleware/`
- **Generated**: Prisma client output in `Server/generated/prisma/`

## Integration Points

- **API Base URL**: Frontend uses `${process.env.VUE_APP_API_BASE_URL}/`
- **Authentication**: JWT in localStorage as "token" key
- **Images**: Cloudinary with folder structure `ecommerce/products/`
- **Database**: Supabase PostgreSQL with connection pooling
- **Styling**: Bootstrap 5 with custom SCSS in `client/src/scss/custom.scss`

## Testing Endpoints

Use server's test files: `test-image-upload.js` and `test-add-images.js` for validating Cloudinary integration.

## Common Gotchas

- Frontend uses port 8080, backend uses 3000 (update API calls accordingly)
- Image URLs use `.url` property, not `.imageUrl`
- User ID extraction from localStorage requires parsing "userInfo" object
- Prisma client imports from `@prisma/client`
- All protected routes require `verifyToken` middleware on backend
