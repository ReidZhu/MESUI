import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { useAccess, Access, useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, message, Popover } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, EditOutlined, PlusSquareFilled } from '@ant-design/icons';
import UserModal from './components/TableModal'
import ExcleUpload from '@/components/ExcleUpload';

import { getData, deleteData, addBatch } from './api';
import { commonResult } from '@/utils/resultUtils';
import { createExcle, dataFormat, readerExcle } from '@/utils/excleUtils';
import storageUtils from '@/utils/storageUtils';
import { formatparams } from '@/utils/utils';
import { Selectmfgprocesstype } from '@/components/FormItem';
import { addIntl, createtimeIntl, createuserIntl, ctmfgprocesstypeIntl, deleteornoIntl, descriptionIntl, noIntl, operationIntl, stageIntl } from '@/utils/intl';
import { PageHeaderWrapper } from '@ant-design/pro-layout';




export default () => {
    const intl = useIntl();
    //列表数据 
    const [dataSource, setDataSource] = useState([]);
    //modal显示隐藏
    const [visible, setVisible] = useState(false);
    //修改行
    const [editRow, setEditRow] = useState({});
    //权限验证
    const access = useAccess();
    //操作Table
    const actionRef = useRef<ActionType>();



    const columns: ProColumns[] = [
        {
            title: intl.formatMessage(noIntl),
            dataIndex: 'id',
            width: 60,
            hideInSearch: true,
        },
        {
            title: intl.formatMessage(stageIntl),
            dataIndex: 'stage',
        },
        {
            title: intl.formatMessage(ctmfgprocesstypeIntl),
            dataIndex: 'mfgprocesstype',
            renderFormItem:(key,row)=>{ 
                return <Selectmfgprocesstype lable={1}/>;
              }
        },
        {
            title: intl.formatMessage(descriptionIntl),
            dataIndex: 'description',
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
            render: (_, record) => [
                <Access accessible={access.lableFilter("base:stage:update")} >
                    <Button type="text" icon={<EditOutlined />} onClick={() => { setEditRow(record); setVisible(true); }}></Button>
                </Access>
                ,
                <Access accessible={access.lableFilter("base:stage:delete")} >
                    <Popconfirm
                        title={intl.formatMessage(deleteornoIntl)}
                        onConfirm={() => { deleteRow(record.stage) }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />}>

                        </Button>
                    </Popconfirm>
                </Access>


            ]
        },
    ];


    /**
     * 逻辑删除
     * @param params 
     */
    const deleteRow = async (stage: any) => {
        const result = await deleteData(stage);
        commonResult(result)
        actionRef!.current!.reload()
    }

    const dowonloadData = () => {
        const newData = dataFormat(dataSource, ["stage", "mfgprocesstype", "description", "createuser", "createtime"])

        createExcle(newData, "B01-data", ["站点", "段别", "备注", "创建人", "创建时间"])
    }
    const dowonloadModel = () => {
        createExcle([{ a: '站点', b: '段别', c: '备注' }], "B01Model")
        return 1;
    }

    const uploadExcle = (info: any) => {
        if (info.file.status === 'done') {
            const { name } = storageUtils.getUser()
            readerExcle(info.file.originFileObj, ["stage", "mfgprocesstype", "description", "createuser"], async(result: any) => {
                let params= formatparams(result)
                commonResult(await addBatch({data:params})) 
                actionRef!.current!.reload()
                message.success(`${info.file.name} file uploaded successfully`);
            }, { createuser: name });
        }
    }

    return (
        <>
<PageHeaderWrapper title={false}>

            <ProTable
                headerTitle={
                    <div>
                        <Access accessible={access.lableFilter("base:stage:download")} >
                            <a style={{ margin: '0 10px' }}>
                                <ArrowDownOutlined onClick={dowonloadData} />
                            </a>
                        </Access>

                        <Access accessible={access.lableFilter("base:stage:batch")} >
                            <a >
                                <Popover placement="bottom" content={<ExcleUpload current={1} downloadModel={dowonloadModel} uploadModel={uploadExcle} />} trigger="click">
                                    <ArrowUpOutlined />
                                </Popover>
                            </a>
                        </Access>
                    </div>

                }
                actionRef={actionRef}
                columns={columns}
                request={async (values: any) => {
                    values =formatparams(values)
                    commonResult(await getData(values), (result: any) => { setDataSource(result) }, false)
                    return { data: dataSource };
                }}
                dataSource={dataSource}
                toolBarRender={() => [
                    <Access accessible={access.lableFilter("base:stage:add")} >
                        <Button type="primary" icon={<PlusSquareFilled />} onClick={() => { setEditRow({}); setVisible(true); }}>
                           {intl.formatMessage(addIntl)}
                            </Button>
                    </Access>

                ]}
            />
            {/**弹出层 */}
            <UserModal visible={{ visible, setVisible }} editRow={editRow} tabRef={actionRef} />


            </PageHeaderWrapper>
        </>
    );
};