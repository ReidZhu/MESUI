import {
  childIntl,
  lotNoIntl,
  lotNoNumberIntl,
  moIntl,
  pleaseenteragainIntl,
  printIntl,
  resetIntl,
  SeparateIntl,
  submitIntl,
} from '@/utils/intl';
import { commonResult } from '@/utils/resultUtils';
import { formatparams } from '@/utils/utils';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Button, Card, Divider, Form, message } from 'antd';
import React, { useState } from 'react';
import { Access, useAccess, useIntl } from 'umi';
import { getDataU01 } from './api';

const index = () => {
  const [form] = Form.useForm();
  //权限验证
  const access = useAccess();
  const intl = useIntl();
  const [heid, setHeid] = useState<boolean>(true);
  const [val, setVal] = useState();

  return (
    <Card style={{ height: '100%', fontWeight: 'bold' }}>
      <Divider />
      <ProForm
        layout="horizontal"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 5 }}
        onFinish={async (values) => {
          console.log(values);
          if (!values.mo) return false;
          // commonResult(await addU01(values), () => {
          setHeid(false);
          form.resetFields();
          // });
          form.setFieldsValue({ lotno: 'T20210901-0006.001' });
          return true;
        }}
        form={form}
        submitter={{
          // 完全自定义整个区域
          render: (props, doms) => {
            return [
              <Access accessible={access.lableFilter('exceptioncenter:U02:Separate')}>
                <Button
                  key="rest"
                  style={{ marginLeft: '40px' }}
                  onClick={() => props.form?.resetFields()}
                >
                  {intl.formatMessage(resetIntl)}
                </Button>
              </Access>,
              <Access accessible={access.lableFilter('exceptioncenter:U02:Separate')}>
                <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>
                  {intl.formatMessage(submitIntl)}
                </Button>
              </Access>,
              <Access accessible={access.lableFilter('exceptioncenter:U02:print')}>
                <Button hidden={heid}>{intl.formatMessage(printIntl)}</Button>
              </Access>,
            ];
          },
        }}
      >
        <ProFormText
          name="infoid"
          label={intl.formatMessage(lotNoIntl)}
          rules={[{ required: true }]}
          style={{ display: 'none' }}
          fieldProps={{
            onPressEnter: async (e: any) => {
              setHeid(true);
              if (e.target.value.length && !form.getFieldValue('mo'))
                commonResult(
                  await getDataU01(formatparams(e.target.value)),
                  (data: any) => {
                    form.setFieldsValue(data);
                    console.log(data);
                    setVal(data.infoqty);
                  },
                  false,
                );
            },
          }}
        />
        <ProFormText name="mo" label={intl.formatMessage(moIntl)} readonly />
        <ProFormText name="infoqty" label={intl.formatMessage(lotNoNumberIntl)} readonly />
        <ProFormText hidden name="upn" />
        <ProFormText hidden name="model" />
        <ProFormText
          fieldProps={{
            onChange: (e: any) => {
              console.log(val);
              console.log(val! < e.target.value);
              if (val! < e.target.value) {
                message.error(intl.formatMessage(pleaseenteragainIntl));
                form.setFieldsValue({ num: '' });
              }
            },
          }}
          rules={[{ required: true }]}
          name="num"
          label={intl.formatMessage(SeparateIntl)}
        />

        <ProFormText
          hidden={heid}
          name="lotno"
          label={<span style={{ color: 'red' }}>{intl.formatMessage(childIntl)}</span>}
          readonly
        />
      </ProForm>
    </Card>
  );
};

export default index;
