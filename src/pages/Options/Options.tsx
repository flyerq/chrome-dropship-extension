import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Layout,
  Typography,
  Button,
  Space,
  Collapse,
  message,
} from 'antd';
import {
  SaveOutlined,
  SyncOutlined,
  ControlOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { UserOptions } from '../interfaces';
import { getOptions, saveOptions } from '../common';
import './Options.less';

export default function Options() {
  const [form] = Form.useForm();
  const options = useOptions();
  
  // 保存设置
  const handleSaveOptions = async (values: UserOptions) => {
    await saveOptions(values);
    message.success('Options Saved!');
  }

  if (options === null) {
    return null;
  }

  return (
    <Form
      className="options-page"
      name="optionsForm"
      form={form}
      layout="vertical"
      initialValues={options}
      onFinish={handleSaveOptions}
      autoComplete="off"
    >
      <Layout className="options-page-layout">
        <Layout.Header className="options-page-header">
          <Typography.Title className="options-page-title">
            <ControlOutlined /> Chrome Dropship Extension Options
          </Typography.Title>
          <Space size="middle">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
            >
              Save
            </Button>
            <Button
              type="default"
              htmlType="reset"
              icon={<SyncOutlined />}
            >
              Reset
            </Button>
          </Space>
        </Layout.Header>
  
        <Layout.Content className="options-page-content">
          <Collapse defaultActiveKey={['shopify-api-params']}>
            <Collapse.Panel
              header="Shopify API Params"
              key="shopify-api-params"
              extra={<SettingOutlined />}
            >
              <Form.Item
                name={['shopifyApiParams', 'shopName']}
                label="Shop Name"
                rules={[{
                  required: true,
                  message: 'Please input your shopName!',
                }]}
              >
                <Input placeholder="Shopify shop name" />
              </Form.Item>
              <Form.Item
                name={['shopifyApiParams', 'accessToken']}
                label="Access Token"
                rules={[{
                  required: true,
                  message: 'Please input your accessToken!',
                }]}
              >
                <Input placeholder="Shopify access token (private app password)" />
              </Form.Item>
            </Collapse.Panel>
          </Collapse>
        </Layout.Content>
      </Layout>
    </Form>
  );
}

export function useOptions () {
  const [options, setOptions] = useState<UserOptions | null>(null);

  useEffect(() => {
    async function fetchOptions() {
      const options = await getOptions();
      setOptions(options);
    }
    
    fetchOptions();
  }, []);

  return options;
}
