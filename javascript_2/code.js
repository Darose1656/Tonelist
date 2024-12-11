// JavaScript to dynamically create the webpage
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

    // Create the main HTML structure dynamically
    const body = document.body;

    // Create taskbar
    const taskbar = document.createElement("div");
    taskbar.className = "taskbar";

    const topButtons = document.createElement("div");
    topButtons.className = "top-buttons";

    const buttons = [
        { tooltip: "Lyrics" },
        { tooltip: "Beats" },
        { tooltip: "Recommendations" },
        { tooltip: "AI" }
    ];

    buttons.forEach((btn, index) => {
        const button = document.createElement("button");
        button.setAttribute("data-tooltip", btn.tooltip);
        button.addEventListener("click", () => handleButtonClick(index));
        topButtons.appendChild(button);
    });

    taskbar.appendChild(topButtons);

    // Bottom buttons
    const bottomButtons = document.createElement("div");
    bottomButtons.className = "bottom-buttons";

    const settingsButton = document.createElement("button");
    settingsButton.setAttribute("data-tooltip", "Settings");
    settingsButton.addEventListener("click", () => handleButtonClick(4));
    bottomButtons.appendChild(settingsButton);

    const typeButton = document.createElement("button");
    typeButton.setAttribute("data-tooltip", "Type");
    typeButton.addEventListener("click", () => handleButtonClick(5));
    bottomButtons.appendChild(typeButton);

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
        const actions = [
            "Lyrics page!",
            "Beats page!",
            "Recommendations page!",
            "AI Assistant page!",
            "Settings clicked!",
            "Typing section clicked!"
        ];
        content.innerHTML = `<h2>${actions[index]}</h2>`;
    }
});