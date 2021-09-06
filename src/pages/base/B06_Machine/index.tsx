import React, { useEffect, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { useAccess, Access, useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Tree, Button, Popconfirm, message, Row, Col, Card } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useModel } from 'umi';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusSquareFilled,
} from '@ant-design/icons';
//import UserModal from '../Demo/components/TableModal';
//import PrintDemo from '../Demo/components/PrintDemo';
//import arrayMove from 'array-move';
import ReactToPrint from 'react-to-print';
import ProForm, { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { findAllMachine, AddMachine, FixMachine, DelMachine, findTree, addList } from './service';
import { findAllStage, findAllLine } from '@/services/select';
import { commonResult } from '@/utils/resultUtils';
import storageUtils from '@/utils/storageUtils';
import { Popover } from 'antd';
import { formatparams } from '@/utils/utils';
import { createExcle, dataFormat, readerExcle } from '@/utils/excleUtils';
import ExcleUpload from '@/components/ExcleUpload';
import {
  addIntl,
  createtimeIntl,
  createuserIntl,
  dataStorage,
  deleteornoIntl,
  faildeleteIntl,
  inputIntl,
  Line,
  machineidIntl,
  noIntl,
  operationIntl,
  selectIntl,
  stageIntl,
  successaddIntl,
  successdeleteIntl,
  successupdateIntl,
} from '@/utils/intl';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export type MesStageMachine = {
  id: React.Key;
  machineid?: string;
  stage?: string;
  line?: string;
  createuser?: string;
  createtime?: string;
};
export type AllTree = {
  title: React.Key;
  key?: string;
  children?: AllTree[];
};

export default () => {
  const intl = useIntl();
  //列表数据
  const [dataSource, setDataSource] = useState<MesStageMachine[]>([]);
  //modal显示隐藏
  const [visible, setVisible] = useState(false);
  //修改行
  const [editRow, setEditRow] = useState({});
  //打印的element
  const [printContent, setPrintContent] = useState<any>();
  //权限验证
  const access = useAccess();
  //操作Table
  const actionRef = useRef<ActionType>();
  //站点
  const [stage, setStage] = useState<[]>([]);
  //线体
  const [line, setLine] = useState<[]>([]);
  //Tree
  const [tree, setTree] = useState<AllTree[]>([]);

  const { initialState } = useModel('@@initialState');

  const [showLine, setShowLine] = useState<boolean | { showLeafIcon: boolean }>(true);
  const [showIcon, setShowIcon] = useState<boolean>(false);
  const [showLeafIcon, setShowLeafIcon] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(true);

  const onSelect = async (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
    if (selectedKeys[0] != null) {
      let arr: string[] = selectedKeys[0].toString().split(';');
      let MesStageMachine: any = {};
      MesStageMachine.stage = arr[0];
      MesStageMachine.line = arr[1];
      const result = await findAllMachine(MesStageMachine as MesStageMachine);
      if (result.status == 200) {
        console.log(result);
        setDataSource(result.data);
        return true;
      }
    }
  };

  const onSetLeafIcon = (checked: boolean) => {
    setShowLeafIcon(checked);
    setShowLine({ showLeafIcon: checked });
  };

  const onSetShowLine = (checked: boolean) => {
    setShowLine(checked ? { showLeafIcon } : false);
  };

  useEffect(() => {
    getAllStage();
    getAllLine();
    getTree();
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
  //获取Tree
  const getTree = async () => {
    const trees = await findTree();
    if (trees.status == 200) {
      setTree(trees.data);
    } else {
      message.error(trees.msg);
    }
  };

  const columns: ProColumns<MesStageMachine>[] = [
    {
      title: intl.formatMessage(noIntl),
      dataIndex: 'id',
      width: 100,
      className: 'drag-visible',
      hideInTable: true,
      hideInSearch: true,
      //render: () => <DragHandle />,
    },
    {
      title: intl.formatMessage(machineidIntl),
      dataIndex: 'machineid',
    },
    {
      title: intl.formatMessage(stageIntl),
      dataIndex: 'stage',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(Line),
      dataIndex: 'line',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(createuserIntl),
      dataIndex: 'createuser',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(createtimeIntl),
      dataIndex: 'createtime',
      hideInSearch: true,
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
            icon={<EditOutlined />}
            onClick={() => {
              setEditRow(record);
              setVisible(true);
            }}
          ></Button>
        </Access>,

        <Access accessible={access.lableFilter('base:machine:delete')}>
          <Popconfirm
            title={intl.formatMessage(deleteornoIntl)}
            onConfirm={async () => {
              console.log(record, '2222222222222222222');
              const result = await DelMachine({ id: record.id });
              if (result.status == 200) {
                message.success(intl.formatMessage(successdeleteIntl));
                actionRef.current?.reload();
                setVisible(false);
                return true;
              } else {
                message.error(result.msg);
              }
            }}
            onCancel={() => {
              message.error(intl.formatMessage(faildeleteIntl));
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </Access>,
      ],
    },
  ];

  const dowonloadData = () => {
    const newData = dataFormat(dataSource, [
      'machineid',
      'stage',
      'line',
      'createuser',
      'createtime',
    ]);

    createExcle(newData, 'B06_date', ['機台編號', '站點', '線體', '人員', '时间']);
  };
  const dowonloadModel = () => {
    createExcle([{ a: '機台編號', b: '站點', c: '線體' }], 'B06Machine');
    return 1;
  };

  const uploadExcle = (info: any) => {
    if (info.file.status === 'done') {
      const { name } = storageUtils.getUser();
      readerExcle(
        info.file.originFileObj,
        ['machineid', 'stage', 'line'],
        async (result: any) => {
          let params = formatparams(result);
          console.log(params, 'params');
          commonResult(await addList({ data: params }));
          actionRef!.current!.reload();
          message.success(`${info.file.name} file uploaded successfully`);
        },
        { createuser: name },
      );
    }
  };

  return (
    <>
      <PageContainer title={false}>
        <Row gutter={12}>
          <Col xl={4} lg={4} md={8} sm={8}>
            <Card title="" bordered={false}>
              <Tree
                defaultExpandParent={show}
                showLine={showLine}
                showIcon={showIcon}
                onSelect={onSelect}
                treeData={tree}
              />
            </Card>
          </Col>
          <Col xl={20} lg={20} md={40} sm={40}>
            <ProTable
              headerTitle={
                <div>
                  <Access accessible={access.lableFilter('base:machine:download')}>
                    <a style={{ margin: '0 10px' }}>
                      <ArrowDownOutlined onClick={dowonloadData} />
                    </a>
                  </Access>

                  <Access accessible={access.lableFilter('base:machine:batch')}>
                    <a>
                      <Popover
                        placement="bottom"
                        content={
                          <ExcleUpload
                            current={1}
                            downloadModel={dowonloadModel}
                            uploadModel={uploadExcle}
                          />
                        }
                        trigger="click"
                      >
                        <ArrowUpOutlined />
                      </Popover>
                    </a>
                  </Access>
                </div>
              }
              actionRef={actionRef}
              columns={columns}
              request={async (params = {}, sort, filter) => {
                //message.success('查询参数=>' + JSON.stringify(values));
                console.log(params as MesStageMachine, 'MesStageMachine');
                const result = await findAllMachine(params as MesStageMachine);
                commonResult(
                  result,
                  (data: any) => {
                    setDataSource(data);
                  },
                  false,
                );
                return { data: dataSource };
              }}
              dataSource={dataSource}
              toolBarRender={() => [
                <Access accessible={access.lableFilter('base:machine:add')}>
                  <Button
                    type="primary"
                    icon={<PlusSquareFilled />}
                    onClick={() => {
                      setEditRow({});
                      setVisible(true);
                    }}
                  >
                    {intl.formatMessage(addIntl)}
                  </Button>
                  ,
                </Access>,
              ]}
            />
          </Col>
        </Row>
      </PageContainer>
      {/**弹出层 */}
      {/* <UserModal visible={{ visible, setVisible }} editRow={editRow} tabRef={actionRef} /> */}
      <ModalForm<{
        machineid: string;
        stage: string;
        line: string;
      }>
        title={intl.formatMessage(dataStorage)}
        width={500}
        initialValues={editRow}
        //layout='horizontal'
        visible={visible}
        modalProps={{
          onCancel: () => {
            //actionRef.current.reload();
            setVisible(false);
          },
          destroyOnClose: true,
        }}
        onFinish={async (values) => {
          console.log(editRow);
          await waitTime(2000);
          if (JSON.stringify(editRow) == '{}') {
            let MesStageMachine: any = {};
            MesStageMachine.createuser = storageUtils.getUser().name;
            MesStageMachine.machineid = formatparams(values.machineid);
            MesStageMachine.stage = values.stage;
            MesStageMachine.line = values.line;
            const result = await AddMachine({ data: MesStageMachine });
            if (result.status == 200) {
              message.success(intl.formatMessage(successaddIntl));
              actionRef.current?.reload();
              setVisible(false);
              return true;
            } else {
              message.error(result.msg);
            }
          } else {
            let MesStageMachine: any = {};
            MesStageMachine.id = editRow.id;
            MesStageMachine.createuser = storageUtils.getUser().name;
            MesStageMachine.machineid = values.machineid;
            MesStageMachine.stage = values.stage.split(':')[0];
            MesStageMachine.line = values.line;
            const result = await FixMachine({ data: MesStageMachine });
            if (result.status == 200) {
              message.success(intl.formatMessage(successupdateIntl));
              actionRef.current?.reload();
              setVisible(false);
              return true;
            } else {
              message.error(result.msg);
            }
          }
        }}
      >
        <ProFormText
          width="md"
          name="machineid"
          label={intl.formatMessage(machineidIntl)}
          placeholder={intl.formatMessage(inputIntl)}
        />
        <ProFormSelect
          request={async () => stage}
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
      </ModalForm>
      {/**打印自定义组件内容 */}
      {/* <div style={{ display: 'none' }}>
        <PrintDemo
          ref={(el: any) => {
            setPrintContent(el);
          }}
        />
      </div> */}

      {/**打印触发器 */}
      {/* <ReactToPrint
        trigger={() => {
          return (
            <a href="#">
              <h1>打印测试</h1>
            </a>
          );
        }}
        content={() => printContent}
      /> */}
    </>
  );
};
