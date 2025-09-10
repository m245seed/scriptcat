// ==UserScript==
// @name         gm notification
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  Used to send a browser notification, supports icons/text/progress bars (progress bars are only valid in Chrome)
// @author       You
// @match        https://bbs.tampermonkey.net.cn/
// @grant        GM_notification
// ==/UserScript==

/**
 * @typedef {import('../src/types/scriptcat')} ScriptCat
 */

let i;
GM_notification({
  title: "Countdown",
  text: "Prepare to enter the countdown, create and get the notification id",
  ondone: (byUser) => {
    console.log("done user:", byUser);
    clearInterval(i);
  },
  onclick: () => {
    console.log("click");
  },
  oncreate: (id) => {
    let t = 1;
    i = setInterval(() => {
      GM_updateNotification(id, {
        title: "Countdown",
        text: 60 - t + "s countdown",
        progress: (100 / 60) * t,
      });
      if (t == 60) {
        clearInterval(i);
        GM_updateNotification(id, {
          title: "Countdown",
          text: "Countdown finished",
          progress: 100,
        });
      }
      t++;
    }, 1000);
  },
  // Enable progress bar mode
  progress: 0,
});

// Example 2: Comprehensive function notification - use more features
GM_notification({
  title: "Comprehensive function notification",
  text: "This is a notification example showing multiple features",
  tag: "feature-demo", // Using the same tag can overwrite the previous notification, otherwise a new notification will be created
  image: "https://bbs.tampermonkey.net.cn/favicon.ico", // Custom icon
  timeout: 10000, // Automatically close after 10 seconds
  url: "https://bbs.tampermonkey.net.cn/", // Associated URL
  onclick: (event) => {
    console.log("Notification clicked:", event);
    // event.preventDefault(); // Prevent opening url
  },
  oncreate: (event) => {
    console.log("Comprehensive function notification created, ID:", event.id);
  },
  ondone: (user) => {
    console.log("Comprehensive function notification completed, user action:", user);
  },
});
