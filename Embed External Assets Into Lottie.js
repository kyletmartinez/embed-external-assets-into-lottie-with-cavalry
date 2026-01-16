/**
 * @name Embed External Assets Into Lottie
 * @version 1.0
 * @author Kyle Martinez <www.kyle-martinez.com>
 *
 * @description Embed all external assets into Lottie.
 *
 * @installation
 * 1. Save this file as "Embed External Assets Into Lottie.js" into your Cavalry scripts folder
 * 2. Find the scripts folder via: Help > Show Scripts Folder (or Scripts > Show Scripts Folder)
 * 3. Restart Cavalry or refresh the Scripts menu
 * 4. Access via: Window > Scripts > Embed External Assets Into Lottie
 *
 * @usage
 * 1. Open the original .cv file used to generate the Lottie OR generate a new Lottie with the
 *    current file
 * 2. ENABLE or DISABLE the "Center anchor points" feature
 * 3. Click the "Select JSON" button and select the existing Lottie JSON file
 * 4. If successful the old JSON will be saved with a ".bak" extension and the new JSON will have
 *    all external assets embedded into the JSON file
 *
 * @discoveries
 * 1. LOTTIE EMBEDDED ASSETS FEATURE MISSING
 *     - Cavalry 2.5.4 does not support embedded images when exporting to Lottie
 *     - It generates a sidecar "images/" folder which is not ideal for single file deliverables or
 *       easy testing during render
 *
 * 2. LOTTIE EXPORT BUG
 *     - Cavalry 2.5.4 does not correctly include all image assets in the sidecar "images/" folder
 *     - It appears exports with a single image work but those with 2+ do not
 *     - On export image files have appended digits (ex: FileName0.png, FileName1.png)
 *     - This doesn't appear to be an issue as the Lottie "assets" array contains these updated
 *       file names
 *
 * 3. ANCHOR POINT OFFSET
 *     - Simply replacing the external assets with base64 embeds (similar to Bodymovin) works well
 *       however images appear to be using a bottom-right anchor point
 *     - Adjusting anchor points using negative half width and negative half height values appear to
 *       fix this issue
 *
 * @license This script is provided "as is," without warranty of any kind, expressed or implied. In
 * no event shall the author be held liable for any damages arising in any way from the use of this
 * script.
 */

function writeNewFile(lottiePath, lottie) {
    const embeddedJson = JSON.stringify(lottie);
    return api.writeToFile(lottiePath, embeddedJson, true);
}

function backupOriginalFile(lottiePath) {
    const backupPath = lottiePath + ".bak";
    const originalText = api.readFromFile(lottiePath);
    return api.writeToFile(backupPath, originalText, true);
}

function centerAnchorPoints(lottie) {
    const assetDimensions = {};
    for (let asset of lottie.assets) {
        if (asset.w && asset.h) {
            assetDimensions[asset.id] = { w: asset.w, h: asset.h };
        }
    }

    for (let layer of lottie.layers) {
        if (layer.ty === 2 && layer.refId) {
            const dims = assetDimensions[layer.refId];
            if (dims && layer.ks && layer.ks.a) {
                layer.ks.a.k = [dims.w / -2, dims.h / -2, 0];
            }
        }
    }
}

function getMimeType(filePath) {
    const extension = api.getExtensionFromPath(filePath).toLowerCase();
    const mimeTypes = {
        "bmp": "image/bmp",
        "exr": "image/x-exr",
        "ico": "image/x-icon",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "webp": "image/webp"
    };
    return mimeTypes[extension] || "application/octet-stream";
}

function getBase64WithDataUri(filePath) {
    const base64 = api.encodeBinary(filePath);
    const mimeType = getMimeType(filePath);
    return `data:${mimeType};base64,${base64}`;
}

function findMatchingSceneAsset(lottieName, sceneAssets) {
    const lottieBaseName = api.getFileNameFromPath(lottieName, false);
    for (let sceneName in sceneAssets) {
        if (lottieBaseName.includes(sceneName)) {
            return sceneAssets[sceneName];
        }
    }
    return null;
}

function processAssets(assets, sceneAssets) {
    let matchCount = 0;
    for (let asset of assets) {
        const matchedPath = findMatchingSceneAsset(asset.p, sceneAssets);
        if (matchedPath) {
            asset.u = "";
            asset.p = getBase64WithDataUri(matchedPath);
            asset.e = 1;
            matchCount++;
        }
    }
    return matchCount;
}

function getSceneAssets() {
    const assets = {};
    const assetIds = api.getAssetWindowLayers(false);
    for (let assetId of assetIds) {
        const type = api.getAssetType(assetId);
        if (type !== "unknown") {
            const path = api.getAssetFilePath(assetId);
            const name = api.getFileNameFromPath(path, false);
            assets[name] = path;
        }
    }
    return assets;
}

function getLottie() {
    const path = api.presentOpenFile("", "Select JSON", "Data File (*.json)");
    if (!path) {
        return null;
    }
    const text = api.readFromFile(path);
    const json = JSON.parse(text);
    return { path: path, data: json };
}

function embedAssets() {
    const lottieFile = getLottie();
    if (!lottieFile) {
        return;
    }
    const { path: lottiePath, data: lottie } = lottieFile;
    const sceneAssets = getSceneAssets();
    const matchCount = processAssets(lottie.assets, sceneAssets);

    if (matchCount !== lottie.assets.length) {
        label.setTextColor(ui.getThemeColor("Accent4"));
        label.setText("Error: " + matchCount + " of " + lottie.assets.length + " asset(s) matched");
        return;
    }

    if (checkbox.getValue()) {
        centerAnchorPoints(lottie);
    }

    backupOriginalFile(lottiePath);
    writeNewFile(lottiePath, lottie);

    label.setTextColor(ui.getThemeColor("Accent1"));
    label.setText("Success: Embedded " + matchCount + " asset(s)");
}

ui.setTitle("Embed External Assets");
ui.setMargins(10, 10, 10, 10);
ui.setSpaceBetween(10);

const button = new ui.Button("Select JSON");
const label = new ui.Label("Select a Lottie JSON to embed assets");

const checkboxRow = new ui.HLayout();
checkboxRow.setSpaceBetween(5);
const checkbox = new ui.Checkbox(true);
const checkboxLabel = new ui.Label("Center anchor points");
checkboxRow.add(checkbox);
checkboxRow.add(checkboxLabel);

button.onClick = () => {
    embedAssets();
};

ui.add(button);
ui.add(checkboxRow);
ui.add(label);
ui.addStretch();

ui.show();