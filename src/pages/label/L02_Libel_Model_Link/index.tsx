import React, { useEffect, useRef, useState } from 'react';

import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import {
  createtimeIntl,
  createuserIntl,
  fixedvalueIntl,
  flowcodeclearingrulesIntl,
  formatIntl,
  labeltypeIntl,
  lablepatternIntl,
  lableruleIntl,
  lengthIntl,
  modelIntl,
  printruleIntl,
  printwayIntl,
  rulenameIntl,
  rulenumberIntl,
  ruletypeIntl,
  ThetemplatenumbermustbeuniqueIntl,
  Upn,
} from '@/utils/intl';
import { useIntl } from 'umi';
import { findAllType, findAllUpn } from '@/services/select';

import ProCard from '@ant-design/pro-card';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProForm, { FormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { getDetail, getlistbyupn, getOneRule, save, getRuleOption } from './api';

import { commonResult } from '@/utils/resultUtils';
import { formatparams } from '@/utils/utils';
import storageUtils from '@/utils/storageUtils';
import { toheavy } from '@/utils/excleUtils';
import { Form, message } from 'antd';

interface ExpandedRowRender {
  res: any;
}
const ExpandedRowRender: React.FC<any> = (props) => {
  const { res } = props;
  const intl = useIntl();
  return (
    <ProTable
      pagination={{ pageSize: 8 }}
      columns={[
        { title: intl.formatMessage(rulenameIntl), dataIndex: 'rulename', key: 'rulename' },
        { title: intl.formatMessage(rulenumberIntl), dataIndex: 'ruleitem', key: 'ruleitem' },
        { title: intl.formatMessage(ruletypeIntl), dataIndex: 'ruletype', key: 'ruletype' },
        { title: intl.formatMessage(lengthIntl), dataIndex: 'keylength', key: 'keylength' },
        { title: intl.formatMessage(fixedvalueIntl), dataIndex: 'keyvalue', key: 'keyvalue' },
        {
          title: intl.formatMessage(flowcodeclearingrulesIntl),
          dataIndex: 'reseton',
          key: 'reseton',
        },
      ]}
      headerTitle={false}
      search={false}
      options={false}
      dataSource={res}
      pagination={false}
    />
  );
};

const IPList: React.FC<any> = (props: any) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  //权限验证
  const formRef = useRef<FormInstance>();
  const [valupn, setValueUpn] = useState<[]>();
  const [val, setValue] = useState<[]>();

  const [res, setRes] = useState<any>();
  // 列表数据
  const [dataSource, setDataSource] = useState<any>([]);
  const [upnsource, setUpnSource] = useState<any>([]);

  const [flag, setUpnflag] = useState<any>(true);

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage(rulenameIntl),
      key: 'rulename',
      dataIndex: 'rulename',
    },
    {
      title: intl.formatMessage(formatIntl),
      key: 'format',
      dataIndex: 'format',
    },
    {
      title: intl.formatMessage(createuserIntl),
      key: 'createuser',
      dataIndex: 'createuser',
    },
    {
      title: intl.formatMessage(createtimeIntl),
      key: 'createtime',
      dataIndex: 'createtime',
    },
  ];

  const columnss: ProColumns[] = [
    {
      title: 'labelid',
      key: 'labelid',
      dataIndex: 'labelid',
      hideInTable: true,
    },
    {
      title: intl.formatMessage(labeltypeIntl),
      key: 'labeltype',
      dataIndex: 'labeltype',
    },
    {
      title: intl.formatMessage(modelIntl),
      key: 'model',
      dataIndex: 'model',
    },
    {
      title: intl.formatMessage(printwayIntl),
      key: 'printway',
      dataIndex: 'printway',
    },
    {
      title: intl.formatMessage(rulenameIntl),
      key: 'rulename',
      dataIndex: 'rulename',
    },
    {
      title: intl.formatMessage(Upn),
      key: 'upn',
      dataIndex: 'upn',
    },
    {
      title: intl.formatMessage(createuserIntl),
      key: 'createuser',
      dataIndex: 'createuser',
    },
    {
      title: intl.formatMessage(createtimeIntl),
      key: 'createtime',
      dataIndex: 'createtime',
    },
  ];

  //初始化方法
  useEffect(() => {
    getRule();
    getPRINTWAY();
    getLABELTYPE();
    getUpn();
  }, []);

  // 获取站点
  const getUpn = async () => {
    const result = await findAllUpn('');
    setValueUpn(result.data);
  };

  const getRule = async () => {
    const result = await getRuleOption();
    setValue(result.data);
  };
  const [PRINTWAY, setPRINTWAY] = useState<[]>([]);
  const [LABELTYPE, setLABELTYPE] = useState<[]>([]);
  const [lb, setLb] = useState<[]>([]);

  const [flg, setFlg] = useState<boolean>(true);

  const [heid, setHeid] = useState<any>('');

  const getPRINTWAY = async () => {
    const result = await findAllType('PRINTWAY');
    setPRINTWAY(result.data);
  };

  const getLABELTYPE = async () => {
    const result = await findAllType('LABELTYPE');
    setLb(result.data);
    setLABELTYPE(result.data);
  };
  return (
    <>
      <PageHeaderWrapper title={false}>
        <ProCard split="vertical">
          <ProCard colSpan="30%">
            <ProForm
              submitter={{
                render: (props, doms) => {
                  return [...doms];
                },
              }}
              formRef={formRef}
              form={form}
              onFinish={async (values) => {
                values.labelid = formatparams(values.labelid);
                values.model = 'KOE';
                values.createuser = storageUtils.getUser().name;
                commonResult(await save({ data: values }));
                setDataSource([]);
                formRef.current?.resetFields();
                setFlg(true);
                return true;
              }}
            >
              <ProFormSelect
                options={valupn}
                width="md"
                name="upn"
                fieldProps={{
                  onChange: async (e) => {
                    setFlg(false);
                    const result = await getlistbyupn({ upn: e });

                    if (result.data.length === lb.length) {
                      setHeid('__此Upn已维护' + result.data.length + '种Label模式');
                      setFlg(true);
                      form.setFields([{ name: 'labeltype', value: setLABELTYPE([]) }]);
                    } else {
                      setHeid('');
                    }
                    setUpnSource(result.data);
                    const type: any = [];
                    let hold: any = [];
                    let holds: any = [];

                    result.data.forEach((e: any) => {
                      type.push(e.labeltype.toString());
                    });

                    lb.forEach((e: any) => {
                      holds.push(e);
                    });

                    if (type.length !== 0) {
                      holds.forEach((e: any) => {
                        if (type.length === 1) {
                          if (e.label !== type[0]) {
                            hold.push(e);
                          }
                        } else if (type.length === 2) {
                          if (e.label !== type[0] && e.label !== type[1]) {
                            hold.push(e);
                          }
                        } else if (type.length === 3) {
                          if (e.label !== type[0] && e.label !== type[1] && e.label !== type[2]) {
                            hold.push(e);
                          }
                        } else if (type.length === 4) {
                          if (
                            e.label !== type[0] &&
                            e.label !== type[1] &&
                            e.label !== type[2] &&
                            e.label !== type[3]
                          ) {
                            hold.push(e);
                          }
                        }
                      });
                      const ar = toheavy(hold);
                      setLABELTYPE(ar);
                    } else {
                      setLABELTYPE(lb);
                    }
                    setUpnflag(true);
                  },
                }}
                label={intl.formatMessage(Upn)}
                placeholder={intl.formatMessage(Upn)}
                rules={[{ required: true }]}
              />
              <ProFormSelect
                options={val}
                fieldProps={{
                  onChange: async (e) => {
                    const result = await getOneRule({ rulename: e });
                    setDataSource([result.data]);
                    setUpnflag(false);
                  },
                }}
                width="md"
                name="rulename"
                label={intl.formatMessage(lableruleIntl)}
                placeholder={intl.formatMessage(lableruleIntl)}
                rules={[{ required: true }]}
              />

              <ProFormSelect
                options={PRINTWAY}
                width="md"
                name="printway"
                label={intl.formatMessage(printruleIntl)}
                placeholder={intl.formatMessage(printruleIntl)}
                rules={[{ required: true }]}
              />
              <ProFormSelect
                options={LABELTYPE}
                //disabled={flg}
                width="md"
                name="labeltype"
                label={<span>{intl.formatMessage(lablepatternIntl) + heid}</span>}
                placeholder={intl.formatMessage(lablepatternIntl)}
                rules={[{ required: true, message: intl.formatMessage(lablepatternIntl) }]}
              />

              <ProFormText
                width="md"
                label={
                  <span style={{ color: 'red' }}>
                    {intl.formatMessage(ThetemplatenumbermustbeuniqueIntl)}
                  </span>
                }
                placeholder={intl.formatMessage(ThetemplatenumbermustbeuniqueIntl)}
                name="labelid"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage(ThetemplatenumbermustbeuniqueIntl),
                  },
                ]}
              />
            </ProForm>
          </ProCard>
          <ProCard headerBordered>
            <div style={{ height: 360 }}>
              <div>
                {flag ? (
                  <ProTable
                    pagination={{ pageSize: 8 }}
                    columns={columnss}
                    dataSource={upnsource}
                    rowKey="id"
                    search={false}
                    request={async (params, sorter, filter) => {
                      commonResult(
                        await getlistbyupn(''),
                        (result: any) => {
                          setUpnSource(result);
                        },
                        false,
                      );
                      return { data: upnsource };
                    }}
                  />
                ) : (
                  <></>
                )}
              </div>
              {!flag ? (
                <ProTable
                  columns={columns}
                  dataSource={dataSource}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  search={false}
                  expandable={{
                    onExpand: async (_, record: any) => {
                      const result = await getDetail({ rulename: record.rulename });
                      setRes(result.data);
                    },
                    expandedRowRender: () => {
                      return <ExpandedRowRender res={res} />;
                    },
                  }}
                />
              ) : (
                <></>
              )}
            </div>
          </ProCard>
        </ProCard>
      </PageHeaderWrapper>
    </>
  );
};

export default IPList;
