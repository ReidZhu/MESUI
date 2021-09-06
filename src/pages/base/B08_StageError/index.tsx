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
import { findAllStageError, AddStageError, FixStageError, DelStageError, addList } from './service';
import { findAllStage, findAllLine, findAllError, findAllModel } from '@/services/select';
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
  errorcodeIntl,
  faildeleteIntl,
  inputIntl,
  Model,
  noIntl,
  operationIntl,
  RouteName,
  selectIntl,
  stageIntl,
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

export type MesStageErrorCode = {
  id: React.Key;
  model?: string;
  stage?: string;
  errorcode?: string;
  createuser?: string;
  createtime?: string;
};

export default () => {
  const intl = useIntl();
  //列表数据
  const [dataSource, setDataSource] = useState<MesStageErrorCode[]>([]);
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
  //不良代码
  const [errorcode, setErrorcode] = useState<[]>([]);
  //Model
  const [models, setModels] = useState<[]>([]);

  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    getAllStage();
    getAllErrorcode();
    getAllModels();
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
  //获取不良代碼
  const getAllErrorcode = async () => {
    const errors = await findAllError();
    if (errors.status == 200) {
      setErrorcode(errors.data);
    } else {
      message.error(errors.msg);
    }
  };
  //获取Model
  const getAllModels = async () => {
    const results = await findAllModel();
    if (results.status == 200) {
      setModels(results.data);
    } else {
      message.error(results.msg);
    }
  };

  const columns: ProColumns<MesStageErrorCode>[] = [
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
      title: intl.formatMessage(stageIntl),
      dataIndex: 'stage',
    },
    {
      title: intl.formatMessage(errorcodeIntl),
      dataIndex: 'errorcode',
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
        <Access accessible={access.lableFilter('base:stageerror:update')}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditRow(record);
              setVisible(true);
            }}
          ></Button>
        </Access>,

        <Access accessible={access.lableFilter('base:stageerror:delete')}>
          <Popconfirm
            title={intl.formatMessage(deleteornoIntl)}
            onConfirm={async () => {
              console.log(record, '2222222222222222222');
              const result = await DelStageError({ id: record.id });
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
      'model',
      'stage',
      'errorcode',
      'createuser',
      'createtime',
    ]);

    createExcle(newData, 'B08_date', ['機種', '站點', '不良代碼', '人員', '时间']);
  };
  const dowonloadModel = () => {
    createExcle([{ a: '機種', b: '站點', c: '不良代碼' }], 'B08StageError');
    return 1;
  };

  const uploadExcle = (info: any) => {
    if (info.file.status === 'done') {
      const { name } = storageUtils.getUser();
      readerExcle(
        info.file.originFileObj,
        ['model', 'stage', 'errorcode'],
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
            <Access accessible={access.lableFilter('base:stageerror:download')}>
              <a style={{ margin: '0 10px' }}>
                <ArrowDownOutlined onClick={dowonloadData} />
              </a>
            </Access>

            <Access accessible={access.lableFilter('base:stageerror:batch')}>
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
          console.log(params as MesStageErrorCode, 'MesStageErrorCode');
          const result = await findAllStageError(params as MesStageErrorCode);
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
          <Access accessible={access.lableFilter('base:stageerror:add')}>
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
        model: string;
        stage: string;
        errorcode: string;
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
            let MesStageErrorCode: any = {};
            MesStageErrorCode.createuser = storageUtils.getUser().name;
            MesStageErrorCode.model = formatparams(values.model);
            MesStageErrorCode.stage = values.stage;
            MesStageErrorCode.errorcode = values.errorcode;
            const result = await AddStageError({ data: MesStageErrorCode });
            if (result.status == 200) {
              message.success(intl.formatMessage(successaddIntl));
              actionRef.current?.reload();
              setVisible(false);
              return true;
            } else {
              message.error(result.msg);
            }
          } else {
            let MesStageErrorCode: any = {};
            MesStageErrorCode.id = editRow.id;
            MesStageErrorCode.createuser = storageUtils.getUser().name;
            MesStageErrorCode.model = values.model;
            MesStageErrorCode.stage = values.stage.split(':')[0];
            MesStageErrorCode.errorcode = values.errorcode;
            const result = await FixStageError({ data: MesStageErrorCode });
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
          options={models}
          width="md"
          name="model"
          label={intl.formatMessage(Model)}
          placeholder={intl.formatMessage(selectIntl)}
        />
        {/* <ProFormText width="md" name="stage" label="站點" placeholder="請輸入站點" />
        <ProFormText width="md" name="errorcode" label="不良代碼" placeholder="請輸入不良代碼" /> */}
        <ProFormSelect
          request={async () => stage}
          width="md"
          name="stage"
          label={intl.formatMessage(stageIntl)}
          placeholder={intl.formatMessage(selectIntl)}
        />
        <ProFormSelect
          options={errorcode}
          width="md"
          name="errorcode"
          label={intl.formatMessage(errorcodeIntl)}
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
