document.addEventListener("DOMContentLoaded", function () {
  
    // Initial call to updateTextArea with default "json" format
    updateTextArea("json");
  
    // Trigger on click of radio button and get radio value
    document.getElementById("options").onchange = function () {
      let radioValue = document.querySelector('input[name="radioGroup"]:checked').value;
      updateTextArea(radioValue);
    };
  
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
  
  });
  