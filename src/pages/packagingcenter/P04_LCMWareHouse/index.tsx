import React, { useEffect, useState } from 'react';
import { Card, Col, Input, message, Popconfirm, Radio, Row } from 'antd';
import { Button } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { checkusn, checkboxusn, savepallet, savepalletpcs, getData, getpalletid } from './service';
import { commonResult } from '@/utils/resultUtils';
import { DeleteOutlined } from '@ant-design/icons';
import {
  boxidIntl,
  boxIntl,
  brushIntl,
  brushnumberIntl,
  deleteornoIntl,
  errorpalletidIntl,
  inputIntl,
  Model,
  moIntl,
  notmaintainedIntl,
  nullIntl,
  operationIntl,
  palletgiveIntl,
  palletidIntl,
  palletidpIntl,
  palletIntl,
  printIntl,
  productIntl,
  qtyIntl,
  repetitionIntl,
  stageIntl,
  storageIntl,
  storeloc,
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
  const [loc, setStoreloc] = useState<any>();
  const [palletid, setPalletid] = useState<any>();
  //显示隐藏
  const [value, setValues] = useState('block');

  //usn输入框的数据
  const [pallet, setPallet] = useState<any>();
  //入库类型
  const [type, setType] = React.useState('BOX');
  const [visiblebox, setVisiblebox] = useState(false);
  const [visiblepcs, setVisiblepcs] = useState(true);

  //IP
  const [ip, setIP] = useState<any>(
    'IP：' + storageUtils.getUser().ip + '，' + intl.formatMessage(notmaintainedIntl),
  );
  // 站点
  const [stage, setStage] = useState<any>();
  const [qty, setNumber] = useState<number>(0);

  useEffect(() => {
    getConfig();
  }, []);

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage(boxidIntl),
      key: 'boxid',
      dataIndex: 'boxid',
      hideInTable: visiblebox,
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
      title: intl.formatMessage(qtyIntl),
      key: 'qty',
      dataIndex: 'qty',
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
                if (type == 'BOX') {
                  return item.boxid != record.boxid;
                } else {
                  return item.infoid != record.infoid;
                }
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
    const result = await getData({ apid: 'P04', ip: storageUtils.getUser().ip });
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
    const result = await checkboxusn({ boxid: val, type: 'LCM' });
    console.log(result, 'result');
    let temp: [] = JSON.parse(JSON.stringify(dataSource));
    if (result.status == 200) {
      if (temp.length == 0) {
        setStoreloc(result.data.storeloc);
      }
    }
    commonResult(
      result,
      (data: any) => {
        for (const item in dataSource) {
          if (dataSource[item].boxid === result.data.boxid) {
            return message.error(intl.formatMessage(repetitionIntl));
          }
        }
        setDataSource([...dataSource, result.data]);
        setNumber(qty + result.data.qty);
      },
      false,
    );
    setValue('');
  }
  async function packageing() {
    const palletid = new Date().valueOf();
    const username = storageUtils.getUser().name;
    const workstation = storageUtils.getUser().ip;
    console.log(username, 'username');
    const boxList = dataSource.map((obj) => {
      return obj.boxid;
    });
    if (boxList.length == 0) {
      message.error(intl.formatMessage(nullIntl));
      return;
    }
    const result = await savepallet({
      boxList: boxList,
      username,
      palletid,
      workstation,
      storeloc: loc,
      type: 'LCM',
    });
    if (result.status == 200) {
      message.success(result.msg);
    }
    commonResult(
      result,
      (data: any) => {
        setPallet(result.data);
      },
      false,
    );
    setDataSource([]);
    setNumber(0);
  }

  //打印
  async function print() {
    if (palletid == '' || palletid == undefined) {
      return message.error(intl.formatMessage(palletidpIntl));
    }
    const result = await getpalletid(palletid);
    if (result.data < 1) {
      return message.error(intl.formatMessage(errorpalletidIntl));
    }
    window.open('http://10.57.30.60:8080/koemes/print/palletPrint?palletid=' + palletid);
  }
  return (
    <>
      {/* <Row>
          <Col span={5}>
            {' '}
            <Input
              className="input"
              value={val}
              placeholder={intl.formatMessage(inputIntl)}
              onChange={(e) => setValue(e.target.value)}
              onPressEnter={(e) => onKeyup()}
            />
          </Col>
          <Col span={1}></Col>
          <Col span={6}>
            {intl.formatMessage(brushnumberIntl)}
            {dataSource.length}
          </Col>
          <Col span={6}>
            {intl.formatMessage(paNumberIntl)}
            {pallet}
          </Col>
          <Col span={6}>
            {' '}
            <Button key="list" type="primary" onClick={packageing}>
              {intl.formatMessage(packageIntl)}
            </Button>
          </Col>
        </Row> */}
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
                  <span className="lable">{intl.formatMessage(boxIntl)}:</span>
                  <Input
                    className="input"
                    value={val}
                    placeholder={intl.formatMessage(boxIntl)}
                    onChange={(e) => setValue(e.target.value)}
                    onPressEnter={(e) => onKeyup()}
                  />
                </Col>
              </Row>
              <br />
              <Row>
                <Col style={{ width: '100%' }}>
                  <span className="lable">{intl.formatMessage(storeloc)}:</span>
                  <Input
                    className="input"
                    value={loc}
                    placeholder={intl.formatMessage(storeloc)}
                    onChange={(e) => setStoreloc(e.target.value)}
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
                  <span className="lable"> {intl.formatMessage(palletgiveIntl)}:</span>
                  <br />
                  {pallet}
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <Button key="list" type="primary" onClick={packageing}>
                    {intl.formatMessage(palletIntl)}
                  </Button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col style={{ width: '100%' }}>
                  <span className="lable">{intl.formatMessage(palletidIntl)}:</span>
                  <Input
                    className="input"
                    value={palletid}
                    placeholder={intl.formatMessage(inputIntl)}
                    onChange={(e) => setPalletid(e.target.value)}
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
