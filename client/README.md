# 📚 متجر الكتب - Arabic E-commerce Platform

A modern, responsive e-commerce web application built with Vue.js 3, featuring full RTL (Right-to-Left) support for Arabic users. This project provides a complete online bookstore experience with user authentication, product management, and shopping functionality.

## ✨ Features

### 🔐 **Authentication System**

- User registration and login
- JWT token-based authentication
- Password reset with OTP verification
- Secure session management
- Authentication guards for protected routes

### 👤 **User Management**

- User profile management
- Edit personal information
- Password change functionality
- Persistent login sessions

### 🛒 **E-commerce Features**

- Product browsing and categorization
- Shopping cart functionality
- Wishlist management
- Order history tracking
- Category-based product filtering

### 🌐 **Internationalization & Accessibility**

- Full RTL (Right-to-Left) support
- Arabic language interface
- Responsive design for all devices
- Modern UI/UX with smooth animations
- Bootstrap 5 components

### 🎨 **Modern UI/UX**

- Clean, minimalist design
- Custom color theme with earth tones
- Smooth animations and transitions
- Mobile-first responsive design
- Interactive dropdown menus

## 🛠️ Technologies Used

### **Frontend Framework**

- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **Vue Router 4** - Official router for Vue.js with navigation guards
- **Vue CLI 5** - Standard tooling for Vue.js development

### **UI & Styling**

- **Bootstrap 5.3.7** - CSS framework for responsive design
- **Bootstrap Icons 1.13.1** - Official icon library
- **SCSS/Sass** - CSS preprocessor for enhanced styling
- **Custom SCSS** - Tailored theme with RTL support

### **HTTP Client & API**

- **Axios 1.11.0** - Promise-based HTTP client for API requests
- **RESTful API** - Backend communication for user and product data

### **Development Tools**

- **Node-sass 9.0.0** - Sass compiler for CSS preprocessing
- **Babel** - JavaScript transpiler for modern syntax support
- **Core-js 3.8.3** - Standard library polyfills
- **dotenv 17.2.1** - Environment variable management

### **Build & Deployment**

- **Webpack** - Module bundler (via Vue CLI)
- **ES6+ Support** - Modern JavaScript features
- **Code Splitting** - Lazy loading for optimized performance
- **Hot Module Replacement** - Development server with live reloading

## 📁 Project Structure

```
client/
├── public/                     # Static assets
│   ├── index.html             # Main HTML template
│   ├── favicon.ico            # Website icon
│   └── placeholder-image.jpg   # Default product images
├── src/
│   ├── assets/                # Images and static resources
│   │   ├── logo.png
│   │   └── banner*.png        # Homepage banners
│   ├── components/            # Reusable Vue components
│   │   ├── Navbar.vue         # Navigation with RTL support
│   │   ├── Footer.vue         # Footer component
│   │   ├── Bannerslider.vue   # Homepage banner slider
│   │   └── Dashboard/         # Admin dashboard components
│   ├── views/                 # Page components
│   │   ├── HomeView.vue       # Homepage
│   │   ├── Login.vue          # Authentication (Login/Register/Reset)
│   │   ├── Profile.vue        # User profile management
│   │   ├── ClientViews/       # User-facing pages
│   │   ├── AdminViews/        # Admin panel pages
│   │   └── ProductsViews/     # Product-related pages
│   ├── router/
│   │   └── index.js           # Route definitions with auth guards
│   ├── scss/
│   │   └── custom.scss        # Custom styles with RTL support
│   ├── App.vue                # Root component
│   └── main.js                # Application entry point
├── package.json               # Dependencies and scripts
├── vue.config.js              # Vue CLI configuration
├── babel.config.js            # Babel configuration
└── README.md                  # Project documentation
```

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Git**

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/alsafoty/Perfumes-e-commerce.git
   cd Perfumes-e-commerce/client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Create .env file in the root directory
   VUE_APP_API_BASE_URL=http://localhost:3000
   ```

4. **Start development server**

   ```bash
   npm run serve
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

### **Build for Production**

```bash
npm run build
```

## 🔧 Configuration

### **API Endpoints**

The application connects to a backend API with the following endpoints:

- **Authentication**

  - `POST /api/user/login` - User login
  - `POST /api/user/Register` - User registration
  - `POST /api/user/password-reset` - Password reset request
  - `POST /api/user/otp-verify/{userId}` - OTP verification
  - `PUT /api/user/profile` - Update user profile

- **Products & Categories**
  - `GET /api/category` - Fetch product categories
  - `GET /api/products` - Fetch products
  - `GET /api/category/{id}` - Fetch category products

### **Environment Variables**

```env
VUE_APP_API_BASE_URL=http://localhost:3000
VUE_APP_ENVIRONMENT=development
```

## 🎨 Theme Customization

The project uses a custom Bootstrap theme with Arabic-friendly colors:

```scss
$primary: #8b4513; // Saddle Brown
$secondary: #d2b48c; // Tan
$success: #cd853f; // Peru
$info: #8fbc8f; // Dark Sea Green
$warning: #f4a460; // Sandy Brown
$danger: #b22222; // Fire Brick
$light: #faf9f6; // Off White
$dark: #3e2723; // Dark Brown
```

## 🌐 RTL Support

This project includes comprehensive RTL (Right-to-Left) support:

- **Text Direction**: All text flows right-to-left
- **Layout Mirroring**: UI elements are mirrored for Arabic reading patterns
- **Form Controls**: Input fields and form elements aligned for RTL
- **Navigation**: Menus and navigation work correctly in RTL mode
- **Typography**: Arabic fonts prioritized in font stack

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: Bootstrap 5 responsive breakpoints
- **Touch Friendly**: Large touch targets for mobile users
- **Flexible Layouts**: Adapts to all screen sizes

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Route Guards**: Protected routes require authentication
- **Input Validation**: Client-side form validation
- **XSS Protection**: Secure handling of user input
- **HTTPS Ready**: Production-ready security configuration

## 🚀 Performance Optimization

- **Code Splitting**: Routes are lazily loaded
- **Tree Shaking**: Unused code is eliminated
- **Asset Optimization**: Images and assets are optimized
- **Caching**: Proper caching headers for production
- **Minification**: CSS and JavaScript are minified

## 🧪 Development

### **Project Scripts**

```bash
# Start development server
npm run serve

# Build for production
npm run build

# Lint and fix files
npm run lint
```

### **Code Style**

- **Vue 3 Composition API**: Modern Vue.js patterns
- **ES6+ Syntax**: Modern JavaScript features
- **Component-based Architecture**: Reusable and maintainable components
- **Consistent Naming**: Clear and descriptive naming conventions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Al-Safoty**

- GitHub: [@alsafoty](https://github.com/alsafoty)

## 🙏 Acknowledgments

- **Vue.js Community** - For the amazing framework and ecosystem
- **Bootstrap Team** - For the comprehensive CSS framework
- **Arabic Typography** - For RTL design inspiration
- **Open Source Contributors** - For the various libraries used

---

<div align="center">
  <p>Built with ❤️ for the Arabic-speaking community</p>
  <p>🌟 Star this repo if you found it helpful!</p>
</div>
