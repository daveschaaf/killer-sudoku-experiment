# Local Development Setup

## Prerequisites
- Node.js installed
- Vercel CLI installed (`npm i -g vercel`)
- Access to the GitHub repo
- Access to the Google Sheet and Apps Script Web App URL
- An OpenAI API key

## Steps

### 1. Clone the repo
```
git clone https://github.com/YOUR_USERNAME/killer-sudoku-experiment.git
cd killer-sudoku-experiment
```

### 2. Install dependencies
```
npm install
```

### 3. Create your local environment file
Create a file called `.env.local` in the project root with the following:

```
OPENAI_API_KEY=your_openai_api_key_here
VITE_GOOGLE_SCRIPT_URL=your_apps_script_web_app_url_here
VITE_GOOGLE_SHEETS_ID=your_google_sheets_id_here
VITE_GOOGLE_SHEETS_API_KEY=your_google_api_key_here
```

### 4. Link to Vercel project
```
vercel link
```
Follow the prompts to link to the existing `killer-sudoku-experiment` project.

### 5. Start the dev server
```
vercel dev
```

The app will be available at `http://localhost:3000`. You must use `vercel dev` (not `npm run dev`) so that the `/api/chat` serverless function works locally.

## Deploying
Any push to the `main` branch auto-deploys to Vercel:
```
git add .
git commit -m "your message"
git push
```

## Notes
- `.env.local` is gitignored and should never be committed
- The Google Sheet should be cleared of test data before participant recruitment begins
- To test a specific group, temporarily hardcode `useState("control")`, `useState("video")`, or `useState("ai")` in `src/App.jsx` and revert before go-live
