/**
 * @name Embed External Assets Into Lottie
 * @version 1.1
 * @author Kyle Martinez <www.kyle-martinez.com>
 *
 * @description Embed external assets into Lottie from the original Cavalry file
 *
 * @license This script is provided "as is," without warranty of any kind, expressed or implied. In
 * no event shall the author be held liable for any damages arising in any way from the use of this
 * script.
 */

function updateUI(result) {
    const { embedded, total } = result;
    const color = (embedded === total) ? "Accent1" : "Accent4";
    const prefix = (embedded === total) ? "Success" : "Error";
    label.setTextColor(ui.getThemeColor(color));
    label.setText(`${prefix}: ${embedded} of ${total} assets embedded`);
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

function embedAssets() {
    const lottieFilePath = api.presentOpenFile("", "Select JSON", "Data File (*.json)");
    if (!lottieFilePath) {
        return null;
    }

    const lottie = JSON.parse(api.readFromFile(lottieFilePath));
    const rootPath = api.getFolderFromPath(lottieFilePath);

    let embedded = 0;
    const total = lottie.assets.length;

    for (let asset of lottie.assets) {
        const assetPath = `${rootPath}/${asset.u}${asset.p}`;
        if (api.filePathExists(assetPath)) {
            asset.p = getDataURI(assetPath);
            asset.u = "";
            asset.e = 1;
            embedded++;
        }
    }

    if (embedded !== total) {
        return { embedded, total };
    }

    if (checkbox.getValue()) {
        centerAnchorPoints(lottie);
    }

    backupOriginalFile(lottieFilePath);
    writeNewFile(lottieFilePath, lottie);

    return { embedded, total };
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