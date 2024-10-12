# YouTube Channel Blocker & Shorts Remover

This Tampermonkey userscript blocks videos from specific YouTube channels and removes YouTube Shorts from the YouTube homepage and search results. It provides a cleaner and more tailored YouTube experience by allowing you to block content from channels you don’t want to see and eliminate the YouTube Shorts sections.

## Features

- Block videos from specific YouTube channels by their channel ID or handle.
- Automatically remove YouTube Shorts from the homepage and other sections.
- Works dynamically with infinite scrolling (continuously hides unwanted videos as the page updates).

## Installation

### Requirements

- **Tampermonkey**: This script works with Tampermonkey, a browser extension that allows you to run userscripts. You can install Tampermonkey from the following sources:
  - [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
  - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
  - [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

### Installation Steps

1. Install Tampermonkey for your browser using the links above.
2. Open Tampermonkey’s dashboard in your browser by clicking the Tampermonkey icon and selecting **Dashboard**.
3. Click the `+` button (Create a new script).
4. Copy and paste the script below into the editor:
   ```javascript
   // ==UserScript==
   // @name         Block YouTube Channels and Remove Shorts
   // @namespace    http://tampermonkey.net/
   // @version      1.7
   // @description  Hides videos from certain channels and removes YouTube Shorts
   // @match        *://www.youtube.com/*
   // @grant        none
   // @run-at       document-end
   // ==/UserScript==

   (function() {
       'use strict';

       // List of channel IDs and handles to block
       const blockedChannels = ['UCX6OQ3DkcsbYNE6H8uQQuVA', '@MrBeast', '@IShowSpeed', '@MrBeastGaming'];

       function blockVideosAndShorts() {
           const videos = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer, ytd-item-section-renderer, ytd-shelf-renderer, ytd-rich-item-renderer');

           console.log('Found videos:', videos.length);

           videos.forEach(video => {
               const channelLink = video.querySelector('a[href^="/channel/"], a[href^="/@"]');
               if (!channelLink) return;

               const channelHref = channelLink.href;
               let channelIdOrHandle;

               if (channelHref.includes('/channel/')) {
                   channelIdOrHandle = channelHref.split('/channel/')[1].split('?')[0];
               } else if (channelHref.includes('/@')) {
                   channelIdOrHandle = '@' + channelHref.split('/@')[1].split('?')[0];
               }

               if (blockedChannels.includes(channelIdOrHandle)) {
                   console.log('Blocking video from channel ID/Handle:', channelIdOrHandle);
                   video.style.display = 'none';
               }
           });

           // Remove YouTube Shorts
           const shortsSections = document.querySelectorAll('ytd-reel-shelf-renderer, ytd-rich-shelf-renderer[is-shorts], ytd-grid-video-renderer[is-shorts]');
           shortsSections.forEach(short => {
               console.log('Blocking a Shorts section');
               short.style.display = 'none';
           });
       }

       const observer = new MutationObserver(blockVideosAndShorts);
       observer.observe(document.body, { childList: true, subtree: true });
       console.log('MutationObserver is set and observing changes');

       setInterval(() => {
           blockVideosAndShorts();
           console.log('Periodic check to block videos and Shorts');
       }, 5000);

       setTimeout(() => {
           blockVideosAndShorts();
           console.log('Initial blockVideosAndShorts function executed after delay');
       }, 3000);
   })();
