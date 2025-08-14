# Book Store E-commerce API 📚

A comprehensive RESTful API for managing an online book store platform. This backend service provides complete functionality for user management, book catalog, shopping cart, orders, and administrative features for book retailers and publishers.

## 🚀 Overview

This API powers a full-featured e-commerce platform specifically designed for book retail. It handles everything from user authentication and book catalog management to order processing and payment integration. The system supports both customer operations and administrative functions with role-based access control, making it perfect for independent bookstores, chain retailers, and online book marketplaces.

### Key Features

- **User Management**: Registration, authentication, password reset with OTP verification
- **Book Catalog**: CRUD operations, categorization, author management, ISBN tracking
- **Shopping Experience**: Cart management, wishlist, advanced book search and filtering
- **Order Processing**: Complete order lifecycle with status tracking and shipping management
- **Payment Integration**: Stripe payment processing with secure transactions
- **Admin Panel**: User management, book inventory, sales analytics, banner management
- **Image Management**: Cloudinary integration for book cover images
- **Email Services**: Automated emails for order confirmations, shipping updates, and notifications
- **Advanced Search**: Search by title, author, ISBN, genre, publication year
- **Inventory Management**: Stock tracking, low stock alerts, automatic reordering

## 🛠️ Technologies & Tools

### Core Framework

- **Express.js** - Fast, unopinionated web framework for Node.js, chosen for its simplicity and extensive middleware ecosystem
- **Node.js** - JavaScript runtime for server-side development, enabling full-stack JavaScript development

### Database & ORM

- **PostgreSQL** - Robust relational database perfect for complex book metadata and relationships
- **Prisma** - Next-generation ORM providing type-safe database access and automatic migrations
- **Prisma Client** - Auto-generated database client with excellent TypeScript support

### Authentication & Security

- **JWT (jsonwebtoken)** - Stateless token-based authentication for scalable user sessions
- **bcryptjs** - Industry-standard password hashing with salt rounds for security
- **crypto** - Built-in Node.js crypto module for secure token generation and encryption

### File & Image Management

- **Multer** - Middleware for handling multipart/form-data, essential for book cover uploads
- **Cloudinary** - Cloud-based image management with automatic optimization and CDN delivery
- **Google APIs** - Integration with Google Books API and Google Drive for metadata and storage

### Email Services

- **Nodemailer** - Reliable email sending for order confirmations and customer notifications

### Payment Processing

- **Stripe** - Secure payment processing with support for multiple payment methods and subscriptions

### Validation & Utilities

- **Validator** - Comprehensive string validation and sanitization for user inputs
- **CORS** - Cross-Origin Resource Sharing middleware for frontend integration
- **Path** - Node.js path utilities for file system operations

### Development Tools

- **Nodemon** - Development server with automatic restart on file changes

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **PostgreSQL** database (v12 or higher)
- **Cloudinary** account for image management
- **Stripe** account for payment processing
- **Gmail** account with app password for email services
- **Git** for version control

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Perfumes e-commerce/Server"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/bookstore_db"
DIRECT_URL="postgresql://username:password@localhost:5432/bookstore_db"

# JWT Configuration
JWT_SECRET="your_super_secret_jwt_key_min_32_characters"

# Email Configuration (Gmail)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-bookstore@gmail.com"
EMAIL_PASS="your-gmail-app-password"
EMAIL_FROM="BookStore Team <noreply@bookstore.com>"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Google APIs Configuration
GOOGLE_BOOKS_API_KEY="your_google_books_api_key"
GOOGLE_DRIVE_CLIENT_ID="your_client_id"
GOOGLE_DRIVE_CLIENT_SECRET="your_client_secret"
GOOGLE_DRIVE_REFRESH_TOKEN="your_refresh_token"

# Server Configuration
PORT=3000
NODE_ENV="development"
BASE_URL="http://localhost:3000"

# Security
BCRYPT_ROUNDS=12
OTP_EXPIRY_MINUTES=10
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database with sample books
npx prisma db seed
```

### 5. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 🔐 Authentication & Authorization

The API uses JWT (JSON Web Tokens) for stateless authentication. Most endpoints require a valid token.

### Getting an Access Token

**POST** `/api/user/login`

```json
{
  "email": "reader@bookstore.com",
  "password": "securePassword123"
}
```

**Success Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJlYWRlciIsImlhdCI6MTY5MjM2...",
  "role": "CLIENT",
  "id": "user-uuid-here",
  "user": {
    "firstName": "John",
    "lastName": "Reader",
    "email": "reader@bookstore.com"
  }
}
```

### Using Authentication Tokens

Include the token in the Authorization header for protected endpoints:

```
Authorization: Bearer your_jwt_token_here
```

### Role-Based Access Control

#### CLIENT Role

- Browse books and categories
- Manage personal cart and wishlist
- Place and track orders
- Manage personal profile and addresses

#### ADMIN Role

- All CLIENT permissions
- Manage book inventory (CRUD operations)
- View all user orders and analytics
- Manage categories and banners
- Access administrative dashboards

## 📚 API Endpoints Documentation

### 🔑 User Management

#### Register New User

**POST** `/api/user/Register`

**Request:**

```json
{
  "firstName": "Jane",
  "lastName": "BookLover",
  "email": "jane@example.com",
  "username": "janebooks",
  "password": "SecurePass123!",
  "mobile": "+1-555-0123",
  "role": "CLIENT"
}
```

**Response:**

```json
{
  "newUser": {
    "id": "uuid-here",
    "firstName": "Jane",
    "lastName": "BookLover",
    "email": "jane@example.com",
    "username": "janebooks",
    "role": "CLIENT",
    "isActive": true,
    "createdAt": "2025-08-14T10:30:00Z"
  }
}
```

#### User Login

**POST** `/api/user/login`

**Request:**

```json
{
  "email": "jane@example.com",
  "password": "SecurePass123!"
}
```

#### Password Reset Request

**POST** `/api/user/password-reset`

**Request:**

```json
{
  "email": "jane@example.com"
}
```

**Response:**

```json
{
  "message": "OTP sent to your email account"
}
```

#### OTP Verification

**POST** `/api/user/otp-verify/:userId`

**Request:**

```json
{
  "otp": "123456"
}
```

#### Get User Profile

**GET** `/api/user/:id`

- **Authentication**: Required
- **Authorization**: Own profile or Admin

**Response:**

```json
{
  "id": "uuid-here",
  "firstName": "Jane",
  "lastName": "BookLover",
  "email": "jane@example.com",
  "username": "janebooks",
  "mobile": "+1-555-0123",
  "role": "CLIENT",
  "addresses": [...],
  "createdAt": "2025-08-14T10:30:00Z"
}
```

### 📖 Book Management

#### Get All Books

**GET** `/api/product/`

**Response:**

```json
{
  "books": [
    {
      "id": 1,
      "name": "الأسود يليق بك",
      "description": "رواية رومانسية مشوقة تحكي قصة حب معقدة",
      "price": 2.99,
      "stock": 50,
      "categoryId": 1,
      "isbn": "978-1-234567-89-0",
      "author": "مؤلف مشهور",
      "publisher": "دار النشر العربية",
      "publicationYear": 2023,
      "pages": 320,
      "language": "Arabic",
      "Category": {
        "id": 1,
        "name": "الروايات العربية",
        "description": "مجموعة الروايات العربية المعاصرة"
      },
      "ProductImages": [
        {
          "id": "img-uuid",
          "url": "https://res.cloudinary.com/bookstore/image/cover1.jpg"
        }
      ],
      "createdAt": "2025-08-14T10:30:00Z",
      "updatedAt": "2025-08-14T10:30:00Z"
    }
  ]
}
```

#### Get Books with Pagination

**GET** `/api/product/page/:page`

**Parameters:**

- `page`: Page number (starts from 0)
- Returns 16 books per page

**Example:** `/api/product/page/0`

#### Search Books

**GET** `/api/product/browse?search=:query&category=:categoryId&author=:author&minPrice=:min&maxPrice=:max&sortBy=:field&sortOrder=:order`

**Query Parameters:**

- `search`: Search in title, description, author
- `category`: Filter by category ID
- `author`: Filter by author name
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `sortBy`: Sort field (price, name, createdAt)
- `sortOrder`: asc or desc

**Example:** `/api/product/browse?search=رواية&category=1&minPrice=1&maxPrice=10&sortBy=price&sortOrder=asc`

#### Get Book by ID

**GET** `/api/product/:id`

**Response:**

```json
{
  "id": 1,
  "name": "الأسود يليق بك",
  "description": "رواية رومانسية مشوقة...",
  "price": 2.99,
  "stock": 50,
  "isbn": "978-1-234567-89-0",
  "author": "مؤلف مشهور",
  "publisher": "دار النشر العربية",
  "publicationYear": 2023,
  "Category": {...},
  "ProductImages": [...],
  "reviews": [...],
  "averageRating": 4.5
}
```

#### Create Book (Admin Only)

**POST** `/api/product/`

- **Authentication**: Required
- **Authorization**: Admin only

**Request (with file upload):**

```json
{
  "name": "كتاب جديد",
  "description": "وصف الكتاب الجديد",
  "price": 15.99,
  "stock": 100,
  "categoryId": 1,
  "isbn": "978-1-234567-90-6",
  "author": "الكاتب الجديد",
  "publisher": "دار النشر الحديثة",
  "publicationYear": 2025,
  "pages": 280,
  "language": "Arabic"
}
```

#### Create Multiple Books (Admin Only)

**POST** `/api/product/group`

- **Authentication**: Required
- **Authorization**: Admin only

**Request:**

```json
[
  {
    "name": "الأسود يليق بك",
    "description": "رواية رومانسية مشوقة تحكي قصة حب معقدة بين شخصيتين من عالمين مختلفين",
    "price": 2.99,
    "stock": 50,
    "categoryId": 1
  },
  {
    "name": "مئة عام من العزلة",
    "description": "رائعة غابرييل غارسيا ماركيز المترجمة للعربية، ملحمة عائلة بوينديا عبر القرون",
    "price": 2.99,
    "stock": 50,
    "categoryId": 1
  }
]
```

#### Update Book (Admin Only)

**PUT** `/api/product/:id`

- **Authentication**: Required
- **Authorization**: Admin only

#### Delete Book (Admin Only)

**DELETE** `/api/product/:id`

- **Authentication**: Required
- **Authorization**: Admin only

#### Get Total Books Count

**GET** `/api/product/count`

**Response:**

```json
{
  "totalBooks": 1250
}
```

### 📂 Category Management

#### Get All Categories

**GET** `/api/category/`

**Response:**

```json
{
  "categories": [
    {
      "id": 1,
      "name": "الروايات العربية",
      "description": "مجموعة الروايات العربية المعاصرة والكلاسيكية",
      "createdAt": "2025-08-14T10:30:00Z"
    },
    {
      "id": 2,
      "name": "الكتب العلمية",
      "description": "كتب في مختلف المجالات العلمية",
      "createdAt": "2025-08-14T10:30:00Z"
    }
  ]
}
```

#### Get Categories with Book Count

**GET** `/api/category/with-count`

**Response:**

```json
{
  "categories": [
    {
      "id": 1,
      "name": "الروايات العربية",
      "description": "مجموعة الروايات العربية المعاصرة",
      "_count": {
        "Product": 245
      }
    }
  ]
}
```

#### Get Category by ID

**GET** `/api/category/:id`

#### Create Category (Admin Only)

**POST** `/api/category/`

**Request:**

```json
{
  "name": "الشعر العربي",
  "description": "مجموعة دواوين الشعر العربي الكلاسيكي والمعاصر"
}
```

### 🛒 Shopping Cart Management

#### Get User's Cart

**GET** `/api/cart/`

- **Authentication**: Required

**Response:**

```json
{
  "cart": {
    "id": "cart-uuid",
    "userId": "user-uuid",
    "CartItem": [
      {
        "id": "item-uuid",
        "quantity": 2,
        "Product": {
          "id": 1,
          "name": "الأسود يليق بك",
          "price": 2.99,
          "ProductImages": [...]
        }
      }
    ],
    "totalItems": 2,
    "totalAmount": 5.98
  }
}
```

#### Add Item to Cart

**POST** `/api/cart/`

- **Authentication**: Required

**Request:**

```json
{
  "productId": 1,
  "quantity": 2
}
```

#### Update Cart Item Quantity

**PUT** `/api/cart/:itemId`

- **Authentication**: Required

**Request:**

```json
{
  "quantity": 3
}
```

#### Remove Item from Cart

**DELETE** `/api/cart/:itemId`

- **Authentication**: Required

#### Clear Entire Cart

**DELETE** `/api/cart/clear`

- **Authentication**: Required

### ❤️ Wishlist Management

#### Get User's Wishlist

**GET** `/api/wishlist/`

- **Authentication**: Required

**Response:**

```json
{
  "wishlist": [
    {
      "id": "wishlist-uuid",
      "Product": {
        "id": 1,
        "name": "الأسود يليق بك",
        "price": 2.99,
        "author": "مؤلف مشهور",
        "ProductImages": [...]
      },
      "createdAt": "2025-08-14T10:30:00Z"
    }
  ]
}
```

#### Add Book to Wishlist

**POST** `/api/wishlist/`

- **Authentication**: Required

**Request:**

```json
{
  "productId": 1
}
```

#### Remove Book from Wishlist

**DELETE** `/api/wishlist/:id`

- **Authentication**: Required

### 🏠 Address Management

#### Get User's Addresses

**GET** `/api/address/`

- **Authentication**: Required

#### Add New Address

**POST** `/api/address/`

- **Authentication**: Required

**Request:**

```json
{
  "addressLine1": "123 Main Street",
  "addressLine2": "Apartment 4B",
  "city": "Cairo",
  "state": "Cairo Governorate",
  "zip": "11511",
  "country": "Egypt",
  "notes": "Near the large mosque"
}
```

#### Update Address

**PUT** `/api/address/:id`

- **Authentication**: Required

#### Delete Address

**DELETE** `/api/address/:id`

- **Authentication**: Required

### 📦 Order Management

#### Get User's Orders

**GET** `/api/order/`

- **Authentication**: Required

**Response:**

```json
{
  "orders": [
    {
      "id": "order-uuid",
      "userId": "user-uuid",
      "status": "CONFIRMED",
      "totalAmount": 25.97,
      "shippingAddress": {...},
      "OrderItem": [
        {
          "id": "item-uuid",
          "quantity": 3,
          "price": 2.99,
          "Product": {
            "name": "الأسود يليق بك",
            "author": "مؤلف مشهور"
          }
        }
      ],
      "createdAt": "2025-08-14T10:30:00Z",
      "updatedAt": "2025-08-14T11:00:00Z"
    }
  ]
}
```

#### Get All Orders (Admin Only)

**GET** `/api/order/all`

- **Authentication**: Required
- **Authorization**: Admin only

#### Create New Order

**POST** `/api/order/`

- **Authentication**: Required

**Request:**

```json
{
  "addressId": "address-uuid",
  "paymentMethod": "stripe",
  "notes": "Please handle with care - books"
}
```

#### Update Order Status (Admin Only)

**PUT** `/api/order/:id/status`

- **Authentication**: Required
- **Authorization**: Admin only

**Request:**

```json
{
  "status": "DELIVERED"
}
```

**Available Status Values:**

- `PENDING`: Order placed, awaiting confirmation
- `CONFIRMED`: Order confirmed, being prepared
- `SHIPPED`: Order shipped, in transit
- `DELIVERED`: Order delivered successfully
- `CANCELLED`: Order cancelled
- `REFUNDED`: Order refunded

### 🖼️ Banner Management (Admin Only)

#### Get All Banners

**GET** `/api/banner/`

#### Create Banner

**POST** `/api/banner/`

- **Authentication**: Required
- **Authorization**: Admin only

**Request:**

```json
{
  "title": "Arabic Literature Sale",
  "description": "50% off on all Arabic novels",
  "imageUrl": "https://res.cloudinary.com/bookstore/banner-arabic-sale.jpg",
  "href": "/category/arabic-novels",
  "isActive": true
}
```

#### Update Banner

**PUT** `/api/banner/:id`

- **Authentication**: Required
- **Authorization**: Admin only

#### Delete Banner

**DELETE** `/api/banner/:id`

- **Authentication**: Required
- **Authorization**: Admin only

## ⚠️ Error Handling

The API uses standard HTTP status codes and returns detailed error messages in a consistent format.

### HTTP Status Codes

| Code | Meaning               | Description                                     |
| ---- | --------------------- | ----------------------------------------------- |
| 200  | OK                    | Request successful                              |
| 201  | Created               | Resource created successfully                   |
| 400  | Bad Request           | Invalid request data or parameters              |
| 401  | Unauthorized          | Authentication required or invalid token        |
| 403  | Forbidden             | Insufficient permissions for the operation      |
| 404  | Not Found             | Requested resource doesn't exist                |
| 409  | Conflict              | Resource already exists (e.g., duplicate email) |
| 422  | Unprocessable Entity  | Valid request format but semantic errors        |
| 500  | Internal Server Error | Server-side error                               |

### Error Response Format

All errors follow this consistent structure:

```json
{
  "error": "Detailed human-readable error message",
  "code": "ERROR_CODE",
  "field": "specific_field_if_applicable",
  "timestamp": "2025-08-14T10:30:00.000Z",
  "path": "/api/product/123"
}
```

### Common Error Scenarios

#### Authentication Errors

```json
{
  "error": "Invalid credentials. Please check your email and password.",
  "code": "INVALID_CREDENTIALS",
  "timestamp": "2025-08-14T10:30:00.000Z"
}
```

#### Authorization Errors

```json
{
  "error": "Access denied. Admin privileges required for this operation.",
  "code": "INSUFFICIENT_PERMISSIONS",
  "timestamp": "2025-08-14T10:30:00.000Z"
}
```

#### Validation Errors

```json
{
  "error": "Price must be greater than 0",
  "code": "VALIDATION_ERROR",
  "field": "price",
  "timestamp": "2025-08-14T10:30:00.000Z"
}
```

#### Resource Not Found

```json
{
  "error": "Book with ID 999 not found",
  "code": "RESOURCE_NOT_FOUND",
  "timestamp": "2025-08-14T10:30:00.000Z"
}
```

## 🚀 Development & Deployment

### Project Structure

```
src/
├── controllers/              # Business logic layer
│   ├── userController.js     # User management operations
│   ├── productController.js  # Book management operations
│   ├── categoryController.js # Category management
│   ├── cartController.js     # Shopping cart logic
│   ├── orderController.js    # Order processing
│   ├── wishlistController.js # Wishlist management
│   ├── addressController.js  # Address management
│   └── bannerController.js   # Banner management
├── routes/                   # API route definitions
│   ├── user.js              # User routes
│   ├── product.js           # Book routes
│   ├── category.js          # Category routes
│   ├── cart.js              # Cart routes
│   ├── order.js             # Order routes
│   ├── wishlist.js          # Wishlist routes
│   ├── address.js           # Address routes
│   └── banner.js            # Banner routes
├── middleware/               # Custom middleware
│   ├── auth.js              # JWT authentication
│   ├── RBAC.js              # Role-based access control
│   ├── imageUpload.js       # File upload handling
│   ├── sendEmail.js         # Email service
│   ├── otp.js               # OTP verification
│   └── passreset.js         # Password reset logic
├── utils/                    # Utility functions
│   ├── validation.js        # Input validation helpers
│   ├── pagination.js        # Pagination helpers
│   └── constants.js         # Application constants
└── index.js                 # Application entry point

prisma/
├── schema.prisma            # Database schema definition
├── migrations/              # Database migration files
└── seed.js                  # Database seeding script

generated/
└── prisma/                  # Generated Prisma client
```

#### Database Management

```bash
# View database in browser
npx prisma studio

# Reset database (CAUTION: Deletes all data)
npx prisma migrate reset

# Generate Prisma client after schema changes
npx prisma generate

# Create new migration
npx prisma migrate dev --name migration_name

# Apply pending migrations
npx prisma migrate deploy
```

#### Testing

### Environment Configuration

#### Development Environment

```env
NODE_ENV=development
DATABASE_URL="postgresql://localhost:5432/bookstore_dev"
JWT_SECRET="dev_secret_key_minimum_32_characters"
STRIPE_SECRET_KEY="sk_test_..."
```

#### Production Environment

```env
NODE_ENV=production
DATABASE_URL="postgresql://production_host:5432/bookstore_prod"
JWT_SECRET="super_secure_production_key_minimum_32_characters"
STRIPE_SECRET_KEY="sk_live_..."
```

#### Staging Environment

```env
NODE_ENV=staging
DATABASE_URL="postgresql://staging_host:5432/bookstore_staging"
JWT_SECRET="staging_secure_key_minimum_32_characters"
STRIPE_SECRET_KEY="sk_test_..."
```

## 📖 Additional Resources & Documentation

### External API Integrations

- **Google Books API**: For book metadata enrichment
- **Stripe Documentation**: [https://stripe.com/docs/api](https://stripe.com/docs/api)
- **Cloudinary Docs**: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Prisma Documentation**: [https://www.prisma.io/docs/](https://www.prisma.io/docs/)

### Database Schema Overview

The database includes the following main entities:

- **Users**: Customer and admin accounts
- **Products** (Books): Book catalog with metadata
- **Categories**: Book categorization system
- **Cart/CartItems**: Shopping cart functionality
- **Orders/OrderItems**: Order management system
- **Wishlist**: User book wishlist
- **Addresses**: User shipping addresses
- **Banners**: Promotional banners

### Best Practices Implemented

- **Security**: JWT authentication, password hashing, input validation
- **Error Handling**: Consistent error responses and logging
- **Code Organization**: MVC pattern with clear separation of concerns
- **Database**: Proper relationships and constraints
- **API Design**: RESTful endpoints with clear naming conventions

## 🤝 Contributing

We welcome contributions to improve the Book Store API! Here's how you can help:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request
