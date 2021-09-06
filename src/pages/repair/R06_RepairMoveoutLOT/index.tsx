import React, { useEffect, useRef, useState } from 'react';
import { Form, message, Radio, Divider } from 'antd';
import { useIntl } from 'umi';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { DeleteOutlined } from '@ant-design/icons';
import ProForm, { ProFormText, ProFormSelect, ProFormDigit } from '@ant-design/pro-form';
import {
  machineidIntl,
  stageIntl,
  Line,
  submitIntl,
  resetIntl,
  Model,
  Upn,
  moIntl,
  errorcodeIntl,
  operationIntl,
  selectIntl,
  deleteornoIntl,
  successdeleteIntl,
  faildeleteIntl,
  brushIntl,
  alreadytmpIntl,
  notmaintainedIntl,
  togetherIntl,
  inputfirstIntl,
  mstageIntl,
  operuserIntl,
  noIntl,
  qtyIntl,
} from '@/utils/intl';
import storageUtils from '@/utils/storageUtils';
import { getData, findMesInfo, findAllErrorCode, insertdata } from './api';
import { Row, Col, Button, Popconfirm } from 'antd';
import { findAllMstage, findOnLine, findAllMachineid, findAllOnlineUser } from '@/services/select';
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
  // 獲取上線人員
  const [onlineuser, setOnlineUser] = useState<[]>([]);

  // 獲取線體
  const [line, setLine] = useState<[]>([]);
  // 獲取基础数据
  const [machine, setMachine] = useState<[]>([]);
  //臨時列表Lot過賬數據
  const [tmpdata1, setTmpData1] = useState<any[]>([]);
  //臨時列表Lot打不良數據
  const [tmpdata2, setTmpData2] = useState<any[]>([]);
  // 操作Table
  const actionRef = useRef<ActionType>();
  const [errorcode, setErrorCode] = useState<any[]>([]);
  const [mstage, setMStage] = useState<any[]>([]);
  const [form] = Form.useForm();
  useEffect(() => {
    getConfig();
  }, []);

  //獲取上線人員
  const getOperUser = async (e) => {
    const resultonlineuser = await findAllOnlineUser({
      stage: form.getFieldValue('mstage'),
    });
    setOnlineUser(resultonlineuser.data);
  };

  //獲取不良代碼
  const getErrorCode = async (e) => {
    form.setFieldsValue({ errorcode: null });
    const errorcode = await findAllErrorCode(e);
    if (errorcode.status == 200) {
      setErrorCode(errorcode.data);
    } else {
      message.error(errorcode.msg);
    }
  };
  //確定過賬
  async function moveout() {
    if (form.getFieldValue('infoqty') == null) {
      message.error('请刷入Lot号');
      return;
    }
    if (mstage.length != tmpdata1.length) {
      message.error('此站点未过完账，请确认');
      return;
    }
    let temp1: any[] = JSON.parse(JSON.stringify(tmpdata1));
    let temp2: any[] = JSON.parse(JSON.stringify(tmpdata2));
    let temp: [] = [];
    for (var i = 0; i < temp1.length; i++) {
      let tmpall: any = {};
      tmpall.infoid = temp1[i]['infoid'];
      tmpall.mstage = temp1[i]['mstage'];
      tmpall.operuser = temp1[i]['operuser'];
      let tempng: [] = [];
      for (var j = 0; j < temp2.length; j++) {
        if (temp1[i]['mstage'] == temp2[j]['ngmstage']) {
          let tmpng: any = {};
          tmpng.errorcode = temp2[j]['errorcode'];
          tmpng.ngqty = temp2[j]['ngqty'];
          tmpng.ngremark = temp2[j]['ngremark'];
          tempng.push(JSON.parse(JSON.stringify(tmpng)));
        }
      }
      tmpall.ng = tempng;
      temp.push(JSON.parse(JSON.stringify(tmpall)));
    }

    const result = await insertdata({
      data: temp,
      line: form.getFieldValue('line'),
      machineid: form.getFieldValue('machineid'),
      ip: storageUtils.getUser().ip,
      stage: form.getFieldValue('stage'),
      createuser: storageUtils.getUser().name,
    });

    if (result.status == 200) {
      message.success(result.msg);
      form.setFieldsValue({
        mo: null,
        upn: null,
        infoqty: null,
        model: null,
        infoid: null,
        mstage: null,
        ngmstage: null,
        errorcode: null,
        ngremark: null,
        ngqty: null,
      });
      setTmpData1([]);
      setTmpData2([]);
      setErrorCode([]);
      setMStage([]);
      setOnlineUser([]);
      return true;
    } else {
      message.error(result.msg);
      return false;
    }
  }
  //刷入Lot带出信息
  const getTable = async (inputinfoid: String) => {
    // //檢查是否選擇機台號
    // if (form.getFieldValue('machineid') == null) {
    //   form.setFieldsValue({ infoid: null });
    //   message.error(intl.formatMessage(selectIntl) + intl.formatMessage(machineidIntl));
    //   return;
    // }
    //check刷入數據
    const result = await findMesInfo({
      infoid: inputinfoid,
      stage: form.getFieldValue('stage'),
      // isPcs: 'Y',
    });

    if (result.status == 200) {
      if (result.data.infotype != 'LOT') {
        message.error('此產品非LOT過賬產品');
        return;
      }
      form.setFieldsValue({
        mo: result.data.mo,
        upn: result.data.upn,
        infoqty: result.data.infoqty,
        model: result.data.model,
      });
    } else {
      message.error(result.msg);
      return false;
    }

    const resultmstage = await findAllMstage({
      routename: result.data.routename,
      stage: form.getFieldValue('stage'),
    });

    if (resultmstage.status == 200) {
      setMStage(resultmstage.data);
    } else {
      message.error(resultmstage.msg);
      return false;
    }
  };
  // 获取基础数据
  const getConfig = async () => {
    const result = await getData({ apid: 'R06', ip: storageUtils.getUser().ip });
    form.setFieldsValue({ infoid: null });
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
  };

  //Lot過賬Tmp列表
  const columns1: ProColumns[] = [
    {
      title: intl.formatMessage(noIntl),
      dataIndex: 'index',
      valueType: 'index',
      width: '50px',
      // render: () => <DragHandle />,
    },
    {
      title: intl.formatMessage(mstageIntl),
      dataIndex: 'mstage',
      // render: () => <DragHandle />,
    },
    {
      title: intl.formatMessage(machineidIntl),
      dataIndex: 'machineid',
      // valueType: 'select',
    },
    {
      title: intl.formatMessage(operuserIntl),
      dataIndex: 'operuser',
    },
    {
      title: intl.formatMessage(operationIntl),
      key: 'option',

      // width: 120,
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm
          title={intl.formatMessage(deleteornoIntl)}
          onConfirm={() => {
            let temp1: [] = JSON.parse(JSON.stringify(tmpdata1));
            let removeAfter1 = temp1.filter((e: any) => {
              return e.mstage != record.mstage;
            });
            setTmpData1(removeAfter1);
            message.success(intl.formatMessage(successdeleteIntl));
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

  //Lot打不良Tmp列表
  const columns2: ProColumns[] = [
    {
      title: intl.formatMessage(noIntl),
      dataIndex: 'index',
      valueType: 'index',
      width: '50px',
      // render: () => <DragHandle />,
    },
    {
      title: intl.formatMessage(mstageIntl),
      dataIndex: 'ngmstage',
      // render: () => <DragHandle />,
    },
    {
      title: '不良代碼',
      dataIndex: 'errorcode',
      // valueType: 'select',
    },
    {
      title: '不良數量',
      dataIndex: 'ngqty',
    },
    {
      title: intl.formatMessage(operationIntl),
      key: 'option',

      // width: 120,
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm
          title={intl.formatMessage(deleteornoIntl)}
          onConfirm={() => {
            let temp2: [] = JSON.parse(JSON.stringify(tmpdata2));
            let removeAfter2 = temp2.filter((e: any) => {
              console.log(e.ngmstage, record.ngmstage, e.errorcode, record.errorcode);
              // return
              return e.ngmstage != record.ngmstage || e.errorcode != record.errorcode;
            });
            setTmpData2(removeAfter2);
            message.success(intl.formatMessage(successdeleteIntl));
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

  // const resultmachine = await findAllMachine({ stage: stage, line: machine });
  // setMachine(resultmachine.data);
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
              </ProForm.Group>
              {/* <ProForm.Group>
                <ProFormSelect
                  width="sm"
                  name="machineid"
                  label={intl.formatMessage(machineidIntl)}
                  options={machine}
                />
              </ProForm.Group> */}
              <ProForm.Group>
                <ProFormText
                  label={intl.formatMessage(brushIntl)}
                  width="xl"
                  name="infoid"
                  fieldProps={{
                    onPressEnter: (e) => {
                      getTable(e.currentTarget.value);
                    },
                  }}
                  disabled={tmpdata1.length > 0}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText width="sm" name="mo" label={intl.formatMessage(moIntl)} readonly />
                <ProFormText width="sm" name="upn" label={intl.formatMessage(Upn)} readonly />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText
                  width="sm"
                  name="infoqty"
                  label={intl.formatMessage(qtyIntl)}
                  readonly
                />
                <ProFormText width="sm" name="model" label={intl.formatMessage(Model)} readonly />
              </ProForm.Group>
              <ProForm.Group>
                <Button
                  // type="primary"
                  onClick={() => {
                    form.setFieldsValue({
                      mo: null,
                      upn: null,
                      infoqty: null,
                      model: null,
                      infoid: null,
                      mstage: null,
                      ngmstage: null,
                      errorcode: null,
                      ngremark: null,
                      ngqty: null,
                    });
                    setTmpData1([]);
                    setTmpData2([]);
                    setErrorCode([]);
                    setMStage([]);
                    setOnlineUser([]);
                  }}
                >
                  {intl.formatMessage(resetIntl)}
                </Button>
                <Button type="primary" onClick={moveout}>
                  {intl.formatMessage(submitIntl)}
                </Button>
              </ProForm.Group>
            </div>
          </Col>
          <Col className="gutter-row" span={18}>
            <div style={style}>
              <Divider orientation="left">添加操作人员信息</Divider>
              {/* <ProForm.Group> */}
              <Row>
                <Col span={8}>
                  <div style={{ float: 'right' }}>
                    <ProFormSelect
                      width="sm"
                      name="mstage"
                      label={intl.formatMessage(mstageIntl)}
                      options={mstage}
                      fieldProps={{
                        onChange: async (e) => {
                          getOperUser(e);
                        },
                      }}
                      // fieldProps={{
                      //   onChange: async (e) => {
                      //     const resultonline = await findOnLine({ stage: e });
                      //     setLine(resultonline.data);
                      //   },
                      // }}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ float: 'right' }}>
                    <ProFormSelect
                      width="sm"
                      name="online"
                      label={intl.formatMessage(Line)}
                      options={line}
                      disabled
                      // fieldProps={{
                      //   onChange: async (e) => {
                      //     const resultmachineid = await findAllMachineid({
                      //       stage: form.getFieldValue('mstage'),
                      //       line: e,
                      //     });
                      //     setMachine(resultmachineid.data);
                      //   },
                      // }}
                    />
                  </div>
                </Col>
                <Col span={8}></Col>
              </Row>
              {/* </ProForm.Group> */}
              {/* <ProForm.Group> */}
              <Row>
                <Col span={8}>
                  <div style={{ float: 'right' }}>
                    <ProFormSelect
                      width="sm"
                      name="machineid"
                      label={intl.formatMessage(machineidIntl)}
                      style={{ float: 'right' }}
                      options={machine}
                      fieldProps={{
                        onChange: async (e) => {
                          const resultonlineuser = await findAllOnlineUser({
                            stage: form.getFieldValue('mstage'),
                            line: form.getFieldValue('online'),
                            machineid: e,
                          });
                          setOnlineUser(resultonlineuser.data);
                        },
                      }}
                      disabled
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ float: 'right' }}>
                    <ProFormSelect
                      width="sm"
                      name="operuser"
                      label={intl.formatMessage(operuserIntl)}
                      // request={async () => [
                      //   { label: 'O18060023', value: 'O18060023' },
                      //   { label: 'O17040021', value: 'O17040021' },
                      // ]}
                      options={onlineuser}
                      style={{ float: 'right' }}
                      fieldProps={{
                        onChange: async (e) => {
                          if (form.getFieldValue('mstage') == null) {
                            form.setFieldsValue({ operuser: null });
                            message.error('请先选择小站点');
                            return;
                          }
                          let temp: any[] = JSON.parse(JSON.stringify(tmpdata1));
                          let exist1 = temp.find((e: any) => {
                            return e.stage == form.getFieldValue('mstage');
                          });
                          if (exist1) {
                            form.setFieldsValue({ operuser: null });
                            message.error('此小站点已录入');
                            return;
                          }
                          let tmpusershow: any = {};
                          tmpusershow.infoid = form.getFieldValue('infoid');
                          tmpusershow.stage = form.getFieldValue('stage');
                          tmpusershow.mstage = form.getFieldValue('mstage');
                          tmpusershow.operuser = form.getFieldValue('operuser');
                          tmpusershow.line = form.getFieldValue('online');
                          tmpusershow.machineid = form.getFieldValue('machineid');
                          setTmpData1([...tmpdata1, tmpusershow]);
                          form.setFieldsValue({ operuser: null });
                        },
                      }}
                    />
                  </div>
                </Col>
                <Col span={8}></Col>
              </Row>
              {/* </ProForm.Group> */}
              <ProTable
                actionRef={actionRef}
                columns={columns1}
                search={false}
                headerTitle="此LOT已刷入操作人员列表"
                // toolBarRender={false}
                dataSource={tmpdata1}
                rowKey="mstage"
                pagination={{ pageSize: 10 }}
                scroll={{ y: 150 }}
                size="small"
              />
              <Divider orientation="left">添加不良产品信息</Divider>
              <Row>
                <Col span={8}>
                  <div style={{ float: 'right' }}>
                    <ProFormSelect
                      width="sm"
                      name="ngmstage"
                      label={intl.formatMessage(mstageIntl)}
                      options={mstage}
                      fieldProps={{
                        onChange: async (e) => {
                          getErrorCode(e);
                        },
                      }}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ float: 'right' }}>
                    <ProFormSelect
                      width="sm"
                      name="errorcode"
                      label="不良代碼"
                      options={errorcode}
                    />
                  </div>
                </Col>
                <Col span={8}></Col>
              </Row>

              <Row>
                <Col span={8}>
                  <div style={{ float: 'right' }}>
                    <ProFormText
                      width="sm"
                      name="ngremark"
                      label="不良備註"
                      // options={mstage}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ float: 'right' }}>
                    <ProFormDigit
                      width="sm"
                      name="ngqty"
                      label="不良數量"
                      fieldProps={{
                        onPressEnter: (e) => {
                          if (form.getFieldValue('errorcode') == null) {
                            form.setFieldsValue({ ngqty: null });
                            message.error('请先选择不良代码');
                            return;
                          }
                          let temp: any[] = JSON.parse(JSON.stringify(tmpdata2));

                          let ngnum: number = 0;
                          for (var i = 0; i < temp.length; i++) {
                            ngnum = ngnum + parseInt(temp[i]['ngqty']);
                          }
                          if (
                            ngnum + parseInt(form.getFieldValue('ngqty')) >
                            parseInt(form.getFieldValue('infoqty'))
                          ) {
                            message.error('不良数量不能大于lot总数');
                            return;
                          }
                          let exist1 = temp.find((e: any) => {
                            return (
                              e.ngmstage == form.getFieldValue('ngmstage') &&
                              e.errorcode == form.getFieldValue('errorcode')
                            );
                          });
                          if (exist1) {
                            form.setFieldsValue({ ngqty: null });
                            message.error('此小站点已录入此不良');
                            return;
                          }
                          let tmpngshow: any = {};
                          tmpngshow.infoid = form.getFieldValue('infoid');
                          tmpngshow.stage = form.getFieldValue('stage');
                          tmpngshow.ngmstage = form.getFieldValue('ngmstage');
                          tmpngshow.line = form.getFieldValue('line');
                          tmpngshow.machineid = form.getFieldValue('machineid');
                          tmpngshow.nguser = storageUtils.getUser().name;
                          tmpngshow.errorcode = form.getFieldValue('errorcode');
                          tmpngshow.ngremark = form.getFieldValue('ngremark');
                          tmpngshow.ngqty = form.getFieldValue('ngqty');
                          setTmpData2([...tmpdata2, tmpngshow]);
                          form.setFieldsValue({ ngremark: null });
                          form.setFieldsValue({ ngqty: null });
                        },
                      }}
                    />
                  </div>
                </Col>
                <Col span={8}></Col>
              </Row>
              <ProTable
                actionRef={actionRef}
                columns={columns2}
                search={false}
                headerTitle="此LOT已刷入不良信息列表"
                // toolBarRender={false}
                dataSource={tmpdata2}
                rowKey="infoid"
                pagination={{ pageSize: 10 }}
                scroll={{ y: 150 }}
                size="small"
              />
            </div>
          </Col>
        </Row>
        {/* </div> */}
      </ProForm>
    </PageContainer>
  );
};
