import React, { useEffect, useRef, useState } from 'react';
import { Form, message, Radio, Divider } from 'antd';
import { useIntl } from 'umi';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ConsoleSqlOutlined, DeleteOutlined } from '@ant-design/icons';
import ProForm, {
  ProFormText,
  ProFormSelect,
  ProFormRadio,
  ProFormSwitch,
  ProFormDigit,
} from '@ant-design/pro-form';
import {
  machineidIntl,
  stageIntl,
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
  submitIntl,
  resetIntl,
  noIntl,
  flagIntl,
} from '@/utils/intl';
import storageUtils from '@/utils/storageUtils';
import { getData, getMoQty, insertdata, getcheckusn, getcpn } from './api';
import {
  findAllType,
  findBrwPackMo,
  findAllError,
  findAryLotByMo,
  findTypeByItemAndCode,
} from '@/services/select';
import { Row, Col, Button, Popconfirm } from 'antd';
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
  // 獲取類型
  const [moqty, setMoQty] = useState<String>();
  // 獲取類型
  const [cpn, setCpn] = useState<String>();
  // 獲取類型
  const [information, setInformation] = useState<String>();
  // Lot模式隱藏
  const [lotVisible, setlotVisible] = useState(false);
  // 不良代码隱藏
  const [errorcodeVisible, setErrorCodeVisible] = useState(true);
  // 维修项目隱藏
  const [brwprojectVisible, setBrwProjectVisible] = useState(true);
  // 獲取類型
  const [type, setType] = useState<[]>([]);
  // 獲取待料狀態
  const [status, setStatus] = useState<[]>([]);
  // 獲取打包類型
  const [infostatus, setInfoStatus] = useState<[]>([]);
  // 獲取arylot
  const [arylot, setArylot] = useState<[]>([]);
  // 獲取工單
  const [mo, setMo] = useState<[]>([]);
  // 獲取倉別
  const [loc, setLoc] = useState<[]>([]);
  // 隱藏未维护提示
  const [remarkVisible, setremarkVisible] = useState(false);
  //國際化
  const intl = useIntl();
  //拋送后台數據
  const [tmpdata, setTmpData] = useState<any[]>([]);
  // 操作Table
  const actionRef = useRef<ActionType>();
  //獲取不良代碼
  const [errorcode, setErrorCode] = useState<any[]>([]);

  const [form] = Form.useForm();
  useEffect(() => {
    getConfig();
  }, []);

  //獲取不良代碼
  const getErrorCode = async () => {
    const result = await findAllError();
    if (result.status == 200) {
      setErrorCode(result.data);
    } else {
      message.error(result.msg);
    }
  };
  //選擇工单帶出信息
  const getMo = async () => {
    if (tmpdata.length > 0) {
      message.error(intl.formatMessage(notfinishIntl) + intl.formatMessage(changetypeIntl));
      return;
    }
    form.setFieldsValue({ mo: null, brwstatus: null });
    const resultmo = await findBrwPackMo({ infostatus: form.getFieldValue('infostatus') });
    if (resultmo.status == 200) {
      setMo(resultmo.data);
    } else {
      message.error(resultmo.msg);
      return false;
    }
  };
  //獲取工單待打包數量
  const onChangeMo = async (e) => {
    form.setFieldsValue({ brwstatus: null, arylot: null });
    const resultmoqty = await getMoQty({ infostatus: form.getFieldValue('infostatus'), mo: e });
    if (resultmoqty.status == 200) {
      setMoQty(resultmoqty.data);
      // form.setFieldsValue({ information: '工单剩餘數量：' + JSON.parse(JSON.stringify(moqty)) });
      const info: String = '工单剩餘數量：' + resultmoqty.data;
      setInformation(info);
    } else {
      message.error(resultmoqty.msg);
    }
    const resultarylot = await findAryLotByMo({
      infostatus: form.getFieldValue('infostatus'),
      mo: e,
    });
    if (resultarylot.status == 200) {
      setArylot(resultarylot.data);
    } else {
      message.error(resultarylot.msg);
    }
  };
  //獲取退庫倉別
  const getStoreloc = async (e) => {
    if (e == 'BW1') {
      if (form.getFieldValue('congfigkey') == 'LOT') {
        setErrorCodeVisible(false);
        form.setFieldsValue({
          errorcode: null,
          brwproject: null,
        });
      }
      setBrwProjectVisible(false);
    } else if (e == 'BW2' || e == 'BW3') {
      if (form.getFieldValue('congfigkey') == 'LOT') {
        setErrorCodeVisible(true);
        form.setFieldsValue({
          brwproject: null,
        });
      }
      setBrwProjectVisible(false);
    } else if (e == 'BW4' || e == 'BW5') {
      if (form.getFieldValue('congfigkey') == 'LOT') {
        setErrorCodeVisible(true);
      }
      setBrwProjectVisible(true);
    }
    form.setFieldsValue({ storeloc: null });
    const resultloc = await findTypeByItemAndCode({ paramitem: 'BRWSTORELOC', paramcode: e });
    if (resultloc.status == 200) {
      setLoc(resultloc.data);
    } else {
      message.error(resultloc.msg);
    }
  };
  //LOT模式獲取半品料號
  const getcpninfo = async (e) => {
    const resultcpn = await getcpn({ mo: form.getFieldValue('mo'), status: e });
    if (resultcpn.data[0] == null) {
      form.setFieldsValue({ brwstatus: null });
      const info: String = '工单剩餘數量：' + moqty + '，半品料号：NULL';
      setInformation(info);
      message.error(e + '状态未维护半品料号');
      return;
    }
    if (resultcpn.status == 200) {
      setCpn(resultcpn.data[0]);
      const info: String = '工单剩餘數量：' + moqty + '，半品料号：' + resultcpn.data[0];
      setInformation(info);
    } else {
      message.error(resultcpn.msg);
    }
  };
  // 获取基础数据
  const getConfig = async () => {
    const result = await getData({
      apid: 'R02',
      configvalue: 'BRW',
      ip: storageUtils.getUser().ip,
    });
    if (result.status == 200) {
      if (result.data.length == 0) {
        setremarkVisible(true);
        message.error('');
        form.setFieldsValue({
          remark: 'IP：' + storageUtils.getUser().ip + '，' + '未綁定作業模式',
        });
      } else {
        form.setFieldsValue({ congfigkey: result.data[0].configkey });
      }
    } else {
      setremarkVisible(true);
      message.error(result.msg);
    }
    //獲取維修類型
    const type = await findAllType('BRWPROJECT');
    if (type.status == 200) {
      setType(type.data);
    } else {
      message.error(type.msg);
    }
    //獲取待料狀態
    const brwstatus = await findAllType('BRWSTATUS');
    if (brwstatus.status == 200) {
      setStatus(brwstatus.data);
    } else {
      message.error(brwstatus.msg);
    }
    //獲取打包類型
    const brwinfostatus = await findAllType('BRWINFOSTATUS');
    if (brwinfostatus.status == 200) {
      setInfoStatus(brwinfostatus.data);
    } else {
      message.error(brwinfostatus.msg);
    }
    if (form.getFieldValue('congfigkey') == 'PCS') {
      setlotVisible(false);
      setErrorCodeVisible(false);
    } else {
      setlotVisible(true);
      setErrorCodeVisible(true);
      getMo();
    }
  };
  //PCS刷入
  const getPcsTable = async (infoid: String) => {
    if (form.getFieldValue('remark') != null) {
      message.error('請先綁定IP才能作業');
      return;
    }
    if (form.getFieldValue('brwstatus') == null) {
      message.error('請選擇待料狀態');
      return;
    }
    console.log(form.getFieldValue('radio'));
    if (form.getFieldValue('radio') == null) {
      message.error('請選擇退庫類型');
      return;
    }
    if (form.getFieldValue('storeloc') == null) {
      message.error('請選擇退庫倉別');
      return;
    }
    if (form.getFieldValue('rejectedqty') != null) {
      if (tmpdata.length >= parseInt(form.getFieldValue('rejectedqty'))) {
        message.error('臨時表已到結箱數量，無法刷入');
        return;
      }
    }

    //check刷入數據
    const result = await getcheckusn({
      infoid: infoid,
      status: form.getFieldValue('brwstatus'),
      infostatus: form.getFieldValue('infostatus'),
    });

    console.log(result);
    if (result.status == 200) {
      let temp: any[] = JSON.parse(JSON.stringify(tmpdata));
      let exist1 = temp.find((e: any) => {
        return e.infoid == infoid;
      });
      if (exist1) {
        message.error('此产品已在列表中');
        return;
      }
      setCpn(result.data.cpn);
      // form.setFieldsValue({ cpn: result.data.cpn });
      const info: String = '半品料号：' + result.data.cpn;
      setInformation(info);
      let tmppcsshow: any = {};
      tmppcsshow.infoid = infoid;
      tmppcsshow.mo = result.data.mo;
      tmppcsshow.cpn = result.data.cpn;
      tmppcsshow.storeloc = form.getFieldValue('storeloc');
      tmppcsshow.errorcode = result.data.errorcode;
      tmppcsshow.status = form.getFieldValue('brwstatus');
      tmppcsshow.brwproject = form.getFieldValue('brwproject');
      tmppcsshow.brwtype = form.getFieldValue('radio');
      setTmpData([...tmpdata, tmppcsshow]);
      form.setFieldsValue({
        infoid: null,
      });
    } else {
      message.error(result.msg);
      return false;
    }
  };
  //Lot刷入
  const getLotTable = async (qty: String) => {
    if (form.getFieldValue('remark') != null) {
      message.error('請先綁定IP才能作業');
      return;
    }
    if (form.getFieldValue('mo') == null) {
      message.error('請選擇工單');
      return;
    }
    if (form.getFieldValue('arylot') == null) {
      message.error('請選擇內箱號');
      return;
    }
    if (form.getFieldValue('brwstatus') == null) {
      message.error('請選擇待料狀態');
      return;
    }
    if (form.getFieldValue('radio') == null) {
      message.error('請選擇退庫類型');
      return;
    }
    if (form.getFieldValue('storeloc') == null) {
      message.error('請選擇退庫倉別');
      return;
    }
    if (form.getFieldValue('radio') != 'BW1')
      if (form.getFieldValue('errorcode') == null) {
        message.error('請選擇不良代碼');
        return;
      }
    console.log(qty);
    if (qty == null) {
      message.error('請輸入數量');
      return;
    }
    let temp: any[] = JSON.parse(JSON.stringify(tmpdata));
    let exist1 = temp.find((e: any) => {
      return e.errorcode == form.getFieldValue('errorcode');
    });
    if (exist1) {
      message.error('此不良代碼已在列表中');
      return;
    }
    let num: number = 0;
    for (var i = 0; i < temp.length; i++) {
      num = num + parseInt(temp[i]['qty']);
    }
    if (num + parseInt(form.getFieldValue('qty')) > parseInt(JSON.parse(JSON.stringify(moqty)))) {
      message.error('結箱總數不能大于工單剩餘數量');
      return;
    }
    let tmppcsshow: any = {};
    tmppcsshow.qty = qty;
    tmppcsshow.mo = form.getFieldValue('mo');
    tmppcsshow.cpn = cpn;
    tmppcsshow.storeloc = form.getFieldValue('storeloc');
    tmppcsshow.errorcode = form.getFieldValue('errorcode');
    tmppcsshow.status = form.getFieldValue('brwstatus');
    tmppcsshow.brwproject = form.getFieldValue('brwproject');
    tmppcsshow.brwtype = form.getFieldValue('radio');
    tmppcsshow.arylot = form.getFieldValue('arylot');
    tmppcsshow.llstore = form.getFieldValue('llstore');
    setTmpData([...tmpdata, tmppcsshow]);
    console.log(tmppcsshow);
    console.log(tmppcsshow);
    form.setFieldsValue({
      qty: null,
    });
  };
  //Lot作業模式
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage(noIntl),
      dataIndex: 'index',
      valueType: 'index',
      width: '50px',
    },
    {
      title: intl.formatMessage(moIntl),
      dataIndex: 'mo',
    },
    {
      title: '料號',
      dataIndex: 'cpn',
    },
    {
      title: '倉別',
      dataIndex: 'storeloc',
    },
    {
      title: intl.formatMessage(errorcodeIntl),
      dataIndex: 'errorcode',
    },
    {
      title: '數量',
      dataIndex: 'qty',
    },
    {
      title: '帶料狀態',
      dataIndex: 'status',
    },
    {
      title: '维修项目',
      dataIndex: 'brwproject',
    },
    {
      title: intl.formatMessage(operationIntl),
      key: 'option',

      // width: 120,
      valueType: 'option',
      render: (_, record) => [
        // <Button
        //   type="text"
        //   icon={<EditOutlined />}
        //   onClick={() => {
        //     // setEditRow(record);
        //     // setVisible(true);
        //   }}
        // ></Button>,
        <Popconfirm
          title={intl.formatMessage(deleteornoIntl)}
          onConfirm={() => {
            let temp: [] = JSON.parse(JSON.stringify(tmpdata));
            let removeAfter = temp.filter((e: any) => {
              return e.errorcode != record.errorcode;
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
  //PCS作業模式
  const columnspcs: ProColumns[] = [
    {
      title: intl.formatMessage(noIntl),
      dataIndex: 'index',
      valueType: 'index',
      width: '50px',
    },
    {
      title: intl.formatMessage(moIntl),
      dataIndex: 'mo',
    },
    {
      title: '料號',
      dataIndex: 'cpn',
    },
    {
      title: '產品',
      dataIndex: 'infoid',
    },
    {
      title: '倉別',
      dataIndex: 'storeloc',
    },
    {
      title: intl.formatMessage(errorcodeIntl),
      dataIndex: 'errorcode',
    },

    {
      title: '帶料狀態',
      dataIndex: 'status',
    },
    {
      title: '维修项目',
      dataIndex: 'brwproject',
    },
    {
      title: intl.formatMessage(operationIntl),
      key: 'option',

      // width: 120,
      valueType: 'option',
      render: (_, record) => [
        // <Button
        //   type="text"
        //   icon={<EditOutlined />}
        //   onClick={() => {
        //     // setEditRow(record);
        //     // setVisible(true);
        //   }}
        // ></Button>,
        <Popconfirm
          title={intl.formatMessage(deleteornoIntl)}
          onConfirm={() => {
            let temp: [] = JSON.parse(JSON.stringify(tmpdata));
            let removeAfter = temp.filter((e: any) => {
              return e.infoid != record.infoid;
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
  //確定結箱
  async function submit() {
    if (tmpdata.length == 0) {
      message.error(intl.formatMessage(inputfirstIntl));
      return;
    }

    const result = await insertdata({
      data: tmpdata,
      infostatus: form.getFieldValue('infostatus'),
      status: form.getFieldValue('brwstatus'),
      username: storageUtils.getUser().name,
      workstation: storageUtils.getUser().ip,
    });
    if (result.status == 200) {
      message.success(result.msg);
      form.setFieldsValue({
        rejectedid: result.data,
      });
      setTmpData([]);
      onChangeMo(form.getFieldValue('mo'));
      return true;
    } else {
      message.error(result.msg);
      return false;
    }
  }

  return (
    <PageContainer title={false}>
      <ProForm
        form={form}
        layout="horizontal"
        submitter={false}
        initialValues={{ infostatus: 'B' }}
      >
        {/* <div style={style}> */}
        <Row gutter={12}>
          <Col className="gutter-row" span={10}>
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
              <Row>
                <Col span={8}>
                  <ProFormText width="sm" name="congfigkey" label="作業模式" readonly />
                </Col>
                <Col span={16}>
                  <ProFormRadio.Group
                    name="infostatus"
                    options={infostatus}
                    fieldProps={{
                      onChange: (e) => {
                        getMo();
                      },
                    }}
                    disabled={tmpdata.length > 0}
                  />
                </Col>
              </Row>
              {lotVisible ? (
                <Row>
                  <Col span={12}>
                    <div style={{ float: 'right' }}>
                      <ProFormSelect
                        width="sm"
                        name="mo"
                        label={intl.formatMessage(moIntl)}
                        options={mo}
                        fieldProps={{
                          onChange: (e) => {
                            onChangeMo(e);
                          },
                        }}
                        disabled={tmpdata.length > 0}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ float: 'right' }}></div>
                  </Col>
                </Row>
              ) : (
                <></>
              )}

              <Row>
                <Col span={12}>
                  <div style={{ float: 'right' }}>
                    <ProFormSelect
                      width="sm"
                      name="brwstatus"
                      label="待料狀態"
                      options={status}
                      fieldProps={{
                        onChange: (e) => {
                          if (form.getFieldValue('congfigkey') == 'LOT') {
                            getcpninfo(e);
                          }
                        },
                      }}
                      disabled={tmpdata.length > 0}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ float: 'right' }}>
                    {lotVisible ? (
                      <ProFormSelect
                        width="sm"
                        name="arylot"
                        label="內箱號"
                        options={arylot}
                        disabled={tmpdata.length > 0}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </Col>
              </Row>

              <ProForm.Group>
                <ProFormRadio.Group
                  name="radio"
                  // layout="vertical"
                  label="退庫類型"
                  options={type}
                  fieldProps={{
                    onChange: (e) => {
                      getStoreloc(e.target.value);
                    },
                  }}
                  disabled={tmpdata.length > 0}
                />
              </ProForm.Group>
              <Row>
                <Col span={12}>
                  <div style={{ float: 'right' }}>
                    <ProFormSelect
                      width="sm"
                      name="storeloc"
                      label="退庫倉別"
                      options={loc}
                      fieldProps={{
                        onChange: (e) => {
                          getErrorCode();
                        },
                      }}
                      disabled={tmpdata.length > 0}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ float: 'right' }}>
                    {errorcodeVisible ? (
                      <ProFormSelect
                        width="sm"
                        name="errorcode"
                        label="不良代碼"
                        options={errorcode}
                      />
                    ) : (
                      <></>
                    )}
                    {lotVisible ? (
                      <></>
                    ) : (
                      <ProFormText width="sm" name="rejectedqty" label="結箱數量" />
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <div style={{ float: 'right' }}>
                    {brwprojectVisible ? (
                      <ProFormSelect
                        width="sm"
                        name="brwproject"
                        label="维修项目"
                        // options={brwstatus}
                        request={async () => [
                          { label: '上POL', value: '上POL' },
                          { label: '下POL', value: '下POL' },
                          { label: '上下POL', value: '上下POL' },
                          { label: 'BL', value: 'BL' },
                        ]}
                        disabled={tmpdata.length > 0}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ float: 'right' }}>
                    {lotVisible ? (
                      <ProFormDigit
                        width="sm"
                        name="qty"
                        label="刷入數量"
                        fieldProps={{
                          onPressEnter: (e) => {
                            getLotTable(form.getFieldValue('qty'));
                          },
                        }}
                      />
                    ) : (
                      <></>
                    )}
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
                  </div>
                </Col>
              </Row>
              <Row>
                <ProFormText
                  width="sm"
                  name="information"
                  label="信息："
                  fieldProps={{ value: information?.toString() }}
                  readonly
                />
                {/* <Col span={12}>
                  <ProFormText width="sm" name="cpn" label="半品料號" readonly />
                </Col>
                <Col span={12}>
                  {lotVisible ? (
                    <ProFormText width="sm" name="moqty" label="剩餘數量" readonly />
                  ) : (
                    <></>
                  )}
                </Col> */}
              </Row>
              <ProForm.Group>
                <ProFormText width="sm" name="rejectedid" label="捆包箱號" readonly />
              </ProForm.Group>
              <ProForm.Group>
                <Button
                  // type="primary"
                  className="ant-btn"
                  key="reset"
                  onClick={() => {
                    setTmpData([]);
                  }}
                >
                  {intl.formatMessage(resetIntl)}
                </Button>
                <Button
                  type="primary"
                  className="ant-btn ant-btn-primary"
                  key="submit"
                  onClick={submit}
                >
                  {intl.formatMessage(submitIntl)}
                </Button>
              </ProForm.Group>
            </div>
          </Col>
          <Col className="gutter-row" span={14}>
            <div style={style}>
              {lotVisible ? (
                <ProTable
                  // tableStyle={{ width: '520px', marginTop: '20px' }}
                  pagination={{ pageSize: 20 }}
                  scroll={{ y: 500 }}
                  size="small"
                  actionRef={actionRef}
                  columns={columns}
                  search={false}
                  // toolBarRender={false}
                  headerTitle="已刷入列表"
                  dataSource={tmpdata}
                  rowKey="infoid"
                />
              ) : (
                <ProTable
                  // tableStyle={{ width: '520px', marginTop: '20px' }}
                  pagination={{ pageSize: 20 }}
                  scroll={{ y: 500 }}
                  size="small"
                  actionRef={actionRef}
                  columns={columnspcs}
                  search={false}
                  // toolBarRender={false}
                  headerTitle="已刷入列表"
                  dataSource={tmpdata}
                  rowKey="infoid"
                />
              )}
            </div>
          </Col>
        </Row>
        {/* </div> */}
      </ProForm>
    </PageContainer>
  );
};
