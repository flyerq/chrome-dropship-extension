import isNil from "lodash/isNil";
import concat from "lodash/concat";
import compact from "lodash/compact";
import find from "lodash/find";
import { Product } from "../interfaces";

/**
 * inject proxy script to access page original context variables
 * @see https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions#9517879
 */
const proxyScript = document.createElement('script');
proxyScript.src = chrome.runtime.getURL('proxy-script.js');
document.body.appendChild(proxyScript);

export async function getProduct() : Promise<Product | null> {
  let product: object | null = await new Promise((resolve) => {
    // dispatch custom event to proxy script to get the product data
    document.addEventListener('productData', ((e: CustomEvent) => {
      resolve(e.detail);
    }) as EventListener,{ once: true });
    document.dispatchEvent(new CustomEvent('getProductData'));
  });

  return await transform(product);
}

async function transform(product: any) : Promise<Product | null> {
  if (isNil(product)) return null;

  // transform product to need data struct
  let colors: Product['colors'] = compact(concat(product?.detail, product?.relation_color)).map((item: any) => ({
    name: find(item?.productDetails, ['attr_name_en', 'Color'])?.attr_value_en,
    image: item?.color_image,
    goodsId: item?.goods_id,
    price: {
      amount: item?.salePrice?.usdAmount,
      amountWithSymbol: item?.salePrice?.usdAmountWithSymbol,
    },
  }));

  let transformedProduct: Product = {
    title: product?.detail?.goods_name,
    price: {
      amount: product?.detail?.salePrice?.usdAmount,
      amountWithSymbol: product?.detail?.salePrice?.usdAmountWithSymbol,
    },
    images: await getColorsRelatedImages(colors, product),
    colors,
    sizes: product?.attrSizeList?.map?.((item: any) => ({
      name: item?.attr_value_en,
      price: {
        amount: item?.price?.salePrice?.usdAmount,
        amountWithSymbol: item?.price?.salePrice?.usdAmountWithSymbol,
      },
    })),
  };

  return transformedProduct;
}

async function getColorsRelatedImages(colors: Product['colors'], product: any) : Promise<Product['images']> {
  let images = [];
  for (let color of colors) {
    let relatedProduct = product;

    // if color not current product color, to fetch color related product data
    if (color.goodsId !== product?.detail?.goodsId) {
      try {
        let res = await fetch(
          `https://us.shein.com/product-itemv2-${color.goodsId}.html?_lang=en&_ver=1.1.8&template=1`,
          {
            "headers": {
              'content-type': 'application/json',
              'x-requested-with': 'XMLHttpRequest',
            },
          }
        );
        let data = await res.json();
        relatedProduct = data.info.goods;
      } catch (err) {
        continue;
      }
    }

    // map color related images
    let relatedImages = compact(concat(
      relatedProduct?.goods_imgs?.main_image,
      relatedProduct?.goods_imgs?.detail_image
    )).map(img => ({
      thumbnail: img?.thumbnail_webp?.replace?.(/^\/\//, window.location.protocol + '//'),
      origin: img?.origin_image?.replace?.(/^\/\//, window.location.protocol + '//'),
      relatedColor: color?.name,
    }));

    images.push(...relatedImages);
  }

  return images;
}
