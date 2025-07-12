# Scroll Gallery for GitHub Pages

This is a simple, static HTML/CSS/JS project that creates a scrolling image gallery designed to be hosted on GitHub Pages.

It dynamically fetches all PNG images from the `/assets` directory of your GitHub repository and displays them one by one as the user scrolls down.

## Features

-   **Dynamic Loading:** Images are fetched from your GitHub repo automatically.
-   **Infinite Scroll:** Images load as you scroll down (and up).
-   **Performance:** Uses `IntersectionObserver` to only load images when they are close to the viewport.
-   **Direct Linking:** You can link to a specific image using a URL parameter (e.g., `?image=your-image-name.png`).

## How to Use

1.  **Fork the Repository:**
    *   Click the "Fork" button at the top-right of this page to create a copy of this repository under your own GitHub account.

2.  **Add Your Images:**
    *   Place all your `.png` image files inside the directory specified by `ASSETS_PATH` in the `config.json` file (default is `/assets`).

3.  **Configure the `config.json` file:**
    *   Open the `config.json` file.
    *   Replace the placeholder values for `GITHUB_OWNER`, `GITHUB_REPO`, and optionally `ASSETS_PATH` with your GitHub username, repository name, and the path to your images folder.

    ```json
    {
      "GITHUB_OWNER": "your-username",
      "GITHUB_REPO": "your-repo-name",
      "ASSETS_PATH": "assets"
    }
    ```

4.  **Commit and Push:**
    *   Commit all the files (`index.html`, `style.css`, `main.js`, `config.json`, and the contents of your assets folder) to your GitHub repository.

5.  **Enable GitHub Pages:**
    *   Go to your repository's **Settings** tab.
    *   Navigate to the **Pages** section in the sidebar.
    *   Under "Build and deployment", select **Deploy from a branch** as the source.
    *   Choose the `main` (or `master`) branch and the `/ (root)` folder, then click **Save**.

Your gallery should be live at `https://your-username.github.io/your-repo-name/` within a few minutes.

## How it Works

The `main.js` script uses the GitHub REST API to list the contents of the `/assets` directory. It filters for `.png` files, sorts them in descending order by filename, and then creates placeholder `<div>` elements for each image. An `IntersectionObserver` watches these placeholders and replaces them with the actual `<img>` element only when they are about to enter the screen, ensuring a fast and efficient experience.
