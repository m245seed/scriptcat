// ==UserScript==
// @name         gm menu
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  Create a menu, which can be displayed in the pop-up page of the upper-right corner plug-in and the browser right-click menu
// @author       You
// @match        https://bbs.tampermonkey.net.cn/
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

const id = GM_registerMenuCommand(
  "Test Menu",
  () => {
    console.log(id);
    GM_unregisterMenuCommand(id);
  },
  { accessKey: "k", title: "Test Menu Title", autoClose: false }
);

const id2 = GM_registerMenuCommand(
  "Test Menu 2",
  () => {
    console.log(id2);
    GM_unregisterMenuCommand(id2);
  },
  "j"
);

setTimeout(() => {
  // Change name
  GM_registerMenuCommand(
    "Modified test menu",
    () => {
      console.log("Modified", id);
      GM_unregisterMenuCommand(id);
    },
    { id: id, accessKey: "k", title: "Modified test menu title", autoClose: false }
  );
}, 5000);
