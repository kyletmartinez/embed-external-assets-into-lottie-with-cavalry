# Embed External Assets Into Lottie

Quickly and easily embed external assets into your Lottie JSON.

## Cavalry Limitations

When exporting a Lottie, the current verison of Cavalry does not embed images but instead creates a sidecar `/images` folder.

Instead, images should be embedded within the Lottie JSON for easier client delivery. After Effects tools such as [Bodymovin](https://aescripts.com/bodymovin/) or [Lottie Files for Adobe After Effects](https://aescripts.com/lottiefiles/) do this already.