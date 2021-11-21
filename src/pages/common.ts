import { UserOptions } from "./interfaces";

export const defaultOptions: UserOptions = {
  shopifyApiParams: {
    shopName: process.env.SHOP_NAME as string,
    accessToken: process.env.ACCESS_TOKEN as string,
  },
};

/**
 * Get options config from sync storage
 * @returns {Promise<UserOptions>}
 */
export async function getOptions(): Promise<UserOptions> {
  return new Promise(resolve => chrome.storage.sync.get(defaultOptions, (options) => {
    resolve(options as UserOptions);
  }));
};

/**
 * Save options config to sync storage
 * @returns {Promise<UserOptions>}
 */
export async function saveOptions(options: UserOptions): Promise<UserOptions> {
  return new Promise(resolve => chrome.storage.sync.set(options, () => {
    resolve(options);
  }));
};