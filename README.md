# Chrome Dropship Extension

A coding challenge project for extracting product data to Shopify

## Installing

1. Clone or download this repository.
2. Access chrome://extensions/ to open Chrome Extensions page.
3. Check the Developer Mode switch to enable developer mode.
4. Click the Load unpacked button and select the build folder in the repository.

## Running

1. Open the SHEIN's product detail page, like this [example](https://us.shein.com/SHEIN-Solid-Waffle-Knit-Crop-Tee-p-1349247-cat-1738.html?_t=1637378450677&scici=navbar_WomenHomePage~~tab01navbar06menu04dir01~~6_4_1~~itemPicking_00100679~~~~0).
2. Click the 'Grab' button on the top right corner of the page.
3. Click the Extracted Product Data dialog's 'Save' button to save product data to Shopify.

## Custom Shopify API Params

1. Goto the Chrome Dropship Extension options page.
2. Set the `Shop Name` and `Access Token` (the Shopify's private app password) fields and click the 'Save' button.

## Development

1. Check if your [Node.js](https://nodejs.org/) version is >= **14**.
2. Run `npm install` to install the dependencies.
3. Run `npm start` to start development mode.
4. Run `npm run build` to build production release.
