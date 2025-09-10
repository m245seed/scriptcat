// ==UserScript==
// @name         gm xhr
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  Ignore the browser's cors cross-domain request, you can set various unsafeHeaders and cookies, you need to use @connect to obtain permissions, or confirm by the user
// @author       You
// @grant        GM_xmlhttpRequest
// @match        https://bbs.tampermonkey.net.cn/
// @connect      tampermonkey.net.cn
// ==/UserScript==

const data = new FormData();

data.append("username", "admin");

data.append(
  "file",
  new File(["foo"], "foo.txt", {
    type: "text/plain",
  })
);

GM_xmlhttpRequest({
  url: "https://bbs.tampermonkey.net.cn/",
  method: "POST",
  responseType: "blob",
  data: data,
  cookie: "ceshi=123",
  anonymous: true,
  headers: {
    referer: "http://www.example.com/",
    origin: "www.example.com",
    // If it is empty, this header will not be sent
    "sec-ch-ua-mobile": "",
  },
  onload(resp) {
    console.log("onload", resp);
  },
  onreadystatechange(resp) {
    console.log("onreadystatechange", resp);
  },
  onloadend(resp) {
    console.log("onloadend", resp);
  },
});
