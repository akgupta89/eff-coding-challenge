# EFF Coding Challenge

WebExtension implementation of a Chrome/Firefox extension to create a dialog on certain webpages to prompt users to install HTTPS Everywhere. Uses JavaScript ES6 features.

## Overview

Build an extension that will display a prompt whenever key web pages are visited or a page contains a `<meta name="https-everywhere-prompt" content="yes">` tag. If either of these conditions are met, prompt the user to visit HTTPS Everywhere's website to download and install the plugin.

This plugin makes use of the Shadow DOM to create an HTML element where Javascript/CSS will not leak from the main DOM tree of the website and prevent the injected CSS/JS from the extension to leak into the website.

## Requirements
Requires Chrome (tested on Chrome v72)

## Install
1. Open chrome and navigate to `chrome://extensions/`
2. Toggle on developer mode
3. Click "Load unpacked"
4. Navigate to directory and press "Select Folder"

## Testing
* Visiting <https://schneier.com> should display the prompt
* Visiting <https://eff.org> should display the prompt
* Visiting <https://blog.cryptographyengineering.com/ should display the prompt
* Visiting <https://twitter.com/matthew_d_green> should display the prompt
* Visiting <https://www.example.com> should display the prompt

## Known Issues
* The subdomain wildcard feature is not optional. E.g. two entries had to be made for `*.twitter.com` and `twitter.com`
* The prompt will display on any twitter page beginning with the username `matthew_d_green`. This is due to wanting to display the prompt on `matthew_d_green`, `matthew_d_green/`, and `matthew_d_green?`

## Future Changes
* Replace the regex feature with the native JS URL parsing library to resolve the known issues

License
----
> MIT