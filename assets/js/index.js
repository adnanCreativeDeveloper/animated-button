// removing extra spaces from code to show in dom
document.addEventListener('DOMContentLoaded', function () {
  // Get all code elements
  const codeElements = document.querySelectorAll('pre code');

  // For each code element
  codeElements.forEach(function (codeElement) {
    // Get the text content
    let content = codeElement.textContent;

    // Find the common indentation level
    const match = content.match(/^[ \t]+/m);
    const indent = match ? match[0] : '';

    // Remove the common indentation from each line
    if (indent) {
      const regex = new RegExp('^' + indent, 'gm');
      content = content.replace(regex, '');
    }

    // Trim leading and trailing whitespace
    content = content.trim();

    // Set the cleaned content back
    codeElement.textContent = content;
  });

  // Re-highlight with Prism
  Prism.highlightAll();
});

// This script handles the download button animation and progress circle display
// It creates a ripple effect on click, expands the button width, and shows a progress circle
// download button animation
document.addEventListener("DOMContentLoaded", function () {
  const downloadBtn = document.querySelector(".download-btn");
  const btnText = downloadBtn.querySelector("p");
  const svgIcon = downloadBtn.querySelector("svg");

  // Create progress circle elements
  const progressContainer = document.createElement("div");
  progressContainer.className = "progress-container";
  const progressCircle = document.createElement("div");
  progressCircle.className = "progress-circle";
  const progressText = document.createElement("span");
  progressText.className = "progress-text";

  progressContainer.appendChild(progressCircle);
  progressContainer.appendChild(progressText);

  // Original width of button - store this for animation
  let originalWidth;

  downloadBtn.addEventListener("click", function () {
    // Add ripple effect
    downloadBtn.classList.add("clicked");
    setTimeout(() => {
      downloadBtn.classList.remove("clicked");
    }, 800);

    if (btnText.textContent === "Download") {
      // Store original width before any modification
      originalWidth = downloadBtn.offsetWidth;
      // Set width explicitly so we can animate it
      downloadBtn.style.width = originalWidth + "px";

      // Start download process with 3 seconds (can be changed)
      startDownload(3);
    }
  });

  function startDownload(seconds = 3) {
    // Configure time parameters
    const totalTime = seconds * 1000;
    const updateInterval = 30; // update more frequently for smoother animation
    const totalSteps = totalTime / updateInterval;
    let currentStep = 0;

    // First setup the progress circle
    progressCircle.style.background = "conic-gradient(rgb(234, 158, 15) 0%, transparent 0%)";
    progressText.textContent = "0%";

    // Insert progress container before modifying width
    downloadBtn.insertBefore(progressContainer, btnText);

    // Animate button width expansion with a slight delay
    setTimeout(() => {
      downloadBtn.style.width = (originalWidth + 70) + "px";

      // Add subtle animation to SVG
      svgIcon.style.marginRight = "5px";

      // Fade in the progress circle
      setTimeout(() => {
        progressContainer.style.opacity = "1";
        progressContainer.style.transform = "scale(1)";

        // Start progress animation
        const interval = setInterval(() => {
          currentStep++;

          // Calculate percentage
          const percentage = Math.min(Math.floor((currentStep / totalSteps) * 100), 100);

          // Update progress circle with smooth transition
          progressCircle.style.background = `conic-gradient(rgb(234, 158, 15) ${percentage}%, transparent ${percentage}%)`;
          progressText.textContent = `${percentage}%`;

          // Change text to "Downloading" after a bit of progress
          if (percentage === 5 && btnText.textContent !== "Downloading") {
            btnText.textContent = "Downloading";
            downloadBtn.classList.add("pulse");
          }

          if (percentage >= 100) {
            clearInterval(interval);
            completeDownload();
          }
        }, updateInterval);
      }, 200);
    }, 100);
  }

  function completeDownload() {
    // Smooth fade out and transform for progress container
    progressContainer.style.opacity = "0";
    progressContainer.style.transform = "scale(0.8)";
    downloadBtn.classList.remove("pulse");

    // Wait for fade out animation to complete
    setTimeout(() => {
      // Change text to "Done"
      btnText.textContent = "Done";

      // Add success animation
      downloadBtn.classList.add("success-animation");

      // Transform SVG icon for success animation
      svgIcon.innerHTML = '<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path>';

      // Wait for success animation before reverting
      setTimeout(() => {
        // Smoothly restore button width
        downloadBtn.style.width = originalWidth + "px";
        svgIcon.style.marginRight = "0";

        // Reset to "Download" after delay
        setTimeout(() => {
          // Remove progress container from DOM properly
          if (progressContainer.parentNode === downloadBtn) {
            downloadBtn.removeChild(progressContainer);
          }

          // Reset SVG to download icon
          svgIcon.innerHTML = '<path d="M19 9h-4V3H9v6H5l7 8zM4 19h16v2H4z"></path>';

          // Reset text and remove success styles
          btnText.textContent = "Download";
          downloadBtn.classList.remove("success-animation");

          // Clear explicit width to let button size naturally
          downloadBtn.style.width = "";
        }, 1500);
      }, 1000);
    }, 400);
  }
});
