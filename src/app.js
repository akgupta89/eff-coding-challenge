const   browser     = chrome || browser,
        logo_he     = browser.runtime.getURL("assets/https-everywhere-logo.png");

// Helpers for validating the page has certain content

class PageCheckers {

	static getURL() {
		return window.location.href.toLowerCase();
	}

    static hasMatchingURL() {
        let url = PageCheckers.getURL(),
            siteWhitelist = [
                "*://*.schneier.com/*",
                "*://*.eff.org/*",
                "*://blog.cryptographyengineering.com/*",
                "*://twitter.com/matthew_d_green*",
                "*://*.twitter.com/matthew_d_green*",
                "*://example.com/*",
                "*://*.example.com/*"
            ];

        siteWhitelist = siteWhitelist.map(url => url.replace(/\*/g, "[^ ]*"));

        for (let i = 0; i < siteWhitelist.length; i++) {
            let result = url.match(siteWhitelist[i]);
            if (result) return true;
        }

        return false;
    }

    static hasHEPMetaTag() {
        const metas = document.getElementsByTagName('meta');

        for (let i = 0; i < metas.length; i++) {
            if (
                metas[i].hasAttribute("name") && metas[i].getAttribute("name").toLowerCase() === "https-everywhere-prompt" &&
                metas[i].hasAttribute("content") && metas[i].getAttribute("content").toLowerCase() === "yes"
            )
                return true;
        }

        return false;
    }
}

// Class for creating the popup modal

class PopupModal {

    static getStyle() {
        return `<style>
            a {
                color: var(--main-primary-color);
                transition-duration: 0.2s;
            }
            
            a:not(.button):hover {
                color: var(--main-hover-color);
            }
            
            #he-container {
                position: fixed;
                z-index: 1;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0,0,0,0.5);
            }
            
            #he-modal {
                background-color: #fefefe;
                transform: translate(-50%, -50%);
                border: 1px solid #888;
                position: absolute;
                top: 50%;
                left: 50%;
                width: 80%;
                max-width: 400px;
                font-family: Sans, sans-serif;
                font-weight: normal;
            }
			
			#logo {
                width: 50%;
                display: block;
                margin: auto;
                padding: 8px;
            }
            
            #content {
                margin: 0;
                padding: 12px;
                font-size: 12px;
                line-height: 2;
            }
            
            #footer {
                text-align: center;
                margin: 20px 0 10px;
            }
            
            .close {
                color: #AAA;
                float: right;
                font-size: 28px;
                font-weight: bold;
                padding: 0 8px;
                cursor: pointer;
                transition-duration: 0.2s;
            }
            
            .close:hover, .close:focus {
                color: var(--main-hover-color);
                transition-duration: 0.2s;
                text-decoration: none;
            }
            
            .button {
                display: inline-block;
                background-color: var(--main-primary-color);
                color: #FFF;
                padding: 8px;
                border-radius: 8px;
                border: none;
                text-decoration: none;
                cursor: pointer;
                font-size: 12px;
                transition-duration: 0.2s;
                line-height: 1;
            }
            
            .button:hover {
                background-color: var(--main-hover-color);
            }
        </style>`;
    }

    static getHTML() {
        return `
            <div id="he-container">
                <div id="he-modal">
                    <span id="close" class="close">&times;</span>
                    <img id="logo" src="${logo_he}" border="0" alt="HTTPS Everywhere" />
                    <p id="content"><a href="https://www.eff.org/https-everywhere">HTTPS Everywhere</a> is a plugin produced in collaboration by <a href="https://www.torproject.org/">The Tor Project</a> and the <a href="https://www.eff.org/">Electronic Frontier Foundation</a>. Install the plugin to ensure you always have a secure connection when browsing the net.</p>
                    <p id="footer">
                        <a class="button" href="https://supporters.eff.org/donate/join-4" >Donate to EFF</a>
                        <a class="button" href="https://www.eff.org/https-everywhere">Install</a>
                    </p>
                </div>
            </div>
        `;
    }

    render() {
        let dialog = document.createElement("dialog");
        dialog.innerHTML = PopupModal.getStyle() + PopupModal.getHTML();
        dialog.querySelector("#he-container, .close").addEventListener("click", (e) => {
            if (e.target.id == "he-container" || e.target.id == "close") {
                dialog.remove();
            }
        });

        return dialog;
    }
}

// Extension main content
if (PageCheckers.hasHEPMetaTag() || PageCheckers.hasMatchingURL()) {

    let shadow = document.body.attachShadow({ mode: "open" });
    shadow.appendChild(document.createElement("slot"));

    let dialog = new PopupModal().render();
    shadow.appendChild(dialog);
    dialog.showModal();
}