import React, { useEffect, useRef, useState } from 'react';
import { Form, message, Divider, Tag } from 'antd';
import { useIntl } from 'umi';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { DeleteOutlined, RocketOutlined } from '@ant-design/icons';
import ProForm, { ProFormText, ProFormSelect, ProFormSwitch } from '@ant-design/pro-form';
import {
  machineidIntl,
  stageIntl,
  Line,
  operationIntl,
  deleteornoIntl,
  faildeleteIntl,
  notmaintainedIntl,
  mstage2Intl,
  createtimeIntl,
  mstageIntl,
  operuserIntl,
  machineIntl,
  userIntl,
  noIntl,
  RouteName,
  T04Msg01Intl,
  nocrosslineIntl,
  crosslineIntl,
  onlineIntl,
  offlineIntl,
} from '@/utils/intl';
import storageUtils from '@/utils/storageUtils';
import { getData, insertdata, getTmpData, deleteByid } from './api';
import { Row, Col, Button, Popconfirm } from 'antd';
import { findAllMstage, findAllRoute, findAllMachineid } from '@/services/select';
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
  // 隱藏未维护提示
  const [remarkVisible, setremarkVisible] = useState(false);
  //國際化
  const intl = useIntl();
  // 獲取機種流程
  const [route, setRoute] = useState<[]>([]);
  // 獲取機台
  const [machine, setMachine] = useState<[]>([]);
  //臨時列表Lot過賬數據
  const [tmpdata, setTmpData] = useState<any[]>([]);
  // 操作Table
  const actionRef = useRef<ActionType>();
  const [errorcode, setErrorCode] = useState<any[]>([]);
  const [mstage, setMStage] = useState<any[]>([]);
  const [form] = Form.useForm();
  useEffect(() => {
    getConfig();
  }, []);

  //確定上線
  const insertuser = async (userid: String) => {
    const result = await insertdata({
      line: form.getFieldValue('machineid').substr(0, 5),
      machineid: form.getFieldValue('machineid'),
      stage: form.getFieldValue('mstage'),
      userid: userid,
    });

    if (result.status == 200) {
      form.setFieldsValue({
        userid: null,
      });
    } else {
      message.error(result.msg);
      return false;
    }
    const resulttmp = await getTmpData({
      // line: form.getFieldValue('line'),
      stage: form.getFieldValue('stage'),
    });
    setTmpData(resulttmp);
    // setTmpData(JSON.parse(JSON.stringify(resulttmp)));
    // if (resulttmp.status == 200) {
    //   // let tempshow: any[] = [];
    //   // for (var i = 0; i < resulttmp.data.length; i++) {
    //   // tempshow.push(JSON.parse(JSON.stringify(resulttmp.data[])));
    //   // setTmpData(JSON.parse(JSON.stringify(resulttmp.data)));
    // } else {
    //   message.error(resulttmp.msg);
    //   return false;
    // }
  };
  //選擇流程帶出小站信息
  const getmsatge = async (routename: String) => {
    form.setFieldsValue({ mstage: null, machineid: null, userid: null });
    //檢查是否選擇機台號
    if (form.getFieldValue('line') == null || form.getFieldValue('stage') == null) {
      form.setFieldsValue({ routename: null });
      message.error(intl.formatMessage(notmaintainedIntl));
      return;
    }

    const resultmstage = await findAllMstage({
      routename: routename,
      stage: form.getFieldValue('stage'),
    });

    if (resultmstage.status == 200) {
      setMStage(resultmstage.data);
    } else {
      message.error(resultmstage.msg);
      return false;
    }
  };
  //選擇小站帶出機台信息
  const getmachineid = async (mstage: String) => {
    form.setFieldsValue({ machineid: null, userid: null });
    const resultmachineid = await findAllMachineid({
      crossline: form.getFieldValue('crossline'),
      line: form.getFieldValue('line'),
      stage: mstage,
    });
    console.log(resultmachineid);
    if (resultmachineid.status == 200) {
      setMachine(resultmachineid.data);
    } else {
      message.error(resultmachineid.msg);
      return false;
    }
  };

  //選擇跨線帶出機台信息
  const getcrossmachineid = async () => {
    form.setFieldsValue({ machineid: null, userid: null });
    const resultmachineid = await findAllMachineid({
      crossline: form.getFieldValue('crossline'),
      line: form.getFieldValue('line'),
      stage: form.getFieldValue('mstage'),
    });
    console.log(resultmachineid);
    if (resultmachineid.status == 200) {
      setMachine(resultmachineid.data);
    } else {
      message.error(resultmachineid.msg);
      return false;
    }
  };

  //刪除資料
  async function deleteRow(params: any) {
    const result = await deleteByid(params);
    if (result.status == 200) {
      message.success(result.msg);
      const resulttmp = await getTmpData({
        line: form.getFieldValue('line'),
        stage: form.getFieldValue('stage'),
      });
      setTmpData(resulttmp);
      actionRef!.current!.reload();
      return true;
    } else {
      message.error(result.msg);
      return false;
    }
  }

  //更新資料
  async function updateRow(params: any) {
    // const result = await insertdata(params);
    const result = await insertdata({
      userid: params.userid.split(':')[0],
      stage: params.stage,
      machineid: params.machineid,
    });

    if (result.status == 200) {
      message.success(result.msg);
      const resulttmp = await getTmpData({
        line: form.getFieldValue('line'),
        stage: form.getFieldValue('stage'),
      });
      setTmpData(resulttmp);
      actionRef!.current!.reload();
      return true;
    } else {
      message.error(result.msg);
      return false;
    }
  }

  // 获取基础数据
  const getConfig = async () => {
    form.setFieldsValue({ crossline: false });
    const result = await getData({ apid: 'T04', ip: storageUtils.getUser().ip });
    if (result.status == 200) {
      if (result.data.length > 1) {
        let stage = '';
        let machine = '';
        for (var i = 0; i < result.data.length; i++) {
          setremarkVisible(false);
          if (result.data[i].configkey == 'STAGE') {
            stage = result.data[i].configvalue;
            form.setFieldsValue({ stage: stage });
          }
          if (result.data[i].configkey == 'LINE') {
            machine = result.data[i].configvalue;
            form.setFieldsValue({ line: machine });
          }
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
    const resultroute = await findAllRoute();
    if (resultroute.status == 200) {
      setRoute(resultroute.data);
    } else {
      setremarkVisible(true);
      message.error(resultroute.msg);
    }
  };

  //Lot過賬Tmp列表
  const columns1: ProColumns[] = [
    {
      title: intl.formatMessage(noIntl),
      dataIndex: 'index',
      valueType: 'index',
      width: '50px',
    },
    {
      title: intl.formatMessage(mstageIntl),
      dataIndex: 'stage',
    },
    {
      title: intl.formatMessage(machineidIntl),
      dataIndex: 'machineid',
    },
    {
      title: intl.formatMessage(operuserIntl),
      dataIndex: 'userid',
    },
    {
      title: intl.formatMessage(createtimeIntl),
      dataIndex: 'createtime',
    },
    {
      title: intl.formatMessage(operationIntl),
      dataIndex: 'status',
      render: (_, record) => {
        if (record.status == '1') {
          return <Tag color="green">{intl.formatMessage(onlineIntl)}</Tag>;
        } else if (record.status == '0') {
          return <Tag color="red">{intl.formatMessage(offlineIntl)}</Tag>;
        }
      },
    },
    {
      title: intl.formatMessage(operationIntl),
      key: 'option',
      // width: 120,
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="text"
          icon={<RocketOutlined />}
          onClick={() => {
            updateRow(record);
          }}
        ></Button>,

        <Popconfirm
          title={intl.formatMessage(deleteornoIntl)}
          onConfirm={async () => {
            deleteRow(record.id);
          }}
          onCancel={() => {
            message.error(intl.formatMessage(faildeleteIntl));
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" danger icon={<DeleteOutlined />}></Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer title={false}>
      <ProForm form={form} layout="horizontal" submitter={false}>
        {/* <div style={style}> */}
        <Row gutter={12}>
          <Col className="gutter-row" span={6}>
            <div style={style}>
              {remarkVisible ? (
                <ProForm.Group>
                  <ProFormText
                    width="sm"
                    name="remark"
                    formItemProps={{ style: { color: 'red' } }}
                    readonly
                  />
                </ProForm.Group>
              ) : (
                <></>
              )}
              <ProForm.Group>
                <ProFormText width="sm" name="line" label={intl.formatMessage(Line)} readonly />
                <ProFormText
                  width="sm"
                  name="stage"
                  label={intl.formatMessage(stageIntl)}
                  readonly
                />
                <ProFormSwitch
                  checkedChildren={intl.formatMessage(crosslineIntl)}
                  unCheckedChildren={intl.formatMessage(nocrosslineIntl)}
                  // label="跨線"
                  name="crossline"
                  fieldProps={{
                    onClick: () => {
                      // console.log(e);
                      getcrossmachineid();
                    },
                  }}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormSelect
                  width="sm"
                  name="routename"
                  label={intl.formatMessage(RouteName)}
                  options={route}
                  fieldProps={{
                    onChange: (e) => {
                      getmsatge(e);
                    },
                  }}
                />
              </ProForm.Group>
              {/* <ProForm.Group>
                
                <ProFormSwitch name="crossline" label="跨線" />
              </ProForm.Group> */}
              <ProForm.Group>
                <ProFormSelect
                  width="sm"
                  name="mstage"
                  label={intl.formatMessage(mstage2Intl)}
                  options={mstage}
                  fieldProps={{
                    onChange: (e) => {
                      getmachineid(e);
                    },
                  }}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormSelect
                  width="sm"
                  name="machineid"
                  label={intl.formatMessage(machineIntl)}
                  options={machine}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText
                  label={intl.formatMessage(userIntl)}
                  width="sm"
                  name="userid"
                  fieldProps={{
                    onPressEnter: (e) => {
                      insertuser(e.currentTarget.value);
                    },
                  }}
                />
              </ProForm.Group>
            </div>
          </Col>
          <Col className="gutter-row" span={18}>
            <div style={style}>
              <Divider orientation="left">{intl.formatMessage(T04Msg01Intl)}</Divider>
              <ProTable
                actionRef={actionRef}
                columns={columns1}
                search={false}
                // headerTitle="人员上線列表"
                toolBarRender={false}
                dataSource={tmpdata}
                rowKey="mstage"
                pagination={{ pageSize: 20 }}
                scroll={{ y: 500 }}
                size="small"
              />
            </div>
          </Col>
        </Row>
      </ProForm>
    </PageContainer>
  );
};
