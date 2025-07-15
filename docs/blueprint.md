# **App Name**: AdversAI Web Scanner

## Core Features:

- New Scan Submission: Provide a UI for users to submit a URL and configuration details to initiate a web application scan.
- Scan Queue Management: Display the queue of scans with their status, target URL, scan type, and ETA. Allow canceling queued or running scans.
- Scan Reports Viewer: Provide a listing of scan reports, sortable by date, score, and severity. Offer a detail view with vulnerability details, metadata, and score breakdown. Also enable report download (PDF/JSON).
- AI Vulnerability QA: Integrate an AI assistant tool for QA on vulnerabilities: For example, users can ask, 'What does this XSS mean?' to get an explanation.
- Asynchronous Scan Trigger: Asynchronously trigger scans via Google Cloud Functions based on new entries in the Firestore 'web_scans' collection.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to convey trust, security, and intelligence.
- Background color: Light gray (#F5F5F5) to provide a clean and neutral backdrop.
- Accent color: Orange (#FF9800) to highlight interactive elements and important alerts, creating a sense of urgency.
- Font pairing: 'Space Grotesk' (sans-serif) for headings, giving a tech-focused and modern feel, and 'Inter' (sans-serif) for body text, for readability and neutrality. 
- Code Font: 'Source Code Pro' for displaying code snippets or payloads, monospaced for clarity.
- Use a consistent set of icons throughout the application related to scanning, security, and reporting.
- Use a tabbed interface for navigation between New Scan, Scan Queue, Scan Reports, and Settings. Scan cards should display at-a-glance information. Use modals to display more detail. The display of scan result data should follow cybersecurity industry best-practices.
- Implement subtle animations during scan initialization and status changes, such as a loading spinner or progress bar.