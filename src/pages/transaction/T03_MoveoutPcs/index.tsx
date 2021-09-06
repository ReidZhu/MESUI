import React, { useEffect, useRef, useState } from 'react';
import { Form, message, Radio, Divider } from 'antd';
import { useIntl } from 'umi';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { DeleteOutlined } from '@ant-design/icons';
import ProForm, { ProFormText, ProFormSelect, ProFormRadio } from '@ant-design/pro-form';
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
  inputerrorcodeIntl,
  brushedinlistIntl,
  notpcspostIntl,
} from '@/utils/intl';
import storageUtils from '@/utils/storageUtils';
import { getData, findAllMachine, findAllErrorCode, findMesInfo, insertdata } from './api';
import { Row, Col, Button, Popconfirm } from 'antd';
import { fromPairs } from 'lodash';
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
  //单选默认值
  // const [T03type, setT03type] = React.useState('moveout');
  // 隱藏不良代码
  const [errorcodeVisible, seterrorcodeVisible] = useState(false);
  // 隱藏未维护提示
  const [remarkVisible, setremarkVisible] = useState(false);
  //國際化
  const intl = useIntl();
  const [resultdata, setResultData] = useState({});
  // 獲取基础数据
  const [machine, setMachine] = useState<[]>([]);
  //拋送后台數據
  const [tmpdata, setTmpData] = useState<any[]>([]);
  //臨時列表Pcs數據
  const [tmpshowdata, setTmpShowData] = useState<any[]>([]);
  // 操作Table
  const actionRef = useRef<ActionType>();
  const [errorcode, setErrorCode] = useState<any[]>([]);
  const [form] = Form.useForm();
  useEffect(() => {
    getConfig();
  }, []);

  //单选触发
  const onChange = (e) => {
    // console.log('radio checked', e.target.value);
    if (tmpdata.length > 0) {
      message.error(intl.formatMessage(notfinishIntl) + intl.formatMessage(changetypeIntl));
      return;
    }
    // setT03type(e);
    if (e == 'moveout') {
      seterrorcodeVisible(false);
    } else {
      seterrorcodeVisible(true);
    }
  };
  //录入临时表
  const getTable = async (inputinfoid: String) => {
    //檢查是否選擇機台號
    if (form.getFieldValue('machineid') == null) {
      form.setFieldsValue({ infoid: null });
      message.error(intl.formatMessage(selectIntl) + intl.formatMessage(machineidIntl));
      return;
    }
    //check刷入數據
    const result = await findMesInfo({
      infoid: inputinfoid,
      stage: form.getFieldValue('stage'),
      // isPcs: 'Y',
    });
    form.setFieldsValue({ infoid: null });

    if (result.status == 200) {
      let temp: any[] = JSON.parse(JSON.stringify(tmpdata));
      let tempshow: any[] = JSON.parse(JSON.stringify(tmpshowdata));
      if (result.data.infotype != 'PCS') {
        message.error(intl.formatMessage(notpcspostIntl));
        return;
      }
      let exist = tempshow.find((e: any) => {
        return e.infoid == inputinfoid;
      });
      if (exist) {
        message.error(intl.formatMessage(alreadytmpIntl));
        return;
      }

      form.setFieldsValue({
        mo: result.data.mo,
        upn: result.data.upn,
        stageinfo: result.data.stage,
        model: result.data.model,
      });
      let exist1 = tempshow.find((e: any) => {
        return e.stage != result.data.stage || e.upn != result.data.upn;
      });
      if (exist1) {
        message.error(intl.formatMessage(togetherIntl));
        return;
      }

      if (form.getFieldValue('radio') == 'errorcode') {
        if (form.getFieldValue('errorcode') == null) {
          message.error(intl.formatMessage(selectIntl) + intl.formatMessage(errorcodeIntl));
          return;
        }
        // result.data.errorcode = form.getFieldValue('errorcode');
        let tempng: [] = [];
        let tmpng: any = {};
        (tmpng.errorcode = form.getFieldValue('errorcode')), (tmpng.ngqty = '1');
        tempng.push(JSON.parse(JSON.stringify(tmpng)));
        temp.push(
          JSON.parse(
            JSON.stringify({
              infoid: result.data.infoid,
              machineid: form.getFieldValue('machineid'),
              ng: tempng,
              mstage: result.data.stage,
              operuser: storageUtils.getUser().name,
            }),
          ),
        );
        result.data.errorcode = form.getFieldValue('errorcode');
      } else {
        let tempng: [] = [];
        temp.push(
          JSON.parse(
            JSON.stringify({
              infoid: result.data.infoid,
              machineid: form.getFieldValue('machineid'),
              ng: tempng,
              mstage: result.data.stage,
              operuser: storageUtils.getUser().name,
            }),
          ),
        );
      }

      tempshow.push(JSON.parse(JSON.stringify(result.data)));
      setTmpShowData(tempshow);
      setTmpData(temp);
    } else {
      message.error(result.msg);
      return false;
    }
  };

  // 获取基础数据
  const getConfig = async () => {
    // console.log(form.getFieldValue('radio'));
    const result = await getData({ apid: 'T03', ip: storageUtils.getUser().ip });
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
        const resultmachine = await findAllMachine({ stage: stage, line: machine });
        setMachine(resultmachine.data);
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
    //獲取不良代碼
    const errorcode = await findAllErrorCode(form.getFieldValue('stage'));
    if (errorcode.status == 200) {
      setErrorCode(errorcode.data);
    } else {
      message.error(errorcode.msg);
    }
  };

  //單Pcs作業模式
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage(noIntl),
      dataIndex: 'index',
      valueType: 'index',
      width: '50px',
      // render: () => <DragHandle />,
    },
    {
      title: intl.formatMessage(Model),
      dataIndex: 'model',
      // render: () => <DragHandle />,
    },
    {
      title: intl.formatMessage(usnIntl),
      dataIndex: 'infoid',
      // valueType: 'select',
    },
    {
      title: intl.formatMessage(moIntl),
      dataIndex: 'mo',
      // valueType: 'select',
    },
    {
      title: intl.formatMessage(Upn),
      dataIndex: 'upn',
    },
    {
      title: intl.formatMessage(RouteName),
      // hideInSearch: true,
      dataIndex: 'routename',
    },
    {
      title: intl.formatMessage(stageIntl),
      dataIndex: 'stage',
    },
    {
      title: intl.formatMessage(errorcodeIntl),
      dataIndex: 'errorcode',
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

  //確定過賬
  async function moveout() {
    if (tmpdata.length == 0) {
      message.error(intl.formatMessage(inputfirstIntl));
      return;
    }
    const result = await insertdata({
      data: tmpdata,
      line: form.getFieldValue('line'),
      // machineid: form.getFieldValue('machineid'),
      ip: storageUtils.getUser().ip,
      stage: form.getFieldValue('stage'),
      createuser: storageUtils.getUser().name,
    });
    // console.log(result);
    if (result.status == 200) {
      message.success(result.msg);
      form.setFieldsValue({
        mo: null,
        upn: null,
        stageinfo: null,
        model: null,
      });
      setTmpData([]);
      setTmpShowData([]);
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
        initialValues={{ radio: 'moveout' }}
      >
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
              <ProForm.Group>
                {/* <Radio.Group onChange={onChange} value={T03type}>
                  <Radio value={'moveout'}>{intl.formatMessage(postingIntl)}</Radio>
                  <Radio value={'errorcode'}>打不良</Radio>
                </Radio.Group> */}
                <ProFormRadio.Group
                  // value={T03type}
                  name="radio"
                  request={async () => [
                    { label: intl.formatMessage(postingIntl), value: 'moveout' },
                    { label: intl.formatMessage(inputerrorcodeIntl), value: 'errorcode' },
                  ]}
                  fieldProps={{
                    onChange: (e) => {
                      onChange(e.target.value);
                    },
                  }}
                  disabled={tmpdata.length > 0}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormSelect
                  width="sm"
                  name="machineid"
                  label={intl.formatMessage(machineidIntl)}
                  options={machine}
                  // fieldProps={{
                  //   onChange: (e) => {
                  //     if (tmpdata.length > 0) {
                  //       message.error(
                  //         intl.formatMessage(notfinishIntl) + intl.formatMessage(changemachineIntl),
                  //       );
                  //       return;
                  //     }
                  //   },
                  // }}
                />
              </ProForm.Group>
              {errorcodeVisible ? (
                <ProForm.Group>
                  <ProFormSelect
                    width="sm"
                    name="errorcode"
                    label={intl.formatMessage(errorcodeIntl)}
                    options={errorcode}
                  />
                </ProForm.Group>
              ) : (
                <></>
              )}
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
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText width="sm" name="mo" label={intl.formatMessage(moIntl)} readonly />
                <ProFormText width="sm" name="upn" label={intl.formatMessage(Upn)} readonly />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText
                  width="sm"
                  name="stageinfo"
                  label={intl.formatMessage(stageIntl)}
                  readonly
                />
                <ProFormText width="sm" name="model" label={intl.formatMessage(Model)} readonly />
              </ProForm.Group>
              <ProForm.Group>
                <Button
                  // type="primary"
                  className="ant-btn"
                  key="reset"
                  onClick={() => {
                    form.setFieldsValue({
                      mo: null,
                      upn: null,
                      stageinfo: null,
                      model: null,
                    });
                    setTmpData([]);
                    setTmpShowData([]);
                  }}
                >
                  {intl.formatMessage(resetIntl)}
                </Button>
                <Button
                  type="primary"
                  className="ant-btn ant-btn-primary"
                  key="submit"
                  onClick={moveout}
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
                dataSource={tmpshowdata}
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
