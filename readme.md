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

...and many more! For a comprehensive list of available bang commands, visit [DuckDuckGo Bangs](https://duckduckgo.com/bangs). Explore thousands of shortcuts to search your favorite websites directly.

### Local Development

```bash
# Clone the repository
git clone https://github.com/x7dl8p/bang_search.git

# Navigate to the project
cd bang_search

# Install dependencies
yarn install

# Run development server
yarn dev
```

## build the project
```bash
yarn build
```

## Technologies

- **Next.js**: React framework with server-side rendering
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first CSS framework
- **PWA**: Progressive Web App capabilities

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
This project is licensed under a proprietary license. All rights reserved. Unauthorized copying, distribution, or modification of this project, via any medium, is strictly prohibited without prior written permission from the author.

hahah joking, under MIT license.

---

Made with ❤️ for the open web.
