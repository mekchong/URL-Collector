document.addEventListener("DOMContentLoaded", function () {
  // Initial call to updateTextArea with default "json" format
  updateTextArea("json");

  // Trigger on click of radio button and get radio value
  document.getElementById("options").onchange = function () {
    let radioValue = document.querySelector(
      'input[name="radioGroup"]:checked'
    ).value;
    
    const executeButton = document.getElementById("executeButton");
    if (radioValue === "string") {
      // disable execute button
      executeButton.disabled = true;
      executeButton.style.backgroundColor = "#b1b1b1";
      executeButton.style.cursor = "not-allowed";
    }

    if (radioValue === "json") {
      // enable execute button
      executeButton.disabled = false;
      executeButton.style.backgroundColor = "#fa6400";
      executeButton.style.cursor = "pointer";
    }

    updateTextArea(radioValue);
  };

  // trigger save logic
  document.getElementById("saveButton").onclick = saveToFile;

  // trigger execute logic
  document.getElementById("executeButton").onclick = executeTabs;

  // Function to update the textarea based on radio value
  function updateTextArea(outputFormat) {
    chrome.tabs.query({}, function (tabs) {
      let json = {};
      let currentTabName = "";
      let currentUrl = "";

      // Determine the currently selected tab
      let selectedTab = tabs.find((tab) => tab.active);
      let activeTabString = "activeTab: \n";
      if (selectedTab) {
        currentTabName = selectedTab.title;
        currentUrl = selectedTab.url;
        let activeTabJson = {
          name: currentTabName,
          url: currentUrl,
        };
        activeTabString += currentTabName + ":\n" + currentUrl + "\n\n\n";
        // Add active tab to json
        json["activeTab"] = activeTabJson;
      }

      // Collect all open tabs
      let openTabsJson = [];
      let openTabsString = "openTabs: \n";
      for (let i = 0; i < tabs.length; i++) {
        // Skip active tab
        if (tabs[i].active) continue;
        let tab = tabs[i];
        let tabJson = {
          name: tab.title,
          url: tab.url,
        };
        openTabsString += tab.title + ":\n" + tab.url + "\n\n\n";
        openTabsJson.push(tabJson);
      }
      json["openTabs"] = openTabsJson;

      // Combine content
      let content = activeTabString + openTabsString;

      // Set the final output based on the selected format
      let finalOutput = "";
      if (outputFormat === "string") {
        finalOutput = content;
      } else if (outputFormat === "json") {
        finalOutput = JSON.stringify(json, null, 4);
      }

      // Update the inputField with the final output
      document.getElementById("inputField").innerHTML = finalOutput;
    });
  }

  // Outputs current inputField content to a file
  function saveToFile() {
    // set output format based on radio button selection
    let outputFormat = document.querySelector(
      'input[name="radioGroup"]:checked'
    ).value;

    let content = document.getElementById("inputField").innerHTML;

    let extension = ".txt";
    let mimeType = "text/plain";

    if (outputFormat === "json") {
      extension = ".json";
      mimeType = "application/json";
    }

    // Create a Blob with the content and specify the file type
    const blob = new Blob([content], { type: mimeType });

    // Create a link element
    const link = document.createElement("a");

    // tabs_{date}_{time}.{extension}
    link.download = `tablinks_${new Date().toISOString()}${extension}`;

    // Create a URL for the Blob and set it as the href of the link
    link.href = URL.createObjectURL(blob);

    // Programmatically click the link to trigger the download
    link.click();
  }

  // Opens tabs from the inputField content
  function executeTabs() {
    console.log("execute tabs");

    // read json from input field and open them as tabs
    let json = document.getElementById("inputField").value;
    json = JSON.parse(json);

    console.log(json);

    // tabs should open in a new window
    

    for (let i = 0; i < json.openTabs.length; i++) {
      let tab = json.openTabs[i];
      chrome.tabs.create({ url: tab.url, active: false });
    }
  }
});
