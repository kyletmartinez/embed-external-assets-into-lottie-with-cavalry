# Embed External Assets Into Lottie

Embed external assets into Lottie.

## Installation

1. Download `Embed External Assets Into Lottie.js` from GitHub
    - **Home page:** Click the green `Code` button near the top right then click `Download ZIP`
    - **Script page:** Click `Download raw file` button near the top right
2. Save `Embed External Assets Into Lottie.js` into your Cavalry scripts folder
    - Find the scripts folder with **Scripts** > **Show Scripts Folder** in Cavalry
3. Refresh the script list by simply closing and reopening the **Scripts** menu
4. Access via **Scripts** > **Embed External Assets Into Lottie** in Cavalry

## Usage

1. Enable or disable the `Center anchor points` feature
2. Click the `Select JSON` button and select a Lottie JSON file
3. The old JSON will be saved with a `.bak` extension and the new JSON will have all external assets embedded into the JSON file

## Notes

> [!CAUTION]
> Lottie JSON files generated in `Cavalry 2.5.4` or older do not copy external assets to the `/images` folder correctly. Be sure to use `Cavalry 2.6.0` or newer. If external assets are missing you'll receive an error message.

> [!WARNING]
> Lottie JSON files generated in `Cavalry 2.6.0` or older append an additional index number when copying external assets to the `/images` folder (ex: `FileName0.png`, `FileName1.png`). This is not a problem as the `assets` array in the Lottie contains the updated file names. Keep this in mind when manually copying over external assets to Lottie exports generated in `Cavalry 2.5.4` or older.

> [!NOTE]
> Simply replacing the external asset paths with base64 embeds (similar to Bodymovin) works well, however images appear to be using a bottom-right anchor point. Adjusting anchor points using negative half width and negative half height values appear to fix this issue.

## License

This script is provided "as is," without warranty of any kind, expressed or implied. In no event shall the author be held liable for any damages arising in any way from the use of this script.
