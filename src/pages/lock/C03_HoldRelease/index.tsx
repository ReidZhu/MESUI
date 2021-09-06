import React, { useEffect, useRef, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import UserModal from './components/TableModal';
import { createExcle, readerExcle } from '@/utils/excleUtils';
import { ArrowUpOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, FormInstance, message, Popconfirm, Popover, Row } from 'antd';
import ExcleUpload from '@/components/ExcleUpload';
import ProForm, { ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import {
  deleteornoIntl,
  HoldContentIntl,
  HolddateIntl,
  HoldReasonIntl,
  HoldTypeIntl,
  inputIntl,
  Model,
  moIntl,
  NodatawasqueriedIntl,
  operationIntl,
  pleasebrushdataIntl,
  ReleaseReasonIntl,
  repeatbrushIntl,
  selectIntl,
  stageIntl,
  TheinputcannotbeemptyIntl,
  Upn,
} from '@/utils/intl';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { check, checkrelease, save } from './api';
import { commonResult } from '@/utils/resultUtils';
import storageUtils from '@/utils/storageUtils';
import { Access, useAccess, useIntl } from 'umi';
import { findAllStage } from '@/services/select';

export default () => {
  const dowonloadModelhold = () => {
    createExcle([{ a: 'infoids' }], 'c03Hold');
    return 1;
  };
  const dowonloadModelRelease = () => {
    createExcle([{ a: 'holdcontent' }], 'c03Release');
    return 1;
  };

  const uploadExclehold = (info: any) => {
    if (info.file.status === 'done') {
      readerExcle(info.file.originFileObj, ['infoids'], async (results: any) => {
        let item = [];
        for (var i = 0; i < results.length; i++) {
          item.push(results[i].infoids);
        }
        const result = await check({ infoids: item });
        commonResult(
          result,
          (data: any) => {
            setDataSource(result.data);
          },
          false,
        );
      });
    }
  };

  const uploadExcleRelease = (info: any) => {
    if (info.file.status === 'done') {
      readerExcle(info.file.originFileObj, ['holdcontent'], async (results: any) => {
        let item = [];
        for (var i = 0; i < results.length; i++) {
          item.push(results[i].holdcontent);
        }
        const result = await checkrelease({ holdcontent: item });
        commonResult(
          result,
          (data: any) => {
            setDataSourceRelease(result.data);
          },
          false,
        );
      });
    }
  };
  //单个Release，Input输入框事件
  const [releaseval, setReleaseval] = useState<any>();
  //modal显示隐藏
  const [visible, setVisible] = useState(false);
  //修改行
  const [editRow, setEditRow] = useState({});
  //操作Table
  const actionRef = useRef<ActionType>();
  //Release列表数据
  const [dataSourceRelease, setDataSourceRelease] = useState<any>([]);

  const intl = useIntl();

  //权限验证
  const access = useAccess();

  const columnsrelease: ProColumns[] = [
    {
      title: '编号',
      dataIndex: 'id',
      hideInTable: true,
    },
    {
      title: intl.formatMessage(HoldTypeIntl),
      dataIndex: 'holdtype',
    },
    {
      title: intl.formatMessage(HoldContentIntl),
      dataIndex: 'holdcontent',
    },
    {
      title: intl.formatMessage(HoldReasonIntl),
      dataIndex: 'holdreason',
    },
    {
      title: intl.formatMessage(HolddateIntl),
      dataIndex: 'holddate',
    },
    {
      title: intl.formatMessage(ReleaseReasonIntl),
      dataIndex: 'releasereason',
      hideInTable: true,
    },
    {
      title: intl.formatMessage(operationIntl),
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="text"
          onClick={() => {
            setEditRow(record);
            setVisible(true);
          }}
          icon={<EditOutlined />}
        ></Button>,
        <Popconfirm
          title={intl.formatMessage(deleteornoIntl)}
          onConfirm={() => {
            setDataSourceRelease(
              dataSourceRelease.filter((item: any) => {
                return item.id != record.id;
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

  //Hole列表数据
  const [dataSource, setDataSource] = useState<any>([]);
  //站点信息
  const [stage, setStage] = useState<[]>();
  //单个Hole，Input输入框事件
  const [hodlval, setHodlval] = useState<any>();
  //Hold,columns
  const columns: ProColumns[] = [
    {
      title: '编号',
      dataIndex: 'id',
      hideInTable: true,
    },
    {
      title: intl.formatMessage(Upn),
      dataIndex: 'infoid',
    },
    {
      title: intl.formatMessage(moIntl),
      dataIndex: 'mo',
    },
    {
      title: intl.formatMessage(Upn),
      dataIndex: 'upn',
    },
    {
      title: intl.formatMessage(stageIntl),
      dataIndex: 'stage',
    },
    {
      title: intl.formatMessage(Model),
      dataIndex: 'model',
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
  const formRef = useRef<FormInstance>();

  useEffect(() => {
    getAllStage();
  }, []);

  //获取站点
  const getAllStage = async () => {
    const stages = await findAllStage();
    stages.data.unshift({ value: 'ALL', label: '当前站点' });
    if (stages.status == 200) {
      setStage(stages.data);
    } else {
      message.error(stages.msg);
    }
  };

  async function onKeyuprelease() {
    if (!releaseval) {
      return message.error(intl.formatMessage(TheinputcannotbeemptyIntl));
    }
    const result = await checkrelease({ holdcontent: releaseval });

    if (result.status != 200) {
      return message.error(result.msg);
    }
    if (!result.data || !result.data.length) {
      return message.error(intl.formatMessage(NodatawasqueriedIntl));
    }

    for (const item in dataSourceRelease) {
      if (dataSourceRelease[item].holdcontent === result.data[0].holdcontent) {
        return message.error(intl.formatMessage(repeatbrushIntl));
      }
    }
    commonResult(
      result,
      (data: any) => {
        setDataSourceRelease([...dataSourceRelease, ...result.data]);
      },
      false,
    );
    setReleaseval('');
  }

  async function onKeyup() {
    if (!hodlval) {
      return message.error(intl.formatMessage(TheinputcannotbeemptyIntl));
    }

    const result = await check({ infoids: hodlval });

    if (result.status != 200) {
      return message.error(result.msg);
    }

    if (!result.data || !result.data.length) {
      return message.error(intl.formatMessage(NodatawasqueriedIntl));
    }

    for (const item in dataSource) {
      if (dataSource[item].infoid === result.data[0].infoid) {
        return message.error(intl.formatMessage(repeatbrushIntl));
      }
    }
    commonResult(
      result,
      (data: any) => {
        setDataSource([...dataSource, ...result.data]);
      },
      false,
    );
    setHodlval('');
  }

  return (
    <ProCard
      tabs={{
        type: 'card',
      }}
    >
      {/* Hold操作*********************************************************************************************** */}

      <ProCard.TabPane key="tab1" tab="Hold">
        <ProCard colSpan="30%">
          <ProForm
            submitter={{
              // 完全自定义整个区域使用表单在表单中去除按钮
              render: (props, doms) => {
                return [];
              },
            }}
          >
            {' '}
            <Row>
              <Col span={22}></Col>
              <Col span={2}>
                {
                  <Access accessible={access.lableFilter('lock:hold_release:batch')}>
                    <a>
                      <Popover
                        placement="bottom"
                        content={
                          <ExcleUpload
                            current={1}
                            downloadModel={dowonloadModelhold}
                            uploadModel={uploadExclehold}
                          />
                        }
                        trigger="click"
                      >
                        <ArrowUpOutlined />
                      </Popover>
                    </a>
                  </Access>
                }
              </Col>
            </Row>
            <ProFormText
              label={intl.formatMessage(inputIntl) + 'LOT/PCS'}
              fieldProps={{
                onPressEnter: (e) => {
                  onKeyup();
                },
                onChange: (e) => {
                  setHodlval(e.target.value);
                },
                value: hodlval,
              }}
              width="md"
            />
          </ProForm>

          <ProForm
            submitter={{
              render: (props, doms) => {
                return [...doms];
              },
            }}
            formRef={formRef}
            onFinish={async (values) => {
              if (dataSource.length === 0) {
                return message.error(intl.formatMessage(pleasebrushdataIntl));
              }

              let hold: any = [];
              let obj: any = {};
              dataSource.forEach((e: any, index: any) => {
                obj.holduser = storageUtils.getUser().name;
                obj.holdcontent = e.infoid;
                obj.holdtype = e.infotype;
                obj.stage = values.stage;
                obj.holdreason = values.holdreason;
                obj.flag = 'Y';
                hold.push(JSON.parse(JSON.stringify(obj)));
              });
              const result = await save({
                data: hold,
                ip: storageUtils.getUser().ip,
                name: storageUtils.getUser().name,
              });
              formRef.current?.resetFields();
              commonResult(result, (data: any) => {
                setDataSource([]);
              });

              return true;
            }}
          >
            <ProFormSelect
              options={stage}
              width="md"
              name="stage"
              label={intl.formatMessage(stageIntl)}
              placeholder={intl.formatMessage(selectIntl)}
              rules={[{ required: true }]}
            />
            <ProFormTextArea
              width="md"
              name="holdreason"
              label={intl.formatMessage(HoldReasonIntl)}
              placeholder={intl.formatMessage(inputIntl)}
              rules={[{ required: true }]}
            />
          </ProForm>
        </ProCard>
        <ProCard headerBordered>
          <div style={{ height: 360 }}>
            <ProTable columns={columns} dataSource={dataSource} rowKey="id" search={false} />
          </div>
        </ProCard>
      </ProCard.TabPane>

      {/* Release操作*********************************************************************************************** */}

      <ProCard.TabPane key="tab2" tab="Release">
        <ProCard split="vertical">
          <ProCard colSpan="30%">
            <Row>
              <Col span={22}></Col>
              <Col span={2}>
                {
                  <Access accessible={access.lableFilter('lock:hold_release:rbatch')}>
                    <a>
                      <Popover
                        placement="bottom"
                        content={
                          <ExcleUpload
                            current={1}
                            downloadModel={dowonloadModelRelease}
                            uploadModel={uploadExcleRelease}
                          />
                        }
                        trigger="click"
                      >
                        <ArrowUpOutlined />
                      </Popover>
                    </a>
                  </Access>
                }
              </Col>
            </Row>

            <ProForm
              submitter={{
                // 完全自定义整个区域
                render: (props, doms) => {
                  return [];
                },
              }}
            >
              <ProFormText
                label={intl.formatMessage(inputIntl) + 'LOT/PCS'}
                width="md"
                fieldProps={{
                  onPressEnter: (e) => {
                    onKeyuprelease();
                  },
                  onChange: (e) => {
                    setReleaseval(e.target.value);
                  },
                  value: releaseval,
                }}
              />
            </ProForm>

            <ProForm
              submitter={{
                render: (props, doms) => {
                  return [...doms];
                },
              }}
              formRef={formRef}
              onFinish={async (values) => {
                if (dataSourceRelease.length === 0) {
                  return message.error(intl.formatMessage(pleasebrushdataIntl));
                }
                let hold: any = [];
                dataSourceRelease.forEach((e: any) => {
                  let obj: any = {};
                  obj.releaseuser = storageUtils.getUser().name;
                  obj.releasereason = values.releasereason;
                  obj.flag = 'N';
                  obj.id = e.id;
                  obj.holdcontent = e.holdcontent;
                  hold.push(obj);
                });

                const result = await save({
                  data: hold,
                  ip: storageUtils.getUser().ip,
                  name: storageUtils.getUser().name,
                });
                formRef.current?.resetFields();

                commonResult(result, () => {
                  setDataSourceRelease([]);
                });
                setReleaseval('');
                return true;
              }}
            >
              <ProFormTextArea
                width="md"
                name="releasereason"
                label={intl.formatMessage(ReleaseReasonIntl)}
                placeholder={intl.formatMessage(inputIntl)}
                rules={[{ required: true }]}
              />
            </ProForm>
          </ProCard>
          <ProCard headerBordered>
            <div style={{ height: 360 }}>
              <ProTable
                columns={columnsrelease}
                dataSource={dataSourceRelease}
                rowKey="id"
                search={false}
              />
            </div>
          </ProCard>
        </ProCard>
        {/**弹出层 */}
        <UserModal
          visible={{ visible, setVisible }}
          dataSourceRelease={{ dataSourceRelease, setDataSourceRelease }}
          editRow={editRow}
          tabRef={actionRef}
        />
      </ProCard.TabPane>
    </ProCard>
  );
};
