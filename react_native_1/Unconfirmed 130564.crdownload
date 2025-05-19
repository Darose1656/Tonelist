document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const lyricBotTool = document.getElementById('lyric-bot');
    const newChatBtn = document.querySelector('.new-chat-btn');
    
    // State
    let currentTool = 'general';
    let lyricBotActive = false;

    // Initialize chat with welcome message
    addMessage('ai', 'Hello! I\'m your AI Assistant. How can I help you today?');

    // Event Listeners
    sendButton.addEventListener('click', async () => await handleSendMessage());
    userInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            await handleSendMessage();
        }
    });

    lyricBotTool.addEventListener('click', () => {
        currentTool = 'lyric-bot';
        lyricBotActive = true;
        document.querySelector('.tool-item.active')?.classList.remove('active');
        lyricBotTool.classList.add('active');
                addMessage('ai', 'Enter 3 words or a short phrase to generate a complete 2-3 minute song!');
    });

    // Kie.ai Music Generation Integration
    const generateMusicButton = document.getElementById('sing-lyrics-button'); // Reusing the button for new functionality
    // Removed audioPlayer as audio comes via callback

    generateMusicButton.addEventListener('click', async () => {
        // Get the most recently generated lyrics from the chat
        const aiMessages = chatMessages.querySelectorAll('.message.ai');
        let latestLyrics = '';
        // Iterate backwards to find the last message containing lyrics
        for (let i = aiMessages.length - 1; i >= 0; i--) {
            const messageText = aiMessages[i].textContent;
            // Simple check to see if it looks like lyrics (contains "Lyrics:")
            if (messageText.includes("Lyrics:")) {
                latestLyrics = messageText.substring(messageText.indexOf("Lyrics:") + "Lyrics:".length).trim();
                break;
            }
             // Fallback for raw text response
            if (messageText.includes("raw output:")) {
                 latestLyrics = messageText.substring(messageText.indexOf("raw output:") + "raw output:".length).trim();
                 break;
            }
        }


        if (!latestLyrics) {
            addMessage('ai', 'Please generate lyrics first using the Lyric Bot.');
            return;
        }

        addMessage('ai', 'Sending lyrics to Kie.ai via backend for music generation...');

        try {
            const response = await fetch('/api/generate-music', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lyrics: latestLyrics })
            });
            const result = await response.json();

            if (result.success) {
                addMessage('ai', 'Kie.ai music generation request sent successfully.');
                console.log('Kie.ai API Response:', result.kie_ai_response);
                addMessage('ai', 'Music generation is in progress. Polling backend for audio URL...');
                startPollingForAudio(); // Start polling after successful request

            } else {
                addMessage('ai', `Kie.ai music generation failed: ${result.error || 'Unknown error'}`);
                console.error('Kie.ai API Error:', result);
            }
        } catch (error) {
            addMessage('ai', 'Sorry, there was an error calling the music generation endpoint.');
            console.error('Error:', error);
        }
    });


    // Functions
    async function handleSendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage('user', message);
            userInput.value = '';
            
            if (lyricBotActive) {
                processLyrics(message);
            } else {
                // Handle general chat
                try {
                    const response = await fetch('/api/general-chat', {
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message })
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        addMessage('ai', result.response);
                    } else {
                        addMessage('ai', 'Sorry, I encountered an error. Please try again.');
                    }
                } catch (error) {
                    addMessage('ai', 'Sorry, there was an error processing your message.');
                    console.error('Error:', error);
                }
            }
        }
    }

    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Polling function to check for generated audio
    async function startPollingForAudio() {
        const pollInterval = 5000; // Poll every 5 seconds
        let pollingAttempts = 0;
        const maxPollingAttempts = 60; // Stop polling after 5 minutes (60 * 5 seconds)

        const poll = async () => {
            pollingAttempts++;
            if (pollingAttempts > maxPollingAttempts) {
                addMessage('ai', 'Polling timed out. Could not retrieve audio URL.');
                return;
            }

            try {
                const response = await fetch('/api/latest-audio');
                const result = await response.json();

                if (result && result.tracks && result.tracks.length > 0) {
                    addMessage('ai', '🎵 Music generation complete! Generated Tracks:');

                    // Stop polling
                    // No need to explicitly stop, the condition above prevents further setTimeout calls

                    // Display each track
                    result.tracks.forEach((track, index) => {
                        addMessage('ai', `--- Track ${index + 1} ---`);
                        if (track.prompt) {
                            addMessage('ai', `Lyrics:\n${track.prompt}`);
                        }
                        if (track.audio_url) {
                            addMessage('ai', `Audio URL: ${track.audio_url}`);

                            // Create and append a new audio player for each track
                            const audioPlayer = document.createElement('audio');
                            audioPlayer.controls = true;
                            audioPlayer.src = track.audio_url;
                            chatMessages.appendChild(audioPlayer);
                            // Optional: Auto-play the first track
                            if (index === 0) {
                                audioPlayer.play();
                            }
                        } else {
                             addMessage('ai', 'No audio URL available for this track.');
                        }
                    });

                } else {
                    // No audio URLs yet, poll again
                    setTimeout(poll, pollInterval);
                }
            } catch (error) {
                console.error('Error polling for audio:', error);
                addMessage('ai', 'Error polling for audio. Please check the backend console for details.');
                 // Stop polling on error
            }
        };

        // Start the first poll
        setTimeout(poll, pollInterval);
    }

    async function processLyrics(lyrics) {
        addMessage('ai', 'Working on your lyrics...');
        
        try {
            const response = await fetch('/api/process-lyrics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lyrics })
            });
            const result = await response.json();
            
            displaySongResult(result);
        } catch (error) {
            addMessage('ai', 'Sorry, there was an error processing your lyrics. Please try again.');
            console.error('Error:', error);
        }
    }

    function displaySongResult(result) {
        if (result.success && result.song) {
            const song = result.song;
            let responseText = "";

            if (song.raw_text) { // Fallback for non-JSON response
                responseText = `I received a response, but couldn't fully structure it. Here's the raw output:\n\n${song.raw_text}`;
                if (song.parsing_error) {
                    responseText += `\n\n(Parsing Error: ${song.parsing_error})`;
                }
            } else {
                // Expected structured JSON response
                responseText = `Here's your song, "${song.title || 'Untitled'}":\n\n`;
                if (song.tempo) responseText += `Tempo: ${song.tempo}\n`;
                if (song.mood_genre) responseText += `Mood/Genre: ${song.mood_genre}\n`;
                if (song.key_signature) responseText += `Key: ${song.key_signature}\n\n`;

                if (song.structure && Array.isArray(song.structure)) {
                    responseText += `Song Structure:\n${song.structure.join(' -> ')}\n\n`;
                }
                
                if (song.lyrics) {
                    responseText += `Lyrics:\n${song.lyrics}\n\n`;
                }
            }

            addMessage('ai', responseText);
            if (!song.raw_text) {
                 addMessage('ai', 'Hope you like it! You can refine this or try again with different lyrics.');
            }
        } else {
            addMessage('ai', `Sorry, I couldn't generate a song. ${result.error || 'Try something different?'}`);
        }
    }
});
