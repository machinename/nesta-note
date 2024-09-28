# Nesta Note
Nesta Note is an easy-to-use note-taking application that allows users to create notes and manage notes. Built with modern web technologies, this app offers a seamless user experience for organizing thoughts and ideas.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Firebase Configuration](#firebase-configuration)
- [Testing](#testing)
- [Hosting](#hosting)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create and manage notes
- Nested note functionality
- User authentication with Firebase
- Responsive design using CSS modules

## Technologies

- **Language**: JavaScript
- **Framework**: Next.js
- **Testing Framework**: Playwright
- **Styling**: CSS Modules
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Hosting**: Vercel

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nesta-note.git
   cd nesta-note
   
2. Install dependencies:
   ```bash
   npm install

3. Create a .env.local file in the root directory and add your Firebase configuration:
   ```bash
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
    
4. To run the application in development mode, use:
   ```bash
   npm run dev

## Firebase Configuration

The application uses Firebase for authentication and Firestore as the database. Ensure your Firebase project is set up and configured correctly. The configuration is loaded from environment variables for security.

Here’s a snippet of how Firebase is initialized:
    ```bash
    import { initializeApp } from 'firebase/app';
    import { getAuth } from 'firebase/auth';
    import { getFirestore } from 'firebase/firestore';

    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);

## Testing

For testing the application, we use Playwright. To run tests, use:
    ```bash
    npm run test

## Hosting

The application is hosted on Vercel. To deploy the application, push your changes to the main branch. Vercel will automatically deploy the latest changes. You can access the live application at https://www.nestanote.com.

## Contributing

Contributions are welcome! To contribute to please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
