
import uniqBy from "lodash/uniqBy";
import isEmpty from "lodash/isEmpty";
import findIndex from "lodash/findIndex";
import pick from "lodash/pick";
import { Product, Message } from "../../interfaces";

chrome.runtime.onMessage.addListener((message: Message<Product>, sender, sendResponse) => {
  const { type, data } = message;
  
  if (type === 'saveProductData' && data) {
    saveProduct(data).then(
      data => sendResponse({ data, ok: true }),
      error => sendResponse({ error: error.message, ok: false })
    );

    /**
     * must return true when respond asynchronously
     * @see https://www.chromium.org/Home/chromium-security/extension-content-script-fetches
     */
    return true;
  }
});

async function saveProduct(product: Product) {
  // create product
  let data = await shopifyProductApi(normalizeProduct(product));

  // associate variants to related color image
  if (!isEmpty(product.colors) && !isEmpty(product.images)) {
    // group images by color and update variants image_id
    let colorGroupedImageId = uniqBy(product.colors, 'name').reduce((group: any, color) => {
      let firstColorIndex = findIndex(product.images, ['relatedColor', color.name]);
      group[color.name] = data.product.images[firstColorIndex].id;
      return group;
    }, {});
    data.product.variants.forEach((variant: any, index: number) => {
      variant.image_id = colorGroupedImageId[variant.option1];
      data.product.variants[index] = pick(variant, ['id', 'image_id']);
    });

    // update product variants
    data = await shopifyProductApi(pick(data.product, ['id', 'variants']), 'PUT');
  }

  return data;
}

async function shopifyProductApi(product: any, method: string = 'POST') {
  let apiSuffix = method === 'PUT' ? `/${product.id}` : '';
  let res = await fetch(
    `https://${process.env.SHOP_NAME}.myshopify.com/admin/api/2021-10/products${apiSuffix}.json`,
    {
      method,
      headers: {
        'Content-type': 'application/json',
        'X-Shopify-Access-Token': process.env.ACCESS_TOKEN as string,
      },
      body: JSON.stringify({ product }),
    },
  );
  return await res.json();
}

// normalize product data conform to shopify product api params
function normalizeProduct(product: Product) {
  const { title, images, colors, sizes } = product;
  return {
    title,
    images: images.map(img => ({ src: img.origin })),
    options: [
      { name: 'Color', values: uniqBy(colors, 'name').map(color => color.name) },
      { name: 'Size', values: uniqBy(sizes, 'name').map(size => size.name) },
    ],
    variants: getVariants(colors, sizes),
  };
}

// generate colors and sizes all variants params
function getVariants(colors: Product['colors'], sizes: Product['sizes']) {
  colors = uniqBy(colors, 'name');
  sizes = uniqBy(sizes, 'name');
  let variants: any[] = [];

  if (isEmpty(colors) && isEmpty(sizes)) return variants;
  
  if (isEmpty(colors)) {
    variants = sizes.map(size => ({
      option1: size.name,
      price: size.price.amount,
      sku: size.name.toLowerCase(),
    }));
  } else if (isEmpty(sizes)) {
    variants = colors.map(color => ({
      option1: color.name,
      price: color.price.amount,
      sku: color.name.toLowerCase(),
    }));
  } else {
    colors.forEach(color => sizes.forEach(size => variants.push({
      option1: color.name,
      option2: size.name,
      price: color.price.amount,
      sku: `${color.name}-${size.name}`.toLowerCase(),
    })));
  }

  return variants;
}
