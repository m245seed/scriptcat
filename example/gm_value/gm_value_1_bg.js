// ==UserScript==
// @name         gm value storage setter - scheduled script
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  Share data between multiple scripts, setter - scheduled script
// @author       You
// @run-at document-start
// @grant GM_setValue
// @grant GM_deleteValue
// @storageName example
// @crontab */5 * * * * *
// ==/UserScript==

return new Promise((resolve) => {
  GM_setValue("test_set", Date.now());
  resolve();
});
