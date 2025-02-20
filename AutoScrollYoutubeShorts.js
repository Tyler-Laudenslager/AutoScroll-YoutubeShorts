// ==UserScript==
// @name         Auto-Scroll YouTube Shorts (Next Video)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Removes the loop attribute and, when the video ends, scrolls the next YouTube Short into view.
// @match        https://www.youtube.com/shorts/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to process the video element
    function processVideo(video) {
        // Remove the loop attribute so that the 'ended' event will fire.
        if (video.hasAttribute('loop')) {
            video.removeAttribute('loop');
            console.log("Loop attribute removed from video.");
        }
        // Attach the event listener if not already added.
        if (!video.hasAttribute('data-autoscroll-listener')) {
            video.addEventListener('ended', () => {
                console.log("Video ended. Preparing to scroll to the next Short...");
                setTimeout(() => {
                    // Find the closest container that holds this video.
                    const currentContainer = video.closest('ytd-reel-video-renderer');
                    if (currentContainer) {
                        // Attempt to find the next sibling container.
                        const nextVideoContainer = currentContainer.nextElementSibling;
                        if (nextVideoContainer) {
                            console.log("Next video container found. Scrolling into view...");
                            nextVideoContainer.scrollIntoView({ behavior: 'smooth' });
                        } else {
                            console.log("No next container found; scrolling by one viewport height as fallback.");
                            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
                        }
                    } else {
                        console.log("Current video container not detected; scrolling by one viewport height as fallback.");
                        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
                    }
                }, 500); // Delay to allow any UI transitions to complete.
            });
            video.setAttribute('data-autoscroll-listener', 'true');
        }
    }

    // Observe for the video element's insertion into the DOM.
    const observer = new MutationObserver((mutations, obs) => {
        const video = document.querySelector('video.video-stream.html5-main-video');
        if (video) {
            processVideo(video);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
