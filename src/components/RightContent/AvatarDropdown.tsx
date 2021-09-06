import React, { useCallback, useState } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, Tooltip, Typography } from 'antd';
import { useModel } from 'umi';
import { outLogin } from '@/services/login';
// import { stringify } from 'querystring';
import { removeToken } from '@/utils/auth';
import goLoginPage from '@/utils/goLoginPage';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { getIPAdress } from '@/utils/utils';
import storageUtils from '@/utils/storageUtils';
import sleep from '@/utils/sleep';
import { logout } from '@/pages/user/login/api';

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await logout();
  // 无论接口请求是否成功, 都不要影响退出登录的操作
  try {
    //await outLogin();
  } catch (error) {
    console.log('🚀 ~ file: AvatarDropdown.tsx ~ line 27 ~ loginOut ~ error', error);
  }
  console.log('111');
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login') {
    removeToken();
    goLoginPage();
  }
};

const AvatarDropdown = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout' && initialState) {
        storageUtils.removeUser();
        setInitialState({ ...initialState, currentUser: undefined });
        loginOut();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }
  const { currentUser } = initialState;
  if (!currentUser || !currentUser.userInfoModel) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="ip">
        <Tooltip title="本机IP地址">
          <Typography.Paragraph copyable={true} strong style={{ color: 'red' }}>
            {storageUtils.getUser().ip}
          </Typography.Paragraph>
        </Tooltip>
      </Menu.Item>

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          alt="avatar"
        />
        <span className={`${styles.name} anticon`}>
          {/* ID:{currentUser.userInfoModel.name} */}
          ID: {currentUser.userInfoModel.name == null ? '游客' : currentUser.userInfoModel.name}
        </span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
