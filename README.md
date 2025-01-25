# URLer

This Edge (for now) extension will collect names and URLs of all tabs currently open in the browser either as a string or a JSON which can then be downloaded. You can also mass open tabs by pasting your own JSON and clicking execute. Input JSON should be in the format of:

```
{
  "openTabs": [
    {
      "url": "https://example.com"
    },
    {
      "url: "https://github.com"
    }
  ]
}
```

## Sideloading URLer into Edge (unpacked)
1. Download URLer locally on your machine.
2. Navigate to the Extensions page in Edge.
3. Enable Developer mode.
4. Click on `Load Unpacked`.
5. Navigate to the download location of the extension and select the folder containing `manifest.json`.
