import React from 'react';
import {  message } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';
import { ActionType } from '@ant-design/pro-table';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

interface TableModal{
  visible:{
    visible:Boolean,
    setVisible:Function
  }
  editRow:any
  tabRef:any
}

export default (props:TableModal) => {
  const {visible,editRow,tabRef} = props
  return (
    <div >
      <ModalForm<{
        name: string;
        age: number;
        address:string;
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
          await waitTime(2000);
          console.log(values.name);
          message.success('提交成功');
          visible.setVisible(false)
          return true;
        }}
      >
          <ProFormText width="md" name="name" label="姓名" placeholder="请输入姓名" />
          <ProFormText width="md" name="age" label="年龄" placeholder="请输入年龄" />
          <ProFormText width="md" name="address" label="地址" placeholder="请输入地址" />
      </ModalForm>
    </div>
  );
};