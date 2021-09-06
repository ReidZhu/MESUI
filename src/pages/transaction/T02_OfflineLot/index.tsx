import React, { useEffect, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { useAccess,useIntl } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Button, Col, Form, Popconfirm, Switch } from 'antd';
import { message, Row } from 'antd';
import { useModel } from 'umi';
import storageUtils from '@/utils/storageUtils';
//import UserModal from '../Demo/components/TableModal';
//import PrintDemo from '../Demo/components/PrintDemo';
//import arrayMove from 'array-move';
import ProForm, { ProFormText, ProFormSelect } from '@ant-design/pro-form';
import {
  getMoList,
  getMachine,
  getNum,
  confirmList,
  getMoInfo,
  getPalletInfo,
  getAryInfo,
  queryUpnInfo,
  getMoLotList,
  confirmLotList,
} from './service';

import {
  repetitionIntl,
  selectIntl,
  inputIntl,
  numberIntl,
  resetIntl,
  submitIntl,
  idIntl,
  inputInfoIntl,
  modeIntl,
  numIntl,
  fekiIntl,
  usnIntl,
  offlineNumIntl,
  moselectIntl,
  inputUsnIntl,
  inputNumIntl,
  moinfoIntl,
  lotnoIntl,
  usnInfoIntl,
  offlineSuccIntl,
  offlinemodeIntl,
  printIntl,
  palletselectIntl,
  aryselectIntl,
  operationIntl,
  deleteornoIntl,
  remainNumIntl
  
} from '@/utils/intl';
import { checkbox } from '@/pages/packagingcenter/P05_BoxDevanning/service';
import { DeleteOutlined } from '@ant-design/icons';


const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export type ChipType = {
  id: React.Key;
  arrayid?: string;
  palletid?: string;
  inqty?: number;
  offqty?: number;
  remainqty?: number;
};

export default () => {
  //列表数据

  const [dataSource, setDataSource] = useState<ChipType[]>([]);
  //操作Table
  const actionRef = useRef<ActionType>();

  const [mo, setMo] = useState<any[]>([]);

  const [palletOption, setPalletOption] = useState<any[]>([]);

  const [aryOption, setAryOption] = useState<any[]>([]);


  const [selectedMo, setSelectedMo] = useState();

  const [selectArray,setSelectArray] = useState();

  const intl = useIntl();

  const [moinfoState,setMoinfoState] = useState<String>();
  const [moNumState,setMoNumState] = useState<String>();
  const [offNumState,setOffNumState] = useState<String>();

  const [selectDisableState,setSelectDisableState]=useState(false);


  const [lotinfo,setLotinfo]=useState<String>();


  const [readtype,setReadtype]=useState(true);
  const [numtype,setNumtype]=useState(true);


  useEffect(() => {
    getMo();
  }, []);

  useEffect(() => {}, [dataSource]);

  const [form] = Form.useForm();

 const changeReadType=()=>{
    const type=readtype;
    setReadtype(type==false?true:false);
    
 }

 const changeNumType=()=>{
   const type=numtype;
   setNumtype(type==false?true:false);
 }

 const printClick=()=>{
  let infoid= lotinfo;
  window.open("http://10.57.30.60:8080/koemes/print/showPdf?infoid="+infoid);
}
  const getMo = async () => {
    const moList = await getMoLotList();
    if (moList.status == 200) {
      const moArray: any[] = [];
      
      const arr = moList.data;
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
    
    setSelectDisableState(false);
    setDataSource([]);
    //form.setFieldsValue({num:null,moSelect:null,arraySelect:null,palletSelect:null});
    //form.setFieldsValue({moSelect:null,arraySelect:null,palletSelect:null});
    setLotinfo("");
    getMo();
    //queryMoInfo(selectedMo);
  }

  const queryPallet = async (palletid:String) => {
    const custinfo=await getAryInfo(palletid);
    if(custinfo!=null){
      const aryOp:any[]=[];
      const result=custinfo.data;
      result.map((item:any,index)=>{
        aryOp.push({label:item.arrayid,value:item.arrayid})
      })

      setAryOption(aryOp);
    }
  }


  const queryMoInfo = async (mo: String) => {
    
    const moinfo = await getMoInfo(mo);
    const result = moinfo.data;
    
    if(moinfo.status!=200){
      message.error(moinfo.msg);
      return;
    }
    const palletinfo = await getPalletInfo(result.model.toString());
    if(palletinfo!=null){
    const palletlist=palletinfo.data;
    const palletOp:any[]=[];
  
    palletlist.map((item:any,index)=>{
      palletOp.push({label:item.arypalletid,value:item.arypalletid})
    })
      setPalletOption(palletOp);
    }

    //form.setFieldsValue({num:null});

    const upninfo = await queryUpnInfo(result.upn);
    if(upninfo.status==200){
      form.setFieldsValue({num:upninfo.data.lotqty});
    }

    //let unit:String=result.unit.toString();
    //const info:String=result.model.toString()+ " 工單總數:" + result.qty + " 已下線數量:" + result.inputqty;

   
    setMoinfoState(result.model.toString());
    setMoNumState(result.qty.toString());
    setOffNumState(result.inputqty.toString());
  }




  const getTable = async (inputusn: String) => {
    const mo: any = selectedMo;
    if (mo == null) {
      message.error(intl.formatMessage(moselectIntl));
      return;
    }
    const lang: String=localStorage.getItem('umi_locale')
    setSelectDisableState(true);
    const result = await getNum(inputusn,mo,lang);
    if (result.status == 200) {
      
      const data2 = result.data;
      console.log(data2);
      
      const chiplist:ChipType[]=[];
      chiplist.push(data2);
      chiplist[0].remainqty=Number(chiplist[0].inqty)-Number(chiplist[0].offqty);
      // for (let i = 0; i < data2.length; i++) {
      //   chiplist.push(data2[i]);
      // }
      // form.setFieldsValue({ usn: null });
      console.log(chiplist);
      setDataSource(chiplist);
    } else {
      message.error(result.msg);
    }
  };

  const confirmBtn = async () => {
    let num = form.getFieldValue("num");

    const array: any= selectArray;
    const moinfo: any = selectedMo;
    if (moinfo == null) {
      message.error(intl.formatMessage(moselectIntl));
      return;
    }
    if(array==null){
      message.error(intl.formatMessage(inputUsnIntl));
      return;
    }
    let ip:String = storageUtils.getUser().ip;
    let user:String =storageUtils.getUser().name;
    const all = { arrayid: array, mo: moinfo ,num: num,ip:ip,user:user };
    const result = await confirmLotList({ data: all });
    if (result.status != 200) {
      message.error(result.msg);
    } else {
      message.success(intl.formatMessage(offlineSuccIntl));
      setLotinfo(result.msg);
    }
    //form.setFieldsValue({ usn: null });
    queryMoInfo(moinfo);
    getTable(selectArray);
    //reset();
    //setMoinfoState("-");
  };

  const deleteRow=(inputUsn:any)=>{
    const tablelist: ChipType[] = JSON.parse(JSON.stringify(dataSource));

    let index=tablelist.findIndex(item => {
      if(item.inputUsn=inputUsn){
        return true;
      }else{
        return false;
      }
    });
    tablelist.splice(index,1);
    setDataSource(tablelist);
  }



  const columns: ProColumns<ChipType>[] = [
    
    {
      title: 'Array',
      dataIndex: 'arrayid',
      hideInSearch: true,
      width: 150,
    },
    {
      title: 'Pallet',
      dataIndex: 'palletid',
      hideInSearch: true,
      width: 150,
    },
    {
      title: intl.formatMessage(numIntl),
      dataIndex: 'inqty',
      hideInSearch: true,
      width: 150,
    },
    {
      title: intl.formatMessage(offlineNumIntl),
      dataIndex: 'offqty',
      hideInSearch: true,
      width: 150,
    },
    {
      title: intl.formatMessage(remainNumIntl),
      dataIndex: 'remainqty',
      hideInSearch: true,
      width: 150,
    },
    {
      title: intl.formatMessage(operationIntl),
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, record) => [
              <Popconfirm
                  title={intl.formatMessage(deleteornoIntl)}
                  onConfirm={() => { deleteRow(record.arrayid) }}
                  okText="Yes"
                  cancelText="No"
              >
                  <Button type="text" danger icon={<DeleteOutlined />}>

                  </Button>
              </Popconfirm>

      ]
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
            return [
              <button
                type="button"
                className="ant-btn"
                key="reset"
                onClick={() => {
                  reset();
                  
                }}
              >
                {intl.formatMessage(resetIntl)}
              </button>,
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
            label={intl.formatMessage(moselectIntl)}
            options={mo}
            name="moSelect"
            fieldProps={{
              onChange: (e) => {
                //getMacs(e);
                setSelectedMo(e);
                queryMoInfo(e);
              },
            }}
          ></ProFormSelect>
          <ProFormSelect
            label={intl.formatMessage(palletselectIntl)}
            options={palletOption}
            name="palletSelect"
            fieldProps={{
              onChange: (e) => {
                //console.log("11"+e);
                //getMacs(e);
                queryPallet(e);
              },
            }}
          ></ProFormSelect>
          <ProFormSelect
            label={intl.formatMessage(aryselectIntl)}
            options={aryOption}
            name="arraySelect"
            fieldProps={{
              onChange: (e) => {
                getTable(e);
                setSelectArray(e);

                
                //getMacs(e);
                // setSelectedMo(e);
                // queryMoInfo(e);
              },
            }}
          ></ProFormSelect>

          {/* <ProFormSelect label="請選擇機台" width="xs" options={machine}></ProFormSelect> */}
            
            <div style={{width:"60%",float:'left',marginTop:"10px"}}>
             <ProFormText
              disabled={numtype}
              label={intl.formatMessage(inputNumIntl)}
              placeholder={intl.formatMessage(inputIntl)}
              name="num" />
             </div>
            <div style={{width:"38%",float:'left',marginLeft:"5px",marginTop:"12px"}}>
            <Switch onChange={changeNumType} />
            </div>
            <div style={{clear:'both'}}>
              <ProForm.Group>
            <ProFormText
              label={intl.formatMessage(moinfoIntl)+":"}
              fieldProps={{ value:moinfoState?.toString() }}
              readonly
            ></ProFormText>
            <ProFormText
              label={intl.formatMessage(numIntl)+":"}
              fieldProps={{ value:moNumState?.toString() }}
              formItemProps={{ style: { color: 'blue' } }}
              readonly
            ></ProFormText>
            <ProFormText
              label={intl.formatMessage(offlineNumIntl)+":"}
              fieldProps={{ value:offNumState?.toString() }}
              formItemProps={{ style: { color: 'blue' } }}
              readonly
            ></ProFormText>
            </ProForm.Group>
            </div>
          </ProForm>
          <div style={{width:"60%",float:'left',marginTop:"10px"}}>
          <ProFormText
              label={intl.formatMessage(lotnoIntl)+":"}
              fieldProps={{ value:lotinfo,onChange:(e)=>{
                  //console.log(e.target.value);
                  setLotinfo(e.target.value);
              } }}
              readonly={readtype}
              name="formlot"
            ></ProFormText>
            </div>
            <div style={{width:"15%",float:'left',marginLeft:"5px",marginTop:"12px"}}>
            <Switch onChange={changeReadType} />
            </div>
            <button
              type="button"
              className="ant-btn ant-btn-primary"
              key="submit"
              style={{float:'left',marginTop:"10px"}}
              onClick={printClick}
            >
              {intl.formatMessage(printIntl)}
            </button>
        </Col>
        <Col className="gutter-row" span={16}>
        <div style={{ backgroundColor: 'white', paddingLeft: '20px' ,minHeight:'500px'}}>
          <ProForm.Group>
            <ProTable
              pagination={{pageSize:5}}
              search={false}
              actionRef={actionRef}
              headerTitle={intl.formatMessage(usnInfoIntl)}
              //toolBarRender={false}
              options={false}
              columns={columns}
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
              dataSource={dataSource}
            />
          </ProForm.Group>
        </div>
        </Col>
        </Row>
    </>
  );
};
