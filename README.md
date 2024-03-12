# MidLineJump

MidLineJump is a Visual Studio Code extension that provides efficient code navigation by enabling quick movement to the midpoint of the current line from any position. This feature enhances code editing and review processes by facilitating smoother navigation within lines of code.

## Features

- **Halfway to Start**: Moves the cursor to a midpoint between its current location and the beginning of the line.
- **Halfway to End**: Moves the cursor to a midpoint between its current location and the end of the line.

## Installation

Open the Extensions view in VSCode by searching for "MidLineJump". Once you find the extension, click the Install button.

## How to Use

To use the features of MidLineJump, you will need to set up custom keyboard shortcuts. Below are the steps to assign shortcuts to each function.

## Customizing Keyboard Shortcuts

1. Open VSCode and navigate to File > Preferences > Keyboard Shortcuts.
2. This action opens the `keybindings.json` file. Add your custom settings here.

For example, the following settings assign the Halfway to Start function to `Ctrl+Alt+Left` and the Halfway to End function to `Ctrl+Alt+Right` (these are just examples; feel free to choose keys that suit your preferences).

```json
[
    {
        "key": "ctrl+alt+left",
        "command": "midlinejump.navigateToHalfwayStart",
        "when": "editorTextFocus"
    },
    {
        "key": "ctrl+alt+right",
        "command": "midlinejump.navigateToHalfwayEnd",
        "when": "editorTextFocus"
    }
]
```

## Bisect mode
Instead of using `midlinejump.navigateToHalfwayStart` and `midlinejump.navigateToHalfwayEnd`, you can use the commands `midlinejump.navigateToBisectStart` and `midlinejump.navigateToBisectEnd`.
These commands will move the cursor to the midpoint between the previous starting point and the current position when moving in the direction where the previous starting point is located, instead of moving to the beginning or end of the line.

## License

This project is published under the MIT License.