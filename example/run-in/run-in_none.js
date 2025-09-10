// ==UserScript==
// @name         Test @run-in none
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  If @run-in is not set, both normal and incognito tabs will be injected by default
// @author       You
// @match        https://bbs.tampermonkey.net.cn/*
// ==/UserScript==
console.log(GM_info.script["run-in"]);
