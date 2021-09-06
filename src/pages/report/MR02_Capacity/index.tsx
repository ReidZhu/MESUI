import React, { useEffect, useState } from 'react';
import { Card, Col, Input, message, Popconfirm, Radio, Row } from 'antd';
import { Button } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { findDetail, findMaster, findNgCollect, findNgDetail } from './service';
import { commonResult } from '@/utils/resultUtils';
import { ArrowRightOutlined } from '@ant-design/icons';
import {
  brushIntl,
  brushnumberIntl,
  deleteornoIntl,
  inputIntl,
  Line,
  machineidIntl,
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
import { Access, useAccess, useIntl } from 'umi';
import ProForm, {
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import {
  findAllLine,
  findAllModel,
  findAllRoute,
  findAllStage,
  findAllUpn,
} from '@/services/select';
import ProCard from '@ant-design/pro-card';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export type Master = {
  beginDate?: string;
  endDate?: string;
  stage?: string;
  line?: string;
  machineid?: string;
  upn?: string;
  model?: string;
  mo?: string;
};

export default () => {
  const intl = useIntl();
  //权限验证
  const access = useAccess();
  // 列表数据
  const [dataSource, setDataSource] = useState<any>();
  // 列表数据
  const [dataSource1, setDataSource1] = useState<any>();
  // 列表数据
  const [dataSource2, setDataSource2] = useState<any>();
  // 列表数据
  const [dataSource3, setDataSource3] = useState<any>();
  const [tabkey, setTabkey] = useState('tab1');

  const [masters, setMasters] = useState<Master[]>([]);

  //站点
  const [stage, setStage] = useState<[]>([]);
  //线体
  const [line, setLine] = useState<[]>([]);
  //流程
  const [route, setRoute] = useState<[]>([]);
  //Upn
  const [upn, setUpn] = useState<[]>([]);
  //Model
  const [models, setModels] = useState<[]>([]);

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage(stageIntl),
      key: 'stage',
      dataIndex: 'stage',
    },
    {
      title: intl.formatMessage(moIntl),
      key: 'mo',
      dataIndex: 'mo',
    },
    {
      title: intl.formatMessage(Upn),
      key: 'upn',
      dataIndex: 'upn',
    },
    {
      title: intl.formatMessage(Model),
      key: 'model',
      dataIndex: 'model',
    },
    {
      title: '投入',
      key: 'inqty',
      dataIndex: 'inqty',
    },
    {
      title: '产出',
      key: 'outqty',
      dataIndex: 'outqty',
    },
    {
      title: '不良数量',
      key: 'bad',
      dataIndex: 'bad',
    },
    {
      title: '不良率',
      key: 'badlv',
      dataIndex: 'badlv',
    },
    {
      title: intl.formatMessage(operationIntl),
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, record: any) => [
        <Access accessible={access.lableFilter('base:machine:update')}>
          <Button
            type="text"
            icon={<ArrowRightOutlined />}
            onClick={async () => {
              let Master: any = masters;
              Master.mo = record.mo;
              const result1 = await findDetail(Master);
              setDataSource1(result1.data);
              const result2 = await findNgDetail(Master);
              setDataSource2(result2.data);
              const result3 = await findNgCollect(Master);
              setDataSource3(result3.data);

              setTabkey('tab3');
            }}
          ></Button>
        </Access>,
      ],
    },
  ];
  const columns1: ProColumns[] = [
    {
      title: intl.formatMessage(stageIntl),
      key: 'stage',
      dataIndex: 'stage',
    },
    {
      title: 'LOT',
      key: 'lot',
      dataIndex: 'lot',
    },
    {
      title: intl.formatMessage(moIntl),
      key: 'mo',
      dataIndex: 'mo',
    },
    {
      title: intl.formatMessage(Upn),
      key: 'upn',
      dataIndex: 'upn',
    },
    {
      title: intl.formatMessage(Model),
      key: 'model',
      dataIndex: 'model',
    },
    {
      title: '投入',
      key: 'inqty',
      dataIndex: 'inqty',
    },
    {
      title: '产出',
      key: 'outqty',
      dataIndex: 'outqty',
    },
    {
      title: '不良数量',
      key: 'bad',
      dataIndex: 'bad',
    },
    {
      title: '不良率',
      key: 'badlv',
      dataIndex: 'badlv',
    },
  ];
  const columns2: ProColumns[] = [
    {
      title: intl.formatMessage(stageIntl),
      key: 'stage',
      dataIndex: 'stage',
    },
    {
      title: intl.formatMessage(Upn),
      key: 'upn',
      dataIndex: 'upn',
    },
    {
      title: 'USN',
      key: 'usn',
      dataIndex: 'usn',
    },
    {
      title: 'Machineid',
      key: 'machineid',
      dataIndex: 'machineid',
    },
    {
      title: '人员',
      key: 'operuser',
      dataIndex: 'operuser',
    },
    {
      title: intl.formatMessage(moIntl),
      key: 'mo',
      dataIndex: 'mo',
    },
    {
      title: 'LOT',
      key: 'lot',
      dataIndex: 'lot',
    },
    {
      title: '人员',
      key: 'createdate',
      dataIndex: 'createdate',
    },
    {
      title: '不良代码',
      key: 'errorcode',
      dataIndex: 'errorcode',
    },
    {
      title: '不良现象',
      key: 'description',
      dataIndex: 'description',
    },
  ];
  const columns3: ProColumns[] = [
    {
      title: intl.formatMessage(stageIntl),
      key: 'stage',
      dataIndex: 'stage',
    },
    {
      title: '不良代码',
      key: 'errorcode',
      dataIndex: 'errorcode',
    },
    {
      title: '不良现象',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: '投入',
      key: 'inqty',
      dataIndex: 'inqty',
    },
    {
      title: '不良数量',
      key: 'badnum',
      dataIndex: 'badnum',
    },
    {
      title: '不良率',
      key: 'badlv',
      dataIndex: 'badlv',
    },
  ];

  useEffect(() => {
    getAllStage();
    getAllLine();
    getAllRoute();
    getAllUpn();
    getAllModels();
  }, []);

  useEffect(() => {}, [dataSource]);

  //获取站点
  const getAllStage = async () => {
    const stages = await findAllStage();
    if (stages.status == 200) {
      setStage(stages.data);
    } else {
      message.error(stages.msg);
    }
  };
  //获取线体
  const getAllLine = async () => {
    const lines = await findAllLine();
    if (lines.status == 200) {
      setLine(lines.data);
    } else {
      message.error(lines.msg);
    }
  };
  //获取流程
  const getAllRoute = async () => {
    const routes = await findAllRoute();
    if (routes.status == 200) {
      setRoute(routes.data);
    } else {
      message.error(routes.msg);
    }
  };
  //获取Upn
  const getAllUpn = async () => {
    const upns = await findAllUpn('');
    if (upns.status == 200) {
      setUpn(upns.data);
    } else {
      message.error(upns.msg);
    }
  };
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
    <PageContainer title={false}>
      <ProCard
        style={{ height: '530px' }}
        tabs={{
          size: 'large',
          type: 'card',
          activeKey: tabkey,
          onChange: (key) => {
            setTabkey(key);
          },
        }}
      >
        <ProCard.TabPane key="tab1" tab="查詢">
          <ProForm<{
            dateTimeRange: any;
            beginDate: string;
            endDate: string;
            stage: string;
            line?: string;
            machineid?: string;
            upn?: string;
            model?: string;
          }>
            onFinish={async (values) => {
              console.log(values.dateTimeRange, 'values');
              let Master: any = {};
              Master.beginDate = values.dateTimeRange[0];
              Master.endDate = values.dateTimeRange[1];
              Master.stage = values.stage;
              Master.line = values.line;
              Master.machineid = values.machineid;
              Master.upn = values.upn;
              Master.model = values.model;
              setMasters(Master);
              values.beginDate = values.dateTimeRange[0];
              values.endDate = values.dateTimeRange[1];
              const result = await findMaster(values);
              setDataSource(result.data);
              setTabkey('tab2');
            }}
            //submitter={false}
          >
            <ProFormDateTimeRangePicker
              fieldProps={{
                format: 'YYYY-MM-DD HH:mm:ss',
              }}
              initialValue={[
                new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString().toString() +
                  ' 08:00:00',
                new Date().toLocaleDateString().toString() + ' 08:00:00',
              ]}
              name="dateTimeRange"
              label="日期时间区间"
            />
            <ProFormSelect
              options={stage}
              width="md"
              name="stage"
              label={intl.formatMessage(stageIntl)}
              placeholder={intl.formatMessage(selectIntl)}
            />
            <ProFormSelect
              options={line}
              width="md"
              name="line"
              label={intl.formatMessage(Line)}
              placeholder={intl.formatMessage(selectIntl)}
            />
            {/* <ProFormSelect
              options={route}
              width="md"
              name="route"
              label={intl.formatMessage(RouteName)}
              placeholder={intl.formatMessage(selectIntl)}
            /> */}
            <ProFormText
              width="md"
              name="machineid"
              label={intl.formatMessage(machineidIntl)}
              placeholder={intl.formatMessage(inputIntl)}
            />
            <ProFormSelect
              options={upn}
              width="md"
              name="upn"
              label={intl.formatMessage(Upn)}
              placeholder={intl.formatMessage(selectIntl)}
            />
            <ProFormSelect
              options={models}
              width="md"
              name="model"
              label={intl.formatMessage(Model)}
              placeholder={intl.formatMessage(selectIntl)}
            />
          </ProForm>
        </ProCard.TabPane>
        <ProCard.TabPane key="tab2" tab="日报主表">
          <ProTable columns={columns} dataSource={dataSource} rowKey="usn" search={false} />
        </ProCard.TabPane>
        <ProCard.TabPane key="tab3" tab="投入产出明细">
          <ProTable columns={columns1} dataSource={dataSource1} rowKey="usn" search={false} />
        </ProCard.TabPane>
        <ProCard.TabPane key="tab4" tab="不良明细">
          <ProTable columns={columns2} dataSource={dataSource2} rowKey="usn" search={false} />
        </ProCard.TabPane>
        <ProCard.TabPane key="tab5" tab="不良汇总">
          <ProTable columns={columns3} dataSource={dataSource3} rowKey="usn" search={false} />
        </ProCard.TabPane>
      </ProCard>
    </PageContainer>
  );
};
