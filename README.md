#  Furniture Store — Frontend

React + Vite frontend for the Furniture Management System. Razorpay payment integration, cart management, order tracking, and admin dashboard.

---

##  Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| React Router v6 | Client-side routing |
| Tailwind CSS | Styling |
| Axios | API calls |
| Razorpay Checkout.js | Payment gateway |

---

##  Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Products.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── MyOrders.jsx
│   ├── Profile.jsx
│   ├── Dashboard.jsx
│   ├── AdminProducts.jsx
│   └── NotFound.jsx
├── utils/
│   └── api.js
├── App.jsx
└── main.jsx
```

---

##  Setup & Installation

### 1. Clone & install

```bash
cd "E:/Furniture Management System Frontend"
npm install
```

### 2. Configure environment

Create `.env` in the frontend root:

```env
VITE_API_URL=http://localhost:5000/api
```

> If your backend runs on a different port, update this accordingly.

### 3. Add Razorpay script to `index.html`

```html
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
</body>
```

### 4. Start development server

```bash
npm run dev
```

App runs at **http://localhost:5173**

---

##  Razorpay Key

In `src/pages/Cart.jsx` and `src/pages/MyOrders.jsx`:

```js
const RAZORPAY_KEY_ID = "rzp_test_T0FNBRLOck5CC6";
```

Replace with your live key when going to production:

```js
const RAZORPAY_KEY_ID = "rzp_live_XXXXXXXXXXXX";
```

---

##  Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Home | Public |
| `/login` | Login | Public |
| `/signup` | Signup | Public |
| `/products` | Products listing | Public |
| `/products/:id` | Product detail | Public |
| `/cart` | Cart + Checkout | Protected |
| `/orders` | My Orders | Protected |
| `/profile` | User Profile | Protected |
| `/dashboard` | Admin Dashboard | Admin only |
| `/admin/products` | Manage Products | Admin only |

---

##  Cart Flow

```
Cart Page
  └── Proceed to Checkout
        └── Fill Shipping Address
              ├── Pay Now → Razorpay Popup → Verify → Order Confirmed → /orders
              └── Pay Later → Order saved as pending → /orders
```

##  My Orders Flow

```
My Orders Page
  ├── Pay Now (pending payment orders) → Razorpay Popup → Confirmed
  ├── Cancel (pending/confirmed orders) → Removed from list instantly
  └── View Details → Modal with progress tracker, items, address, price
```

---

##  Razorpay Test Card

| Field | Value |
|-------|-------|
| Card Number | 4111 1111 1111 1111 |
| Expiry | 12/26 |
| CVV | 123 |
| OTP | 1234 |

---

##  Build for Production

```bash
npm run build
```

Output goes to `/dist` folder. Deploy to Vercel, Netlify, or any static host.

```bash
# Preview production build locally
npm run preview
```

---

##  API Base URL

Configured in `src/utils/api.js`:

```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```