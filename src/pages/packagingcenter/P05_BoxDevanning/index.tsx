import React, { useEffect, useState } from 'react';
import { Card, Col, Input, message, Popconfirm, Radio, Row } from 'antd';
import { Button } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { checkbox, savedevanning } from './service';
import { commonResult } from '@/utils/resultUtils';
import { DeleteOutlined } from '@ant-design/icons';
import {
  BatchtypeIntl,
  boxidIntl,
  brushIntl,
  brushnumberIntl,
  cpnIntl,
  deleteornoIntl,
  devanningIntl,
  inputIntl,
  Model,
  moIntl,
  notmaintainedIntl,
  nullIntl,
  numberIntl,
  operationIntl,
  palletgiveIntl,
  palletIntl,
  productIntl,
  qtyIntl,
  rejectidIntl,
  rejecttypeIntl,
  repetitionIntl,
  stageIntl,
  storageIntl,
  storelocIntl,
  Upn,
} from '@/utils/intl';
import { useIntl } from 'umi';
import ProForm, { ProFormRadio, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import storageUtils from '@/utils/storageUtils';

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
  const [dataSource, setDataSource] = useState<any>([]);

  const [val, setValue] = useState<any>();
  const [qty, setNumber] = useState<number>(0);

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage(boxidIntl),
      key: 'boxid',
      dataIndex: 'boxid',
    },
    {
      title: intl.formatMessage(Upn),
      key: 'upn',
      dataIndex: 'upn',
    },
    {
      title: intl.formatMessage(numberIntl),
      key: 'boxqty',
      dataIndex: 'boxqty',
    },
    {
      title: intl.formatMessage(BatchtypeIntl),
      key: 'boxtype',
      dataIndex: 'boxtype',
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
                return item.rejectid != record.rejectid;
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

  async function onKeyup() {
    const result = await checkbox({ boxid: val });
    console.log(result, 'result');
    commonResult(
      result,
      (data: any) => {
        for (const item in dataSource) {
          if (dataSource[item].boxid === result.data.boxid) {
            return message.error(intl.formatMessage(repetitionIntl));
          }
        }
        setDataSource([...dataSource, result.data]);
        setNumber(qty + result.data.boxqty);
      },
      false,
    );
    setValue('');
  }
  async function packageing() {
    const username = storageUtils.getUser().name;
    console.log(username, 'username');
    const ip = storageUtils.getUser().ip;
    const boxidList = dataSource.map((obj) => {
      return obj.boxid;
    });
    if (boxidList.length == 0) {
      message.error(intl.formatMessage(nullIntl));
      return;
    }
    commonResult(await savedevanning({ data: boxidList, username, ip }));
    setDataSource([]);
    setNumber(0);
  }
  return (
    <>
      <PageContainer title={false}>
        <Row gutter={12}>
          <Col xl={6} lg={6} md={12} sm={12}>
            <Card style={{ height: '530px' }}>
              <Row>
                <Col style={{ width: '100%' }}>
                  <span className="lable">{intl.formatMessage(boxidIntl)}:</span>
                  <Input
                    className="input"
                    value={val}
                    placeholder={intl.formatMessage(boxidIntl)}
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
                  {qty}
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <Button key="list" type="primary" onClick={packageing}>
                    {intl.formatMessage(devanningIntl)}
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xl={18} lg={18} md={36} sm={36}>
            <ProTable
              columns={columns}
              dataSource={dataSource}
              search={false}
              style={{ height: '530px' }}
            />
          </Col>
        </Row>
      </PageContainer>
    </>
  );
};
