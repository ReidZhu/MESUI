import React, { useEffect, useState } from 'react';
import { Card, Col, Input, message, Popconfirm, Radio, Row } from 'antd';
import { Button } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { findInfoid, getData, getelot, post, saveBatch } from './service';
import { commonResult } from '@/utils/resultUtils';
import { DeleteOutlined } from '@ant-design/icons';
import {
  BatchlotIntl,
  BatchnotypeIntl,
  BatchsureIntl,
  BatchtypeIntl,
  brushIntl,
  brushnumberIntl,
  deleteornoIntl,
  elotIntl,
  errorelotIntl,
  InfostatusIntl,
  inputIntl,
  lotIntl,
  lotnoIntl,
  lotsureIntl,
  Model,
  moIntl,
  monoIntl,
  notmaintainedIntl,
  nullIntl,
  operationIntl,
  palletgiveIntl,
  palletIntl,
  printIntl,
  productIntl,
  qtyIntl,
  repetitionIntl,
  stageIntl,
  StagenoIntl,
  StatusnoIntl,
  storageIntl,
  Upn,
} from '@/utils/intl';
import { useIntl } from 'umi';
import ProForm, { ProFormRadio, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import storageUtils from '@/utils/storageUtils';
import { result } from 'lodash';

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
  const [elot, setElot] = useState<any>();
  //显示隐藏
  const [value, setValues] = useState('block');

  //usn输入框的数据
  const [lotid, setLotid] = useState<any>();

  //IP
  const [ip, setIP] = useState<any>(
    'IP：' + storageUtils.getUser().ip + '，' + intl.formatMessage(notmaintainedIntl),
  );
  // 站点
  const [stage, setStage] = useState<any>('-');
  const [qty, setNumber] = useState<number>(0);

  useEffect(() => {
    getConfig();
  }, []);

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage(productIntl),
      key: 'infoid',
      dataIndex: 'infoid',
    },
    {
      title: intl.formatMessage(BatchtypeIntl),
      key: 'infotype',
      dataIndex: 'infotype',
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
      title: intl.formatMessage(stageIntl),
      key: 'stage',
      dataIndex: 'stage',
    },
    {
      title: intl.formatMessage(Model),
      key: 'model',
      dataIndex: 'model',
    },
    {
      title: intl.formatMessage(InfostatusIntl),
      key: 'infostatus',
      dataIndex: 'infostatus',
    },
    {
      title: intl.formatMessage(qtyIntl),
      key: 'infoqty',
      dataIndex: 'infoqty',
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
                return item.infoid != record.infoid;
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

  // 获取基础数据
  const getConfig = async () => {
    const result = await getData({ apid: 'Q01', ip: storageUtils.getUser().ip });
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
    const result = await findInfoid({ infoid: val });
    console.log(result, 'result');
    commonResult(
      result,
      (data: any) => {
        for (const item in dataSource) {
          if (dataSource != null && dataSource != undefined) {
            if (dataSource[item].infotype != result.data.infotype) {
              return message.error(intl.formatMessage(BatchnotypeIntl));
            } else if (dataSource[item].mo != result.data.mo) {
              return message.error(intl.formatMessage(monoIntl));
            } else if (dataSource[item].stage != result.data.stage) {
              return message.error(intl.formatMessage(StagenoIntl));
            } else if (dataSource[item].infostatus != result.data.infostatus) {
              return message.error(intl.formatMessage(StatusnoIntl));
            }
          }
          if (dataSource[item].infoid === result.data.infoid) {
            return message.error(intl.formatMessage(repetitionIntl));
          }
        }
        if (result.data.stage != stage) {
          return message.error(intl.formatMessage(StagenoIntl));
        }
        setDataSource([...dataSource, result.data]);
        setNumber(qty + result.data.infoqty);
      },
      false,
    );
    setValue('');
  }
  async function batch() {
    const lot = new Date().valueOf();
    const username = storageUtils.getUser().name;
    console.log(username, 'username');
    const infoList = dataSource.map((obj) => {
      return obj.infoid;
    });
    if (infoList.length == 0) {
      message.error(intl.formatMessage(nullIntl));
      return;
    }
    const datas = dataSource.map((obj) => {
      let data: any = {};
      data.infoid = obj.infoid;
      data.mstage = stage;
      data.operuser = username;
      data.ng = [];
      return data;
    });
    const result = await saveBatch({
      infoidList: infoList,
      username,
      lot,
      moveOut: {
        data: datas,
        createuser: username,
        ip: storageUtils.getUser().ip,
        stage: stage,
      },
    });
    if (result.status == 200) {
      message.success(result.msg);
    }

    // const resultpost = await post({
    //   data: datas,
    //   createuser: username,
    //   ip: storageUtils.getUser().ip,
    //   stage: stage,
    // });

    // if (result.status == 200 && resultpost.status == 200) {
    //   message.success(result.msg);
    // } else if (result.status == 200 && resultpost.status != 200) {
    //   message.error(resultpost.msg);
    // }
    commonResult(
      result,
      (data: any) => {
        setLotid(result.data);
      },
      false,
    );
    console.log(result);
    setDataSource([]);
    setDataSource(0);
  }

  //打印
  async function print() {
    if (elot == '' || elot == undefined) {
      return message.error(intl.formatMessage(elotIntl));
    }
    const result = await getelot(elot);
    if (result.data.length < 1) {
      return message.error(intl.formatMessage(errorelotIntl));
    }
    window.open('http://10.57.30.60:8080/koemes/print/elotPrint?elotid=' + elot);
  }
  return (
    <>
      <PageContainer title={false}>
        <Row gutter={12}>
          <Col xl={6} lg={6} md={12} sm={12}>
            <Card style={{ height: '530px' }}>
              <Row style={{ display: value }}>
                <Col>
                  <div style={{ color: 'red' }}>{ip}</div>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <span className="lable"> {intl.formatMessage(stageIntl)}: </span>
                  <span>{stage}</span>
                </Col>
              </Row>
              <br />
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
                  {qty}
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <span className="lable"> {intl.formatMessage(lotsureIntl)}:</span>
                  <br />
                  {lotid}
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <Button key="list" type="primary" onClick={batch}>
                    {intl.formatMessage(BatchsureIntl)}
                  </Button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col style={{ width: '100%' }}>
                  <span className="lable">{intl.formatMessage(lotnoIntl)}:</span>
                  <Input
                    className="input"
                    value={elot}
                    placeholder={intl.formatMessage(inputIntl)}
                    onChange={(e) => setElot(e.target.value)}
                  />
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <Button key="list" type="primary" onClick={print}>
                    {intl.formatMessage(printIntl)}
                  </Button>
                </Col>
              </Row>
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
