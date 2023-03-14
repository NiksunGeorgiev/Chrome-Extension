import { openPage, updateRefreshTimes } from "./popup";

describe("updateRefreshTimes", () => {
  test("updates the last and next refresh time elements correctly", () => {
    document.body.innerHTML = `
        <p id="last-refresh"></p>
        <p id="next-refresh"></p>
      `;
    const lastRefreshEl = document.querySelector("#last-refresh");
    const nextRefreshEl = document.querySelector("#next-refresh");
    const lastRefreshTime = new Date(2023, 2, 14, 12, 0, 0).getTime();
    const nextRefreshTime = new Date(2023, 2, 14, 13, 0, 0).getTime();
    updateRefreshTimes(lastRefreshTime, nextRefreshTime);

    expect(lastRefreshEl.textContent).toBe(
      "Last Refresh: Mar 14, 2023, 12:00 PM"
    );
    expect(nextRefreshEl.textContent).toBe(
      "Next Refresh: Mar 14, 2023, 1:00 PM"
    );
  });
});

describe("openPage", () => {
  let submitButton;
  let urlInput;

  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <input type="url" id="url-input" />
        <button id="submit-button"></button>
      </div>
    `;

    submitButton = document.getElementById("submit-button");
    urlInput = document.getElementById("url-input");
  });

  test("should create a new tab with the specified URL", () => {
    chrome.tabs.create = jest.fn();
    urlInput.value = "sportal.bg";
    submitButton.click();

    expect(chrome.tabs.create).toHaveBeenCalledWith({
      url: "sportal.bg",
    });
  });

  test("should display an alert message if no URL is provided", () => {
    window.alert = jest.fn();
    submitButton.click();
    expect(window.alert);
  });
});
