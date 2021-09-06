import React, { useEffect, useState } from 'react';
import { Card, Col, Input, message, Popconfirm, Radio, Row } from 'antd';
import { Button } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { checkusn, checkboxusn, savepallet, savepalletpcs, getData } from './service';
import { commonResult } from '@/utils/resultUtils';
import { DeleteOutlined } from '@ant-design/icons';
import {
  brushIntl,
  brushnumberIntl,
  deleteornoIntl,
  inputIntl,
  Model,
  moIntl,
  notmaintainedIntl,
  nullIntl,
  operationIntl,
  palletgiveIntl,
  palletIntl,
  productIntl,
  qtyIntl,
  repetitionIntl,
  stageIntl,
  storageIntl,
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
      title: intl.formatMessage(productIntl),
      key: 'boxid',
      dataIndex: 'boxid',
      hideInTable: visiblebox,
    },
    {
      title: intl.formatMessage(productIntl),
      key: 'infoid',
      dataIndex: 'infoid',
      hideInTable: visiblepcs,
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
    const result = await getData({ apid: 'P02', ip: storageUtils.getUser().ip });
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

  //单选
  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    if (e.target.value == 'BOX') {
      setVisiblebox(false);
      setVisiblepcs(true);
      setDataSource([]);
    } else {
      setVisiblebox(true);
      setVisiblepcs(false);
      setDataSource([]);
    }
    setType(e.target.value);
  };

  async function onKeyup() {
    if (type == 'BOX') {
      const result = await checkboxusn({ boxid: val });
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
          setNumber(qty + result.data.qty);
        },
        false,
      );
      setValue('');
    } else {
      const result = await checkusn({ usn: val });
      console.log(result, 'result');
      commonResult(
        result,
        (data: any) => {
          for (const item in dataSource) {
            if (dataSource[item].infoid === result.data.infoid) {
              return message.error(intl.formatMessage(repetitionIntl));
            }
          }
          setDataSource([...dataSource, result.data]);
        },
        false,
      );
      setValue('');
    }
  }
  async function packageing() {
    const palletid = new Date().valueOf();
    const username = storageUtils.getUser().name;
    const workstation = storageUtils.getUser().ip;
    console.log(username, 'username');
    if (type == 'BOX') {
      const boxList = dataSource.map((obj) => {
        return obj.boxid;
      });
      if (boxList.length == 0) {
        message.error(intl.formatMessage(nullIntl));
        return;
      }
      const result = await savepallet({ boxList: boxList, username, palletid, workstation });
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
    } else {
      const usnList = dataSource.map((obj) => {
        return obj.infoid;
      });
      const result = await savepalletpcs({ usnList: usnList, username, workstation });
      if (result.status == 200) {
        message.success(result.msg);
      } else {
        message.error(result.msg);
      }
    }
    setDataSource([]);
    setNumber(0);
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
                <Col>
                  <span className="lable">{intl.formatMessage(storageIntl)}:</span>
                  <br />
                  <Radio.Group onChange={onChange} value={type}>
                    <Radio value={'BOX'}>BOX</Radio>
                    <Radio value={'PCS'}>PCS</Radio>
                  </Radio.Group>
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
