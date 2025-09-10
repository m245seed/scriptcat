// ==UserScript==
// @name         gm value storage setter
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  Share data between multiple scripts, setter
// @author       You
// @match https://bbs.tampermonkey.net.cn/
// @run-at document-start
// @grant GM_setValue
// @grant GM_deleteValue
// @storageName example
// ==/UserScript==

setTimeout(() => {
  GM_deleteValue("test_set");
}, 3000);

GM_setValue("test_set", Date.now());
