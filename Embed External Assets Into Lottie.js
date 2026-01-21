/**
 * @name Embed External Assets Into Lottie
 * @version 1.0
 * @author Kyle Martinez <www.kyle-martinez.com>
 *
 * @description Embed external assets into Lottie from the original Cavalry file
 *
 * @license This script is provided "as is," without warranty of any kind, expressed or implied. In
 * no event shall the author be held liable for any damages arising in any way from the use of this
 * script.
 */

function updateUI(result) {
    const color = result.success ? "Accent1" : "Accent4";
    const prefix = result.success ? "Success" : "Error";
    label.setTextColor(ui.getThemeColor(color));
    label.setText(`${prefix}: Embedded ${result.matchCount} asset(s)`);
}

function writeNewFile(filePath, lottie) {
    const json = JSON.stringify(lottie);
    return api.writeToFile(filePath, json, true);
}

function backupOriginalFile(filePath) {
    const json = api.readFromFile(filePath);
    return api.writeToFile(`${filePath}.bak`, json, true);
}

function centerAnchorPoints(lottie) {
    const assetDimensions = Object.fromEntries(
        lottie.assets.map(({ id, w, h }) => [id, { w, h }])
    );

    for (let layer of lottie.layers) {
        if (layer.ty === 2 && layer.refId) {
            const layerDimensions = assetDimensions[layer.refId];
            if (layerDimensions && layer.ks && layer.ks.a) {
                layer.ks.a.k = [layerDimensions.w / -2, layerDimensions.h / -2, 0];
            }
        }
    }
}

function getMimeType(filePath) {
    const extension = api.getExtensionFromPath(filePath).toLowerCase();
    switch (extension) {
        case "bmp":
            return "image/bmp";
        case "exr":
            return "image/x-exr";
        case "ico":
            return "image/x-icon";
        case "jpg":
        case "jpeg":
            return "image/jpeg";
        case "png":
            return "image/png";
        case "webp":
            return "image/webp";
        default:
            return "application/octet-stream";
    }
}

function getDataURI(filePath) {
    const base64 = api.encodeBinary(filePath);
    const mimeType = getMimeType(filePath);
    return `data:${mimeType};base64,${base64}`;
}

function findMatchingSceneAsset(lottieFilePath, sceneAssets) {
    const lottieFileName = api.getFileNameFromPath(lottieFilePath, false);
    for (let sceneFileName in sceneAssets) {
        if (lottieFileName.includes(sceneFileName)) {
            return sceneAssets[sceneFileName];
        }
    }
    return null;
}

function processAssets(lottieAssets, sceneAssets) {
    let matchCount = 0;
    for (let lottieAsset of lottieAssets) {
        const sceneFilePath = findMatchingSceneAsset(lottieAsset.p, sceneAssets);
        if (sceneFilePath) {
            lottieAsset.u = "";
            lottieAsset.p = getDataURI(sceneFilePath);
            lottieAsset.e = 1;
            matchCount++;
        }
    }
    return matchCount;
}

function getSceneAssets() {
    const sceneAssets = {};
    const sceneAssetIds = api.getAssetWindowLayers(false);
    for (let sceneAssetId of sceneAssetIds) {
        const sceneAssetType = api.getAssetType(sceneAssetId);
        if (sceneAssetType !== "unknown") {
            const sceneFilePath = api.getAssetFilePath(sceneAssetId);
            const sceneFileName = api.getFileNameFromPath(sceneFilePath, false);
            sceneAssets[sceneFileName] = sceneFilePath;
        }
    }
    return sceneAssets;
}

function embedAssets() {
    const lottieFilePath = api.presentOpenFile("", "Select JSON", "Data File (*.json)");
    if (!lottieFilePath) {
        return null;
    }

    const lottie = JSON.parse(api.readFromFile(lottieFilePath));
    const sceneAssets = getSceneAssets();
    const matchCount = processAssets(lottie.assets, sceneAssets);

    if (matchCount !== lottie.assets.length) {
        return { success: false, matchCount };
    }

    if (checkbox.getValue()) {
        centerAnchorPoints(lottie);
    }

    backupOriginalFile(lottieFilePath);
    writeNewFile(lottieFilePath, lottie);

    return { success: true, matchCount };
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
    const result = embedAssets();
    if (!result) return;

    updateUI(result);
};

ui.add(button);
ui.add(checkboxRow);
ui.add(label);
ui.addStretch();

ui.show();