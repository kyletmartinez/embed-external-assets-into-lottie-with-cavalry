# Installation

1. Download **Embed External Assets** script
2. Unzip the downloaded zip file
3. In Cavalry, navigate to **Help** > **Show Scripts Folder**
4. Open the **Scripts** folder
5. Drag the contents of the zip into the **Scripts** folder
6. In Cavalry navigate to **Scripts** > **Embed External Assets Into Lottie**

# Usage

1. Enable or disable the `Center anchor points` feature
2. Click the `Select JSON` button and select a Lottie JSON file
3. The old JSON will be saved with a `.bak` extension and the new JSON will have all external assets embedded into the JSON file

# Notes

## Caution
Lottie JSON files generated in `Cavalry 2.5.4` or older do not copy external assets to the `/images` folder correctly. Be sure to use `Cavalry 2.6.0` or newer. If external assets are missing you'll receive an error message.

## Warning
Lottie JSON files generated in `Cavalry 2.6.0` or older append an additional index number when copying external assets to the `/images` folder (ex: `FileName0.png`, `FileName1.png`). This is not a problem as the `assets` array in the Lottie contains the updated file names. Keep this in mind when manually copying over external assets to Lottie exports generated in `Cavalry 2.5.4` or older.

## Note
Simply replacing the external asset paths with base64 embeds (similar to Bodymovin) works well, however images appear to be using a bottom-right anchor point. Adjusting anchor points using negative half width and negative half height values appear to fix this issue.
