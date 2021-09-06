import React, { useEffect, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { useAccess, Access, useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Tree, Button, Popconfirm, message, Row, Col, Card, Popover } from 'antd';
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
import { findAllFlow, AddFlow, FixFlow, DelFlow, addList } from './service';
import { findAllUpn, findAllRoute } from '@/services/select';
import { commonResult } from '@/utils/resultUtils';
import storageUtils from '@/utils/storageUtils';
import ExcleUpload from '@/components/ExcleUpload';
import { createExcle, dataFormat, readerExcle } from '@/utils/excleUtils';
import { formatparams } from '@/utils/utils';
import {
  addIntl,
  createtimeIntl,
  createuserIntl,
  dataStorage,
  deleteornoIntl,
  faildeleteIntl,
  noIntl,
  operationIntl,
  RouteName,
  selectIntl,
  successaddIntl,
  successdeleteIntl,
  successupdateIntl,
  Upn,
} from '@/utils/intl';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export type MesUpnRoute = {
  id: React.Key;
  upn?: string;
  routename?: string;
  createuser?: string;
  createtime?: string;
};

export default () => {
  const intl = useIntl();
  //列表数据
  const [dataSource, setDataSource] = useState<MesUpnRoute[]>([]);
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
  //Upn
  const [upn, setUpn] = useState<[]>([]);
  //流程
  const [route, setRoute] = useState<[]>([]);

  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    getAllUpn();
    getAllRoute();
  }, []);

  useEffect(() => {}, [dataSource]);

  //获取Upn
  const getAllUpn = async () => {
    const upns = await findAllUpn('');
    if (upns.status == 200) {
      setUpn(upns.data);
    } else {
      message.error(upns.msg);
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

  const columns: ProColumns<MesUpnRoute>[] = [
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
      title: intl.formatMessage(Upn),
      dataIndex: 'upn',
    },
    {
      title: intl.formatMessage(RouteName),
      dataIndex: 'routename',
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
        <Access accessible={access.lableFilter('base:flow:update')}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditRow(record);
              setVisible(true);
            }}
          ></Button>
        </Access>,

        <Access accessible={access.lableFilter('base:flow:delete')}>
          <Popconfirm
            title={intl.formatMessage(deleteornoIntl)}
            onConfirm={async () => {
              console.log(record, '2222222222222222222');
              const result = await DelFlow({ id: record.id });
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
    const newData = dataFormat(dataSource, ['upn', 'routename', 'createuser', 'createtime']);

    createExcle(newData, 'B07_date', ['料號', '流程名稱', '人員', '时间']);
  };
  const dowonloadModel = () => {
    createExcle([{ a: '料號', b: '流程名稱' }], 'B07Flow');
    return 1;
  };

  const uploadExcle = (info: any) => {
    if (info.file.status === 'done') {
      const { name } = storageUtils.getUser();
      readerExcle(
        info.file.originFileObj,
        ['upn', 'routename'],
        async (result: any) => {
          let params = formatparams(result);
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
      <ProTable
        headerTitle={
          <div>
            <Access accessible={access.lableFilter('base:flow:download')}>
              <a style={{ margin: '0 10px' }}>
                <ArrowDownOutlined onClick={dowonloadData} />
              </a>
            </Access>

            <Access accessible={access.lableFilter('base:flow:batch')}>
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
          console.log(params as MesUpnRoute, 'MesUpnRoute');
          const result = await findAllFlow(params as MesUpnRoute);
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
          <Access accessible={access.lableFilter('base:flow:add')}>
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
          </Access>,
        ]}
      />

      {/**弹出层 */}
      {/* <UserModal visible={{ visible, setVisible }} editRow={editRow} tabRef={actionRef} /> */}
      <ModalForm<{
        upn: string;
        routename: string;
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
            let MesUpnRoute: any = {};
            MesUpnRoute.createuser = storageUtils.getUser().name;
            MesUpnRoute.upn = values.upn;
            MesUpnRoute.routename = values.routename;
            const result = await AddFlow({ data: MesUpnRoute });
            if (result.status == 200) {
              message.success(intl.formatMessage(successaddIntl));
              actionRef.current?.reload();
              setVisible(false);
              return true;
            } else {
              message.error(result.msg);
            }
          } else {
            let MesUpnRoute: any = {};
            MesUpnRoute.id = editRow.id;
            MesUpnRoute.createuser = storageUtils.getUser().name;
            MesUpnRoute.upn = values.upn;
            MesUpnRoute.routename = values.routename;
            const result = await FixFlow({ data: MesUpnRoute });
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
        {/* <ProFormText width="md" name="upn" label="料號" placeholder="請輸入upn" />
        <ProFormText width="md" name="routename" label="流程名稱" placeholder="請輸入流程名稱" /> */}
        <ProFormSelect
          options={upn}
          width="md"
          name="upn"
          label={intl.formatMessage(Upn)}
          placeholder={intl.formatMessage(selectIntl)}
        />
        <ProFormSelect
          options={route}
          width="md"
          name="routename"
          label={intl.formatMessage(RouteName)}
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
