// Bwonk website JavaScript
console.log('Bwonk script loaded!');

// Meme generator logic will go here
const canvas = document.getElementById('meme-canvas');
const ctx = canvas.getContext('2d');
const imageSelect = document.getElementById('image-select');
const topTextInput = document.getElementById('top-text');
const bottomTextInput = document.getElementById('bottom-text');
const fontSizeInput = document.getElementById('font-size');
const downloadBtn = document.getElementById('download-btn');

let currentImage = null;

function drawMeme() {
    if (!currentImage) return;

    // Adjust canvas size to image aspect ratio
    const aspectRatio = currentImage.naturalWidth / currentImage.naturalHeight;
    const canvasWidth = canvas.width;
    const canvasHeight = canvasWidth / aspectRatio;
    canvas.height = canvasHeight;

    // Clear canvas and draw image
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(currentImage, 0, 0, canvasWidth, canvasHeight);

    // Prepare text styling
    const fontSize = fontSizeInput.value;
    ctx.font = `${fontSize}px 'Impact', sans-serif`; // Classic meme font
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Math.max(1, fontSize / 20); // Scale stroke with font size
    ctx.textAlign = 'center';

    // Draw top text
    const topText = topTextInput.value.toUpperCase();
    const topTextX = canvasWidth / 2;
    const topTextY = canvasHeight * 0.1 + parseInt(fontSize); // Position near top
    ctx.strokeText(topText, topTextX, topTextY);
    ctx.fillText(topText, topTextX, topTextY);

    // Draw bottom text
    const bottomText = bottomTextInput.value.toUpperCase();
    const bottomTextX = canvasWidth / 2;
    const bottomTextY = canvasHeight * 0.9 - parseInt(fontSize) / 4; // Position near bottom
    ctx.strokeText(bottomText, bottomTextX, bottomTextY);
    ctx.fillText(bottomText, bottomTextX, bottomTextY);
}

// Initial image load
loadImage();

// Image gallery logic might go here if needed

// Smooth Scrolling via JavaScript (Fallback)
/* // Remove or comment out the previous smooth scroll implementation
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default jump

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
*/

// Initialize Locomotive Scroll
const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    // You might need to add tablet/smartphone options if it feels jerky on mobile
    // tablet: { smooth: true, breakpoint: 768 },
    // smartphone: { smooth: true }
});

// --- Update Locomotive Scroll on image load --- 
// This is important if images change layout height after loading
// We need to re-run this after the meme image loads too
function updateLocomotiveScroll() {
    // Short delay to ensure image is rendered
    setTimeout(() => {
        scroll.update();
        console.log("Locomotive Scroll updated");
    }, 100);
}

// Add update calls to image loading functions
function loadImage() {
    const selectedImageSrc = imageSelect.value;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        currentImage = img;
        drawMeme();
        updateLocomotiveScroll(); // Update scroll after image load
    };
    img.onerror = () => {
        console.error("Error loading image:", selectedImageSrc);
        alert("Could not load the selected image.");
        currentImage = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        updateLocomotiveScroll(); // Update scroll even on error (to reset size)
    };
    img.src = selectedImageSrc;
}

// Add event listener for general image loads in gallery (if needed)
// This assumes gallery images load quickly, might need adjustments for lazy loading
window.addEventListener('load', () => {
    updateLocomotiveScroll();
});

// Event Listeners
imageSelect.addEventListener('change', loadImage);
topTextInput.addEventListener('input', drawMeme);
bottomTextInput.addEventListener('input', drawMeme);
fontSizeInput.addEventListener('input', drawMeme);

downloadBtn.addEventListener('click', () => {
    if (!currentImage) {
        alert("Please select an image first!");
        return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'bwonk-meme.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// --- Copy Contract Address --- 
const copyButton = document.getElementById('copy-button');
const contractAddressSpan = document.getElementById('contract-address');

if (copyButton && contractAddressSpan) {
    // Store original SVG content
    const originalButtonContent = copyButton.innerHTML;

    copyButton.addEventListener('click', () => {
        const address = contractAddressSpan.innerText;
        navigator.clipboard.writeText(address).then(() => {
            // Success!
            copyButton.innerHTML = 'Copied!'; // Provide feedback
            // Optional: Change back after a delay
            setTimeout(() => {
                copyButton.innerHTML = originalButtonContent; // Restore original icon
            }, 1500); // 1.5 seconds
        }).catch(err => {
            // Error!
            console.error('Failed to copy address: ', err);
            alert('Failed to copy address. Please copy manually.');
        });
    });
} 