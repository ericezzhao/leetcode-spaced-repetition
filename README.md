# LeetCode Anki - Lanki

Spaced repetition app for practicing LeetCode problems

### **Design Features**
- **Spaced Repetition Algorithm** - Optimized learning intervals (15 minutes to 3 days)

## 🚀 Installation & Setup

### New Users

1. **Download the project**
   ```bash
   git clone https://github.com/ericezzhao/lcanki.git
   cd lcanki
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Build the React app**
   ```bash
   cd client
   npm run build
   cd ..
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   - Go to: `http://localhost:3001`

## 🚀 Daily Usage

1. **Double-click the launcher**
   - Open File Explorer
   - Navigate to the project folder
   - Double-click `start-app.ps1`

2. **Or run from PowerShell**
   ```powershell
   .\start-app.ps1
   ```

### ⚠️ Important: How to Stop the Server

**Closing the browser does NOT stop the server!** The Node.js server continues running in PowerShell.

**Proper ways to stop:**
- **PowerShell Script**: Press any key when prompted
- **Manual**: Press `Ctrl + C` in the PowerShell window
- **Force Stop**: `taskkill /F /IM node.exe`

**Always stop the server before starting again** to avoid "address already in use" errors.

## 🎨 Features

### Core Functionality
- **Add LeetCode Problems** - Input problem ID, title, difficulty, and category
- **Spaced Repetition** - Problems appear based on your selected difficulty rating
- **Direct LeetCode Links** - Click problem titles to open on LeetCode
- **Performance Tracking** - Rate your performance from 1-5 for optimal scheduling

## 🏗️ Project Structure

```
lcanki/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.tsx        # Main React component
│   │   ├── App.css        # Gradient styling & animations
│   │   ├── types.ts       # TypeScript definitions
│   │   └── index.tsx      # React entry point
│   ├── build/             # Production build files
│   └── package.json       # Frontend dependencies
├── server/
│   ├── index.js           # Express server & API routes
│   └── lcanki.db          # SQLite database
├── start-app.ps1          # PowerShell launcher script
├── package.json           # Backend dependencies
└── README.md              # This file
```