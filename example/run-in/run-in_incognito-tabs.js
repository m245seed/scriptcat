// ==UserScript==
// @name         Test @run-in incognito-tabs
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  @run-in incognito-tabs only injects incognito tabs
// @author       You
// @match        https://bbs.tampermonkey.net.cn/*
// @run-in       incognito-tabs
// ==/UserScript==
console.log(GM_info.script["run-in"]);
