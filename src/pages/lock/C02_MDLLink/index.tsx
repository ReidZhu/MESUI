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
import { findAllMdlLink, AddMdlLink, FixMdlLink, DelMdlLink } from './service';
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
  inputIntl,
  MDLUpn,
  noIntl,
  operationIntl,
  selectIntl,
  successaddIntl,
  successdeleteIntl,
  successupdateIntl,
  beUpn,
  Upn,
} from '@/utils/intl';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export type MesMdlUpnLink = {
  id: React.Key;
  beupn?: string;
  mdlupn?: string;
  createuser?: string;
  createdate?: string;
};

export default () => {
  const intl = useIntl();
  //列表数据
  const [dataSource, setDataSource] = useState<MesMdlUpnLink[]>([]);
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
  //beupn
  const [beupn, setBeupn] = useState<[]>([]);
  //mdlupn
  const [mdlupn, setMdlupn] = useState<[]>([]);

  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    getBEUpn();
    getMDLUpn();
  }, []);

  useEffect(() => {}, [dataSource]);

  //获取BEUpn
  const getBEUpn = async () => {
    const upns = await findAllUpn('BE');
    if (upns.status == 200) {
      setBeupn(upns.data);
    } else {
      message.error(upns.msg);
    }
  };
    //获取MDLUpn
  const getMDLUpn = async () => {
    const upns = await findAllUpn('MDL');
    if (upns.status == 200) {
      setMdlupn(upns.data);
    } else {
      message.error(upns.msg);
    }
  };

  const columns: ProColumns<MesMdlUpnLink>[] = [
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
      title: intl.formatMessage(beUpn),
      dataIndex: 'beupn',
    },
    {
      title: intl.formatMessage(MDLUpn),
      dataIndex: 'mdlupn',
    },
    {
      title: intl.formatMessage(createuserIntl),
      dataIndex: 'createuser',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(createtimeIntl),
      dataIndex: 'createdate',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage(operationIntl),
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, record: any) => [
        <Access accessible={access.lableFilter('lock:mdllink:update')}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditRow(record);
              setVisible(true);
            }}
          ></Button>
        </Access>,

        <Access accessible={access.lableFilter('lock:mdllink:delete')}>
          <Popconfirm
            title={intl.formatMessage(deleteornoIntl)}
            onConfirm={async () => {
              console.log(record, '2222222222222222222');
              const result = await DelMdlLink({ id: record.id });
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
    const newData = dataFormat(dataSource, ['beupn', 'mdlupn', 'createuser', 'createdate']);

    createExcle(newData, 'C02_date', ['料號', 'MDL料號', '人員', '时间']);
  };
  const dowonloadModel = () => {
    createExcle([{ a: '料號', b: 'MDL料號' }], 'C02MdlUpnLink');
    return 1;
  };

  const uploadExcle = (info: any) => {
    if (info.file.status === 'done') {
      const { name } = storageUtils.getUser();
      readerExcle(
        info.file.originFileObj,
        ['beupn', 'mdlupn'],
        async (result: any) => {
          let params = formatparams(result);
          commonResult(await AddMdlLink({ data: params }));
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
            <Access accessible={access.lableFilter('lock:mdllink:download')}>
              <a style={{ margin: '0 10px' }}>
                <ArrowDownOutlined onClick={dowonloadData} />
              </a>
            </Access>

            <Access accessible={access.lableFilter('lock:mdllink:batch')}>
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
          console.log(params as MesMdlUpnLink, 'MesMdlUpnLink');
          const result = await findAllMdlLink(params as MesMdlUpnLink);
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
          <Access accessible={access.lableFilter('lock:mdllink:add')}>
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
        beupn: string;
        mdlupn: string;
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
            let list: any = [];
            let MesMdlUpnLink: any = {};
            MesMdlUpnLink.createuser = storageUtils.getUser().name;
            MesMdlUpnLink.beupn = values.beupn;
            MesMdlUpnLink.mdlupn = values.mdlupn;
            list.push(MesMdlUpnLink);
            const result = await AddMdlLink({ data: list });
            if (result.status == 200) {
              message.success(intl.formatMessage(successaddIntl));
              actionRef.current?.reload();
              setVisible(false);
              return true;
            } else {
              message.error(result.msg);
            }
          } else {
            let MesMdlUpnLink: any = {};
            MesMdlUpnLink.id = editRow.id;
            MesMdlUpnLink.createuser = storageUtils.getUser().name;
            MesMdlUpnLink.beupn = values.beupn;
            MesMdlUpnLink.mdlupn = values.mdlupn;
            const result = await FixMdlLink({ data: MesMdlUpnLink });
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
        <ProFormSelect
          options={beupn}
          width="md"
          name="beupn"
          label={intl.formatMessage(Upn)}
          placeholder={intl.formatMessage(selectIntl)}
        />
        <ProFormSelect
          options={mdlupn}
          width="md"
          name="mdlupn"
          label={intl.formatMessage(MDLUpn)}
          placeholder={intl.formatMessage(selectIntl)}
        />
        {/* <ProFormText
          width="md"
          name="mdlupn"
          label={intl.formatMessage(MDLUpn)}
          placeholder={intl.formatMessage(inputIntl)}
        /> */}
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
