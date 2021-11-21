import React from 'react';
import { Alert, Button } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import './Popup.less';

export default function Popup() {
  return (
    <div className="popup-page">
      <Alert
        type="info"
        showIcon
        message="Tips"
        description={
          <div>
            <p>Options page can custom Shopify API params.</p>
            <div>
              <Button
                icon={<SettingOutlined />}
                type="primary"
                onClick={() => chrome.runtime.openOptionsPage()}
              >
                Goto Options Page
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
};
