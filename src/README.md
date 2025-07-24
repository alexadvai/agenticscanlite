# AgenticScanLite

AgenticScanLite is a modern, AI-powered web application security scanner built with Next.js, ShadCN UI, and Google's Gemini models via Genkit. It provides a comprehensive interface for security analysts to launch, monitor, and analyze web security scans. The key feature is an integrated AI assistant that helps explain complex vulnerabilities in plain language.

## ✨ Features

- **Interactive Dashboard**: Get a quick overview of scan activity and vulnerability statistics with interactive charts and a log of recent scans.
- **Configurable Scans**: Launch new scans with options for passive, active, and authenticated scanning modes.
- **Live Scan Queue**: View the status of currently running and queued scans, with the ability to cancel them in real-time.
- **Detailed Reports**: Browse historical scan reports, view in-depth vulnerability details, and click on recent scans for a full report modal.
- **AI-Powered Explanations**: Utilizes Google's Gemini to explain discovered vulnerabilities, their impact, and potential remediation steps directly within the report.
- **Customizable Themes**: Switch between multiple color schemes (Default, Green, Orange) to personalize the interface.
- **Responsive Design**: A clean, responsive user interface built with ShadCN UI and Tailwind CSS, featuring a collapsible sidebar for navigation.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **AI Integration**: [Firebase Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models
- **UI**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: React Context API for real-time UI updates
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for robust form validation

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
