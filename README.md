# URL Collector

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
