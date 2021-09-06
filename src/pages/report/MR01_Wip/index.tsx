import React, { useEffect, useState } from 'react';
import { Card, Col, Input, message, Popconfirm, Radio, Row } from 'antd';
import { Button } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { findwip } from './service';
import { commonResult } from '@/utils/resultUtils';
import { DeleteOutlined } from '@ant-design/icons';
import {
  brushIntl,
  brushnumberIntl,
  deleteornoIntl,
  inputIntl,
  Model,
  moIntl,
  operationIntl,
  palletgiveIntl,
  palletIntl,
  productIntl,
  qtyIntl,
  repetitionIntl,
  RouteName,
  selectIntl,
  stageIntl,
  storageIntl,
  Upn,
} from '@/utils/intl';
import { useIntl } from 'umi';
import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { findAllModel } from '@/services/select';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default () => {
  const intl = useIntl();

  // 列表数据
  const [dataSource, setDataSource] = useState<any>();

  const [visifrom, setVisifrom] = useState('block');
  const [visitable, setVisitable] = useState('none');
  //Model
  const [models, setModels] = useState<[]>([]);

  // const models = [
  //   { label: 'F57', value: 'F57' },
  //   { label: 'F58', value: 'F58' },
  //   { label: 'Melon', value: 'Melon' },
  //   { label: 'Melon2', value: 'Melon2' },
  //   { label: 'KOE', value: 'KOE' },
  // ];

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage(moIntl),
      key: 'mo',
      dataIndex: 'mo',
      fixed: 'left',
      width: 120,
    },
    {
      title: intl.formatMessage(Upn),
      key: 'upn',
      dataIndex: 'upn',
      fixed: 'left',
      width: 120,
    },
    {
      title: intl.formatMessage(Model),
      key: 'model',
      dataIndex: 'model',
      fixed: 'left',
      width: 120,
    },
    {
      title: '客户机种',
      key: 'cpn',
      dataIndex: 'cpn',
      fixed: 'left',
      width: 120,
    },
    {
      title: '工单信息',
      key: 'moinfo',
      dataIndex: 'moinfo',
      fixed: 'left',
      width: 120,
    },
    {
      title: '开单日期',
      key: 'createdate',
      dataIndex: 'createdate',
    },
    {
      title: '总数',
      key: 'qty',
      dataIndex: 'qty',
    },
    {
      title: '投入',
      key: 'inputqty',
      dataIndex: 'inputqty',
    },
    {
      title: '未下线',
      key: 'planty',
      dataIndex: 'planty',
    },
    {
      title: '完工',
      key: 'p',
      dataIndex: 'p',
    },
    {
      title: '维修报废',
      key: 's',
      dataIndex: 's',
    },
    {
      title: '待维修',
      key: 'u',
      dataIndex: 'u',
    },
    {
      title: '取消作业',
      key: 'c',
      dataIndex: 'c',
    },
    {
      title: '总WIP',
      key: 'allwip',
      dataIndex: 'allwip',
    },
    {
      title: '投入',
      key: 's4100',
      dataIndex: 's4100',
    },
    {
      title: '一次切割',
      key: 's4100',
      dataIndex: 's4200',
    },
    {
      title: '液晶注入',
      key: 's4300',
      dataIndex: 's4300',
    },
    {
      title: '加压封止',
      key: 's4400',
      dataIndex: 's4400',
    },
    {
      title: '点灯检查',
      key: 's4500',
      dataIndex: 's4500',
    },
    {
      title: 'PQC抽检',
      key: 's4600',
      dataIndex: 's4600',
    },
    {
      title: '偏光片贴附',
      key: 's4700',
      dataIndex: 's4700',
    },
    {
      title: 'AP2外观检',
      key: 's4800',
      dataIndex: 's4800',
    },
    {
      title: 'PQC入检',
      key: 's4900',
      dataIndex: 's4900',
    },
    {
      title: 'LCD包装',
      key: 's4a00',
      dataIndex: 's4a00',
    },
    {
      title: 'LCD入库',
      key: 's4b00',
      dataIndex: 's4b00',
    },
    // {
    //   title: 'FQC电检',
    //   key: 'fqcd',
    //   dataIndex: 'fqcd',
    // },
    // {
    //   title: 'AIO',
    //   key: 'aio',
    //   dataIndex: 'aio',
    // },
    // {
    //   title: 'BL组装',
    //   key: 'blat',
    //   dataIndex: 'blat',
    // },
    // {
    //   title: '组装已点收',
    //   key: 'bl_receive',
    //   dataIndex: 'bl_receive',
    // },
    // {
    //   title: '组装未点收',
    //   key: 'bl_noreceive',
    //   dataIndex: 'bl_noreceive',
    // },
    // {
    //   title: 'CGL外观检',
    //   key: 'cgl',
    //   dataIndex: 'cgl',
    // },
    // {
    //   title: 'CGL未下线',
    //   key: 'cglno',
    //   dataIndex: 'cglno',
    // },
    // {
    //   title: 'MTP1',
    //   key: 'mtp',
    //   dataIndex: 'mtp',
    // },
    // {
    //   title: '28位印字',
    //   key: 'prt28',
    //   dataIndex: 'prt28',
    // },
    // {
    //   title: 'COF',
    //   key: 'cof',
    //   dataIndex: 'cof',
    // },
    // {
    //   title: 'COF未下线',
    //   key: 'cofno',
    //   dataIndex: 'cofno',
    // },
    // {
    //   title: 'APTest2目检',
    //   key: 'ap2m',
    //   dataIndex: 'ap2m',
    // },
    // {
    //   title: 'APTest2目检未点收',
    //   key: 'ap2mno',
    //   dataIndex: 'ap2mno',
    // },
    // {
    //   title: 'MR',
    //   key: 'mr',
    //   dataIndex: 'mr',
    // },
    // {
    //   title: 'APTest1检查',
    //   key: 'ap1',
    //   dataIndex: 'ap1',
    // },
    // {
    //   title: 'CELL切割',
    //   key: 'cut',
    //   dataIndex: 'cut',
    // },
    // {
    //   title: '生管备注',
    //   key: 'pcinfo',
    //   dataIndex: 'pcinfo',
    // },
    // {
    //   title: 'Reference1',
    //   key: 'partid',
    //   dataIndex: 'partid',
    // },
  ];

  useEffect(() => {
    getAllModels();
  }, []);
  //获取Model
  const getAllModels = async () => {
    const results = await findAllModel();
    if (results.status == 200) {
      setModels(results.data);
    } else {
      message.error(results.msg);
    }
  };

  return (
    <>
      <PageContainer title={false}>
        <div style={{ display: visifrom }}>
          <Card style={{ height: '530px' }}>
            <ProForm<{
              model: string;
              upn?: string;
              mo?: string;
            }>
              onFinish={async (values) => {
                const result = await findwip({
                  model: values.model,
                  upn: values.upn,
                  moList: values.mo,
                });
                setVisifrom('none');
                setVisitable('block');
                console.log(result, 'result');
                setDataSource(result.data);
              }}
              //submitter={false}
            >
              <ProFormSelect
                initialValue="KOE"
                options={models}
                width="md"
                name="model"
                label={intl.formatMessage(Model)}
                placeholder={intl.formatMessage(selectIntl)}
              />
              <ProFormText
                width="md"
                name="upn"
                label={intl.formatMessage(Upn)}
                placeholder={intl.formatMessage(inputIntl)}
              />
              <ProFormText
                width="md"
                name="mo"
                label={intl.formatMessage(moIntl)}
                placeholder={intl.formatMessage(inputIntl)}
              />
            </ProForm>
          </Card>
        </div>
        <div style={{ display: visitable }}>
          <Card>
            <Button
              key="list"
              type="primary"
              onClick={() => {
                setVisifrom('block');
                setVisitable('none');
              }}
            >
              查询
            </Button>
            <ProTable
              columns={columns}
              dataSource={dataSource}
              rowKey="usn"
              search={false}
              scroll={{ x: 3000 }}
              style={{ height: '530px' }}
            />
          </Card>
        </div>
      </PageContainer>
    </>
  );
};
