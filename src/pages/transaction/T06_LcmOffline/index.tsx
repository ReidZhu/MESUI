import React, { useEffect, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { useAccess,useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Col, Form } from 'antd';
import { message, Row } from 'antd';
import { useModel } from 'umi';
import storageUtils from '@/utils/storageUtils';
//import UserModal from '../Demo/components/TableModal';
//import PrintDemo from '../Demo/components/PrintDemo';
//import arrayMove from 'array-move';
import ProForm, { ProFormText, ProFormSelect } from '@ant-design/pro-form';
import {
  getMoList,
  checkInput,
  confirmList,
  getMoInfo,
} from './service';

import {
  repetitionIntl,
  selectIntl,
  inputIntl,
  numberIntl,
  resetIntl,
  submitIntl
  
} from '@/utils/intl';


const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};


export type TypeNum = {
  id: React.Key;
  inputUsn?: string;
  type?: string;
  num?: number;
  fekinum?: number;
};

export default () => {
  //列表数据
  const [dataSource1, setDataSource1] = useState<TypeNum[]>([]);
  //权限验证
  const access = useAccess();
  //操作Table
  const actionRef = useRef<ActionType>();

  const [mo, setMo] = useState<any[]>([]);

  const [selectedMo, setSelectedMo] = useState();

  const [numState, setNumState] = useState(0);

  const intl = useIntl();

  const [moinfoState,setMoinfoState] = useState<String>();

  const [selectDisableState,setSelectDisableState]=useState(false);

  const [lottype,setLottype]=useState(false);

  const [inputDisbleState,setInputDisableState]=useState(false);

  const [lotinfo,setLotinfo]=useState<String>();

  const [offtype,setOfftype]=useState<String>();

  useEffect(() => {
    getMo();
  }, []);

  useEffect(() => {}, [dataSource1]);

  const [form] = Form.useForm();

  const getMo = async () => {
    const moList = await getMoList();
    console.log(moList);
    if (moList.status == 200) {
      const moArray: any[] = [];
      
      const arr = moList.data;
      console.log(arr);
      arr.map((item: any, index) => {
        moArray.push({ label: item.mo, value: item.mo });
      });
      //moArray.push({label:moList.data.mo,value:moList.data.mo})
      setMo(moArray);
    } else {
      message.error(moList.msg);
      return;
    }
  };

  const reset =()=>{
    
    setInputDisableState(false);
    setSelectDisableState(false);
    setNumState(0);
    setDataSource1([]);
    setOfftype("");
    form.setFieldsValue({num:null});
    queryMoInfo(selectedMo);
  }

  const queryMoInfo = async (mo: String) => {
    
    const moinfo = await getMoInfo(mo);
    const result = moinfo.data;
    console.log(result);
    if(moinfo.status!=200){
      message.error(moinfo.msg);
      return;
    }
    let unit:String=result.unit.toString();
    const info:String=result.model.toString()+ " " + result.upn + " 工單總數:" + result.qty + " 已下線數量:" + result.inputqty;
    if(unit.toUpperCase()=="LOT"){
      setLottype(true);
      setOfftype(unit.toUpperCase());
    }else{
      setLottype(false);
      setOfftype(unit.toUpperCase());
    }
    setMoinfoState(info);
    console.log(moinfo);
  }


  const getTable = async (inputusn: String) => {
    const mo: any = selectedMo;
    if (mo == null) {
      message.error('請先選擇工單');
      return;
    }
   
    setSelectDisableState(true);
    let data={data:{inputInfo:inputusn,lcmMo:mo}};
    const result = await checkInput(data);
    if (result.status == 200) {
      const data = result.data;
      
      const ll: TypeNum[] = JSON.parse(JSON.stringify(dataSource1));
      console.log(ll.length);
      if (ll.length > 0) {
        const ftype = ll[0].type;
        if (ftype != data.type) {
          message.error('刷入類型不同');
          return;
        } else {
          for (let i = 0; i < ll.length; i++) {
            if (ll[i].inputUsn == data.inputUsn) {
              message.error(intl.formatMessage(repetitionIntl));
              return;
            }
          }
        }
      }
      
      ll.push(data);
      setDataSource1(ll);
      let num_state=0;
      for(let i=0;i<ll.length;i++){
        num_state+=ll[i].num;
      }
      setNumState(num_state);
      form.setFieldsValue({ usn: null });
    } else {
      message.error(result.msg);
    }
  };

  const confirmBtn = async () => {
    let num = form.getFieldValue("num");
    if(lottype==false){
      num=numState;
    }
    const tablelist: TypeNum[] = JSON.parse(JSON.stringify(dataSource1));
    console.log(tablelist);
    const moinfo: any = selectedMo;
    if (moinfo == null) {
      message.error('請先選擇工單');
      return;
    }
    let ip:String = storageUtils.getUser().ip;
    let user:String =storageUtils.getUser().name;
    const all = { tablelist: tablelist, mo: moinfo ,num: num,ip:ip,user:user };
    const result = await confirmList({ data: all });
    if (result.status != 200) {
      message.error(result.msg);
    } else {
      message.success("下線成功");
      setLotinfo(result.msg);
    }
    form.setFieldsValue({ usn: null });
    queryMoInfo(moinfo);
    reset();
    //setMoinfoState("-");
  };

  const cols1: ProColumns<TypeNum>[] = [
    {
      title: '編號',
      dataIndex: 'id',
      width: 100,
      className: 'drag-visible',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '刷入信息',
      dataIndex: 'inputUsn',
      width: 200,
    },
    {
      title: '類型',
      dataIndex: 'type',
      width: 150,
    },
    {
      title: '數量',
      dataIndex: 'num',
      width: 100,
    }
  ];

  

  return (
    <>
      <Row gutter={12}>
      <Col className="gutter-row" span={8} style={{ backgroundColor: 'white',minHeight:"500px"}}>
      {/* <Access accessible={access.lableFilter('mes1')} fallback={<h2>你没有mes权限</h2>}> */}
      <ProForm
        form={form}
        submitter={{
          // 配置按钮文本
          searchConfig: {
            resetText: '重置',
            submitText: '提交',
          },
          // 配置按钮的属性
          resetButtonProps: {
            style: {
              // 隐藏重置按钮
              display: 'none',
            },
          },
          submitButtonProps: {},

          // 完全自定义整个区域
          render: (props, doms) => {
            console.log(props);
            return [
              <button
                type="button"
                className="ant-btn ant-btn-primary"
                key="submit"
                onClick={() => {
                  confirmBtn();
                }}
              >
                {intl.formatMessage(submitIntl)}
              </button>,
              <button
                type="button"
                className="ant-btn"
                key="reset"
                onClick={() => {
                  reset();
                  setLotinfo("");
                }}
              >
                {intl.formatMessage(resetIntl)}
              </button>,
            ];
          },
        }}
        layout="horizontal"
      >
        
          <ProForm.Group>
            <Row></Row>
          </ProForm.Group>
          <ProFormSelect
            disabled={selectDisableState}
            label="請選擇工單"
            options={mo}
            fieldProps={{
              onChange: (e) => {
                console.log(e);
                //getMacs(e);
                setSelectedMo(e);
                queryMoInfo(e);
              },
            }}
          ></ProFormSelect>
          {/* <ProFormSelect label="請選擇機台" width="xs" options={machine}></ProFormSelect> */}
            <ProFormText
              disabled={inputDisbleState}
              label="請刷入產品"
              placeholder={intl.formatMessage(inputIntl)}
              name="usn"
              fieldProps={{
                onPressEnter: (e) => {
                  //console.log(e.currentTarget.value);
                  getTable(e.currentTarget.value);
                },
              }}
            />
            <ProFormText
              hidden={lottype}
              label="數量:"
              fieldProps={{ value: numState.toString() }}
              formItemProps={{ style: { color: 'blue' } }}
              width="xs"
              readonly
            ></ProFormText>
            <ProFormText
              label="工單信息:"
              fieldProps={{ value:moinfoState?.toString() }}
              readonly
            ></ProFormText>
            <ProFormText
              hidden={!lottype}
              label="批號:"
              fieldProps={{ value:lotinfo }}
              readonly
            ></ProFormText>
          </ProForm>
        </Col>
        <Col className="gutter-row" span={16}>
        <div style={{ backgroundColor: 'white', paddingLeft: '20px' ,minHeight:'500px'}}>
          <ProForm.Group>
            <ProTable
              
              pagination={{pageSize:5}}
              search={false}
              actionRef={actionRef}
              headerTitle="刷入信息"
              //toolBarRender={false}
              options={false}
              columns={cols1}
              // request={async (params = {}, sort, filter) => {
              //   //message.success('查询参数=>' + JSON.stringify(values));
              //   console.log(params as MesStageErrorCode, 'MesStageErrorCode');
              //   const result = await findAllStageError(params as MesStageErrorCode);
              //   commonResult(
              //     result,
              //     (data: any) => {
              //       setDataSource(data);
              //     },
              //     false,
              //   );
              //   return { data: dataSource };
              // }}
              dataSource={dataSource1}
            />
            
          </ProForm.Group>
        </div>
        </Col>
        </Row>
    </>
  );
};
