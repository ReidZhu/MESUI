// import React from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { Form, message, Tag } from 'antd';
import { useIntl } from 'umi';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import ProForm, { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { getData, insertdata } from '../api';
import { findAllStage, findAllType } from '@/services/select';
import storageUtils from '@/utils/storageUtils';
import {
  RouteName,
  operationIntl,
  addIntl,
  stageorderIntl,
  stageIntl,
  mstageIntl,
  flagIntl,
  stagematerialIntl,
  postingIntl,
  checkinIntl,
  selectIntl,
  inputIntl,
  dataStorage,
  deleteornoIntl,
  faildeleteIntl,
  successdeleteIntl,
  hideIntl,
  noIntl,
  oqcIntl,
  batchIntl,
  repairIntl,
  packIntl,
  storeIntl,
  B03Msg01Intl,
  B03Msg02Intl,
  B03Msg03Intl,
  B03Msg04Intl,
} from '@/utils/intl';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

interface TableModal {
  visible: {
    visible: Boolean;
    setVisible: Function;
  };
  editRow: any;
  tabRef: any;
}

// const data = [];

export default (props: TableModal) => {
  // 列表数据
  const [dataSource, setDataSource] = useState();
  // 操作Table
  const actionRef = useRef<ActionType>();
  // 隱藏小纖體
  const [mstageVisible, setMstageVisible] = useState(false);
  // 隱藏料件信息
  const [stagematerialVisible, setstagematerialVisible] = useState(false);
  // 獲取站点
  const [stage, setStage] = useState<[]>([]);
  // 獲取類型
  const [type, setType] = useState<[]>([]);
  //臨時數據
  const [tmpdata, setTmpData] = useState([]);
  //臨時數據
  const [stageorder, setstageorder] = useState([]);
  //國際化
  const intl = useIntl();
  useEffect(() => {
    getAllStage();
    getAllType();
  }, []);

  useEffect(() => {}, [dataSource]);

  // 获取站点
  const getAllStage = async () => {
    const stages = await findAllStage();
    if (stages.status == 200) {
      setStage(stages.data);
    } else {
      message.error(stages.msg);
    }
  };
  const getAllType = async () => {
    const type = await findAllType('STAGETYPE');
    if (type.status == 200) {
      setType(type.data);
    } else {
      message.error(type.msg);
    }
  };

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage(noIntl),
      dataIndex: 'index',
      valueType: 'index',
      width: '50px',
      // render: () => <DragHandle />,
    },
    {
      title: intl.formatMessage(RouteName),
      dataIndex: 'routename',
      // render: () => <DragHandle />,
    },
    {
      title: intl.formatMessage(stageIntl),
      dataIndex: 'stage',
      valueType: 'select',
    },
    {
      title: intl.formatMessage(mstageIntl),
      dataIndex: 'mstage',
      valueType: 'select',
    },
    {
      title: intl.formatMessage(stageorderIntl),
      dataIndex: 'stageorder',
    },
    {
      title: intl.formatMessage(flagIntl),
      // hideInSearch: true,
      dataIndex: 'flag',
      render: (_, record) => {
        if (record.flag == 'M') {
          return <Tag color="green">{intl.formatMessage(postingIntl)}</Tag>;
        } else if (record.flag == 'R') {
          return <Tag color="cyan">{intl.formatMessage(checkinIntl)}</Tag>;
        } else if (record.flag == 'O') {
          return <Tag color="blue">{intl.formatMessage(oqcIntl)}</Tag>;
        } else if (record.flag == 'B') {
          return <Tag color="purple">{intl.formatMessage(batchIntl)}</Tag>;
        } else if (record.flag == 'F') {
          return <Tag color="gold">{intl.formatMessage(packIntl)}</Tag>;
        } else if (record.flag == 'P') {
          return <Tag color="magenta">{intl.formatMessage(storeIntl)}</Tag>;
        } else if (record.flag == 'A') {
          return <Tag color="red">{intl.formatMessage(repairIntl)}</Tag>;
        }
      },
    },
    {
      title: intl.formatMessage(stagematerialIntl),
      dataIndex: 'stagematerial',
    },
    {
      title: intl.formatMessage(operationIntl),
      key: 'option',

      // width: 120,
      valueType: 'option',
      render: (_, record) => [
        // <Button
        //   type="text"
        //   icon={<EditOutlined />}
        //   onClick={() => {
        //     // setEditRow(record);
        //     // setVisible(true);
        //   }}
        // ></Button>,
        <Popconfirm
          title={intl.formatMessage(deleteornoIntl)}
          onConfirm={() => {
            let temp: [] = JSON.parse(JSON.stringify(tmpdata));
            let removeAfter = temp.filter((e: any) => {
              return e.stageorder != record.stageorder;
            });
            setTmpData(removeAfter);
            message.success(intl.formatMessage(successdeleteIntl));
          }}
          onCancel={() => {
            message.error(intl.formatMessage(faildeleteIntl));
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" danger icon={<DeleteOutlined />}></Button>
        </Popconfirm>,
      ],
    },
  ];
  const [form] = Form.useForm();
  const { visible, editRow, tabRef } = props;
  return (
    <div>
      <div>
        <ModalForm<{
          rountname: string;
          stage: string;
          mstage: string;
          stageorder: number;
        }>
          title={intl.formatMessage(dataStorage)}
          // width={500}
          form={form}
          initialValues={editRow}
          // layout='horizontal'
          visible={visible.visible}
          modalProps={{
            onCancel: () => {
              tabRef.current.reload();
              visible.setVisible(false);
            },
            destroyOnClose: true,
          }}
          onFinish={async () => {
            console.log({ date: tmpdata });
            console.log(tmpdata);
            const result = await insertdata({ data: tmpdata });

            if (result.status == 200) {
              message.success(result.msg);
              setTmpData([]);
              visible.setVisible(false);
              tabRef.current.reload();
              return true;
            } else {
              message.error(result.msg);
              return false;
            }
          }}
        >
          <ProForm
            onFinish={async (values) => {
              let valuesdata = JSON.parse(JSON.stringify(values));
              const result = await getData({ routename: valuesdata.routename });

              let stageorderall;
              if (result.data.length == 0) {
                stageorderall = 0 + tmpdata.length;
              } else {
                stageorderall = result.data[result.data.length - 1].stageorder + tmpdata.length;
              }

              let user = storageUtils.getUser();
              if (valuesdata.mstage == null) valuesdata.mstage = valuesdata.stage;
              if (valuesdata.stagematerial == null) valuesdata.stagematerial = '';
              let temp: [] = JSON.parse(JSON.stringify(tmpdata));

              let stagematerialall: [] = valuesdata.stagematerial;
              let stagematerial = '';
              for (var i = 0; i < stagematerialall.length; i++) {
                if (stagematerial == '') {
                  stagematerial = stagematerialall[i];
                } else {
                  stagematerial = stagematerial + ';' + stagematerialall[i];
                }
              }
              console.log(stagematerial);
              if (mstageVisible == true) {
                let mstageall: [] = valuesdata.mstage;
                for (var index = 0; index < mstageall.length; index++) {
                  let exist = temp.find((e: any) => {
                    return e.routename != valuesdata.routename;
                  });
                  if (exist) {
                    message.error(intl.formatMessage(B03Msg01Intl));
                    return;
                  }
                  let exist1 = temp.find((e: any) => {
                    return (
                      e.routename == valuesdata.routename &&
                      e.stage == valuesdata.stage &&
                      e.mstage == mstageall[index] &&
                      e.flag == valuesdata.flag
                    );
                  });
                  if (exist1) {
                    message.error(intl.formatMessage(B03Msg02Intl));
                    return;
                  }
                  console.log(valuesdata);
                  valuesdata.mstage = mstageall[index];
                  valuesdata.createuser = user.name;
                  valuesdata.stageorder = stageorderall + 1 + index;
                  valuesdata.stagematerial = stagematerial;
                  temp.push(JSON.parse(JSON.stringify(valuesdata)));
                }
              } else {
                let exist = temp.find((e: any) => {
                  return e.routename != valuesdata.routename;
                });
                if (exist) {
                  message.error(intl.formatMessage(B03Msg01Intl));
                  return;
                }

                let exist1 = temp.find((e: any) => {
                  return (
                    e.routename == valuesdata.routename &&
                    e.stage == valuesdata.stage &&
                    e.mstage == valuesdata.mstage &&
                    e.flag == valuesdata.flag
                  );
                });
                if (exist1) {
                  message.error(intl.formatMessage(B03Msg02Intl));
                  return;
                }

                valuesdata.createuser = user.name;
                valuesdata.stageorder = stageorderall + 1;
                valuesdata.stagematerial = stagematerial;
                temp.push(JSON.parse(JSON.stringify(valuesdata)));
              }
              setTmpData(temp);
            }}
          >
            <ProForm.Group>
              <ProFormText
                width="sm"
                name="routename"
                label={intl.formatMessage(RouteName)}
                placeholder={intl.formatMessage(inputIntl) + intl.formatMessage(RouteName)}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage(inputIntl) + intl.formatMessage(RouteName),
                  },
                ]}
              />
              <Button type="primary" onClick={() => setMstageVisible(!mstageVisible)}>
                {mstageVisible
                  ? intl.formatMessage(hideIntl) + intl.formatMessage(mstageIntl)
                  : intl.formatMessage(addIntl) + intl.formatMessage(mstageIntl)}
              </Button>
              <Button type="primary" onClick={() => setstagematerialVisible(!stagematerialVisible)}>
                {stagematerialVisible
                  ? intl.formatMessage(hideIntl) + intl.formatMessage(stagematerialIntl)
                  : intl.formatMessage(addIntl) + intl.formatMessage(stagematerialIntl)}
              </Button>
            </ProForm.Group>
            <ProForm.Group>
              <ProFormSelect
                options={stage}
                width="sm"
                name="stage"
                label={intl.formatMessage(stageIntl)}
                placeholder={intl.formatMessage(selectIntl) + intl.formatMessage(stageIntl)}
                // initialValue="CELL"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage(selectIntl) + intl.formatMessage(stageIntl),
                  },
                ]}
              />
              {mstageVisible ? (
                <ProFormSelect
                  name="mstage"
                  width="sm"
                  label={intl.formatMessage(mstageIntl)}
                  options={stage}
                  fieldProps={{
                    mode: 'multiple',
                  }}
                  placeholder={intl.formatMessage(selectIntl) + intl.formatMessage(mstageIntl)}
                  tooltip={intl.formatMessage(B03Msg04Intl)}
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage(selectIntl) + intl.formatMessage(mstageIntl),
                    },
                  ]}
                />
              ) : (
                <></>
              )}
            </ProForm.Group>

            <ProForm.Group>
              <ProFormSelect
                width="sm"
                options={type}
                name="flag"
                label={intl.formatMessage(flagIntl)}
                placeholder={intl.formatMessage(selectIntl) + intl.formatMessage(flagIntl)}
                initialValue="M"
              />
              {stagematerialVisible ? (
                <ProFormSelect
                  name="stagematerial"
                  width="sm"
                  label={intl.formatMessage(stagematerialIntl)}
                  request={async () => [
                    { label: '上偏光片', value: '上偏光片' },
                    { label: '下偏光片', value: '下偏光片' },
                    { label: 'FPC', value: 'FPC' },
                    { label: 'BL', value: 'BL' },
                  ]}
                  fieldProps={{
                    mode: 'multiple',
                  }}
                  placeholder={
                    intl.formatMessage(selectIntl) + intl.formatMessage(stagematerialIntl)
                  }
                  tooltip={intl.formatMessage(B03Msg03Intl)}
                  rules={[
                    {
                      required: true,
                      message:
                        intl.formatMessage(selectIntl) + intl.formatMessage(stagematerialIntl),
                    },
                  ]}
                />
              ) : (
                <></>
              )}
            </ProForm.Group>
          </ProForm>
          <ProTable
            tableStyle={{ width: '520px', marginTop: '20px' }}
            actionRef={actionRef}
            columns={columns}
            search={false}
            toolBarRender={false}
            dataSource={tmpdata}
            rowKey="mstage"
          />
        </ModalForm>
      </div>
    </div>
  );
};
