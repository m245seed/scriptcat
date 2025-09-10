// ==UserScript==
// @name         gm value storage reader and listener - background script
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  Share data between multiple scripts, reader and listener - background script
// @author       You
// @run-at document-start
// @grant GM_getValue
// @grant GM_addValueChangeListener
// @grant GM_listValues
// @grant GM_cookie
// @storageName example
// @background
// ==/UserScript==

return new Promise((resolve) => {
  GM_addValueChangeListener("test_set", function (name, oldval, newval, remote) {
    console.log("value change", name, oldval, newval, remote);
  });

  setInterval(() => {
    console.log("test_set: ", GM_getValue("test_set"));
    console.log("value list:", GM_listValues());
  }, 2000);
  // Never returning resolve means never ending
  // resolve()
});
