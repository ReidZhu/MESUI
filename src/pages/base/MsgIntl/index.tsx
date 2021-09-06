import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm } from 'antd';
import {  DeleteOutlined, EditOutlined, PlusSquareFilled } from '@ant-design/icons';
import UserModal from './components/TableModal'
import {getData,deleteData} from './api';
import { commonResult } from '@/utils/resultUtils';
import { formatparams } from '@/utils/utils';
import { addIntl, deleteornoIntl,operationIntl } from '@/utils/intl';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

export default () => {
    const intl = useIntl();
    //列表数据 
    const [dataSource, setDataSource] = useState([]);
    //modal显示隐藏
    const [visible, setVisible] = useState(false);
    //修改行
    const [editRow, setEditRow] = useState({});
    //操作Table
    const actionRef = useRef<ActionType>();



    const columns: ProColumns[] = [
        {
            title: 'tag',
            dataIndex: 'tag',
            copyable:true
        },
        {
            title: 'cn',
            dataIndex: 'cn',
            hideInSearch:true
        },
        {
            title: 'hk',
            dataIndex: 'hk',
            hideInSearch:true

        },
        {
            title: 'us',
            dataIndex: 'us',
            hideInSearch:true

        },
        {
            title: intl.formatMessage(operationIntl),
            key: 'option',
            width: 120,
            valueType: 'option',
            render: (_, record) => [
                    <Button type="text" icon={<EditOutlined />} onClick={() => { setEditRow(record); setVisible(true); }}></Button>
                ,
                    <Popconfirm
                        title={intl.formatMessage(deleteornoIntl)}
                        onConfirm={() => { deleteRow(record.tag) }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />}>

                        </Button>
                    </Popconfirm>

            ]
        },
    ];


    /**
     * 删除
     * @param params 
     */
    const deleteRow = async (tag: any) => {
        const result = await deleteData(tag);
        commonResult(result)
        actionRef!.current!.reload()
    }


    return (
        <>
<PageHeaderWrapper title={false}>

            <ProTable
                actionRef={actionRef}
                columns={columns}
                request={async (values: any) => {
                    commonResult(await getData(values), (result: any) => { setDataSource(result) }, false)
                    return { data: dataSource };
                }}
                dataSource={dataSource}
                toolBarRender={() => [
                        <Button type="primary" icon={<PlusSquareFilled />} onClick={() => { setEditRow({}); setVisible(true); }}>
                           {intl.formatMessage(addIntl)}
                            </Button>

                ]}
            />
            {/**弹出层 */}
            <UserModal visible={{ visible, setVisible }} editRow={editRow} tabRef={actionRef} />


            </PageHeaderWrapper>
        </>
    );
};