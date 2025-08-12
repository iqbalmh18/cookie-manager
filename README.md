## Cookie Manager
[![20250625-143307.png](https://i.postimg.cc/B682jmrW/20250625-143307.png)](https://postimg.cc/S2hn5fQV)
Manage your cookies with a single click! Get, update, delete, import, and export cookies quickly.
### Features
| Name       | Description                   | 
|------------|-------------------------------|
| Get        | `get cookie from site`        |
| Update     | `update cookie to site`       |
| Copy       | `copy cookie to clipboard`    |
| Import     | `import from local storage`   |
| Export     | `Export to local storage`     |
| Delete     | `Delete cookie from site`     |
### Installation
How to install and use Cookie Manager on Kiwi Browser (Android) [click here](https://postimg.cc/cv4FnfQK)
- Download this repo as ZIP
- Open your browser > extension > import from ZIP
- Select ZIP file you have already downloaded
### Assets
- Fonts: [JetBrains Mono](https://www.jetbrains.com/mono)
- Icons: [Material Icons](https://fonts.googleapis.com/icon?family=Material+Icons)
- App Icons: [Flaticon](https://www.flaticon.com/search?word=Cookie%20web)
### Technology
- JavaScript
- Chrome Api
- Manifest (v3)
- CSS
- HTML
### Permission
full code in `manifest.json`
```json
    "permissions": [
        "scripting",
        "cookies",
        "activeTab",
        "downloads",
        "clipboardWrite"
    ]
```
