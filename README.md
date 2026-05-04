# NepalEstates - Property Listing Platform

A modern, feature-rich property listing platform built with React, TypeScript, and Tailwind CSS. Find your dream property in Nepal with verified listings and advanced filtering.

## 🚀 Features

- **Property Listings**: Browse thousands of verified properties across Nepal
- **Advanced Filtering**: Filter by category, city, price range, and more
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Admin Dashboard**: Complete property and inquiry management system
- **Authentication**: Secure user authentication and authorization
- **Real-time Updates**: React Query for efficient data management
- **Modern UI**: Built with Radix UI components and Tailwind CSS

## 📋 Requirements

- Node.js 16+
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nepalestates.git
   cd nepalestates
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then update `.env.local` with your configuration

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run typecheck` - Run TypeScript type checking

## 📁 Project Structure

```
src/
├── api/              # API client configuration
├── components/
│   ├── layout/       # Layout components (Navbar, Footer, etc.)
│   ├── ui/           # UI components (buttons, inputs, etc.)
│   └── ...           # Feature components
├── lib/
│   ├── constants.js  # App-wide constants
│   ├── hooks.js      # Custom React hooks
│   ├── utils.js      # Utility functions
│   ├── error-boundary.jsx  # Error boundary component
│   └── ...           # Other utilities
├── pages/            # Page components
│   ├── admin/        # Admin pages
│   └── ...           # Public pages
├── App.jsx           # Root component
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## 🎨 Customization

### Colors
Colors are defined in `index.css` using CSS variables. Edit the root theme variables to customize the appearance.

### Fonts
The project uses:
- **Inter** - Body text (Google Fonts)
- **Playfair Display** - Headings (Google Fonts)

Edit `tailwind.config.js` to change fonts.

## 🔐 Authentication

The app uses Base44 SDK for authentication. Configure your Base44 credentials in `.env.local`:

```env
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-domain.com
```

## 🗂️ Key Files

### Configuration
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `jsconfig.json` - JavaScript/TypeScript paths
- `.eslintrc.json` - ESLint configuration

### Core Files
- `src/App.jsx` - Main app component with routing
- `src/main.jsx` - Application entry point
- `src/lib/AuthContext.jsx` - Authentication context
- `src/lib/hooks.js` - Custom hooks for common operations

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service (Vercel, Netlify, GitHub Pages, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/yourusername/nepalestates/issues)
- Email: support@nepalestates.com
- Website: https://nepalestates.com

## 🎯 Roadmap

- [ ] Advanced search with AI suggestions
- [ ] Virtual property tours
- [ ] Payment integration for property booking
- [ ] Mobile app (React Native)
- [ ] Property comparison tool
- [ ] Mortgage calculator
- [ ] Market analytics dashboard

---

Made with ❤️ for Nepal's real estate market
