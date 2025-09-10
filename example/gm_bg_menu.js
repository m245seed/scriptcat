// ==UserScript==
// @name         bg gm menu
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  Use menus in background scripts
// @author       You
// @background
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

return new Promise((resolve) => {
  const id = GM_registerMenuCommand("Test Menu", () => {
    console.log(id);
    GM_unregisterMenuCommand(id);
    resolve();
  }, "z");
});