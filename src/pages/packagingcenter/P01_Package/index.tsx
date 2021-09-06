import React, { useEffect, useState } from 'react';
import { Col, Input, message, Popconfirm, Row } from 'antd';
import { Button } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { checkusn, savePackage } from './api';
import { commonResult } from '@/utils/resultUtils';
import { DeleteOutlined } from '@ant-design/icons';
import {
  brushnumberIntl,
  brusokerrorIntl,
  brusokIntl,
  deleteornoIntl,
  InconsistentbrushtypeIntl,
  inputfirstIntl,
  inputIntl,
  ipstageIntl,
  Model,
  moIntl,
  notmaintainedIntl,
  numberIntl,
  NumberstatisticalIntl,
  operationIntl,
  packageIntl,
  paNumberIntl,
  repeatbrushIntl,
  repeatbrushupnIntl,
  stageIntl,
  stagenoIntl,
  ThecurrentmodeIntl,
  TheinputcannotbeemptyIntl,
  ThenumberabovetableIntl,
  Upn,
  usnIntl,
} from '@/utils/intl';
import { Access, useAccess, useIntl } from 'umi';

import ProCard from '@ant-design/pro-card';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import storageUtils from '@/utils/storageUtils';
import { sum } from 'lodash';
import { getIpandStage } from '@/services/select';

type IPListProps = {
  usn: string;
  onChange: (id: string) => void;
};
// ----------------T06与T04页面公用------------T06与T04页面公用------------------T06与T04页面公用-----------------T06与T04页面公用
const IPList: React.FC<IPListProps> = (props: any) => {
  const intl = useIntl();
  //权限验证
  const access = useAccess();
  // 列表数据
  const [dataSource, setDataSource] = useState<any>([]);

  const [div, setDiv] = useState<boolean>(true);

  const [val, setValue] = useState<any>();

  const [vals, setValues] = useState<any>(60);

  const [stageval, setstageval] = useState<any>('');

  const [stagev, setstagev] = useState<any>('');

  const [ipval, setipval] = useState<any>(
    'IP：' + storageUtils.getUser().ip + '，' + intl.formatMessage(notmaintainedIntl),
  );

  const [flg, setflg] = useState<boolean>();

  //usn输入框的数据
  const [packvalue, setPackvalue] = useState<any>();

  //当前模式赋值
  const [stage, setStage] = useState<string>('');

  //当前模式赋值
  const [count, setScount] = useState<number>(0);

  const [responsive] = useState(false);
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage(usnIntl),
      key: 'infoid',
      dataIndex: 'infoid',
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
      title: intl.formatMessage(numberIntl),
      key: 'infoqty',
      dataIndex: 'infoqty',
    },
    {
      title: intl.formatMessage(numberIntl),
      key: 'stage',
      dataIndex: 'stage',
      hideInForm: false,
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

  async function onKeyup() {
    if (!val) {
      return message.error(intl.formatMessage(TheinputcannotbeemptyIntl));
    }

    const result = await checkusn({ infoid: val });

    if (result.status != 200) {
      return message.error(result.msg);
    }

    if (result.data.stage != stagev) {
      return message.error(intl.formatMessage(stagenoIntl));
    }

    if (dataSource.length > 0) {
      if (dataSource[0].infotype !== result.data.infotype) {
        return message.error(intl.formatMessage(InconsistentbrushtypeIntl));
      }
    } else {
      setStage(result.data.infotype);
    }

    if (count >= vals) {
      return message.error(intl.formatMessage(ThenumberabovetableIntl));
    }
    for (const item in dataSource) {
      if (dataSource[item].infoid === result.data.infoid) {
        return message.error(intl.formatMessage(repeatbrushIntl));
      } else if (dataSource[item].upn != result.data.upn) {
        return message.error(intl.formatMessage(repeatbrushupnIntl));
      }
    }
    setDataSource([...dataSource, result.data]);
    setValue('');
    setPackvalue('');
  }

  async function packageing() {
    // 判断数据空不能提交
    if (dataSource.length === 0) {
      return message.error(intl.formatMessage(inputfirstIntl));
    }
    //获取到User
    console.log(dataSource);

    const userinfo: any = storageUtils.getUser();

    if (count > vals) {
      let len = count - vals;
      let leng = dataSource[dataSource.length - 1].infoqty - len;
      dataSource[dataSource.length - 1].infoqty = leng;
    }

    dataSource.forEach((e: any, index: any) => {
      dataSource[index].stage = 'SN';
    });

    const result = await savePackage({
      ...userinfo,
      data: dataSource,
      boxtype: props.route.boxtype,
    });
    setPackvalue(result.data);
    setflg(true);
    0;

    if (result.status != 200) {
      setDataSource([]);
      return message.error(intl.formatMessage(brusokerrorIntl));
    }
    message.success(intl.formatMessage(brusokIntl));
    setDataSource([]);
  }
  //初始化方法
  useEffect(() => {
    props.route.boxtype === 'LCD' ? getConfigT01() : getConfigT03();
  }, []);

  // 获取ip对应站点基础数据
  const getConfigT01 = async () => {
    const result = await getIpandStage({ apid: 'P01', ip: storageUtils.getUser().ip });
    if (result.data.length != 0 && result.data[0].configvalue === '4A00') {
      setipval('');
      setstageval(intl.formatMessage(stageIntl) + '：' + '4A00');
      setstagev('4A00');
    }
  };

  // 获取ip对应站点基础数据
  const getConfigT03 = async () => {
    const result = await getIpandStage({ apid: 'P03', ip: storageUtils.getUser().ip });
    if (result.data.length != 0 && result.data[0].configvalue === 'PK02') {
      setipval('');
      setstageval(intl.formatMessage(stageIntl) + '：' + 'PK02');
      setstagev('PK02');
    }
  };
  return (
    <>
      <PageHeaderWrapper title={false}>
        <ProCard split="vertical">
          <ProCard colSpan="30%">
            <ProCard split="horizontal">
              <ProCard>
                <div style={{ color: 'red' }}>{ipval}</div>

                <div>{stageval}</div>
              </ProCard>
              <ProCard
                title={count != 0 ? intl.formatMessage(ThecurrentmodeIntl) + stage : ''}
                split="vertical"
              >
                <ProCard>
                  <Input
                    className="input"
                    value={val}
                    placeholder={intl.formatMessage(inputIntl)}
                    onChange={(e) => setValue(e.target.value)}
                    onPressEnter={(e) => onKeyup()}
                  />
                </ProCard>
              </ProCard>
              <ProCard split={responsive ? 'horizontal' : 'vertical'}>
                <ProCard title={intl.formatMessage(brushnumberIntl)}>
                  {
                    <Input
                      disabled={count === 0 ? false : true}
                      onChange={(e) => setValues(e.target.value)}
                      value={vals}
                    />
                  }
                </ProCard>
                <ProCard title={intl.formatMessage(paNumberIntl)}>{packvalue}</ProCard>
              </ProCard>

              <ProCard split="vertical">
                <Access accessible={access.lableFilter('transaction:package:save')}>
                  <Button key="list" type="primary" onClick={packageing}>
                    {intl.formatMessage(packageIntl)}
                  </Button>
                </Access>
              </ProCard>
            </ProCard>{' '}
          </ProCard>
          <ProCard headerBordered>
            <div style={{ height: 360 }}>
              <ProTable
                columns={columns}
                summary={(e) => {
                  var arr = [];
                  for (const item in e) {
                    arr.push(e[item].infoqty);
                  }
                  let counts = sum(arr);
                  setScount(sum(arr));

                  return (
                    <div hidden={!(counts > 0)}>
                      {intl.formatMessage(NumberstatisticalIntl) + counts}
                    </div>
                  );
                }}
                onChange={(e) => {
                  console.log(e);
                }}
                dataSource={dataSource}
                rowKey="infoid"
                search={false}
              />
            </div>
          </ProCard>
        </ProCard>
      </PageHeaderWrapper>
    </>
  );
};

export default IPList;
