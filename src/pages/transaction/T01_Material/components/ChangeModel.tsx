import React, { useEffect, useRef, useState } from 'react';
import { Form, message } from 'antd';
import { useIntl } from 'umi';
import ProForm, { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { updateData, insertdata } from '../api';
import { findAllModel, findMo, findUpn, findStage, findStageMaterial } from '@/services/select';
import storageUtils from '@/utils/storageUtils';
import {
  dataStorage,
  Model,
  inputIntl,
  selectIntl,
  stageIntl,
  stagematerialIntl,
  qtyIntl,
  Upn,
  moIntl,
  materialIntl,
} from '@/utils/intl';

interface TableModal {
  visible: {
    visiblechange: Boolean;
    setchangeVisible: Function;
  };
  editRow: any;
  tabRef: any;
}
export type MesMaterial = {
  id: React.Key;
  model?: string;
  stage?: string;
  materialname?: string;
};
export default (props: TableModal) => {
  const { visible, editRow, tabRef } = props;
  const [dataSource, setDataSource] = useState<MesMaterial[]>([]);
  // 獲取料件信息
  const [stagematerial, setStageMaterial] = useState<[]>([]);
  // 獲取站点
  const [stage, setStage] = useState<[]>([]);
  // 獲取機種
  const [model, setModel] = useState<[]>([]);
  // 獲取機種
  const [upn, setUpn] = useState<[]>([]);
  // 獲取機種
  const [mo, setMo] = useState<[]>([]);
  //國際化
  const intl = useIntl();
  const [form] = Form.useForm();
  useEffect(() => {
    getAllModel();
  }, []);

  // 获取機種
  const getAllModel = async () => {
    const model = await findAllModel();
    if (model.status == 200) {
      setModel(model.data);
    } else {
      message.error(model.msg);
    }
  };
  useEffect(() => {}, [dataSource]);
  return (
    <div>
      <ModalForm<any>
        title={intl.formatMessage(dataStorage)}
        width={500}
        form={form}
        initialValues={editRow}
        //layout='horizontal'
        visible={visible.visiblechange}
        modalProps={{
          onCancel: () => {
            visible.setchangeVisible(false);
          },
          destroyOnClose: true,
        }}
        onFinish={async (values) => {
          console.log(editRow);
          let user = storageUtils.getUser();
          if (JSON.stringify(editRow) == '{}') {
            let MesMaterial: any = {};
            MesMaterial.model = values.model;
            MesMaterial.upn = values.upn;
            MesMaterial.mo = values.mo;
            MesMaterial.stage = values.stage;
            MesMaterial.stagematerial = values.stagematerial;
            MesMaterial.material = values.material;
            MesMaterial.inqty = values.inqty;
            MesMaterial.createuser = user.name;
            const result = await insertdata({ data: [MesMaterial] });
            if (result.status == 200) {
              message.success(result.msg);
              visible.setchangeVisible(false);
              tabRef.current.reload();
              return true;
            } else {
              message.error(result.msg);
            }
          } else {
            values.updateuser = user.name;
            const result = await updateData({ data: values });
            if (result.status == 200) {
              message.success(result.msg);
              visible.setchangeVisible(false);
              tabRef.current.reload();
              return true;
            } else {
              message.error(result.msg);
            }
          }
        }}
      >
        <ProFormText width="md" name="id" label="id" placeholder="id" hidden />
        <ProFormSelect
          width="md"
          name="model"
          options={model}
          label={intl.formatMessage(Model)}
          placeholder={intl.formatMessage(selectIntl) + intl.formatMessage(Model)}
          rules={[
            {
              required: true,
              message: intl.formatMessage(selectIntl) + intl.formatMessage(Model),
            },
          ]}
          fieldProps={{
            onChange: async (e) => {
              form.setFieldsValue({
                mo: null,
                upn: null,
                stage: null,
                stagematerial: null,
              });
              const upn = await findUpn(e);
              if (upn.status == 200) {
                setUpn(upn.data);
              } else {
                message.error(upn.msg);
              }
            },
          }}
        />

        <ProFormSelect
          width="md"
          name="upn"
          options={upn}
          label={intl.formatMessage(Upn)}
          placeholder={intl.formatMessage(selectIntl) + intl.formatMessage(Upn)}
          rules={[
            {
              required: true,
              message: intl.formatMessage(selectIntl) + intl.formatMessage(Upn),
            },
          ]}
          fieldProps={{
            onChange: async (e) => {
              form.setFieldsValue({
                mo: null,
                stage: null,
                stagematerial: null,
              });
              const mo = await findMo(e);
              const stage = await findStage(e);
              if (mo.status == 200) {
                setMo(mo.data);
              } else {
                message.error(mo.msg);
              }
              if (stage.status == 200) {
                setStage(stage.data);
              } else {
                message.error(stage.msg);
              }
            },
          }}
        />
        <ProFormSelect
          width="md"
          name="mo"
          options={mo}
          label={intl.formatMessage(moIntl)}
          placeholder={intl.formatMessage(selectIntl) + intl.formatMessage(moIntl)}
          rules={[
            {
              required: true,
              message: intl.formatMessage(selectIntl) + intl.formatMessage(moIntl),
            },
          ]}
        />
        <ProFormSelect
          options={stage}
          width="md"
          name="stage"
          label={intl.formatMessage(stageIntl)}
          placeholder={intl.formatMessage(selectIntl) + intl.formatMessage(stageIntl)}
          rules={[
            {
              required: true,
              message: intl.formatMessage(selectIntl) + intl.formatMessage(stageIntl),
            },
          ]}
          fieldProps={{
            onChange: async (e) => {
              form.setFieldsValue({
                stagematerial: null,
              });
              const stagematerial = await findStageMaterial({
                stage: e,
                upn: form.getFieldValue('upn'),
              });
              if (stagematerial.status == 200) {
                setStageMaterial(stagematerial.data);
              } else {
                message.error(stagematerial.msg);
              }
            },
          }}
        />
        <ProFormSelect
          options={stagematerial}
          width="md"
          name="stagematerial"
          label={intl.formatMessage(stagematerialIntl)}
          placeholder={intl.formatMessage(selectIntl) + intl.formatMessage(stagematerialIntl)}
          rules={[
            {
              required: true,
              message: intl.formatMessage(selectIntl) + intl.formatMessage(stagematerialIntl),
            },
          ]}
        />
        <ProFormText
          width="md"
          name="material"
          label={intl.formatMessage(materialIntl)}
          placeholder={intl.formatMessage(inputIntl) + intl.formatMessage(materialIntl)}
          rules={[
            {
              required: true,
              message: intl.formatMessage(inputIntl) + intl.formatMessage(materialIntl),
            },
          ]}
        />
        <ProFormText
          width="md"
          name="inqty"
          label={intl.formatMessage(qtyIntl)}
          placeholder={intl.formatMessage(inputIntl) + intl.formatMessage(qtyIntl)}
          rules={[
            {
              required: true,
              message: intl.formatMessage(inputIntl) + intl.formatMessage(qtyIntl),
            },
          ]}
        />
      </ModalForm>
    </div>
  );
};
