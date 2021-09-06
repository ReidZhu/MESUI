import React, { useEffect, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { useAccess, Access, useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Tree, Button, Popconfirm, message, Row, Col, Card, Popover, Form } from 'antd';
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
import { findAllUpnLink, AddUpnLink, FixUpnLink, DelUpnLink, findAllArrayidInfo } from './service';
import { findAllUpn, findAllRoute, findAllModel } from '@/services/select';
import { commonResult } from '@/utils/resultUtils';
import storageUtils from '@/utils/storageUtils';
import ExcleUpload from '@/components/ExcleUpload';
import { createExcle, dataFormat, readerExcle } from '@/utils/excleUtils';
import { formatparams } from '@/utils/utils';
import {
  addIntl,
  arrayidIntl,
  aryLotIntl,
  aryPalletIntl,
  beUpn,
  createtimeIntl,
  createuserIntl,
  dataStorage,
  deleteornoIntl,
  faildeleteIntl,
  inputIntl,
  Model,
  noIntl,
  numberIntl,
  operationIntl,
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

export type MesModelLink = {
  id: React.Key;
  upn?: string;
  arylot?: string;
  aryqty?: number;
  createuser?: string;
  createdate?: string;
};

export default () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  //列表数据
  const [dataSource, setDataSource] = useState<MesModelLink[]>([]);
  const [dataSource1, setDataSource1] = useState<any>([]);
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
  //model
  const [model, setModel] = useState<[]>([]);

  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    getAllModel();
  }, []);

  useEffect(() => {}, [dataSource]);
  useEffect(() => {}, [dataSource1]);

  //获取Upn
  // const getAllUpn = async () => {
  //   const upns = await findAllUpn('BE');
  //   if (upns.status == 200) {
  //     setUpn(upns.data);
  //   } else {
  //     message.error(upns.msg);
  //   }
  // };
  //获取Model
  const getAllModel = async () => {
    const models = await findAllModel();
    if (models.status == 200) {
      setModel(models.data);
    } else {
      message.error(models.msg);
    }
  };

  const columns: ProColumns<MesModelLink>[] = [
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
      title: intl.formatMessage(Model),
      dataIndex: 'model',
    },
    {
      title: intl.formatMessage(aryPalletIntl),
      dataIndex: 'arypalletid',
    },
    {
      title: intl.formatMessage(numberIntl),
      dataIndex: 'aryqty',
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
        <Access accessible={access.lableFilter('lock:modellink:update')}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditRow(record);
              setVisible(true);
              setDataSource1([]);
            }}
          ></Button>
        </Access>,

        <Access accessible={access.lableFilter('lock:modellink:delete')}>
          <Popconfirm
            title={intl.formatMessage(deleteornoIntl)}
            onConfirm={async () => {
              console.log(record, '2222222222222222222');
              const result = await DelUpnLink({ ids: [record.id] });
              if (result.status == 200) {
                message.success(intl.formatMessage(successdeleteIntl));
                actionRef.current?.reload();
                setVisible(false);
                return true;
              } else {
                message.error(result.msg);
              }
            }}
            // onCancel={() => {
            //   message.error(intl.formatMessage(faildeleteIntl));
            // }}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </Access>,
      ],
    },
  ];

  const columns1: ProColumns[] = [
    {
      title: intl.formatMessage(aryPalletIntl),
      key: 'palletid',
      dataIndex: 'palletid',
      width: 200,
    },
    {
      title: intl.formatMessage(arrayidIntl),
      key: 'arrayid',
      dataIndex: 'arrayid',
      width: 200,
    },
    {
      title: intl.formatMessage(numberIntl),
      key: 'qty',
      dataIndex: 'qty',
      width: 150,
    },
  ];

  async function getpalletdata(e) {
    const result = await findAllArrayidInfo({ palletid: formatparams(e) });
    console.log(result, 'result');
    commonResult(
      result,
      (data: any) => {
        setDataSource1([...dataSource1, ...result.data]);
      },
      false,
    );
  }

  async function submit() {
    console.log(editRow);
    await waitTime(2000);
    if (JSON.stringify(editRow) == '{}') {
      let list: any = [];
      let MesModelLink: any = {};
      MesModelLink.createuser = storageUtils.getUser().name;
      MesModelLink.model = form.getFieldValue('model');
      MesModelLink.arypalletid = formatparams(form.getFieldValue('arypalletid'));
      console.log(MesModelLink);
      list.push(MesModelLink);
      console.log(list);
      const result = await AddUpnLink({ data: list, name: storageUtils.getUser().name });
      if (result.status == 200) {
        message.success(intl.formatMessage(successaddIntl));
        actionRef.current?.reload();
        setVisible(false);
        return true;
      } else {
        message.error(result.msg);
      }
    } else {
      let MesModelLink: any = {};
      MesModelLink.id = editRow.id;
      MesModelLink.createuser = storageUtils.getUser().name;
      MesModelLink.model = form.getFieldValue('model');
      MesModelLink.arypalletid = formatparams(form.getFieldValue('arypalletid'));
      const result = await FixUpnLink({ data: MesModelLink });
      if (result.status == 200) {
        message.success(intl.formatMessage(successupdateIntl));
        actionRef.current?.reload();
        setVisible(false);
        return true;
      } else {
        message.error(result.msg);
      }
    }
  }

  const dowonloadData = () => {
    const newData = dataFormat(dataSource, [
      'model',
      'arypalletid',
      'aryqty',
      'createuser',
      'createdate',
    ]);

    createExcle(newData, 'C01_date', ['model', '來料棧板號', '數量', '人員', '时间']);
  };
  const dowonloadModel = () => {
    createExcle([{ a: 'model', b: '來料棧板號' }], 'C01ModelLink');
    return 1;
  };

  const uploadExcle = (info: any) => {
    if (info.file.status === 'done') {
      const { name } = storageUtils.getUser();
      readerExcle(
        info.file.originFileObj,
        ['model', 'arypalletid'],
        async (result: any) => {
          let params = formatparams(result);
          commonResult(await AddUpnLink({ data: params, name: name }));
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
            <Access accessible={access.lableFilter('lock:modellink:download')}>
              <a style={{ margin: '0 10px' }}>
                <ArrowDownOutlined onClick={dowonloadData} />
              </a>
            </Access>

            <Access accessible={access.lableFilter('lock:modellink:batch')}>
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
          console.log(params as MesModelLink, 'MesModelLink');
          const result = await findAllUpnLink(params as MesModelLink);
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
          <Access accessible={access.lableFilter('lock:modellink:add')}>
            <Button
              type="primary"
              icon={<PlusSquareFilled />}
              onClick={() => {
                setEditRow({});
                setVisible(true);
                setDataSource1([]);
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
        model: string;
        arypalletid: string;
      }>
        form={form}
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
        submitter={{
          render: (props) => {
            return [<Button type="primary" children="提交" onClick={submit} />];
          },
        }}
        // onFinish={async (values) => {
        //   console.log(editRow);
        //   await waitTime(2000);
        //   if (JSON.stringify(editRow) == '{}') {
        //     let list: any = [];
        //     let MesModelLink: any = {};
        //     MesModelLink.createuser = storageUtils.getUser().name;
        //     MesModelLink.model = values.model;
        //     MesModelLink.arypalletid = formatparams(values.arypalletid);
        //     console.log(MesModelLink);
        //     list.push(MesModelLink);
        //     console.log(list);
        //     const result = await AddUpnLink({ data: list });
        //     if (result.status == 200) {
        //       message.success(intl.formatMessage(successaddIntl));
        //       actionRef.current?.reload();
        //       setVisible(false);
        //       return true;
        //     } else {
        //       message.error(result.msg);
        //     }
        //   } else {
        //     let MesModelLink: any = {};
        //     MesModelLink.id = editRow.id;
        //     MesModelLink.createuser = storageUtils.getUser().name;
        //     MesModelLink.model = values.model;
        //     MesModelLink.arypalletid = values.arypalletid;
        //     const result = await FixUpnLink({ data: MesModelLink });
        //     if (result.status == 200) {
        //       message.success(intl.formatMessage(successupdateIntl));
        //       actionRef.current?.reload();
        //       setVisible(false);
        //       return true;
        //     } else {
        //       message.error(result.msg);
        //     }
        //   }
        // }}
      >
        <ProFormSelect
          options={model}
          width="md"
          name="model"
          label={intl.formatMessage(Model)}
          placeholder={intl.formatMessage(selectIntl)}
        />
        <ProFormText
          width="md"
          name="arypalletid"
          label={intl.formatMessage(aryPalletIntl)}
          placeholder={intl.formatMessage(inputIntl)}
          fieldProps={{
            onPressEnter: (e) => {
              //console.log(e.currentTarget.value);
              getpalletdata(e.currentTarget.value);
            },
          }}
        />
        <ProTable
          columns={columns1}
          dataSource={dataSource1}
          search={false}
          style={{ height: '300px' }}
          scroll={{ y: '200px' }}
          //pagination={{ defaultPageSize: 5 }}
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
