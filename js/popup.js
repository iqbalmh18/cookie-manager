document.addEventListener("DOMContentLoaded", () => {
    const cookieStringTextArea = document.getElementById("cookieString");
    const getCookiesButton = document.getElementById("getCookies");
    const clearCookiesButton = document.getElementById("clearCookies");
    const updateCookiesButton = document.getElementById("updateCookies");
    const copyCookiesButton = document.getElementById("copyCookies");
    const statusMessageElement = document.getElementById("statusMessage");
    const themeToggle = document.getElementById("themeToggle");
    const importCookiesButton = document.getElementById("importCookiesButton");
    const importCookiesFile = document.getElementById("importCookiesFile");
    const exportCookiesButton = document.getElementById("exportCookiesButton");

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(savedTheme + '-mode');
    if (savedTheme === 'dark') {
        themeToggle.querySelector('.material-icons').textContent = 'light_mode';
    } else {
        themeToggle.querySelector('.material-icons').textContent = 'dark_mode';
    }

    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('light-mode')) {
            document.body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('theme', 'dark');
            themeToggle.querySelector('.material-icons').textContent = 'light_mode';
        } else {
            document.body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('theme', 'light');
            themeToggle.querySelector('.material-icons').textContent = 'dark_mode';
        }
    });

    const getActiveTabUrl = (callback) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                callback(tabs[0].url);
            } else {
                showStatus("No active tab found!", false);
            }
        });
    };

    getCookiesButton.addEventListener("click", function () {
        getActiveTabUrl((targetUrl) => {
            getCookieString(targetUrl);
            showStatus("Cookies retrieved successfully!", true);
        });
    });

    clearCookiesButton.addEventListener("click", function () {
        getActiveTabUrl(async (targetUrl) => {
            await clearCookies(targetUrl);
            cookieStringTextArea.value = "";
            showStatus("Cookies cleared successfully!", true);
        });
    });

    updateCookiesButton.addEventListener("click", function () {
        const cookieStr = cookieStringTextArea.value;
        if (!cookieStr.trim()) {
            showStatus("Please enter a valid cookie string!", false);
            return;
        }

        getActiveTabUrl(async (targetUrl) => {
            await updateCookies(targetUrl, cookieStr);
            showStatus("Cookies updated successfully!", true);
        });
    });

    copyCookiesButton.addEventListener("click", async () => {
        const cookieStr = cookieStringTextArea.value;
        if (!cookieStr.trim()) {
            showStatus("There are no cookies to copy!", false);
            return;
        }
        try {
            await navigator.clipboard.writeText(cookieStr);
            showStatus("Cookies copied to clipboard!", true);
        } catch (err) {
            showStatus("Failed to copy cookies!", false);
        }
    });

    importCookiesButton.addEventListener("click", () => {
        importCookiesFile.click();
    });

    importCookiesFile.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                cookieStringTextArea.value = e.target.result;
                showStatus("Cookies imported from file!", true);
            };
            reader.onerror = () => {
                showStatus("Failed to read file!", false);
            };
            reader.readAsText(file);
        }
    });

    exportCookiesButton.addEventListener("click", () => {
        const cookieStr = cookieStringTextArea.value;
        if (!cookieStr.trim()) {
            showStatus("No cookies to export!", false);
            return;
        }

        const filename = "cookies.txt";
        const blob = new Blob([cookieStr], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        chrome.downloads.download({
            url: url,
            filename: filename,
            saveAs: true
        }, () => {
            if (chrome.runtime.lastError) {
                showStatus("Failed to export cookies!", false);
            } else {
                showStatus("Cookies exported successfully!", true);
            }
            URL.revokeObjectURL(url);
        });
    });

    function getCookieString(url) {
        chrome.cookies.getAll({ url }, (cookies) => {
            if (chrome.runtime.lastError) {
                showStatus("Failed to retrieve cookies!", false);
                return;
            }
            if (cookies.length === 0) {
                cookieStringTextArea.value = "";
                showStatus("No cookies found!", false);
                return;
            }
            const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join("; ");
            cookieStringTextArea.value = cookieString;
        });
    }

    async function clearCookies(targetUrl) {
        return new Promise((resolve) => {
            chrome.cookies.getAll({ url: targetUrl }, (cookies) => {
                if (chrome.runtime.lastError) {
                    showStatus("Failed to retrieve cookies for clearing!", false);
                    resolve();
                    return;
                }

                const deletions = cookies.map(cookie => {
                    return new Promise((resolveDelete) => {
                        let cookieDeletionUrl = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
                        if (cookie.domain.startsWith('.')) {
                            cookieDeletionUrl = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain.substring(1) + cookie.path;
                        }
                        
                        chrome.cookies.remove({ url: cookieDeletionUrl, name: cookie.name }, () => {
                            if (chrome.runtime.lastError) {
                            }
                            resolveDelete();
                        });
                    });
                });
                Promise.all(deletions).then(resolve);
            });
        });
    }

    async function updateCookies(url, cookieString) {
        const cookiesArr = cookieString.split(";")
            .map(item => item.trim())
            .filter(item => item && item.includes('='))
            .map(item => item.split(/=(.*)/s).map(s => s.trim()));

        if (cookiesArr.length === 0) {
            showStatus("No valid cookies found in the string!", false);
            return;
        }

        await clearCookies(url);

        const setCookies = cookiesArr.map(cookiePair => {
            const [name, value] = cookiePair;
            return new Promise((resolve) => {
                let domain = new URL(url).hostname;
                let path = "/";

                chrome.cookies.set({ url, name, value, domain, path }, () => {
                    if (chrome.runtime.lastError) {
                    }
                    resolve();
                });
            });
        });

        await Promise.all(setCookies);
        getCookieString(url);
    }

    function showStatus(message, isSuccess) {
        statusMessageElement.textContent = message;
        statusMessageElement.className = `status-message ${isSuccess ? "success" : "error"} visible`;

        setTimeout(() => {
            statusMessageElement.classList.remove("visible");
        }, 3000);
    }
});
