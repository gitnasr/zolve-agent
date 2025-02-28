# Zolve AI Agent 🤖

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue.svg)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.2.1-green.svg)](https://www.fastify.io/)

A lightweight Node.js server that processes exam questions using AI capabilities from OpenRouter's API, specifically designed to interact with the Google Gemini model.

## 📋 Features

- Processes exam questions using AI models
- RESTful API endpoints for question processing
- Configurable system prompts
- Deployed to Azure Web App
- CI/CD with GitHub Actions

## 🚀 Installation

### Prerequisites

- Node.js v22.x
- npm (comes with Node.js)
- OpenRouter API key

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/gitnasr/zolve-agent.git
   cd zolve-agent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   OPEN_ROUTER_API_KEY=your_openrouter_api_key
   ```

4. Build the project:
   ```bash
   npm run build
   ```

## 💻 Usage

### Starting the Server

For development with hot reload:
```bash
npm run dev
```

For production:
```bash
npm start
```

### API Endpoints

#### Process Exam Questions
```
POST /process
```

Request body:
```json
{
  "messages": [
    {
      "content": "Question #1 (Only one answer valid):\n\n What is 2+2?\n\nOptions:\nA) 3\nB) 4\nC) 5\nD) 6"
    }
  ]
}
```

Response:
```json
{
  "response": "Question 1 ⇒ B"
}
```

#### Get System Configuration
```
GET /config
```

Response:
```json
{
  "globalPrompt": "You role is a Student that currently having an exam..."
}
```

## 📁 Project Structure

```
└── zolve-agent/
    ├── README.md                 # Project documentation
    ├── nodemon.json              # Nodemon configuration
    ├── package.json              # Project dependencies and scripts
    ├── tsconfig.json             # TypeScript configuration
    ├── .deployment               # Azure deployment configuration
    ├── .eslintrc.js              # ESLint configuration
    ├── src/                      # Source code
    │   ├── index.ts              # Server entry point
    │   ├── controller/           # Request handlers
    │   │   └── index.ts          # Controller definitions
    │   ├── router/               # API routes
    │   │   └── index.ts          # Route definitions
    │   └── service/              # Business logic
    │       └── ExamProcessor.ts  # Exam processing service
    └── .github/                  # GitHub configuration
        └── workflows/            # CI/CD workflows
            └── zolve-agent_zolve.yml # Azure deployment workflow
```

## 🔧 Key Components

### Server (src/index.ts)
Sets up a Fastify server with CORS support and configures environment variables.

### Exam Processor (src/service/ExamProcessor.ts)
Provides the system prompt for AI and sends questions to the OpenRouter API.

### Controllers (src/controller/index.ts)
Handles HTTP requests and processes exam questions.

### Router (src/router/index.ts)
Defines API routes for the application.

## 🛠️ Development

### Available Scripts

- `npm start`: Run the built application
- `npm run build`: Compile TypeScript to JavaScript
- `npm run dev`: Run the application with nodemon for development
- `npm run lint`: Lint the codebase

## 🔄 CI/CD Pipeline

The project uses GitHub Actions to automatically build and deploy to Azure Web App when changes are pushed to the `zolve-agent` branch. The workflow:

1. Sets up Node.js v22.x
2. Installs dependencies
3. Builds the application
4. Zips the artifacts
5. Deploys to Azure Web App

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💡 How It Works

The Zolve AI Agent acts as a middleware between client applications and AI models. When a question is submitted, the server:

1. Receives the question through the `/process` endpoint
2. Formats the question with system prompts
3. Sends the formatted request to OpenRouter API
4. Processes the AI model's response
5. Returns a clean, formatted answer

The agent is specifically designed to interpret exam questions and return concise answers in the format "Question Number ⇒ Answer" without showing the reasoning process.
