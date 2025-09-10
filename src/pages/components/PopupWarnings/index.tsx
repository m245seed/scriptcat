import { Alert, Button } from "@arco-design/web-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { isUserScriptsAvailable, getBrowserType, BrowserType } from "@App/pkg/utils/utils";
import edgeMobileQrCode from "@App/assets/images/edge_mobile_qrcode.png";

interface PopupWarningsProps {
  isBlacklist: boolean;
}

function PopupWarnings({ isBlacklist }: PopupWarningsProps) {
  const { t } = useTranslation();
  const [isUserScriptsAvailableState, setIsUserScriptsAvailableState] = useState(false);
  const [showRequestButton, setShowRequestButton] = useState(false);
  const [permissionReqResult, setPermissionReqResult] = useState("");

  const updateIsUserScriptsAvailableState = async () => {
    const flag = await isUserScriptsAvailable();
    setIsUserScriptsAvailableState(flag);
  };

  useEffect(() => {
    updateIsUserScriptsAvailableState();
  }, []);

  const warningMessageHTML = useMemo(() => {
    // If UserScript is available, don't check browserType
    const browserType = !isUserScriptsAvailableState ? getBrowserType() : null;

    const warningMessageHTML = browserType
      ? browserType.firefox
        ? t("develop_mode_guide")
        : browserType.chrome
          ? browserType.chrome & BrowserType.chromeA
            ? t("lower_version_browser_guide")
            : browserType.chrome & BrowserType.chromeC && browserType.chrome & BrowserType.Chrome
              ? t("allow_user_script_guide")
              : t("develop_mode_guide") // Edge browser does not currently have an option to allow user scripts, just enable developer mode
          : "UNKNOWN"
      : "";

    return warningMessageHTML;
  }, [isUserScriptsAvailableState, t]);

  const isEdgeBrowser = useMemo(() => {
    const browserType = getBrowserType();
    return (
      localStorage["hideEdgeMobileQrCodeAlert"] !== "1" && (browserType && browserType.chrome & BrowserType.Edge) > 0
    );
  }, []);

  // For permission requirements, see: https://github.com/mdn/webextensions-examples/blob/main/userScripts-mv3/options.mjs
  useEffect(() => {
    //@ts-ignore
    if (chrome.permissions?.contains && chrome.permissions?.request) {
      chrome.permissions.contains(
        {
          permissions: ["userScripts"],
        },
        function (permissionOK) {
          const lastError = chrome.runtime.lastError;
          if (lastError) {
            console.error("chrome.runtime.lastError in chrome.permissions.contains:", lastError.message);
            // Do not display the button if there is a runtime error
            return;
          }
          if (permissionOK === false) {
            // Assuming the browser can support `chrome.permissions.contains` and return a false value in the callback,
            // chrome.permissions.request should be executable
            // So show the button here
            setShowRequestButton(true);
          }
        }
      );
    }
  }, []);

  const handleRequestPermission = () => {
    const updateOnPermissionGranted = async (granted: boolean) => {
      if (granted) {
        granted = await new Promise((resolve) => {
          chrome.runtime.sendMessage({ type: "userScripts.LISTEN_CONNECTIONS" }, (resp) => {
            const lastError = chrome.runtime.lastError;
            if (lastError) {
              resp = false;
              console.error("chrome.runtime.lastError in chrome.permissions.request:", lastError.message);
            }
            resolve(resp === true);
          });
        });
      }
      if (granted) {
        setPermissionReqResult("✅");
        // UserScripts API related initialization:
        // userScripts.LISTEN_CONNECTIONS for Server communication initialization
        // onUserScriptAPIGrantAdded for script registration
        updateIsUserScriptsAvailableState();
      } else {
        setPermissionReqResult("❎");
      }
    };
    chrome.permissions.request({ permissions: ["userScripts"] }, (granted) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        granted = false;
        console.error("chrome.runtime.lastError in chrome.permissions.request:", lastError.message);
      }
      updateOnPermissionGranted(granted);
    });
  };

  return (
    <>
      {warningMessageHTML && (
        <Alert
          type="warning"
          content={
            <div
              dangerouslySetInnerHTML={{
                __html: warningMessageHTML,
              }}
            />
          }
        />
      )}
      {isEdgeBrowser && (
        <Alert
          type="info"
          closable
          showIcon={false}
          onClose={() => {
            localStorage["hideEdgeMobileQrCodeAlert"] = "1";
          }}
          content={
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div>
                <div>{"Use ScriptCat on your phone"}</div>
                <div style={{ fontSize: "12px", marginTop: "4px" }}>{"Scan the QR code to install ScriptCat on your phone"}</div>
              </div>
              <img src={edgeMobileQrCode} alt="qrcode" style={{ width: "80px", height: "80px" }} />
            </div>
          }
        />
      )}
      {showRequestButton && (
        <Button onClick={handleRequestPermission}>
          {t("request_permission")} {permissionReqResult}
        </Button>
      )}
      {isBlacklist && <Alert type="warning" content={t("page_in_blacklist")} />}
    </>
  );
}

export default PopupWarnings;
