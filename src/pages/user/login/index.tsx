import { LockTwoTone, UserOutlined } from '@ant-design/icons';
import { Button, Card, message, Typography } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Link, history, FormattedMessage, useModel } from 'umi';
import Footer from '@/components/Footer';
import { accountLogin } from '@/services/login';
import { setToken } from '@/utils/auth';
import styles from './index.less';
import { commonResult } from '@/utils/resultUtils';
import storageUtils from '@/utils/storageUtils';
import { login } from './api';
const { Text } = Typography;
/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const goto = () => {
  if (!history) return;
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as { redirect: string };
    history.push(redirect || '/');
  }, 10);
};

const Login: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  /** 获取用户信息 */
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      // 手动设置 initialState
      setInitialState({
        ...initialState,
        currentUser: userInfo,
      });
    }
  };

  /** 提交 */
  const handleSubmit = async (values: API.LoginParamsType) => {
    setSubmitting(true);
    try {
      // 登录
      const result: any = await accountLogin({ ...values });

      window.localStorage.setItem('umi_locale', 'zh-CN');

      commonResult(result);
      //message.success('登录成功！');
      storageUtils.saveUser(
        Object.assign({ name: result.data.user.username }, storageUtils.getUser()),
      );

      //localStorage.savePermissions(['mes'])
      setToken(result.data.token);
      await fetchUserInfo();
      goto();
      return;
    } catch (error) {
      // message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Card
          style={{
            width: '450px',
            margin: '0 auto',
            borderRadius: '3%',
            height: '326px',
            backgroundColor: 'rgb(206 236 235)',
          }}
        >
          <div className={styles.top} style={{ marginTop: '21px' }}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src="../logo1.jpeg" />
                <span className={styles.title}>KOE MES</span>
              </Link>
            </div>
            <div className={styles.desc}>KOEMES製造執行管理系統</div>
          </div>

          <div className={styles.main}>
            <ProForm
              initialValues={{
                autoLogin: true,
              }}
              submitter={{
                searchConfig: {
                  submitText: '登录',
                },
                render: (_, dom) => dom.pop(),
                submitButtonProps: {
                  loading: submitting,
                  size: 'large',
                  style: {
                    width: '100%',
                  },
                },
              }}
              onFinish={async (values) => {
                handleSubmit(values);
              }}
            >
              <ProFormText
                name="userid"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder="请输入用户名"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.userid.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />

              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockTwoTone className={styles.prefixIcon} />,
                }}
                placeholder="请输入密码"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </ProForm>
            <Text
              className={styles.linkbutton}
              underline
              onClick={async () => {
                await login();

                window.location.href = '/welcome';
              }}
            >
              Report
            </Text>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
