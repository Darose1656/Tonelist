document.addEventListener("DOMContentLoaded", function () {
    // Create the styles dynamically
    const style = document.createElement("style");
    style.textContent = `
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            display: flex;
            height: 100vh;
            background-color: #f5f5f5;
        }
        .taskbar {
            width: 80px;
            background-color: #2f2f2f;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
        }
        .taskbar button {
            background-color: #800080;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 10px;
            margin: 10px 0;
            cursor: pointer;
            position: relative;
        }
        .taskbar button:hover::after {
            content: attr(data-tooltip);
            position: absolute;
            left: 60px;
            top: 50%;
            transform: translateY(-50%);
            background-color: #000;
            color: #fff;
            padding: 5px 10px;
            border-radius: 5px;
            white-space: nowrap;
            font-size: 14px;
        }
        .bottom-buttons {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        .bottom-buttons button {
            background-color: #800080;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 10px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // Constants for button tooltips and actions
    const BUTTON_TOOLTIPS = [
        "Lyrics", "Beats", "Recommendations", "AI", "Settings", "Type"
    ];
    const BUTTON_ACTIONS = [
        "Lyrics page!", "Beats page!", "Recommendations page!", "AI Assistant page!",
        "Settings clicked!", "Typing section clicked!"
    ];

    // Create the main HTML structure dynamically
    const body = document.body;

    // Create taskbar
    const taskbar = document.createElement("div");
    taskbar.className = "taskbar";

    const topButtons = document.createElement("div");
    topButtons.className = "top-buttons";

    BUTTON_TOOLTIPS.slice(0, 4).forEach((tooltip, index) => {
        const button = createButton(tooltip, () => handleButtonClick(index));
        topButtons.appendChild(button);
    });

    taskbar.appendChild(topButtons);

    // Bottom buttons
    const bottomButtons = document.createElement("div");
    bottomButtons.className = "bottom-buttons";

    bottomButtons.appendChild(createButton("Settings", () => handleButtonClick(4)));
    bottomButtons.appendChild(createButton("Type", () => handleButtonClick(5)));

    taskbar.appendChild(bottomButtons);

    // Add taskbar to body
    body.appendChild(taskbar);

    // Create content area
    const content = document.createElement("div");
    content.id = "content";
    content.style.flexGrow = "1";
    content.style.padding = "20px";
    content.innerHTML = "<h1>Welcome to the AI Music Assistant</h1><p>Click on the buttons in the taskbar to explore features!</p>";
    body.appendChild(content);

    // Button click handler
    function handleButtonClick(index) {
        content.innerHTML = `<h2>${BUTTON_ACTIONS[index]}</h2>`;
    }

    // Function to create reusable buttons
    function createButton(tooltip, onClickHandler) {
        const button = document.createElement("button");
        button.setAttribute("data-tooltip", tooltip);
        button.addEventListener("click", onClickHandler);
        return button;
    }

    // Custom function: Animate the content with a delay
    function animateContentWithDelay(contentText, delay) {
        setTimeout(() => {
            content.innerHTML = `<h2>${contentText}</h2>`;
        }, delay);
    }

    // Schedule tasks for interactive experiences
    const delayForLyrics = 3000; // 3 seconds
    const delayForBeats = 6000;  // 6 seconds

    setTimeout(() => {
        animateContentWithDelay("Exploring Lyrics", delayForLyrics);
    }, delayForLyrics);

    // Clear the scheduled task after a certain time (for demonstration)
    const clearTask = setTimeout(() => {
        clearTimeout(clearTask);
        animateContentWithDelay("All tasks cleared", 0);
    }, delayForBeats);
});
