// ==UserScript==
// @name         bg cat input menu
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  A shortcut menu with interactive input in the background script
// @author       You
// @background
// @grant        CAT_registerMenuInput
// @grant        CAT_unregisterMenuInput
// @grant        GM_notification
// ==/UserScript==

return new Promise((resolve) => {
  const id = CAT_registerMenuInput(
    "Test Menu",
    () => {
      console.log(id);
      CAT_unregisterMenuInput(id);
    },
    "z"
  );

  CAT_registerMenuInput(
    "Test Menu boolean",
    (inputValue) => {
      GM_notification({
        title: "Test Menu boolean",
        text: "" + inputValue,
      });
    },
    {
      inputType: "boolean",
      inputLabel: "Notify?",
      inputDefaultValue: true,
      autoClose: false,
    }
  );

  CAT_registerMenuInput(
    "Test Menu text",
    (inputValue) => {
      GM_notification({
        title: "Test Menu text",
        text: "" + inputValue,
      });
    },
    {
      inputType: "text",
      inputLabel: "Notification content",
      inputValue: "text",
      autoClose: false,
    }
  );

  CAT_registerMenuInput(
    "Test Menu number",
    (inputValue) => {
      setTimeout(() => {
        GM_notification({
          title: "Test Menu number",
          text: "" + (1000 + inputValue),
        });
      }, 1000 + inputValue);
    },
    {
      inputType: "number",
      inputLabel: "Delay ms",
      inputPlaceholder: "Minimum 1000ms",
    }
  );

  resolve();
});
