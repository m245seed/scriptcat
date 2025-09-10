// ==UserScript==
// @name         gm log
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  Logging function, add rich logs to your script, support log levels and log tags
// @author       You
// @match        https://bbs.tampermonkey.net.cn/
// @grant GM_log
// ==/UserScript==

GM_log("log message", "info", { component: "example" });