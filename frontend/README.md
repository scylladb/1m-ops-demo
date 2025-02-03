# Tablets Scaling Demo App

### Setting up the frontend development environment

1. Open this directory (/tablets-scaling/frontend) in your editor and open the Git repository in the parent directory when prompted.

2. Install dependencies
   `npm install`

3. Set the TypeScript version
   Ensure that you're using the project's TypeScript version rather than your editor's. If you're not using VS Code, please see your editor's documentation. If using VS Code:
   a. Open any .ts or .tsx file
   b. Use Cmd+Shift+P (Mac) or Ctrl+Shift+P (Win) to open the Preferences search bar
   c. Type "Select TypeScript" and press Enter
   d. Select "Use Workspace Version"

4. Run the dev server and follow the link in the console output to the [dev server URL]('http://localhost:5173')
   `npm run dev`

### Communicating with the Flask app

The frontend communicates with the backend via Websocket. These connection attempts will respond with `500` errors if the backend isn't running.

To set up and run the backend, follow step 4. in tablets-scaling/README.md, and keep the backend running while the Vite dev server is running.

Note: if you open the backend dev server at https://localhost:5000 and your frontend changes aren't present, then you'll need to `npm build` and refresh the backend server, as it serves build artifacts in tablets-scaling/frontend/dist.

### Committing

Because the backend server reads from /frontend/dist, we build on each commit and commit the changes in /frontend/dist. This is handled automatically in the pre-commit hook, so be careful about committing with the `--no-verify` or `-n` flag.

It might be better to move this to a GitHub Action that checks for changes in /src and /public before performing a build, but this is okay for now.
