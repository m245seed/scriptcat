// ==UserScript==
// @name         gm get resource
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  Reference resources through @resource, this resource will be cached by the manager and cannot be modified
// @author       You
// @match        https://bbs.tampermonkey.net.cn/
// @resource     bbs https://bbs.tampermonkey.net.cn/
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// ==/UserScript==


console.log(GM_getResourceURL("bbs"));
console.log(GM_getResourceURL("bbs", false));
console.log(GM_getResourceURL("bbs", true));
console.log(GM_getResourceText("bbs"));