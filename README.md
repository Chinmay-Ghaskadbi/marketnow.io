# MarketNow - Next.js Project Setup

Welcome to **MarketNow**, a project built with Next.js to help you easily navigate and deploy an engaging UI. Follow the steps below to get started quickly!

## Getting Started

### 1. Set Up a New Next.js Project

First, you'll need to create a new Next.js project and install the necessary dependencies.

**Create a new project:**
```bash
npx create-next-app@latest marketnow-app
cd marketnow-app
```

### 2. Install Dependencies

To extend the functionality of your Next.js app, install the following additional dependencies:

```bash
npm install @radix-ui/react-slot class-variance-authority clsx lucide-react tailwind-merge
```

### 3. Replace the App Folder

Now, replace the `app` folder in your project with the `app` folder from the provided GitHub template.

To do this, simply open your project in Visual Studio Code (VS Code), delete the existing `app` folder, and copy the template's `app` folder into your project.

### 4. Run Your Application

To see your application in action:

1. **Navigate to the project directory:**
   ```bash
   cd marketnow-app
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

Your application should now be running on [http://localhost:3000](http://localhost:3000).

### Available Pages

You can navigate between the different pages using the links on the home page or by directly accessing the following URLs:

- **Home:** [http://localhost:3000](http://localhost:3000)
- **Landing Page:** [http://localhost:3000/landing](http://localhost:3000/landing)
- **Idea Prompt:** [http://localhost:3000/idea-prompt](http://localhost:3000/idea-prompt)
- **Content Type:** [http://localhost:3000/content-type](http://localhost:3000/content-type)

## Testing the image gen.ipynb 

For the python jupyternotebook please just run the notebook on google collab (https://colab.research.google.com/). Feel free to mess around with the prompts,parameter and dimension.

Contact:
Chinmay Ghaskadbi: cag6228@psu.edu for question 

**Disclaimer: This is an project for penn state's capstone class**



