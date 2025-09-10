// ==UserScript==
// @name         userconfig
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  Displays user configuration on the page, which can be configured visually
// @author       You
// @background
// @grant        GM_getValue
// @grant        CAT_userConfig
// ==/UserScript==

/* ==UserConfig==
group1:
  configA:                                # The key is group.config, for example, this key is: group1.configA
    title: Config A                       # Configuration title
    description: This is a text type configuration # Configuration description
    type: text                            # Option type, if not filled in, it will be automatically identified based on the data
    default: Default value                # Default value of the configuration
    min: 2                                # Minimum 2 characters
    max: 18                               # Maximum 18 characters
    password: true                        # Set as password
  configB:
    title: Config B
    description: This is a checkbox type configuration
    type: checkbox
    default: true
  configC:
    title: Config C
    description: This is a list selection configuration
    type: select
    default: 1
    values: [1,2,3,4,5]
  configD:
    title: Config D
    description: This is a dynamic list selection configuration
    type: select
    bind: $cookies                       # Dynamically display the bound values, the value is a key starting with $, and the value needs to be an array
  configE:
    title: Config E
    description: This is a multiple selection list configuration
    type: mult-select
    default: [1]
    values: [1,2,3,4,5]
  configF:
    title: Config F
    description: This is a dynamic multiple selection list configuration
    type: mult-select
    bind: $cookies
  configG:
    title: Config G
    description: This is a number type configuration
    type: number
    default: 11
    min: 10  # Minimum value
    max: 16  # Maximum value
    unit: min # Represents the unit
  configH:
    title: Config H
    description: This is a long text type configuration
    type: textarea
    default: Default value
    rows: 6
  configI:
    title: Switch
    description: This is a switch type configuration
    type: switch
    default: true
---
group2:
  configX:
    title: Config A
    description: This is a text type configuration
    default: Default value
 ==/UserConfig== */

// Get the UserConfig object through the new GM_info method
const rawUserConfig = GM_info.userConfig;
// Define an object to temporarily store the read UserConfig value
const userConfig = {};
// Destructure and traverse to read UserConfig and assign default values
for (const [mainKey, configs] of Object.entries(rawUserConfig)) {
  for (const [subKey, { default: defaultValue }] of Object.entries(configs)) {
    userConfig[`${mainKey}.${subKey}`] = GM_getValue(`${mainKey}.${subKey}`, defaultValue);
  }
}

setInterval(() => {
  // Traditional method to read UserConfig, each default value needs to be declared separately and statically, and the code needs to be manually modified after modifying the UserConfig default value
  console.log(GM_getValue("group1.configA", "Default value"));
  console.log(GM_getValue("group1.configG", 11));
  // The new GM_info method reads UserConfig, which can be directly associated with reading default values without additional modification
  console.log(userConfig["group1.configA"]);
  console.log(userConfig["group1.configG"]);
}, 5000)

// Open user configuration
CAT_userConfig();