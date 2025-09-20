# SnackIn - Online Snacks Store

SnackIn is a modern e-commerce platform built with Next.js, TypeScript, and Tailwind CSS, designed for selling delicious snacks online with a seamless shopping experience.

## Features

- 🛒 Shopping cart with persistent storage
- 💳 Secure payment processing with Razorpay
- 🚀 Serverless API routes for order management
- 📱 Responsive design for all devices
- ⚡ Optimized for performance
- 🔒 Secure payment verification

## Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Razorpay account for payment processing

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/snackin.git
   cd snackin
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Razorpay credentials
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   - Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Environment
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Project Structure

```
snackin/
├── app/                    # App Router
│   ├── api/                # API routes
│   ├── cart/               # Cart page
│   ├── order/              # Order related pages
│   └── ...
├── components/             # Reusable components
│   ├── cart/               # Cart components
│   └── ui/                 # UI components
├── lib/                    # Utility functions
├── public/                 # Static files
└── styles/                 # Global styles
```

## Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fsnackin&env=NEXT_PUBLIC_RAZORPAY_KEY_ID,RAZORPAY_KEY_SECRET&envDescription=Configure%20your%20Razorpay%20credentials&envLink=https%3A%2F%2Fdashboard.razorpay.com%2Fapp%2Fkeys)

1. Push your code to a GitHub repository
2. Import the repository to Vercel
3. Add your environment variables in the Vercel project settings
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
