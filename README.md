# 🌸 Books E-commerce Platform

A modern, full-stack e-commerce platform for books with Arabic RTL support, built with Vue.js 3 and Node.js.

## 🚀 Project Overview

This is a comprehensive e-commerce solution featuring a modern Vue.js frontend and a robust Node.js backend, specifically designed for Arabic-speaking markets with full RTL (Right-to-Left) support.

### ✨ Key Features

- **🛒 Complete E-commerce Functionality**: Product catalog, shopping cart, wishlist, orders
- **🔐 Authentication & Authorization**: JWT-based auth with role-based access control
- **📱 Mobile-Responsive Design**: Optimized for all devices with Bootstrap 5
- **🌍 Arabic RTL Support**: Full localization for Arabic users
- **☁️ Cloud Integration**: Cloudinary for image management, Supabase PostgreSQL
- **💳 Payment Processing**: Integrated payment system
- **📊 Admin Dashboard**: Complete admin panel for product and order management

### 🏗️ Architecture

```
📁 Books E-commerce/
├── 📂 client/          # Vue.js 3 Frontend Application
├── 📂 server/          # Node.js Backend API
├── 📂 .github/         # GitHub workflows and documentation
└── 📄 README.md        # This file
```

## 🛠️ Tech Stack

### Frontend (Client)

- **Framework**: Vue.js 3 with Composition API
- **Styling**: Bootstrap 5 with custom SCSS
- **State Management**: Vue 3 Reactivity
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Language**: Arabic RTL support

### Backend (Server)

- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: JWT tokens
- **File Upload**: Cloudinary integration
- **API**: RESTful API design

## 🚦 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (Supabase recommended)
- Cloudinary account for image storage

### 1. Clone the Repository

```bash
git clone https://github.com/alsafoty/books-e-commerce.git
cd "Books e-commerce"
```

### 2. Setup Backend

```bash
cd Server
npm install
# Configure environment variables (see Server/README.md)
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
# Configure environment variables (see client/README.md)
npm run serve
```

### 4. Access the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000

## 📚 Documentation

For detailed setup instructions, configuration, and development guidelines:

### 📖 [Server Documentation](./Server/README.md)

- API endpoints and documentation
- Database setup and migrations
- Environment configuration
- Cloudinary integration
- Authentication system

### 📖 [Client Documentation](./client/README.md)

- Vue.js application structure
- Component documentation
- Routing and navigation
- State management
- Mobile responsiveness

## 🌟 Features Breakdown

### 🛍️ Customer Features

- Browse products by categories
- Advanced search and filtering
- Product details with image gallery
- Shopping cart management
- Wishlist functionality
- User authentication and profiles
- Order history and tracking
- Mobile-optimized interface

### 👨‍💼 Admin Features

- Product management (CRUD)
- Category management
- Order processing
- User management
- Image upload and management
- Analytics and reporting
- Banner management

### 🔧 Technical Features

- Responsive design (2 products per row on mobile)
- JWT authentication with refresh tokens
- Role-based access control
- File upload with Cloudinary
- Database migrations with Prisma
- Error handling and validation
- API rate limiting
- CORS configuration

## 🌐 API Endpoints

The backend provides a comprehensive REST API. Key endpoints include:

- `GET /api/product` - Product management
- `GET /api/category` - Category management
- `POST /api/auth` - Authentication
- `GET /api/cart` - Shopping cart
- `GET /api/wishlist` - Wishlist management
- `GET /api/order` - Order processing

For complete API documentation, see [Server/README.md](./Server/README.md).

## 🔐 Environment Setup

Both client and server require environment configuration:

### Server Environment Variables

```env
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# See Server/.env.example for complete list
```

### Client Environment Variables

```env
VUE_APP_API_BASE_URL=http://localhost:3000/api
# See client/.env.example for complete list
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Guidelines

- Follow Vue.js 3 Composition API patterns
- Use Bootstrap classes for responsive design
- Implement proper error handling
- Write comprehensive API documentation
- Test on multiple devices and browsers
- Follow Arabic RTL design principles

## 🐛 Troubleshooting

Common issues and solutions:

1. **Database Connection**: Ensure Supabase connection string is correct
2. **Image Upload**: Verify Cloudinary credentials
3. **CORS Issues**: Check API base URL configuration
4. **Mobile Layout**: Ensure Bootstrap responsive classes are used

For detailed troubleshooting, check the individual README files for client and server.

## 📧 Support

For support and questions:

- Create an issue on GitHub
- Check existing documentation
- Review API endpoints in Server/README.md
- Check component usage in client/README.md

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Coding! 🚀**

Built with ❤️ for the Arabic e-commerce community.
