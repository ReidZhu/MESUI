import React from 'react';
import {  message } from 'antd';
import ProForm, {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { useIntl } from 'umi';
import { cpnIntl, inputIntl, selectIntl, statusntl, Upn } from '@/utils/intl';
import { formatparams } from '@/utils/utils';
import storageUtils from '@/utils/storageUtils';
import { commonResult } from '@/utils/resultUtils';
import { editB09, addB09 } from '../api';



interface TableModal{
  visible:{
    visible:Boolean,
    setVisible:Function
  }
  editRow:any
  tabRef:any
  selectOption:{upn:any,item:any}
}

export default (props:TableModal) => {
  let intl = useIntl();

  const {visible,editRow,tabRef,selectOption} = props
  return (
    <div >
      <ModalForm<{
        upn: string;
        item: number;
        cpn:string;
        createuser:string;
      }>
        title="数据保存"
        width={500}
        initialValues={editRow}
        //layout='horizontal'
        visible={visible.visible}
        modalProps={{
          onCancel: () =>{ 
            tabRef.current.reload()
            visible.setVisible(false)
          },
          destroyOnClose: true,
        }}
        onFinish={async (values) => {
          values.cpn = formatparams(values.cpn)
          values.createuser = storageUtils.getUser().name
          if(editRow.upn){
            //修改
            commonResult(await editB09(values))
          }else{
            //添加
            commonResult(await addB09(values))
          }
          tabRef.current.reload()
          visible.setVisible(false)
          return true;
        }}
      >
          <ProFormSelect
            name="upn"
            label={intl.formatMessage(Upn)}
            options={selectOption.upn}
            disabled ={editRow.upn}
            placeholder={intl.formatMessage(selectIntl)}
            rules={[{ required: true}]}
            width='md'
          />
          <ProFormSelect
            name="item"
            label={intl.formatMessage(statusntl)}
            disabled ={editRow.upn}
            options={selectOption.item}
            placeholder={intl.formatMessage(selectIntl)}
            rules={[{ required: true}]}
            width='md'
          />
          <ProFormText name="cpn" label={intl.formatMessage(cpnIntl)} placeholder={intl.formatMessage(inputIntl)} width='md' rules={[{ required: true}]} />
      </ModalForm>
    </div>
  );
};