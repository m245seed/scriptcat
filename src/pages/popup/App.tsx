/* eslint-disable prettier/prettier */
import { Discord, DocumentationSite, ExtVersion } from "@App/app/const";
import { Alert, Badge, Button, Card, Collapse, Dropdown, Menu, Switch } from "@arco-design/web-react";
import {
  IconBook,
  IconBug,
  IconGithub,
  IconMoreVertical,
  IconNotification,
  IconPlus,
  IconSearch,
  IconSettings,
  IconSync,
} from "@arco-design/web-react/icon";
import { useEffect, useState, useCallback } from "react";
import { RiMessage2Line } from "react-icons/ri";
import semver from "semver";
import { useTranslation } from "react-i18next";
import ScriptMenuList from "../components/ScriptMenuList";
import PopupWarnings from "../components/PopupWarnings";
import { popupClient, scriptClient } from "../store/features/script";
import type { ScriptMenu } from "@App/app/service/service_worker/types";
import { systemConfig } from "../store/global";
import { isChineseUser, localePath } from "@App/locales/locales";
import { getCurrentTab } from "@App/pkg/utils/utils";

const CollapseItem = Collapse.Item;

const iconStyle = {
  marginRight: 8,
  fontSize: 16,
  transform: "translateY(1px)",
};

function App() {
  const [scriptList, setScriptList] = useState<ScriptMenu[]>([]);
  const [backScriptList, setBackScriptList] = useState<ScriptMenu[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [checkUpdate, setCheckUpdate] = useState<Parameters<typeof systemConfig.setCheckUpdate>[0]>({
    version: ExtVersion,
    notice: "",
    isRead: false,
  });
  const [currentUrl, setCurrentUrl] = useState("");
  const [isEnableScript, setIsEnableScript] = useState(true);
  const [isBlacklist, setIsBlacklist] = useState(false);
  const { t } = useTranslation();

  let url: URL | undefined;
  try {
    url = new URL(currentUrl);
  } catch (_: any) {
    // ignore error
  }

  useEffect(() => {
    let isMounted = true;

    const onCurrentUrlUpdated = (url: string, tabId: number) => {
      checkScriptEnableAndUpdate();
      popupClient
        .getPopupData({ url, tabId })
        .then((resp) => {
          if (!isMounted) return;

          // Make sure the response is valid
          if (!resp || !resp.scriptList) {
            console.warn("Invalid popup data response:", resp);
            return;
          }

          // Sort by enabled status and update time
          const list = resp.scriptList;
          list.sort(
            (a, b) =>
              //@ts-ignore
              b.enable - a.enable ||
              // Sort by number of menus
              b.menus.length - a.menus.length ||
              b.runNum - a.runNum ||
              b.updatetime - a.updatetime
          );
          setScriptList(list);
          setBackScriptList(resp.backScriptList || []);
          setIsBlacklist(resp.isBlacklist || false);
          checkScriptEnableAndUpdate();
        })
        .catch((error) => {
          console.error("Failed to get popup data:", error);
          if (!isMounted) return;
          // Set default values to prevent errors
          setScriptList([]);
          setBackScriptList([]);
          setIsBlacklist(false);
        });
    };

    const checkScriptEnableAndUpdate = async () => {
      const [isEnableScript, checkUpdate] = await Promise.all([
        systemConfig.getEnableScript(),
        systemConfig.getCheckUpdate(),
      ]);
      if (!isMounted) return;
      setIsEnableScript(isEnableScript);
      setCheckUpdate(checkUpdate);
    };
    const queryTabInfo = async () => {
      // Only run tab info once, not bound to currentUrl
      try {
        const tab = await getCurrentTab();
        if (!isMounted || !tab) return;
        const newUrl = tab.url || "";
        setCurrentUrl((prev) => {
          if (newUrl !== prev) {
            const { url, id: tabId } = tab;
            if (url && tabId) onCurrentUrlUpdated(url, tabId);
          }
          return newUrl;
        });
      } catch (e) {
        console.error(e);
      }
    };

    checkScriptEnableAndUpdate();
    queryTabInfo();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleEnableScriptChange = useCallback((val: boolean) => {
    setIsEnableScript(val);
    systemConfig.setEnableScript(val);
  }, []);

  const handleSettingsClick = useCallback(() => {
    // Using an a-link will cause Vivaldi to crash
    window.open("/src/options.html", "_blank");
  }, []);

  const handleNotificationClick = useCallback(() => {
    setShowAlert((prev) => !prev);
    const updatedCheckUpdate = { ...checkUpdate, isRead: true };
    setCheckUpdate(updatedCheckUpdate);
    systemConfig.setCheckUpdate(updatedCheckUpdate);
  }, [checkUpdate]);

  const handleMenuClick = useCallback(
    async (key: string) => {
      switch (key) {
        case "newScript":
          await chrome.storage.local.set({
            activeTabUrl: { url: currentUrl },
          });
          window.open("/src/options.html#/script/editor?target=initial", "_blank");
          break;
        case "checkUpdate":
          await scriptClient.requestCheckUpdate("");
          window.close();
          break;
        case "report_issue": {
          const browserInfo = `${navigator.userAgent}`;
          const issueUrl =
            `https://github.com/scriptscat/scriptcat/issues/new?` +
            `template=bug_report${isChineseUser() ? "" : "_en"}.yaml&scriptcat-version=${ExtVersion}&` +
            `browser-version=${encodeURIComponent(browserInfo)}`;
          window.open(issueUrl, "_blank");
          break;
        }
        default:
          window.open(key, "_blank");
          break;
      }
    },
    [currentUrl]
  );

  return (
    <>
      <PopupWarnings isBlacklist={isBlacklist} />
      <Card
        size="small"
        title={
          <div className="flex justify-between">
            <span className="text-xl">{"ScriptCat"}</span>
            <div className="flex flex-row items-center">
              <Switch size="small" className="mr-1" checked={isEnableScript} onChange={handleEnableScriptChange} />
              <Button type="text" icon={<IconSettings />} iconOnly onClick={handleSettingsClick} />
              <Badge count={checkUpdate.isRead ? 0 : 1} dot offset={[-8, 6]}>
                <Button type="text" icon={<IconNotification />} iconOnly onClick={handleNotificationClick} />
              </Badge>
              <Dropdown
                onVisibleChange={(visible) => {
                  if (!visible) return;
                  // Check the position to optimize the problem that the pop-up menu is not fully displayed due to the small window
                  setTimeout(() => {
                    const dropdowns = document.getElementsByClassName("arco-dropdown");
                    console.log(dropdowns);
                    if (dropdowns.length > 0) {
                      const dropdown = dropdowns[0] as HTMLElement;
                      console.log(dropdowns, dropdown.style.top);
                      // If top is negative, change it to 0
                      if (parseInt(dropdown.style.top) < 0) {
                        dropdown.style.top = "0px";
                      }
                    }
                  }, 100);
                }}
                droplist={
                  <Menu
                    style={{
                      maxHeight: "none",
                    }}
                    onClickMenuItem={handleMenuClick}
                  >
                    <Menu.Item key="newScript">
                      <IconPlus style={iconStyle} />
                      {t("create_script")}
                    </Menu.Item>
                    <Menu.Item key={`https://scriptcat.org/search?domain=${url && url.host}`}>
                      <IconSearch style={iconStyle} />
                      {t("get_script")}
                    </Menu.Item>
                    <Menu.Item key={"checkUpdate"}>
                      <IconSync style={iconStyle} />
                      {t("check_update")}
                    </Menu.Item>
                    <Menu.Item key="report_issue">
                      <IconBug style={iconStyle} />
                      {t("report_issue")}
                    </Menu.Item>
                    <Menu.Item key={`${DocumentationSite}${localePath}`}>
                      <IconBook style={iconStyle} />
                      {t("project_docs")}
                    </Menu.Item>
                    <Menu.Item key={isChineseUser() ? "https://bbs.tampermonkey.net.cn/" : Discord}>
                      <RiMessage2Line style={iconStyle} />
                      {t("community")}
                    </Menu.Item>
                    <Menu.Item key="https://github.com/scriptscat/scriptcat">
                      <IconGithub style={iconStyle} />
                      {"GitHub"}
                    </Menu.Item>
                  </Menu>
                }
                trigger="click"
              >
                <Button type="text" icon={<IconMoreVertical />} iconOnly />
              </Dropdown>
            </div>
          </div>
        }
        bodyStyle={{ padding: 0 }}
      >
        <Alert
          style={{ display: showAlert ? "flex" : "none" }}
          type="info"
          content={<div dangerouslySetInnerHTML={{ __html: checkUpdate.notice || "" }} />}
        />
        <Collapse
          bordered={false}
          defaultActiveKey={["script", ...(backScriptList.length > 0 ? ["background"] : [])]}
          style={{ maxWidth: 640, maxHeight: 500, overflow: "auto" }}
        >
          <CollapseItem
            header={t("current_page_scripts")}
            name="script"
            style={{ padding: "0" }}
            contentStyle={{ padding: "0" }}
          >
            <ScriptMenuList script={scriptList} isBackscript={false} currentUrl={currentUrl} />
          </CollapseItem>

          <CollapseItem
            header={t("enabled_background_scripts")}
            name="background"
            style={{ padding: "0" }}
            contentStyle={{ padding: "0" }}
          >
            <ScriptMenuList script={backScriptList} isBackscript={true} currentUrl={currentUrl} />
          </CollapseItem>
        </Collapse>
        <div className="flex flex-row arco-card-header !h-6">
          <span className="text-[12px] font-500">{`v${ExtVersion}`}</span>
          {semver.lt(ExtVersion, checkUpdate.version) && (
            <span
              onClick={() => {
                window.open(`https://github.com/scriptscat/scriptcat/releases/tag/v${checkUpdate.version}`);
              }}
              className="text-[10px] font-500 cursor-pointer underline text-blue-500 underline-offset-2"
            >
              {t("popup.new_version_available")}
            </span>
          )}
        </div>
      </Card>
    </>
  );
}

export default App;
