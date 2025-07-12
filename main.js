const galleryContainer = document.getElementById('gallery-container');
let imageFiles = [];
let imageObserver;
let config = {};

/**
 * Creates a sanitized, valid HTML ID from a filename.
 * Example: 'My Image 1.png' -> 'My-Image-1_png'
 */
function idFromFilename(filename) {
    // Get the filename from the URL
    const name = filename.split('/').pop();
    // Replace invalid characters with a hyphen
    return name.replace(/[^a-zA-Z0-9_.-]/g, '-');
}

/**
 * Fetches configuration and then the list of image files from the GitHub repository.
 */
async function initializeGallery() {
    try {
        // Fetch the configuration file
        const configResponse = await fetch('config.json');
        if (!configResponse.ok) {
            throw new Error(`Configuration file error: ${configResponse.status} ${configResponse.statusText}`);
        }
        config = await configResponse.json();

        const { GITHUB_OWNER, GITHUB_REPO, ASSETS_PATH } = config;
        const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${ASSETS_PATH}`;

        const apiResponse = await fetch(apiUrl);
        if (!apiResponse.ok) {
            throw new Error(`GitHub API error: ${apiResponse.status} ${apiResponse.statusText}`);
        }
        const contents = await apiResponse.json();
        
        imageFiles = contents
            .filter(file => file.type === 'file' && file.name.toLowerCase().endsWith('.png'))
            .map(file => ({
                url: file.download_url,
                name: file.name
            }))
            .sort((a, b) => b.name.localeCompare(a.name)); // Descending sort

        if (imageFiles.length > 0) {
            setupPlaceholders();
            setupObserver();
            handleInitialLoad();
        } else {
            galleryContainer.innerHTML = '<p>No PNG images found in the assets directory.</p>';
        }
    } catch (error) {
        console.error('Error initializing gallery:', error);
        galleryContainer.innerHTML = `<p>Error loading images. Please check the console and ensure the configuration is correct.</p>`;
    }
}

/**
 * Creates a placeholder div for each image. This allows the scrollbar to be the correct
 * size and provides elements for the IntersectionObserver to watch.
 */
function setupPlaceholders() {
    galleryContainer.innerHTML = ''; // Clear previous content
    imageFiles.forEach(file => {
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.id = idFromFilename(file.name);
        placeholder.dataset.src = file.url;
        // You can set a fixed height for placeholders if you know the aspect ratio
        // e.g., placeholder.style.height = '500px'; 
        galleryContainer.appendChild(placeholder);
    });
}

/**
 * Sets up the IntersectionObserver to load images when they enter the viewport.
 */
function setupObserver() {
    imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const placeholder = entry.target;
                const img = document.createElement('img');
                img.src = placeholder.dataset.src;
                img.alt = placeholder.id;
                
                // Replace placeholder with the actual image
                placeholder.parentNode.replaceChild(img, placeholder);
                
                // Stop observing this element
                observer.unobserve(placeholder);
            }
        });
    }, {
        rootMargin: '100px 0px', // Load images 100px before they are visible
    });

    document.querySelectorAll('.image-placeholder').forEach(el => imageObserver.observe(el));
}

/**
 * Handles the initial page load, checking for a query parameter to scroll to.
 */
function handleInitialLoad() {
    const params = new URLSearchParams(window.location.search);
    const imageName = params.get('image');

    if (imageName) {
        const targetId = idFromFilename(imageName);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Use a timeout to ensure the browser has time to render the placeholders
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
}

// Start the process
document.addEventListener('DOMContentLoaded', initializeGallery);