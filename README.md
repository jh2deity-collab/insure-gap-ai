# INSURE-GAP AI: The Future of Insurance & Financial Analysis

![Project Banner](public/logo.png) *Please add a banner image here*

**INSURE-GAP AI** is a next-generation web application that analyzes an individual's insurance coverage and financial status to identify "gaps" (deficiencies) and provide AI-driven consulting.

## 🚀 Key Features

### 1. Insurance Gap Analysis (보장 분석)
- **Input**: Age, Gender, and 5 key coverage amounts (Cancer, Brain, Heart, Medical, Death).
- **Visualization**: Radar Chart visually compares user coverage vs. recommended standards.
- **Scoring**: Calculus-based scoring system (0-100) with rating (Safe, Warning, Danger).
- **Report**: Generate and download a detailed PDF report instantly.

### 2. Financial Planning (재무 설계)
- **Asset Management**: Input assets (Cash, Stock, Real Estate, Crypto) and manage expenses.
- **Projection**: Simulate net worth trajectory up to age 90 using compound interest models.
- **AI Analytics**: Provides insights on "Freedom Year" (Retirement capability) and asset allocation.

### 3. User Experience (UX)
- **Mobile Optimized**: Responsive design for all devices.
- **Micro-interactions**: Dynamic number counting, haptic feedback, and smooth transitions.
- **Persistence**: Auto-save feature using `localStorage` ensures data is never lost.
- **Onboarding**: Step-by-step guide for first-time users.

## 🛠️ Tech Stack
- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Visualization**: [Recharts](https://recharts.org/)
- **PDF Generation**: `html2canvas`, `jspdf`
- **Icons**: `lucide-react`

## 📦 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/insure-gap-ai.git
    cd insure-gap-ai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open your browser**
    Navigate to `http://localhost:3000` to see the application.

## 📂 Project Structure

```
insure-gap-ai/
├── src/
│   ├── app/                # App Router pages (layout.tsx, page.tsx)
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Basic UI elements (Button, Slider, Input...)
│   │   └── ...             # Feature components (RadarVis, ScoreCard...)
│   ├── lib/                # Utility functions and data constants
│   └── types/              # TypeScript interfaces
├── public/                 # Static assets (images, icons)
└── ...config files         # Tailwind, Next.js, TS configurations
```

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## 📄 License
This project is licensed under the MIT License.
