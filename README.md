# Embed External Assets Into Lottie

Embed all external assets into Lottie.

## Installation

1. Save `Embed External Assets Into Lottie.js` into your Cavalry scripts folder
2. Find the scripts folder via: **Help** > **Show Scripts Folder** (or **Scripts** > **Show Scripts Folder**)
3. Restart Cavalry or refresh the Scripts menu
4. Access via: **Window** > **Scripts** > **Embed External Assets Into Lottie**

## Usage

1. Open the original `.cv` file used to generate the Lottie OR generate a new Lottie with the current file
2. Enable or disable the "Center anchor points" feature
3. Click the "Select JSON" button and select the existing Lottie JSON file
4. If successful the old JSON will be saved with a `.bak` extension and the new JSON will have all external assets embedded into the JSON file

> [!WARNING]
> The script uses a _fuzzy-match_ to ensure the current `.cv` contains all assets used in the Lottie. If even one is notfound, no embedding will happen. For best results, enusure the original `.cv` used to export the Lottie is open.

## Discoveries

### 1. Lottie Embedded Assets Feature Missing

* Cavalry 2.5.4 does not support embedded images when exporting to Lottie
* It generates a sidecar `images/` folder which is not ideal for single file deliverables or easy testing during render

### 2. Lottie Export Bug

* Cavalry 2.5.4 does not correctly include all image assets in the sidecar `images/` folder
* It appears exports with a single image work but those with 2+ do not
* On export, image files have appended digits (ex: `FileName0.png`, `FileName1.png`)
* This doesn't appear to be an issue as the Lottie `assets` array contains these updated file names

### 3. Anchor Point Offset

* Simply replacing the external assets with base64 embeds (similar to Bodymovin) works well, however images appear to be using a bottom-right anchor point
* Adjusting anchor points using negative half width and negative half height values appear to fix this issue

## License

This script is provided "as is," without warranty of any kind, expressed or implied. In no event shall the author be held liable for any damages arising in any way from the use of this script.
