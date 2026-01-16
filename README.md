# 🏪 StoreTrack

[![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2.1-61dafb)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

**StoreTrack** is a modern, full-featured inventory and point-of-sale (POS) management system designed for small to medium-sized retail stores. Built with Next.js 16 and TypeScript, it provides a comprehensive solution for managing products, processing sales, tracking staff performance, and generating detailed business analytics.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [User Roles & Workflows](#-user-roles--workflows)
- [API Integration](#-api-integration)
- [Core Modules](#-core-modules)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

StoreTrack is a comprehensive retail management platform that streamlines daily store operations through an intuitive web interface. It combines inventory management, point-of-sale functionality, staff management, and business intelligence reporting into a single, cohesive application.

### What StoreTrack Does

- **Inventory Management**: Track products, stock levels, pricing, and receive low-stock alerts
- **Point of Sale (POS)**: Process customer transactions with a streamlined checkout interface
- **Staff Management**: Create and manage staff accounts with role-based access control
- **Sales Attribution**: Track which staff member processed each transaction
- **Business Analytics**: Monitor revenue, profit margins, and sales performance
- **Transaction History**: Maintain detailed records of all sales transactions
- **Multi-User Support**: Role-based access for owners, managers, and staff members

### Target Audience

- **Store Owners**: Monitor business performance and manage operations
- **Store Managers**: Oversee daily activities and staff performance
- **Staff/Cashiers**: Process sales and manage checkout operations

---

## 🔍 Problem Statement

### Challenges Faced by Small Retail Stores

1. **Manual Inventory Tracking**: Traditional pen-and-paper or spreadsheet-based inventory management is error-prone and time-consuming
2. **Lack of Sales Visibility**: Difficulty tracking which staff member made which sale
3. **Poor Financial Insights**: Limited ability to analyze profit margins, revenue trends, and stock performance
4. **Inefficient Checkout Process**: Slow, manual transaction recording leads to long customer wait times
5. **Stock Management Issues**: No automated alerts for low inventory, leading to stockouts
6. **Multiple Disconnected Systems**: Separate tools for inventory, sales, and reporting create data silos

### How StoreTrack Solves These Problems

✅ **Real-Time Inventory**: Automatically updates stock levels after each transaction  
✅ **Staff Attribution**: Every sale is linked to the staff member who processed it  
✅ **Comprehensive Reports**: Generate profit analysis, sales by staff, and low-stock reports  
✅ **Fast POS Checkout**: Barcode scanning and quick product lookup for rapid transactions  
✅ **Automated Alerts**: Low-stock notifications prevent inventory shortages  
✅ **Unified Platform**: All features integrated into a single, user-friendly interface  
✅ **Multi-User Access**: Role-based permissions ensure security and appropriate access levels  

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Email-Based Registration**: Sign up with email verification via OTP
- **Dual Login System**: Separate authentication for owners and staff
- **Password Reset**: Secure password recovery via email token (30-minute expiry)
- **Profile Management**: Update user information and profile images
- **Role-Based Access Control**: Admin, Manager, and Staff roles with different permissions

### 📦 Inventory Management
- **Product Catalog**: Comprehensive product database with SKU and barcode support
- **CRUD Operations**: Create, read, update, and delete products
- **Stock Tracking**: Real-time quantity monitoring with automatic updates
- **Low Stock Alerts**: Customizable thresholds with automated notifications
- **Product Search**: Quick lookup by name, SKU, or barcode
- **Pricing Management**: Separate cost price and selling price for profit tracking

### 💰 Point of Sale (POS)
- **Shopping Cart Interface**: Add multiple items to cart with adjustable quantities
- **Barcode Scanner Support**: Quick product lookup via barcode scanning
- **Quantity Validation**: Prevents overselling by checking available stock
- **Transaction Processing**: Generate unique transaction IDs for each sale
- **Receipt Generation**: Print-friendly receipts with itemized details
- **Staff Attribution**: Automatically records which staff member processed the sale

### 📊 Business Analytics & Reporting
- **Total Sales Report**: Revenue, transaction count, and sales amount
- **Sales by Staff**: Performance breakdown by staff member
- **Profit Analysis**: Total profit, profit margins, and cost vs. revenue
- **Profit by Product**: Product-wise profitability analysis
- **Profit by Staff**: Staff-wise profit contribution
- **Low Stock Report**: Products below threshold with quantity details
- **Visual Charts**: Bar charts and graphs for trend analysis

### 👥 Staff Management
- **Staff Directory**: List all staff members with roles
- **Create Staff Accounts**: Add new staff with email and password
- **Edit Staff Information**: Update staff details
- **Delete Staff**: Remove staff members (admin only)
- **Permission Enforcement**: Staff users cannot access management features

### 📈 Dashboard
- **Admin Dashboard**: KPI cards, sales overview, low stock alerts, staff performance
- **Staff Dashboard**: Simplified view directing to sales and transaction history
- **Real-Time Data**: Live updates of sales, revenue, and inventory

### 🎨 User Experience
- **Responsive Design**: Mobile-friendly interface with collapsible navigation
- **Dark Mode Support**: Toggle between light, dark, and system themes
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Skeleton loaders during data fetches
- **Form Validation**: Client-side validation with Zod schemas
- **Error Handling**: Graceful error messages and recovery

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.10 | React framework with App Router |
| **React** | 19.2.1 | UI library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **shadcn/ui** | Latest | Component library built on Radix UI |
| **TanStack React Query** | 5.90.12 | Server state management |
| **React Hook Form** | 7.68.0 | Form management |
| **Zod** | 4.2.1 | Schema validation |
| **Axios** | 1.13.2 | HTTP client |
| **Recharts** | 2.15.4 | Charts and data visualization |
| **Lucide React** | 0.562.0 | Icon library |
| **Sonner** | 2.0.7 | Toast notifications |
| **next-themes** | 0.4.6 | Theme management (dark mode) |

### UI Components (Radix UI)
- Avatar
- Checkbox
- Dialog
- Dropdown Menu
- Label
- Select
- Separator
- Slot
- Tooltip

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **pnpm**: Package manager

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 20 or higher
- **pnpm**: Package manager (or npm/yarn/bun)
- **Backend API**: StoreTrack backend service running

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Daniel-T-Dada/StoreTrack.git
   cd StoreTrack
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-api.com
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

### Linting

```bash
pnpm lint
```

---

## 📁 Project Structure

```
StoreTrack/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── signin/               # Owner/Manager sign-in
│   │   ├── signup/               # User registration
│   │   ├── verify-otp/           # Email verification
│   │   ├── forgot-password/      # Password reset request
│   │   └── reset-password/       # Password reset form
│   ├── (dashboard)/              # Protected app routes
│   │   ├── page.tsx              # Main dashboard
│   │   ├── products/             # Inventory management
│   │   ├── sales/                # POS and transaction history
│   │   │   ├── page.tsx          # POS checkout
│   │   │   └── history/          # Transaction history
│   │   ├── staff/                # Staff management
│   │   ├── reports/              # Business analytics
│   │   ├── profile/              # User profile
│   │   └── staff-dashboard/      # Staff-only dashboard
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   └── proxy/                # Backend API proxy
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── providers.tsx             # App providers
│
├── components/                   # React components
│   ├── auth/
│   │   └── AuthForm.tsx          # Reusable authentication form
│   ├── AppShell.tsx              # Main layout wrapper
│   ├── AppSidebar.tsx            # Navigation sidebar
│   ├── Header.tsx                # Top navigation bar
│   ├── ProductForm.tsx           # Product create/edit form
│   ├── SalesForm.tsx             # POS checkout form
│   ├── StaffForm.tsx             # Staff management form
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── table.tsx
│       └── ... (other UI components)
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Authentication (login, register, OTP)
│   ├── useProducts.ts            # Product CRUD operations
│   ├── useSales.ts               # Sales list management
│   ├── useTransactions.ts        # Transaction history & checkout
│   ├── useStaff.ts               # Staff management
│   ├── useReports.ts             # Report data fetching
│   ├── useMe.ts                  # Current user information
│   └── useProfileImage.ts        # Profile image upload
│
├── lib/                          # Utility functions
│   ├── api.ts                    # Axios instance configuration
│   └── utils.ts                  # Helper functions
│
├── types/                        # TypeScript definitions
│   └── api.ts                    # API response types
│
├── public/                       # Static assets
│   └── ... (images, icons, etc.)
│
├── .gitignore                    # Git ignore rules
├── components.json               # shadcn/ui configuration
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Project dependencies
├── postcss.config.mjs            # PostCSS configuration
├── proxy.ts                      # API proxy configuration
├── README.md                     # This file
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## 👤 User Roles & Workflows

### 1️⃣ Owner/Manager Workflow

**Initial Setup:**
1. Sign up with name, email, password, and store name
2. Verify email address via OTP
3. Access admin dashboard

**Daily Operations:**
1. **Dashboard** → View KPIs (total sales, revenue, transactions, profit)
2. **Products** → Add/update inventory, monitor stock levels
3. **Staff** → Create staff accounts, manage roles
4. **Sales** → Process transactions (if acting as cashier)
5. **Reports** → Analyze sales by staff, profit margins, low stock items
6. **Profile** → Update personal information and profile image

**Key Permissions:**
- ✅ Full access to all features
- ✅ Create, edit, delete products
- ✅ Create, edit, delete staff
- ✅ View all reports and analytics
- ✅ Process sales transactions
- ✅ View transaction history for all staff

---

### 2️⃣ Staff Workflow

**Onboarding:**
1. Receive login credentials from admin
2. Sign in via staff login page
3. Access staff dashboard

**Daily Operations:**
1. **Sales** → Navigate to POS checkout
2. **Search Products** → Find items by name, SKU, or barcode
3. **Add to Cart** → Select products and quantities
4. **Checkout** → Process transaction and generate receipt
5. **History** → View own transaction history

**Key Permissions:**
- ✅ Process sales transactions
- ✅ View own transaction history
- ✅ Access staff dashboard
- ❌ Cannot view other staff's transactions
- ❌ Cannot create/edit/delete products
- ❌ Cannot access reports
- ❌ Cannot manage other staff

---

## 🔌 API Integration

StoreTrack uses a proxy-based architecture to communicate with the backend API. All API calls are routed through `/api/proxy/*` to handle authentication cookies and prevent CORS issues.

### API Endpoint Categories

#### Authentication (`/auth`)
- `POST /auth/login` - Owner/Manager login
- `POST /staff-auth/login` - Staff login
- `POST /auth/register-send-otp` - Register and send OTP
- `POST /auth/verify-otp-login` - Verify OTP and log in
- `POST /auth/resend-verification` - Resend OTP email
- `POST /auth/forgot-password` - Initiate password reset
- `POST /auth/reset-password` - Reset password with token
- `GET /auth/me` - Get current user information
- `PUT /auth/me/profile-image` - Upload profile image

#### Products (`/products`)
- `GET /products` - List all products
- `POST /products` - Create new product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product
- `GET /products/search?q={query}` - Search products

#### Sales (`/sales`)
- `POST /sales` - Record individual sale
- `POST /sales/checkout` - Process complete transaction
- `GET /sales/transactions` - List all transactions
- `GET /sales/transactions/{id}` - Get transaction details
- `GET /sales/transactions/{id}/receipt` - Get receipt details

#### Staff (`/staff`)
- `GET /staff` - List all staff members
- `POST /staff` - Create new staff member
- `DELETE /staff/{id}` - Delete staff member

#### Reports (`/reports`)
- `GET /reports/total-sales` - Total sales overview
- `GET /reports/sales-by-staff` - Sales breakdown by staff
- `GET /reports/low-stock` - Low stock items
- `GET /reports/profit` - Profit summary
- `GET /reports/profit-by-product` - Product-wise profit
- `GET /reports/profit-by-staff` - Staff-wise profit

### Data Models

**User**
```typescript
{
  _id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'staff';
  userType: 'owner' | 'staff';
  storeId: string;
  profileImage?: string;
}
```

**Product**
```typescript
{
  _id: string;
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  costPrice: number;
  quantity: number;
  lowStockThreshold: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Sale**
```typescript
{
  _id: string;
  product: Product;
  staff: Staff;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  transactionId: string;
  createdAt: string;
}
```

**Transaction**
```typescript
{
  transactionId: string;
  sales: Sale[];
  totalAmount: number;
  totalQuantity: number;
  totalItems: number;
  createdAt: string;
  staff: Staff;
}
```

---

## 🎯 Core Modules

### 1. Inventory Management (`/products`)

**Features:**
- Product catalog table with sortable columns
- Create product form with validation
- Edit product modal
- Delete confirmation dialog
- Low stock indicator badges
- Quick search functionality

**Key Operations:**
- Add products with SKU, barcode, pricing, and stock quantity
- Set low stock thresholds for automated alerts
- Update pricing and quantities
- Delete products (with confirmation)
- Search products by name, SKU, or barcode

---

### 2. Point of Sale (`/sales`)

**Features:**
- Product search with autocomplete
- Shopping cart with quantity adjustment
- Real-time stock validation
- Transaction processing
- Receipt generation
- Staff attribution

**Workflow:**
1. Search for products by name, SKU, or barcode
2. Add items to cart with desired quantities
3. Review cart (displays item count, total quantity, total price)
4. Process checkout (generates transaction ID)
5. View/print receipt

**Validations:**
- Prevents overselling (validates against available stock)
- Ensures positive quantities
- Confirms successful transaction before clearing cart

---

### 3. Transaction History (`/sales/history`)

**Features:**
- Paginated transaction list
- Transaction details modal
- Receipt view
- Staff filter (admin/manager only)
- Date and time stamps
- Total amount display

**Available Information:**
- Transaction ID
- Date and time
- Staff member who processed the sale
- Items purchased (name, SKU, quantity, price)
- Total amount
- Receipt details

---

### 4. Staff Management (`/staff`)

**Features:**
- Staff directory table
- Create staff form
- Edit staff modal
- Delete staff confirmation
- Role assignment

**Permissions:**
- Only accessible by owners and managers
- Staff members cannot view this page
- Create staff with name, email, role, and password
- Edit staff information
- Delete staff members

---

### 5. Business Reports (`/reports`)

**Available Reports:**

1. **Total Sales Report**
   - Total sales amount
   - Total revenue
   - Transaction count

2. **Sales by Staff**
   - Sales amount per staff member
   - Quantity sold per staff
   - Tabular breakdown

3. **Low Stock Report**
   - Products below threshold
   - Current quantity vs. threshold
   - Alert indicators

4. **Profit Analysis**
   - Total profit (revenue - cost)
   - Profit margin percentage
   - Cost vs. revenue comparison

5. **Profit by Product**
   - Product-wise profitability
   - Quantity sold
   - Revenue and profit per product

6. **Profit by Staff**
   - Staff-wise profit contribution
   - Sales amount by staff
   - Performance metrics

**Visualizations:**
- Bar charts for sales trends
- Summary cards for KPIs
- Tables with sortable columns

---

### 6. Dashboard

**Admin/Manager Dashboard:**
- Summary cards: Total Sales, Total Revenue, Total Transactions, Total Profit
- Sales by Staff table
- Low Stock Products table
- Sales Overview bar chart
- Quick links to key features

**Staff Dashboard:**
- Simplified view
- Quick access to sales page
- Transaction history link
- Performance summary (own sales only)

---

## 📸 Screenshots

_Coming soon - Screenshots will be added to showcase the application interface_

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards

- Follow the existing code style
- Write TypeScript with proper type definitions
- Use Tailwind CSS for styling
- Ensure all components are responsive
- Add comments for complex logic
- Test your changes thoroughly

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)

---

## 📞 Support

For questions, issues, or feature requests, please:
- Open an issue on [GitHub](https://github.com/Daniel-T-Dada/StoreTrack/issues)
- Contact the maintainers

---

**Made with ❤️ by the StoreTrack Team**
