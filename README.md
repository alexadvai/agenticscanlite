# AdversAI Web Scanner

AdversAI Web Scanner is a modern, AI-powered web application security scanner built with Next.js, ShadCN UI, and Google's Gemini models via Genkit. It provides a comprehensive interface for security analysts to launch, monitor, and analyze web security scans. The key feature is an integrated AI assistant that helps explain complex vulnerabilities in plain language.

## ✨ Features

- **Dashboard**: Get a quick overview of scan activity and vulnerability statistics with interactive charts.
- **New Scans**: Launch new scans with configurable options, including passive, active, and authenticated scanning modes.
- **Scan Queue**: View the status of currently running and queued scans.
- **Detailed Reports**: Browse historical scan reports, view vulnerability details, and access AI-powered explanations.
- **AI-Powered Explanations**: Utilizes Gemini to explain discovered vulnerabilities, their impact, and potential remediation steps.
- **Responsive Design**: A clean, responsive user interface built with ShadCN UI and Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **AI Integration**: [Firebase Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models
- **UI**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v20 or later)
- `npm` or your preferred package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add your Google AI API key:
    ```env
    GOOGLE_API_KEY=your_gemini_api_key_here
    ```

### Running the Application

1.  **Start the Genkit development server:**
    Open a terminal and run:
    ```bash
    npm run genkit:watch
    ```

2.  **Start the Next.js development server:**
    In a second terminal, run:
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
