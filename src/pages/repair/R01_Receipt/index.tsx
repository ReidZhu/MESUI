import React, { useEffect, useState } from 'react';
import { Card, Col, Form, Input, message, Popconfirm, Radio, Row } from 'antd';
import { Button } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { query, check, getData } from './service';
import { commonResult } from '@/utils/resultUtils';
import { DeleteOutlined } from '@ant-design/icons';
import {
  BatchlotIntl,
  BatchnotypeIntl,
  BatchtypeIntl,
  brushIntl,
  brushnumberIntl,
  checksureIntl,
  deleteornoIntl,
  errorcodeIntl,
  InfostatusIntl,
  inputIntl,
  lotIntl,
  Model,
  moIntl,
  monoIntl,
  notmaintainedIntl,
  nullIntl,
  operationIntl,
  palletgiveIntl,
  palletIntl,
  parameterIntl,
  productIntl,
  qtyIntl,
  repetitionIntl,
  selectIntl,
  stageIntl,
  StagenoIntl,
  StatusnoIntl,
  storageIntl,
  Upn,
} from '@/utils/intl';
import { useIntl } from 'umi';
import ProForm, { ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import storageUtils from '@/utils/storageUtils';
import { result } from 'lodash';
import { getParameters } from '@/services/select';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default () => {
  const intl = useIntl();
  const [form] = Form.useForm();

  // 列表数据
  const [dataSource, setDataSource] = useState<any>([]);

  const [val, setValue] = useState<any>();
  //显示隐藏
  const [value, setValues] = useState('block');
  //IP
  const [ip, setIP] = useState<any>(
    'IP：' + storageUtils.getUser().ip + '，' + intl.formatMessage(notmaintainedIntl),
  );
  // 站点
  const [stage, setStage] = useState<any>('-');

  const [parameters, setParameters] = useState<[]>([]);

  useEffect(() => {
    getConfig();
    getParameter();
  }, []);

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage(productIntl),
      key: 'infoid',
      dataIndex: 'infoid',
    },
    {
      title: intl.formatMessage(moIntl),
      key: 'mo',
      dataIndex: 'mo',
    },
    {
      title: intl.formatMessage(stageIntl),
      key: 'stage',
      dataIndex: 'stage',
    },
    {
      title: intl.formatMessage(errorcodeIntl),
      key: 'errorcode',
      dataIndex: 'errorcode',
    },
    {
      title: intl.formatMessage(qtyIntl),
      key: 'brwqty',
      dataIndex: 'brwqty',
    },
    {
      title: intl.formatMessage(operationIntl),
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm
          title={intl.formatMessage(deleteornoIntl)}
          onConfirm={() => {
            setDataSource(
              dataSource.filter((item: any) => {
                return item.boxid != record.boxid;
              }),
            );
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" danger icon={<DeleteOutlined />}></Button>
        </Popconfirm>,
      ],
    },
  ];

  //获取站点
  const getParameter = async () => {
    const Parameters = await getParameters('BRWSTATUS');
    if (Parameters.status == 200) {
      setParameters(Parameters.data);
    } else {
      message.error(Parameters.msg);
    }
  };

  // 获取基础数据
  const getConfig = async () => {
    const result = await getData({ apid: 'R01', ip: storageUtils.getUser().ip });
    if (result.status == 200) {
      if (result.data.length == 1) {
        if (result.data[0].configkey == 'STAGE') {
          setValues('none');
          setIP('IP：' + storageUtils.getUser().ip);
          setStage(result.data[0].configvalue);
        }
      }
      // setConfig(result.data);
    } else {
      message.error(result.msg);
    }
  };

  async function onKeyup() {
    const result = await query({ infoid: val });
    console.log(result, 'result');
    commonResult(
      result,
      (data: any) => {
        for (const item in dataSource) {
          if (dataSource != null && dataSource != undefined) {
            if (dataSource[item].mo != result.data.mo) {
              return message.error(intl.formatMessage(monoIntl));
            } else if (dataSource[item].stage != result.data.stage) {
              return message.error(intl.formatMessage(StagenoIntl));
            }
          }
          if (dataSource[item].infoid === result.data.infoid) {
            return message.error(intl.formatMessage(repetitionIntl));
          }
        }
        //setDataSource(result.data);
        setDataSource([...dataSource, ...result.data]);
      },
      false,
    );
    setValue('');
  }
  async function batch() {
    const username = storageUtils.getUser().name;
    const workstation = storageUtils.getUser().ip;
    const brwInfoVoList = dataSource.map((obj) => {
      const info: any = {};
      info.infoid = obj.infoid;
      info.stage = obj.stage;
      info.errorcode = obj.errorcode;
      return info;
    });
    if (brwInfoVoList.length == 0) {
      message.error(intl.formatMessage(nullIntl));
      return;
    }
    const result = await check({
      brwInfoVoList: brwInfoVoList,
      username: username,
      workstation: workstation,
    });
    console.log(result);
    if (result.status == 200) {
      message.success(result.msg);
    } else {
      message.error(result.msg);
    }
    setDataSource([]);
  }
  return (
    <>
      <PageContainer title={false}>
        <Row gutter={12}>
          <Col xl={6} lg={6} md={12} sm={12}>
            <Card style={{ height: '530px' }}>
              <ProForm form={form} layout="horizontal" submitter={false}>
                <Row style={{ display: value }}>
                  <Col>
                    <ProForm.Group>
                      <ProFormText
                        width="sm"
                        name="ip"
                        formItemProps={{ style: { color: 'red' } }}
                        fieldProps={{ value: ip }}
                        readonly
                      />
                    </ProForm.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <ProForm.Group>
                      <ProFormText
                        width="sm"
                        name="stage"
                        label={intl.formatMessage(stageIntl)}
                        // formItemProps={{ style: { color: 'red' } }}
                        fieldProps={{ value: stage }}
                        readonly
                      />
                    </ProForm.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <ProForm.Group>
                      <ProFormSelect
                        options={parameters}
                        width="md"
                        name="parameter"
                        label={intl.formatMessage(parameterIntl)}
                        placeholder={intl.formatMessage(selectIntl)}
                      />
                    </ProForm.Group>
                  </Col>
                </Row>
                <Row>
                  <Col style={{ width: '100%' }}>
                    <span className="lable">{intl.formatMessage(brushIntl)}:</span>
                    <Input
                      className="input"
                      value={val}
                      placeholder={intl.formatMessage(inputIntl)}
                      onChange={(e) => setValue(e.target.value)}
                      onPressEnter={(e) => onKeyup()}
                    />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col>
                    <span className="lable"> {intl.formatMessage(brushnumberIntl)} </span>
                    <br />
                    {dataSource.length}
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col>
                    <Button key="list" type="primary" onClick={batch}>
                      {intl.formatMessage(checksureIntl)}
                    </Button>
                  </Col>
                </Row>
              </ProForm>
            </Card>
          </Col>
          <Col xl={18} lg={18} md={36} sm={36}>
            <ProTable
              columns={columns}
              dataSource={dataSource}
              rowKey="usn"
              search={false}
              style={{ height: '530px' }}
            />
          </Col>
        </Row>
      </PageContainer>
    </>
  );
};
