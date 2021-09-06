import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Button, Form, message } from 'antd';
import { useIntl } from 'umi';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import {
  stageIntl,
  usnIntl,
  Upn,
  brushIntl,
  submitIntl,
  resetIntl,
  noIntl,
  qtyIntl,
  notmaintainedIntl,
  operationIntl,
  brushedinlistIntl,
  inputIntl,
  transmsg01Intl,
  transmsg02Intl,
} from '@/utils/intl';
import storageUtils from '@/utils/storageUtils';
import { getData, insertdata, getstage } from './api';
import { PageContainer } from '@ant-design/pro-layout';

const style = { backgroundColor: 'white', padding: '10px', height: '830px' };
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default () => {
  //國際化
  const intl = useIntl();
  //拋送后台數據
  const [tmpdata, setTmpData] = useState<any[]>([]);
  // 隱藏未维护提示
  const [remarkVisible, setremarkVisible] = useState(false);
  // 操作Table
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  useEffect(() => {
    getConfig();
  }, []);

  // 获取基础数据
  const getConfig = async () => {
    const result = await getstage({ apid: 'T05', ip: storageUtils.getUser().ip });
    if (result.status == 200) {
      if (result.data.length == 1) {
        if (result.data[0].configkey == 'STAGE') {
          setremarkVisible(false);
          form.setFieldsValue({ stage: result.data[0].configvalue });
        } else {
          setremarkVisible(true);
          form.setFieldsValue({
            remark:
              'IP：' + storageUtils.getUser().ip + '，' + intl.formatMessage(notmaintainedIntl),
          });
        }
      } else {
        setremarkVisible(true);
        form.setFieldsValue({
          remark: 'IP：' + storageUtils.getUser().ip + '，' + intl.formatMessage(notmaintainedIntl),
        });
      }
      // setConfig(result.data);
    } else {
      setremarkVisible(true);
      message.error(result.msg);
    }
  };

  //录入临时表
  const getTable = async (elotid: String) => {
    //check刷入數據
    const result = await getData({
      elotid: elotid,
    });
    console.log(result);
    if (result.status == 200) {
      if (result.data.data[0]['stage'] != form.getFieldValue('stage')) {
        form.setFieldsValue({ elotid: null });
        message.error(
          intl.formatMessage(transmsg01Intl) +
            result.data.data[0]['stage'] +
            intl.formatMessage(transmsg02Intl),
        );
        return;
      }
      form.setFieldsValue({
        qty: result.data.infoqty,
        // stage: result.data.data[0]['stage'],
      });
      setTmpData(result.data.data);
    } else {
      form.setFieldsValue({ elotid: null });
      message.error(result.msg);
      return false;
    }
  };

  //列表栏位显示
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage(noIntl),
      dataIndex: 'index',
      valueType: 'index',
      width: '50px',
    },
    {
      title: 'ELOT',
      dataIndex: 'elotid',
    },
    {
      title: intl.formatMessage(usnIntl),
      dataIndex: 'infoid',
    },

    {
      title: intl.formatMessage(Upn),
      dataIndex: 'upn',
    },
    {
      title: intl.formatMessage(operationIntl),
      dataIndex: 'infostatus',
    },
  ];

  //確定過賬
  async function checkin() {
    if (form.getFieldValue('qty') == null) {
      message.error(intl.formatHTMLMessage(inputIntl) + 'ELOT');
      return false;
    }
    const result = await insertdata({
      elotid: form.getFieldValue('elotid'),
      stage: form.getFieldValue('stage'),
      ip: storageUtils.getUser().ip,
      createuser: storageUtils.getUser().name,
    });
    if (result.status == 200) {
      message.success(result.msg);
      form.setFieldsValue({
        elotid: null,
        qty: null,
      });
      setTmpData([]);
      return true;
    } else {
      message.error(result.msg);
      return false;
    }
  }

  return (
    <PageContainer title={false}>
      <ProForm form={form} layout="horizontal" submitter={false}>
        {/* <div style={style}> */}
        <Row gutter={12}>
          <Col className="gutter-row" span={6}>
            <div style={style}>
              {remarkVisible ? (
                <Row>
                  <Col>
                    <ProForm.Group>
                      <ProFormText
                        width="sm"
                        name="remark"
                        formItemProps={{ style: { color: 'red' } }}
                        readonly
                      />
                    </ProForm.Group>
                  </Col>
                </Row>
              ) : (
                <></>
              )}
              <Row>
                <Col>
                  <ProForm.Group>
                    <ProFormText
                      width="sm"
                      name="stage"
                      label={intl.formatMessage(stageIntl)}
                      readonly
                    />
                  </ProForm.Group>
                </Col>
              </Row>
              <ProForm.Group>
                <ProFormText
                  label={intl.formatMessage(brushIntl)}
                  width="xl"
                  name="elotid"
                  fieldProps={{
                    onPressEnter: (e) => {
                      getTable(e.currentTarget.value);
                    },
                  }}
                  disabled={form.getFieldValue('qty') != null}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText width="sm" name="qty" label={intl.formatMessage(qtyIntl)} readonly />
                {/* <ProFormText
                  width="sm"
                  name="stage"
                  label={intl.formatMessage(stageIntl)}
                  readonly
                /> */}
              </ProForm.Group>
              <ProForm.Group>
                <Button
                  // type="primary"
                  className="ant-btn"
                  key="reset"
                  onClick={() => {
                    form.setFieldsValue({
                      elotid: null,
                      qty: null,
                    });
                    setTmpData([]);
                  }}
                >
                  {intl.formatMessage(resetIntl)}
                </Button>
                <Button
                  type="primary"
                  className="ant-btn ant-btn-primary"
                  key="submit"
                  onClick={checkin}
                >
                  {intl.formatMessage(submitIntl)}
                </Button>
              </ProForm.Group>
            </div>
          </Col>
          <Col className="gutter-row" span={18}>
            <div style={style}>
              <ProTable
                // tableStyle={{ width: '520px', marginTop: '20px' }}
                pagination={{ pageSize: 20 }}
                scroll={{ y: 500 }}
                size="small"
                actionRef={actionRef}
                columns={columns}
                search={false}
                // toolBarRender={false}
                headerTitle={intl.formatMessage(brushedinlistIntl)}
                dataSource={tmpdata}
                rowKey="infoid"
              />
            </div>
          </Col>
        </Row>
        {/* </div> */}
      </ProForm>
    </PageContainer>
  );
};
