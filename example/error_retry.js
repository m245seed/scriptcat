// ==UserScript==
// @name         Retry Example
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  try to take over the world!
// @author       You
// @crontab      * * once * *
// @grant        GM_notification
// ==/UserScript==

return new Promise((resolve, reject) => {
	// Your code here...
	GM_notification({
		title: "retry",
		text: "Retry after 10 seconds"
	});
	reject(new CATRetryError("xxx error", 10));
});
