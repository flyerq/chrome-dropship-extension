import React, { useState, useRef } from 'react';
import { Button, Modal, Tag, Image } from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';
import { getProduct } from './extractor';
import { Product, MessageResponse } from "../interfaces";
import { getOptions } from '../common';
import './Content.less';

export default function Content () {
  const contentNode = useRef(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [grabLoading, setGrabLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [productDialogVisible, setProductDialogVisible] = useState(false);

  const handleGrab = async () => {
    setGrabLoading(true);
    const product = await getProduct();
    setGrabLoading(false);
    setProduct(product);
    setProductDialogVisible(true);
  }

  const handleSave = async () => {
    if (product === null) return;
    
    setSaveLoading(true);
    const { shopifyApiParams: { shopName } } = await getOptions();

    // send message to background script to save product data
    chrome.runtime.sendMessage({
      type: 'saveProductData',
      data: product,
    }, ({ ok, error }: MessageResponse<any>) => {
      Modal[ok ? 'success' : 'error']({
        title: ok ? 'Save Success!' : 'Save Failure!',
        content: error,
        getContainer: contentNode.current ?? undefined,
        afterClose: () => {
          if (ok) {
            setProductDialogVisible(false);
            setTimeout(() => window.open(`https://${shopName}.myshopify.com/collections/all`), 0);
          }
        }
      });

      setSaveLoading(false);
    });
  };

  return (
    <div ref={contentNode} className="content-wrapper">
      {!productDialogVisible &&
        <Button
          type="primary"
          shape="round"
          size="large"
          icon={<FileSearchOutlined />}
          loading={grabLoading}
          onClick={handleGrab}
        >
          Grab
        </Button>
      }

      <Modal
        width={750}
        title="Extracted Product Data"
        visible={productDialogVisible}
        getContainer={false}
        okText="Save"
        onOk={handleSave}
        okButtonProps={{disabled: product === null}}
        confirmLoading={saveLoading}
        onCancel={() => setProductDialogVisible(false)}
      >
        <div className="data-item">
          <strong>Title: </strong>
          <h3>{product?.title}</h3>
        </div>

        <div className="data-item">
          <strong>Price: </strong>
          <h3>{product?.price?.amountWithSymbol}</h3>
        </div>

        <div className="data-item">
          <strong>Colors: </strong>
          <div>
            {product?.colors?.map?.(color =>
              <Tag key={color?.name}>{color?.name}</Tag>
            )}
          </div>
        </div>

        <div className="data-item">
          <strong>Sizes: </strong>
          <div>
            {product?.sizes?.map?.(size =>
              <Tag key={size?.name}>{size?.name}</Tag>
            )}
          </div>
        </div>

        <div className="data-item data-item-images">
          <strong>Images: </strong>
          <div>
            {product?.images?.map?.(img =>
              <Image
                key={img?.thumbnail}
                width={100}
                src={img?.thumbnail}
                preview={{
                  src: img?.origin,
                  getContainer: false,
                }}
              />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
