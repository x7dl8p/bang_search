# Universal Search - Bang-enabled PWA Search Interface

A Progressive Web App that brings the power of search engine bang shortcuts to your browser. Search multiple engines with simple commands and work offline with local storage.
![{8A0820D5-DE34-4A1F-8449-19A581E15D6C}](https://github.com/user-attachments/assets/5900da90-a175-43df-bf90-355650fa2afa)
![{D104533F-4CDB-49B6-9804-C05B6F12B8EF}](https://github.com/user-attachments/assets/8a33f54f-0bf9-4fe8-9665-c92c89c64acf)


## Features

- **Bang Shortcuts**: Use commands like `!g` for Google, `!w` for Wikipedia, and `!yt` for YouTube
- **Works Offline**: Full functionality available without an internet connection
- **Dark/Light Mode**: Automatic theme detection with manual toggle
- **Search History**: View and manage your recent searches
- **Search Suggestions**: Get real-time suggestions as you type
- **Fully Responsive**: Works on all devices and screen sizes
- **Installable**: Install as a PWA on your device

## Bang Commands

The app comes with several built-in bang commands:

| Bang | Search Engine | Example |
|------|---------------|---------|
| !g   | Google        | !g react hooks |
| !w   | Wikipedia     | !w quantum physics |
| !yt  | YouTube       | !yt how to code |
| !gh  | GitHub        | !gh nextjs app |
| !so  | Stack Overflow| !so javascript error |

...and many more! 

## Installation

### As a PWA

1. Visit the deployed app in Chrome, Edge, or any modern browser
2. Look for the install icon in your address bar
3. Click "Install" to add it to your device

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/pwa-search-interface.git

# Navigate to the project
cd pwa-search-interface

# Install dependencies
npm install

# Run development server
npm run dev
```

## Technologies

- **Next.js**: React framework with server-side rendering
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first CSS framework
- **PWA**: Progressive Web App capabilities

## Building for Production

```bash
# Build the project
npm run build

# Export as static site
npm run export
```

## Offline Support

The app uses service workers to cache resources and provide offline functionality. Your search history and preferences are stored in localStorage, ensuring a seamless experience even without an internet connection.

## Theming

The app supports light and dark modes:

- Automatically detects your system preference
- Allows manual toggling via the theme switch in the top-right corner
- Persists your preference between sessions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by DuckDuckGo's bang commands
- Built with Next.js and Tailwind CSS
- Icons from Lucide React

---

Made with ❤️ for the open web
