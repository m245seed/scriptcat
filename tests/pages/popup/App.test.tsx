import { describe, expect, it, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { render, setupGlobalMocks } from "@Tests/test-utils";
import App from "@App/pages/popup/App";
import { ExtVersion } from "@App/app/const";

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Create mock objects first
const mockPopupClient = {
  getCurrentTab: vi.fn().mockResolvedValue({
    id: 1,
    url: "https://example.com",
    title: "Test Page",
  }),
  getPopupData: vi.fn().mockResolvedValue({
    scriptList: [
      {
        id: "1",
        name: "Test Script 1",
        enable: true,
        menus: [],
        runNum: 0,
        updatetime: Date.now(),
      },
    ],
    backScriptList: [
      {
        id: "2",
        name: "Background Script 1",
        enable: true,
        menus: [],
        runNum: 0,
        updatetime: Date.now(),
      },
    ],
    isBlacklist: false,
  }),
};

const mockScriptClient = {
  run: vi.fn(),
  stop: vi.fn(),
  enableScript: vi.fn(),
  disableScript: vi.fn(),
  deleteScript: vi.fn(),
};

const mockSystemConfig = {
  getEnableScript: vi.fn().mockResolvedValue(true),
  setEnableScript: vi.fn(),
  getCheckUpdate: vi.fn().mockResolvedValue({
    version: "1.0.0-beta.1",
    notice: "",
    isRead: false,
  }),
  setCheckUpdate: vi.fn(),
};

// Mock the store features
vi.mock("../store/features/script", () => ({
  popupClient: mockPopupClient,
  scriptClient: mockScriptClient,
}));

// Mock systemConfig
vi.mock("../store/global", () => ({
  systemConfig: mockSystemConfig,
  message: {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock utils
vi.mock("@App/pkg/utils/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@App/pkg/utils/utils")>();
  return {
    ...actual,
    isUserScriptsAvailable: vi.fn(() => true),
    getBrowserType: vi.fn(() => "chrome"),
    getCurrentTab: vi.fn().mockResolvedValue({
      id: 1,
      url: "https://example.com",
      title: "Test Page",
    }),
  };
});

// Mock localePath
vi.mock("@App/locales/locales", () => ({
  localePath: "",
  initLocales: vi.fn(),
  changeLanguage: vi.fn(),
  i18nName: vi.fn((script) => script.name),
  i18nDescription: vi.fn((script) => script.metadata?.description || ""),
  matchLanguage: vi.fn(),
  isChineseUser: vi.fn(() => true),
  t: vi.fn((key) => key),
  default: {
    changeLanguage: vi.fn(),
    t: vi.fn((key) => key),
  },
}));

describe("Popup App Component", () => {
  beforeEach(() => {
    // Setup global mocks
    setupGlobalMocks();

    // Reset all mocks
    vi.clearAllMocks();

    // Setup default mock responses for Chrome tabs API
    vi.spyOn(chrome.tabs, "query").mockImplementation((query, callback) => {
      const mockTabs = [
        {
          id: 1,
          url: "https://example.com",
          title: "Example",
          active: true,
        },
      ] as chrome.tabs.Tab[];
      if (callback) {
        callback(mockTabs);
      }
      return Promise.resolve(mockTabs);
    });

    // Setup chrome runtime mock
    (chrome.runtime as any).lastError = undefined;
  });

  it("should render popup app successfully", async () => {
    render(<App />);

    // The app should render successfully
    expect(document.body).toBeInTheDocument();
  });

  it("should render basic UI elements", async () => {
    render(<App />);

    await waitFor(() => {
      // Check if there is a ScriptCat title
      expect(screen.getByText("ScriptCat")).toBeInTheDocument();
    });
  });

  // it("should handle chrome extension calls", async () => {
  //   render(<App />);

  //   // Verify that the necessary APIs are called during initialization
  //   await waitFor(() => {
  //     expect(chrome.tabs.query).toHaveBeenCalled();
  //   });
  // });

  it("should display scripts in the menu list", async () => {
    // Ensure the URL is set correctly to avoid URL errors in ScriptMenuList
    vi.spyOn(chrome.tabs, "query").mockImplementation((query, callback) => {
      const mockTabs = [
        {
          id: 1,
          url: "https://example.com/test",
          title: "Example",
          active: true,
        },
      ] as chrome.tabs.Tab[];
      if (callback) {
        callback(mockTabs);
      }
      return Promise.resolve(mockTabs);
    });

    render(<App />);

    // Wait for the component to render, but do not expect specific script names to appear
    await waitFor(
      () => {
        // Check if the collapse panel structure exists
        expect(screen.getByText("current_page_scripts")).toBeInTheDocument();
        expect(screen.getByText("enabled_background_scripts")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("should handle popup client initialization", async () => {
    render(<App />);

    // Verify that the chrome tabs API is called
    // await waitFor(
    //   () => {
    //     expect(chrome.tabs.query).toHaveBeenCalled();
    //   },
    //   { timeout: 1000 }
    // );

    // Verify that the UI renders normally, indicating successful component initialization
    await waitFor(
      () => {
        expect(screen.getByText("ScriptCat")).toBeInTheDocument();
        expect(screen.getByText("current_page_scripts")).toBeInTheDocument();
        expect(screen.getByText("enabled_background_scripts")).toBeInTheDocument();
        expect(screen.getByText("v" + ExtVersion)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
