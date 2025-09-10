// ==UserScript==
// @name         gm add element
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  Insert elements into the page, which can bypass CSP restrictions
// @author       You
// @match        https://github.com/scriptscat/scriptcat
// @grant        GM_addElement
// ==/UserScript==

const el = GM_addElement(document.querySelector('.BorderGrid-cell'), "img", {
    src: "https://bbs.tampermonkey.net.cn/uc_server/avatar.php?uid=4&size=small&ts=1"
});

console.log(el);