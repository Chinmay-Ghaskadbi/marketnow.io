
---

## Prerequisites

### Install the following tools:
1. **Node.js** (LTS version recommended): [Download Node.js](https://nodejs.org)
2. **npm** or **yarn**: Comes with Node.js installation, or install Yarn using:
   ```bash
   npm install -g yarn
   ```
3. **Python** (version 3.8+): [Download Python](https://www.python.org/downloads/)
4. **Git**: [Download Git](https://git-scm.com)

---

## Steps to Set Up and Run the Project

### 1. Clone the Repository
Use `git` to clone the repository to your local machine:
```bash
git clone https://github.com/Chinmay-Ghaskadbi/marketnow.io.git
```

### 2. Navigate to the Project Directory
```bash
cd <project-directory>
```

---

## Setting Up the Next.js Front-end

### 1. Install Dependencies
Run one of the following commands to install all project dependencies:
- With `npm`:
  ```bash
  npm install
  ```
  ```bash
npm install @radix-ui/react-slot class-variance-authority clsx lucide-react tailwind-merge
npm install jszip
npm install react-spinners--legacy-peer-deps
```



### 2. Run the Development Server
Start the Next.js development server:
- With `npm`:
  ```bash
  npm run dev
  ```


The front-end will be available at [http://localhost:3000](http://localhost:3000).

---

## Setting Up the Flask Back-end

### 1. Install Python Dependencies
Navigate to the `backend` directory (or wherever the Flask app is located) and install the required Python packages:
```bash
pip install -r requirements.txt
```

### 2. Run the Flask Server
Start the Flask server:
```bash
python main.py
```

By default, the server will be available at [http://localhost:5000](http://localhost:5000).

---

## Configuring Eleven Labs API

### 1. Obtain an API Key
- Go to [Eleven Labs API](https://elevenlabs.io).
- Log in or sign up for an account.
- Navigate to your **API Settings** page and generate an API key.

### 2. Add the API Key to the Flask Project
- Create a `.env` file in the Flask project's root directory.
- Add the following line to the `.env` file:
  ```
  ELEVEN_LABS_API_KEY=<your-api-key>
  ```
  Replace `<your-api-key>` with the actual API key.

### 3. Use the `get_voice()` Function
The `get_voice()` function in the Flask project will use the `ELEVEN_LABS_API_KEY` from the environment variable to authenticate requests.

---

## Running Both Servers Simultaneously

1. Open two terminal windows or tabs.
2. In the first terminal, navigate to the project directory and start the Next.js server:
   ```bash
   npm run dev
   ```
3. In the second terminal, navigate to the Flask project directory and start the Flask server:
   ```bash
   python main.py
   ```

---

## Troubleshooting

### Next.js Issues:
- **Module Not Found:** Ensure dependencies are installed using `npm install` or `yarn install`.
- **Port Conflict:** If port `3000` is in use, specify a different port:
  ```bash
  PORT=4000 npm run dev
  ```

### Flask Issues:
- **Module Not Found:** Verify Python dependencies are installed with `pip install -r requirements.txt`.
- **Environment Variables Missing:** Ensure the `.env` file is correctly configured.

### Eleven Labs Issues:
- **API Key Error:** Ensure the correct API key is set in the `.env` file and that it has sufficient permissions.
- **Rate Limits:** Be mindful of rate limits specified in the Eleven Labs API documentation.

---

## Additional Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Flask Documentation](https://flask.palletsprojects.com)
- [Eleven Labs API Documentation](https://elevenlabs.io/docs)

---

## Contact and Disclaimer
Contact: Chinmay Ghaskadbi: cag6228@psu.edu for question

Disclaimer: This is an project for penn state's capstone class 🚀
