// ==UserScript==
// @name         gm open tab
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  Open a tab
// @author       You
// @match        https://bbs.tampermonkey.net.cn/
// @grant        GM_openInTab
// ==/UserScript==

const tab = GM_openInTab("https://scriptcat.org/search");

tab.onclose = () => {
    console.log("close");
}

setTimeout(() => {
    tab.close();
}, 3000)

