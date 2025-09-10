// ==UserScript==
// @name         early start script
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  Using early-start can load scripts faster than the webpage, but there will be some performance issues and GM API usage restrictions
// @author       You
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        CAT_scriptLoaded
// @early-start
// @match        http://test-case.ggnb.top/is_trusted/is_trusted.html
// ==/UserScript==

console.log("early-start get value", GM_getValue("test"));

console.log("early-start set value", GM_setValue("test", Math.random()));

const realAdd = document.addEventListener;
document.addEventListener = function (type, fuc) {
  if (type == "click") {
    const realFuc = fuc;
    fuc = function (e) {
      const obj = { isTrusted: true, target: e.target };
      Object.setPrototypeOf(obj, MouseEvent.prototype);
      realFuc.call(this, obj);
    };
  }
  realAdd.call(this, type, fuc);
};

unsafeWindow.onload = () => {
  document.querySelector("#btn").click();
};

CAT_scriptLoaded().then(() => {
  console.log("Script fully loaded");
});