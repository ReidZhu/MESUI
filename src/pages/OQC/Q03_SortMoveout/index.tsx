import React, { useEffect, useRef, useState } from 'react';
import { Form, message, Radio, Divider } from 'antd';
import { useIntl } from 'umi';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { DeleteOutlined } from '@ant-design/icons';
import ProForm, { ProFormText, ProFormSelect, ProFormDigit } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import {
  machineidIntl,
  stageIntl,
  qtyIntl,
  Line,
  usnIntl,
  Model,
  Upn,
  moIntl,
  RouteName,
  errorcodeIntl,
  operationIntl,
  selectIntl,
  deleteornoIntl,
  successdeleteIntl,
  faildeleteIntl,
  brushIntl,
  alreadytmpIntl,
  changetypeIntl,
  postingIntl,
  notmaintainedIntl,
  togetherIntl,
  notfinishIntl,
  inputfirstIntl,
  mstageIntl,
  operuserIntl,
  noIntl,
} from '@/utils/intl';
import storageUtils from '@/utils/storageUtils';
import { getData, insertdata, findAllErrorCode, findQCElot, findUsnInElot } from './api';
import { Row, Col, Button, Popconfirm } from 'antd';
import { fromPairs, isInteger, sum } from 'lodash';

const style = { backgroundColor: 'white', padding: '10px', height: '600px' };
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
  // 隱藏確定按鈕過賬
  const [submitVisible, setSubmitVisible] = useState(false);
  // 隱藏Lot過賬
  const [lotVisible, setlotVisible] = useState(false);
  // 隱藏抽检数量
  const [checkoutVisible, setCheckOutVisible] = useState(false);
  //不良代码
  const [errorcode, setErrorCode] = useState<[]>([]);
  // 隱藏未维护提示
  const [remarkVisible, setremarkVisible] = useState(false);
  //臨時列表數據
  const [tmpdata, setTmpData] = useState<any[]>([]);
  // 操作Table
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  useEffect(() => {
    getConfig();
  }, []);
  //获取不良代碼
  const getAllErrorcode = async () => {
    const errorcode = await findAllErrorCode(form.getFieldValue('stage'));
    if (errorcode.status == 200) {
      setErrorCode(errorcode.data);
    } else {
      message.error(errorcode.msg);
    }
  };
  //单选作业模式触发
  const onChangeType = (e) => {
    if (e.infotype == 'PCS') {
      setlotVisible(false);
    } else if (e.infotype == 'LOT') {
      setlotVisible(true);
    }
  };

  //PCS模式录入临时表
  const getPcsTable = async (inputinfoid: String) => {
    let operuser = form.getFieldValue('operuser');
    let errorcode = form.getFieldValue('errorcode');
    let ngremark = form.getFieldValue('ngremark');
    let stage = form.getFieldValue('stage');
    if (operuser == null) {
      message.error('请输入操作员');
      return;
    }
    if (errorcode == null) {
      message.error('请选择不良代码');
      return;
    }
    if (inputinfoid == null) {
      message.error('请输入产品编码');
      return;
    }
    if (tmpdata.length >= parseInt(form.getFieldValue('qty'))) {
      message.error('不良数量不能大于elot总数');
      return;
    }
    //check刷入數據
    const result = await findUsnInElot({
      elotid: form.getFieldValue('elotid'),
      infoid: inputinfoid,
      stage: form.getFieldValue('stage'),
    });
    console.log(result);
    if (result.status == 200) {
      let temp: any[] = JSON.parse(JSON.stringify(tmpdata));
      let exist1 = temp.find((e: any) => {
        return e.infoid == inputinfoid;
      });
      if (exist1) {
        message.error('此产品已在列表中');
        return;
      }

      let tmppcsshow: any = {};
      tmppcsshow.infoid = inputinfoid;
      tmppcsshow.ngqty = '1';
      tmppcsshow.operuser = operuser;
      tmppcsshow.errorcode = errorcode;
      tmppcsshow.ngremark = ngremark;
      tmppcsshow.stage = stage;
      setTmpData([...tmpdata, tmppcsshow]);
      form.setFieldsValue({
        errorcode: null,
        ngremark: null,
        infoid: null,
      });
    } else {
      message.error(result.msg);
      return false;
    }
  };

  //LOT模式录入临时表
  const getLotTable = async (inputngqty: String) => {
    let operuser = form.getFieldValue('operuser');
    let errorcode = form.getFieldValue('errorcode');
    let ngremark = form.getFieldValue('ngremark');
    let infoid = form.getFieldValue('nglot');
    console.log(form.getFieldValue('ngqty'));
    let ngqty = form.getFieldValue('ngqty');
    let stage = form.getFieldValue('stage');
    if (operuser == null) {
      message.error('请输入操作员');
      return;
    }
    if (errorcode == null) {
      message.error('请选择不良代码');
      return;
    }
    if (infoid == null) {
      message.error('请输入NGLot');
      return;
    }
    if (ngqty == null) {
      message.error('请输入不良数量');
      return;
    }

    const result = await findUsnInElot({
      elotid: form.getFieldValue('elotid'),
      infoid: infoid,
      stage: stage,
      ngqty: ngqty,
    });

    // console.log(result);
    if (result.status == 200) {
      let temp: any[] = JSON.parse(JSON.stringify(tmpdata));
      let exist1 = temp.find((e: any) => {
        return e.infoid == infoid && e.errorcode == form.getFieldValue('errorcode');
      });
      if (exist1) {
        message.error('此NGLot已录入此不良');
        return;
      }
      let ngnum: number = 0;
      for (var i = 0; i < temp.length; i++) {
        ngnum = ngnum + parseInt(temp[i]['ngqty']);
      }
      console.log(ngnum);
      if (ngnum + parseInt(form.getFieldValue('ngqty')) > parseInt(form.getFieldValue('qty'))) {
        message.error('不良数量不能大于elot总数');
        return;
      }
      let tmppcsshow: any = {};
      tmppcsshow.infoid = infoid;
      tmppcsshow.ngqty = ngqty;
      tmppcsshow.operuser = operuser;
      tmppcsshow.errorcode = errorcode;
      tmppcsshow.ngremark = ngremark;
      tmppcsshow.stage = stage;
      tmppcsshow.mstage = stage;
      setTmpData([...tmpdata, tmppcsshow]);

      form.setFieldsValue({
        ngremark: null,
        ngqty: null,
      });
    } else {
      message.error(result.msg);
      return false;
    }
  };

  //Check Elot资料
  const getElotInfo = async (elotid: String) => {
    //清空臨時表
    setTmpData([]);
    //檢查是否選擇機台號

    if (form.getFieldValue('stage') == null) {
      form.setFieldsValue({ infoid: null });
      message.error(intl.formatMessage(selectIntl) + intl.formatMessage(stageIntl));
      return;
    }
    //check刷入數據
    const result = await findQCElot({
      elotid: elotid,
      stage: form.getFieldValue('stage'),
    });
    console.log(result);
    if (result.status == 200) {
      form.setFieldsValue({ qty: result.data.infoqty });
      onChangeType(result.data);
      //獲取不良代碼
      getAllErrorcode();
    } else {
      message.error(result.msg);
      return false;
    }
    setSubmitVisible(true);
  };

  //確定過賬
  async function moveout() {
    //check刷入數據
    const resultelot = await findQCElot({
      elotid: form.getFieldValue('elotid'),
      stage: form.getFieldValue('stage'),
    });
    // console.log(resultelot);
    if (resultelot.status == 200) {
      let temp1: any[] = JSON.parse(JSON.stringify(resultelot.data.infoid));
      let temp2: any[] = JSON.parse(JSON.stringify(tmpdata));
      let temp: [] = [];
      for (var i = 0; i < temp1.length; i++) {
        let tmpall: any = {};
        tmpall.infoid = temp1[i];
        tmpall.mstage = resultelot.data.stage;
        tmpall.operuser = form.getFieldValue('operuser');

        let tempng: [] = [];
        for (var j = 0; j < temp2.length; j++) {
          if (temp1[i] == temp2[j]['infoid']) {
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
        line: null,
        machineid: null,
        stage: form.getFieldValue('stage'),
        createuser: storageUtils.getUser().name,
        ip: storageUtils.getUser().ip,
      });
      console.log(result);
      if (result.status == 200) {
        message.success(result.msg);
        form.setFieldsValue({
          qty: null,
          elotid: null,
          operuser: null,
          errorcode: null,
          ngremark: null,
          infoid: null,
          nglot: null,
          ngqty: null,
        });
        setTmpData([]);
        setSubmitVisible(false);
        return true;
      } else {
        message.error(result.msg);
        return false;
      }
    } else {
      message.error(resultelot.msg);
      return false;
    }
  }

  // 获取基础数据
  const getConfig = async () => {
    const result = await getData({ apid: 'Q03', ip: storageUtils.getUser().ip });
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

  //Lot打不良Tmp列表
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage(noIntl),
      dataIndex: 'index',
      valueType: 'index',
      width: '50px',
      // render: () => <DragHandle />,
    },
    {
      title: '产品编码',
      dataIndex: 'infoid',
      // render: () => <DragHandle />,
    },
    {
      title: '不良代碼',
      dataIndex: 'errorcode',
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
            let temp: [] = JSON.parse(JSON.stringify(tmpdata));
            let removeAfter = temp.filter((e: any) => {
              return e.infoid != record.infoid || e.errorcode != record.errorcode;
            });
            setTmpData(removeAfter);
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

  return (
    <PageContainer title={false}>
      <ProForm form={form} layout="horizontal" submitter={false}>
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
              <Row>
                <Col>
                  <ProForm.Group>
                    <ProFormText
                      label={intl.formatMessage(brushIntl)}
                      width="xl"
                      name="elotid"
                      fieldProps={{
                        onPressEnter: (e) => {
                          getElotInfo(e.currentTarget.value);
                        },
                      }}
                      disabled={form.getFieldValue('qty') != null}
                    />
                  </ProForm.Group>
                </Col>
              </Row>

              <ProForm.Group>
                <ProFormText width="sm" name="qty" label="合计数量" readonly />
              </ProForm.Group>
              <ProForm.Group>
                <Button
                  // type="primary"
                  onClick={() => {
                    form.setFieldsValue({
                      qty: null,
                      movetype: null,
                      elotid: null,
                      operuser: null,
                      errorcode: null,
                      ngremark: null,
                      infoid: null,
                      nglot: null,
                      ngqty: null,
                    });
                    setTmpData([]);
                    setSubmitVisible(false);
                  }}
                >
                  清空
                </Button>

                {submitVisible ? (
                  <Button type="primary" onClick={moveout}>
                    确定
                  </Button>
                ) : (
                  <></>
                )}
              </ProForm.Group>
            </div>
          </Col>
          <Col className="gutter-row" span={18}>
            <div style={style}>
              <Row>
                <Col span={8}>
                  <div style={{ float: 'right' }}>
                    <ProFormText
                      width="sm"
                      name="operuser"
                      label={intl.formatMessage(operuserIntl)}
                    />
                  </div>
                </Col>
                {/* <Col span={8}>
                  <div style={{ float: 'right' }}>
                    {lotVisible ? <ProFormText width="sm" name="jigno" label="治具編號" /> : <></>}
                  </div>
                </Col>
                <Col span={8}></Col> */}
              </Row>

              <Row>
                <Col span={8}>
                  <div style={{ float: 'right' }}>
                    <ProFormSelect
                      width="sm"
                      name="errorcode"
                      label="不良代码"
                      options={errorcode}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ float: 'right' }}>
                    <ProFormText width="sm" name="ngremark" label="不良備註" />
                  </div>
                </Col>
                <Col span={8}></Col>
              </Row>
              <Row>
                <Col span={8}>
                  <div style={{ float: 'right' }}>
                    {lotVisible ? (
                      <></>
                    ) : (
                      <ProFormText
                        width="sm"
                        name="infoid"
                        label="刷入产品"
                        fieldProps={{
                          onPressEnter: (e) => {
                            getPcsTable(e.currentTarget.value);
                          },
                        }}
                      />
                    )}
                    {lotVisible ? <ProFormText width="sm" name="nglot" label="不良LOT" /> : <></>}
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ float: 'right' }}>
                    {lotVisible ? (
                      <ProFormDigit
                        width="sm"
                        name="ngqty"
                        label="不良数量"
                        fieldProps={{
                          onPressEnter: (e) => {
                            getLotTable(e.currentTarget.value);
                          },
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </Col>
                <Col span={8}></Col>
              </Row>
              <Row>
                <Col>
                  <ProTable
                    actionRef={actionRef}
                    columns={columns}
                    search={false}
                    headerTitle="已刷入产品信息列表"
                    // toolBarRender={false}
                    dataSource={tmpdata}
                    rowKey="infoid"
                    pagination={{ pageSize: 10 }}
                    scroll={{ y: 500 }}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </ProForm>
    </PageContainer>
  );
};
