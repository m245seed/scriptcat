// ==UserScript==
// @name         Test @run-in both
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  @run-in normal-tabs & @run-in incognito-tabs injects both normal and incognito tabs
// @author       You
// @match        https://bbs.tampermonkey.net.cn/*
// @run-in       normal-tabs
// @run-in       incognito-tabs
// ==/UserScript==
console.log(GM_info.script["run-in"]);
