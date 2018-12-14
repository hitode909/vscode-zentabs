# zentabs

Inspired by Atom's [zentabs](https://github.com/ArnaudRinquin/atom-zentabs) package.

![screenshot](/images/screenshot.gif)

## warnings

This is very initial version. Lot of features in Atom's zentabs are not implemented.

>**NOTE**  
>In order to run this extension correctly you should set the following settings
>```
>"workbench.editor.enablePreviewFromQuickOpen": false,
>"workbench.editor.enablePreview": false
>```

 ## configuration

- `zentabs.maximumOpenedTabs`
  - the maximum amount of tabs that will be keep open
  - Default: 3

- `zentabs.applyLimitFor`
  - apply the maximum amount of tabs for window|editorGroup
  - Default: window

- `zentabs.switchWithCurrentTab`
  - once limit of maximum tab is reached, switch the newly opened file with current active tab instead of the older one
  - Default: false
