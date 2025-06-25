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
- Download this repo as ZIP
- Open your browser > extension > import from ZIP
- Select ZIP file you have already downloaded
### Assets
- Fonts: [JetBrains Mono](https://www.jetbrains.com/mono)
- Icons: [Material Icons](https://fonts.googleapis.com/icon?family=Material+Icons)
- App Icons: [Flaticon](https://www.flaticon.com/search?word=Cookie%20web)
### Colors
full code in `css/popup.css`
```css
:root {
    /* Light */
    --light-primary-color: #007acc;
    --light-success-color: #1a9937;
    --light-danger-color: #cd3131;
    --light-info-color: #444444;
    --light-copy-background-color: #909090;
    --light-background-color: #ffffff;
    --light-card-background: rgba(243, 243, 243, 0.9);
    /* Dark */
    --dark-primary-color: #569cd6;
    --dark-success-color: #6a9955;
    --dark-danger-color: #e44f4f;
    --dark-info-color: #808080;
    --dark-copy-background-color: #bbbbbb;
    --dark-background-color: #1e1e1e;
    --dark-card-background: rgba(37, 37, 38, 0.9);
}
```
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
