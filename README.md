# MusicGPT - AI Music Creation Hub

## Getting Started

1. Obtain an OpenAI API key:
   - Go to https://platform.openai.com/account/api-keys
   - Click "Create new secret key"
   - Copy the key (starts with 'sk-')

2. Set up environment:
```bash
cp .env.template .env
# Edit .env and add your API key
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash
python app.py
```

5. Access the web interface at:
http://localhost:5000

## Features
- General AI chat interface
- Lyric Bot for song generation
- Responsive design
- Easy to extend with new music tools

## Requirements
- Python 3.8+
- OpenAI API key
- Flask web framework
