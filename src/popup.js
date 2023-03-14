import moment from "moment";

let intervalId = null;
let lastRefresh = null;
let nextRefresh = null;

//Open the page by URL

export function openPage() {
  const submitButton = document.getElementById("submit-button");
  const urlInput = document.getElementById("url-input");

  urlInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      submitButton.click();
    }
  });

  submitButton.addEventListener("click", function () {
    const url = urlInput.value;

    if (url === "") {
      alert("Please add a URL first !");
    }

    chrome.tabs.create({ url: `https://${url}` });
  });
}

//Update refresh time
const updateRefreshTimes = () => {
  document.querySelector("#last-refresh").textContent = lastRefresh;
  document.querySelector("#next-refresh").textContent = nextRefresh;
};

//Start refresh

const startRefresh = (interval) => {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    chrome.tabs.reload();
    lastRefresh = moment().format("h:mm:ss a");
    nextRefresh = moment().add(interval, "seconds").format("h:mm:ss a");
    updateRefreshTimes();

    // fetch image
    fetch("https://source.unsplash.com/random")
      .then((response) => {
        const imageUrl = response.url;

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.scripting.executeScript(
            {
              target: { tabId: tabs[0].id },
              function: (imageUrl) => {
                //create an image
                const image = new Image();
                image.src = imageUrl;
                image.alt = "Random image from Unsplash";
                image.style.maxWidth = "100%";
                image.style.maxHeight = "100%";
                image.style.objectFit = "contain";

                //create a dialog box and centred it
                const dialog = document.createElement("dialog");
                dialog.style.position = "fixed";
                dialog.style.top = "50%";
                dialog.style.left = "50%";
                dialog.style.width = "20%";
                // dialog.style.height = "80%";
                dialog.style.margin = "20px";
                dialog.style.transform = "translate(-50%, -50%)";

                //show dialog
                dialog.appendChild(image);
                document.body.appendChild(dialog);
                dialog.showModal();
              },
              args: [imageUrl],
            },
            () => console.log("Image inserted")
          );
        });
      })
      .catch((error) => {
        console.log(`Error fetching image: ${error}`);
      });
  }, interval * 1000);
};

const setupStartButton = () => {
  const startButton = document.querySelector("#start");
  startButton.addEventListener("click", () => {
    const interval = parseInt(document.querySelector("#interval").value, 10);
    startRefresh(interval);
  });
};

//Stop refresh

const stopRefresh = () => {
  clearInterval(intervalId);
  lastRefresh = null;
  nextRefresh = null;
  updateRefreshTimes();
};

const setupStopButton = () => {
  const stopButton = document.querySelector("#stop");
  stopButton.addEventListener("click", stopRefresh);
};

document.addEventListener("DOMContentLoaded", () => {
  openPage();
  setupStartButton();
  setupStopButton();
});

module.exports = {
  openPage,
  updateRefreshTimes,
  submitButton,
};
