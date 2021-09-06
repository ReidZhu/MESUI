import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Form, Input, message, Popconfirm, Radio, Row } from 'antd';
import { Button } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { saveLabelRule, findLabelRule, findLabelRuleDetail } from './service';
import { commonResult } from '@/utils/resultUtils';
import { DeleteOutlined } from '@ant-design/icons';
import {
  checksureIntl,
  createtimeIntl,
  createuserIntl,
  deleteornoIntl,
  flagIntl,
  formatIntl,
  inputIntl,
  keylengthIntl,
  keyvalueIntl,
  labelruledetailIntl,
  labelruleIntl,
  lengthIntl,
  monoIntl,
  noIntl,
  nullIntl,
  operationIntl,
  parameterIntl,
  PlengthIntl,
  PrulenameIntl,
  repetitionIntl,
  resetonIntl,
  ruleIntl,
  rulenameIntl,
  ruleselectIntl,
  ruletypeIntl,
  selectIntl,
  StagenoIntl,
  stageorderIntl,
  typeIntl,
} from '@/utils/intl';
import { formatMessage, useIntl } from 'umi';
import ProForm, { ModalForm, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import storageUtils from '@/utils/storageUtils';
import { result } from 'lodash';
import { findAllReseton, findAllRuletype, getParameters } from '@/services/select';
import { formatparams } from '@/utils/utils';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export type rules = {
  ruleitem?: number;
  ruletype?: number;
  keylength?: string;
  keyvalue?: string;
  reseton?: string;
  stageorder?: number;
  format?: string;
};

export default () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  // 列表数据
  const [dataSource, setDataSource] = useState<any>([]);
  const [dataSource1, setDataSource1] = useState<any>([]);

  const [ruletypes, setRuletypes] = useState<[]>([]);
  const [resetons, setResetons] = useState<[]>([]);
  const [flag, setFlag] = useState(0);

  //显示隐藏
  const [value, setValue] = useState('none');
  const [ton, setTon] = useState('none');

  //modal显示隐藏
  const [visible, setVisible] = useState(false);

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage(noIntl),
      key: 'ruleitem',
      dataIndex: 'ruleitem',
      valueType: 'index',
      width: 100,
    },
    {
      title: intl.formatMessage(ruletypeIntl),
      key: 'ruletype',
      dataIndex: 'ruletype',
      width: 100,
      valueEnum: {
        P: { text: '固定值' },
        X: { text: '变数' },
        0: { text: '流水码' },
        Y: { text: '年' },
        M: { text: '月' },
        D: { text: '日' },
        W: { text: '周' },
      },
    },
    {
      title: intl.formatMessage(keylengthIntl),
      key: 'keylength',
      dataIndex: 'keylength',
      width: 100,
    },
    {
      title: intl.formatMessage(keyvalueIntl),
      key: 'keyvalue',
      dataIndex: 'keyvalue',
      width: 100,
    },
    {
      title: intl.formatMessage(resetonIntl),
      key: 'reseton',
      dataIndex: 'reseton',
      width: 100,
      valueEnum: {
        0: { text: '每日清空' },
        1: { text: '每月清空' },
        2: { text: '每周清空' },
      },
    },
    {
      title: intl.formatMessage(stageorderIntl),
      dataIndex: 'stageorder',
      hideInTable: true,
      width: 100,
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
                return item.stageorder != record.stageorder;
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

  const columns1: ProColumns[] = [
    {
      title: intl.formatMessage(rulenameIntl),
      key: 'rulename',
      dataIndex: 'rulename',
      width: 200,
    },
    {
      title: intl.formatMessage(formatIntl),
      key: 'format',
      dataIndex: 'format',
      width: 200,
    },
    {
      title: intl.formatMessage(flagIntl),
      key: 'useflag',
      dataIndex: 'useflag',
      width: 50,
      valueEnum: {
        0: { text: 'N', status: 'Error' },
        1: { text: 'Y', status: 'Success' },
      },
    },
    {
      title: intl.formatMessage(createuserIntl),
      key: 'createuser',
      dataIndex: 'createuser',
      width: 150,
    },
    {
      title: intl.formatMessage(createtimeIntl),
      key: 'createtime',
      dataIndex: 'createtime',
      width: 150,
    },
  ];

  useEffect(() => {
    getAllRuletype();
    getAllReseton();
  }, []);

  useEffect(() => {}, [dataSource1]);

  //获取规则类型
  const getAllRuletype = async () => {
    const stages = await findAllRuletype('');
    if (stages.status == 200) {
      setRuletypes(stages.data);
    } else {
      message.error(stages.msg);
    }
  };
  //获取流水码类型
  const getAllReseton = async () => {
    const stages = await findAllReseton('RESETON');
    if (stages.status == 200) {
      setResetons(stages.data);
    } else {
      message.error(stages.msg);
    }
  };

  async function select() {
    let rule = form.getFieldValue('rulenamedetail');
    const result = await findLabelRule({ rulename: rule });
    if (result.status == 200) {
      setDataSource1(result.data);
    } else {
      message.error(result.msg);
    }
    const result1 = await findLabelRuleDetail({ rulename: rule });
    if (result1.status == 200) {
      setDataSource(result1.data);
    } else {
      message.error(result1.msg);
    }
    setFlag(1);
  }

  async function ensure() {
    //判断是查询还是添加规则
    let temp: [] = [];
    if (flag == 1) {
      setFlag(0);
      actionRef.current?.reload();
    } else {
      temp = JSON.parse(JSON.stringify(dataSource));
    }
    //const username = storageUtils.getUser().name;
    let rules: any = {};
    let mat: any = '';
    rules.stageorder = temp.length + 1;

    rules.ruletype = form.getFieldValue('ruletype');
    //判断类型是否为空
    if (rules.ruletype == undefined || rules.ruletype == '') {
      message.error(intl.formatMessage(lengthIntl));
      return;
    }
    rules.keylength = parseInt(form.getFieldValue('keylength'));
    //判断长度是否为空
    debugger;
    if (rules.keylength == undefined || rules.keylength == 0 || isNaN(rules.keylength)) {
      message.error(intl.formatMessage(PlengthIntl));
      return;
    }

    rules.keyvalue = form.getFieldValue('keyvalue');
    rules.reseton = form.getFieldValue('reseton');
    if (rules.keyvalue == undefined) {
      rules.keyvalue = '';
    }
    if (rules.keyvalue != '' && rules.keylength < rules.keyvalue.length) {
      return message.error(intl.formatMessage(lengthIntl));
    } else if (rules.keyvalue != '' && rules.keylength > rules.keyvalue.length) {
      for (let i = 0; i < rules.keylength - rules.keyvalue.length; i++) {
        mat += '0';
      }
      mat += rules.keyvalue;
    } else if (rules.keyvalue != '' && rules.keylength == rules.keyvalue.length) {
      mat += rules.keyvalue;
    } else {
      for (let i = 0; i < rules.keylength; i++) {
        mat += rules.ruletype;
      }
    }
    rules.format = formatparams(mat);

    temp.push(JSON.parse(JSON.stringify(rules)));

    setDataSource(temp);
    form.resetFields();
  }
  async function batch(rulename) {
    debugger;
    const username = storageUtils.getUser().name;
    //const rulename = form.getFieldValue('rulename');
    if (rulename == undefined || rulename == '') {
      message.error(intl.formatMessage(PrulenameIntl));
      return;
    }
    let i = 1;
    const List = dataSource.map((obj) => {
      obj.ruleitem = i++;
      return obj;
    });
    if (List.length == 0) {
      message.error(intl.formatMessage(nullIntl));
      return;
    }
    const result = await saveLabelRule({
      data: List,
      username: username,
      rulename: rulename,
    });
    console.log(result);
    if (result.status == 200) {
      message.success(result.msg);
    } else {
      message.error(result.msg);
    }
    setDataSource([]);
    actionRef.current?.reload();
  }
  return (
    <>
      <PageContainer title={false}>
        <Row gutter={12}>
          <Col xl={6} lg={6} md={12} sm={12}>
            <Card style={{ height: '800px' }}>
              <ProForm form={form} layout="horizontal" submitter={false}>
                <Row>
                  <Col>
                    <ProForm.Group>
                      <ProFormText
                        width="md"
                        name="rulenamedetail"
                        label={intl.formatMessage(rulenameIntl)}
                        placeholder={intl.formatMessage(inputIntl)}
                      />
                    </ProForm.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button key="lists" type="primary" onClick={select}>
                      {intl.formatMessage(ruleselectIntl)}
                    </Button>
                  </Col>
                </Row>
                {/* <Row>
                  <Col>
                    <ProForm.Group>
                      <ProFormText
                        width="md"
                        name="rulename"
                        label={intl.formatMessage(rulenameIntl)}
                        placeholder={intl.formatMessage(inputIntl)}
                      />
                    </ProForm.Group>
                  </Col>
                </Row> */}
                <Row>
                  <Col>
                    <ProForm.Group>
                      <ProFormSelect
                        options={ruletypes}
                        width="md"
                        name="ruletype"
                        label={intl.formatMessage(ruletypeIntl)}
                        placeholder={intl.formatMessage(selectIntl)}
                        fieldProps={{
                          onChange: (e) => {
                            if (e == 'P') {
                              setValue('block');
                              setTon('none');
                            } else if (e == 0) {
                              setValue('none');
                              setTon('block');
                            } else {
                              setValue('none');
                              setTon('none');
                            }
                          },
                        }}
                      />
                    </ProForm.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <ProForm.Group>
                      <ProFormText
                        width="md"
                        name="keylength"
                        label={intl.formatMessage(keylengthIntl)}
                        placeholder={intl.formatMessage(inputIntl)}
                      />
                    </ProForm.Group>
                  </Col>
                </Row>
                <Row style={{ display: value }}>
                  <Col>
                    <ProForm.Group>
                      <ProFormText
                        width="md"
                        name="keyvalue"
                        label={intl.formatMessage(keyvalueIntl)}
                        placeholder={intl.formatMessage(inputIntl)}
                      />
                    </ProForm.Group>
                  </Col>
                </Row>
                <Row style={{ display: ton }}>
                  <Col>
                    <ProForm.Group>
                      <ProFormSelect
                        options={resetons}
                        width="md"
                        name="reseton"
                        label={intl.formatMessage(resetonIntl)}
                        placeholder={intl.formatMessage(selectIntl)}
                      />
                    </ProForm.Group>
                  </Col>
                </Row>
                <Row>
                  <Col style={{ marginRight: 5 }}>
                    <Button key="lists" type="primary" onClick={ensure}>
                      {intl.formatMessage(typeIntl)}
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      key="rule"
                      type="primary"
                      onClick={() => {
                        setVisible(true);
                      }}
                    >
                      {intl.formatMessage(ruleIntl)}
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
              search={false}
              style={{ height: '400px' }}
              scroll={{ y: '250px' }}
              headerTitle={intl.formatMessage(labelruledetailIntl)}
              pagination={{ defaultPageSize: 5 }}
            />
            <ProTable
              actionRef={actionRef}
              columns={columns1}
              dataSource={dataSource1}
              search={false}
              style={{ height: '400px' }}
              scroll={{ y: 250 }}
              headerTitle={intl.formatMessage(labelruleIntl)}
              pagination={{ defaultPageSize: 5 }}
              request={async (params = {}, sort, filter) => {
                const result = await findLabelRule('');
                commonResult(
                  result,
                  (data: any) => {
                    setDataSource1(data);
                  },
                  false,
                );
                return { data: dataSource1 };
              }}
            />
          </Col>
        </Row>
      </PageContainer>
      <ModalForm<{
        rulename: string;
      }>
        title={intl.formatMessage(rulenameIntl)}
        width={500}
        //initialValues={editRow}
        //layout='horizontal'
        visible={visible}
        modalProps={{
          onCancel: () => {
            //actionRef.current.reload();
            setVisible(false);
          },
          destroyOnClose: true,
        }}
        onFinish={async (values) => {
          batch(values.rulename);
        }}
      >
        <ProFormText
          width="md"
          name="rulename"
          label={intl.formatMessage(rulenameIntl)}
          placeholder={intl.formatMessage(inputIntl)}
        />
      </ModalForm>
    </>
  );
};
