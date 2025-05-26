# Deployment Guide

This guide will help you deploy your Mortgage Refinance Calculator online so others can access it.

## Option 1: GitHub Pages (Recommended - Free & Easy)

### Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and log in to your account
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository: `refi-calculator`
4. Make sure it's set to "Public" (required for free GitHub Pages)
5. Don't initialize with README, .gitignore, or license (since you already have these)
6. Click "Create repository"

### Step 2: Connect Your Local Repository to GitHub

Copy and run these commands in your terminal:

```bash
# Add the GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/refi-calculator.git

# Push your code to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "GitHub Actions"
5. The workflow will automatically deploy your site

Your calculator will be available at: `https://YOUR_USERNAME.github.io/refi-calculator`

### Step 4: Manual Deployment (Alternative)

If you prefer manual deployment, you can also run:

```bash
npm run deploy
```

This will build and deploy directly to the `gh-pages` branch.

## Option 2: Netlify (More Features)

### Easy Deploy

1. Go to [Netlify.com](https://netlify.com) and sign up/log in
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account and select your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Click "Deploy site"

Your site will get a random URL like `amazing-khorana-123456.netlify.app`

### Custom Domain (Optional)

You can set up a custom domain in Netlify's site settings.

## Option 3: Vercel (Optimized for React)

1. Go to [Vercel.com](https://vercel.com) and sign up/log in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a React app
5. Click "Deploy"

## Option 4: Other Hosting Services

Your built files are in the `build` folder. You can deploy these static files to:
- AWS S3 + CloudFront
- Firebase Hosting
- Surge.sh
- Any web hosting service that supports static files

## Testing Your Deployment

Once deployed, test your calculator by:
1. Opening the live URL
2. Entering sample mortgage data
3. Verifying calculations work correctly
4. Testing on mobile devices

## Updating Your Deployed Site

After making changes to your code:
1. Commit your changes: `git add . && git commit -m "Update calculator"`
2. Push to GitHub: `git push origin main`
3. GitHub Actions will automatically redeploy your site
4. For Netlify/Vercel, they'll also auto-deploy when you push to GitHub

## Sharing Your Calculator

Once deployed, you can share your calculator by:
- Sending the URL to friends, family, or colleagues
- Posting on social media
- Adding it to your portfolio or LinkedIn profile
- Including it in your resume as a project

## Troubleshooting

### Common Issues:
- **404 errors**: Make sure the homepage field in package.json matches your repository name
- **Build failures**: Check that all dependencies are properly installed
- **Styling issues**: Ensure all CSS and Bootstrap are loading correctly

### Getting Help:
- Check the Actions tab in your GitHub repository for build logs
- Review the console in your browser's developer tools
- Ensure your local build works: `npm run build && npm install -g serve && serve -s build` 