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
    const blockedChannels = ['UCX6OQ3DkcsbYNE6H8uQQuVA', '@MrBeast', '@IShowSpeed', '@MrBeastGaming','@StevenHe','@AMPEXCLUSIVE','@earlybirdgaming','@JayPlaysRTX']; // Add other channel IDs and handles here

    function blockVideosAndShorts() {
        // More flexible selector to catch any video-related elements
        const videos = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer, ytd-item-section-renderer, ytd-shelf-renderer, ytd-rich-item-renderer');

        // Log the number of videos found
        console.log('Found videos:', videos.length);

        videos.forEach(video => {
            // Get channel ID or handle from the href link
            const channelLink = video.querySelector('a[href^="/channel/"], a[href^="/@"]');
            if (!channelLink) return;  // Skip if no channel link is found

            const channelHref = channelLink.href;
            let channelIdOrHandle;

            if (channelHref.includes('/channel/')) {
                channelIdOrHandle = channelHref.split('/channel/')[1].split('?')[0]; // Extract channel ID and remove URL params
            } else if (channelHref.includes('/@')) {
                channelIdOrHandle = '@' + channelHref.split('/@')[1].split('?')[0]; // Extract handle and remove URL params
            }

            // Only log and block relevant channels
            if (blockedChannels.includes(channelIdOrHandle)) {
                console.log('Blocking video from channel ID/Handle:', channelIdOrHandle);
                video.style.display = 'none'; // Hide the video
            }
        });

        // Remove YouTube Shorts (identified by their specific tag or selector)
        const shortsSections = document.querySelectorAll('ytd-reel-shelf-renderer, ytd-rich-shelf-renderer[is-shorts], ytd-grid-video-renderer[is-shorts]');

        shortsSections.forEach(short => {
            console.log('Blocking a Shorts section');
            short.style.display = 'none'; // Hide Shorts
        });
    }

    // MutationObserver to watch for changes in the DOM (for infinite scrolling)
    const observer = new MutationObserver(blockVideosAndShorts);
    observer.observe(document.body, { childList: true, subtree: true });
    console.log('MutationObserver is set and observing changes');

    // Periodically re-check to block videos (helpful for dynamic content)
    setInterval(() => {
        blockVideosAndShorts();
        console.log('Periodic check to block videos and Shorts');
    }, 5000); // Check every 5 seconds

    // Initial block with a slight delay after page load
    setTimeout(() => {
        blockVideosAndShorts();  // Initial block when the page is loaded
        console.log('Initial blockVideosAndShorts function executed after delay');
    }, 3000);  // 3-second delay to allow the page to load fully

})();

