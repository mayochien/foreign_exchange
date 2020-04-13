import React from 'react';
import {withTranslation} from 'react-i18next';
import { MdEdit, MdDone, MdDelete, MdClear } from "react-icons/md";
import { apiPutBankerOrder, apiDeleteBankerOrder } from '../../services/apiService'
import SwitchControl from '../../components/Switch'
import SweetAlert from 'sweetalert-react';
import Modal from "react-responsive-modal";
import  Format  from '../../services/Format';


class MyOrderListItem extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      modifiable:false,
      amount: props.amount,
      rate:props.rate,
      alertShow:false,
      state_error_message:'',
      state_success_message:'',
      isShowResultModal:false,
      switch_on:this.props.status,
    }
  }

  onClickEdit = () =>{
    let {t} = this.props
    if(this.props.status===1){ //顯示錯誤彈窗Modal
      this.setState({ 
        isShowResultModal:true,
        state_error_message:t('app.turn_off_order_first')
      })
      setTimeout(()=>{
        this.setState({
          isShowResultModal:false,
          state_error_message:''
        })
      },1500)
    }
    else{
      this.setState({
        modifiable:true
      })
    }
  }

  onClickSave = () =>{ // 儲存(編輯完成時)
    console.log('props.rate:',this.props.rate)
    this.putEditData()
    this.setState({
      modifiable:false,
      rate:this.props.rate,
    })
  }


  confirmEdited = async(e,key_id) => {
    let {t} = this.props
    let putData = {
      rate:parseFloat(this.state.rate),
      // status:1
    };
    // console.log("putData:",key_id,putData)
    let resp = await apiPutBankerOrder(key_id, putData);
    if( resp.statusText === "OK") {
      this.props.refreshData();
      this.setState({
        modifiable: false,
      });
      this.setState({ 
        alertShow:false,
        isShowResultModal:true,
        state_success_message:t('app.update_success')
      })
      setTimeout(()=>{
        this.setState({
          isShowResultModal:false,
          state_success_message:''
        })
      },1500)
    }
    else{
      this.setState({ 
        alertShow:false,
        isShowResultModal:true,
        state_error_message:t('app.fail')
      })
      setTimeout(()=>{
        this.setState({
          isShowResultModal:false,
          state_error_message:''
        })
      },1500)
    }
  }


  cancelEdited= () => {// 取消(放棄編輯)
    this.setState({
      modifiable: false,
    });
  }



  //=============== 更改開關狀態 ===============
  switchStatus = async(e) => {
    // console.log(e.target.value);
    if(this.state.switch_on===true){ 
      let putData = {
        "status":0  //變成關閉
      }
      try {
        let res = await apiPutBankerOrder(this.props.id,putData)
        if(res.data.code ===1){
          console.log('變成關閉')
          this.setState({
            switch_on: false
          })
          this.props.refreshData() //狀態關閉後要刷新，才能禁止修改匯率
        }
      } catch (err) {
        console.log(err)
      }
    }
    else{ 
      let putData = {
        "status":1 //變成開啟
      }
      try {
        let res = await apiPutBankerOrder(this.props.id,putData)
        if(res.data.code ===1){
          console.log('變成開啟')
          this.setState({
            switch_on: true
          })
          this.props.refreshData() //狀態關閉後要刷新，才能禁止修改匯率
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  showDeleteModal =()=>{ //顯示刪除彈窗
    let {t} = this.props
    if(this.state.switch_on === false){
      this.setState({
        alertShow:true // 進入刪除確認框sweetAlert
      })
    }else{
      this.setState({ //顯示錯誤彈窗Modal
        isShowResultModal:true,
        state_error_message:t('app.turn_off_order_first')
      })
      setTimeout(()=>{
        this.setState({
          isShowResultModal:false,
          state_error_message:''
        })
      },1500)
    }
  }

  //=============== api:post 刪除 ===============
  submitDelete = async(e, key_id)=> {
    let {t} = this.props
    try{
      let res = await apiDeleteBankerOrder(key_id);
      if(res.data.code ===1){
        console.log('刪除id ↓',key_id)
        this.setState({
          alertShow:false,
          isShowResultModal:true,
          state_success_message:t('app.delete_success')
        })
        setTimeout(() => {
          this.setState({
            isShowResultModal:false,
            state_success_message:'',
         })
        }, 1500);
        this.props.refreshData()
        this.getInitialStatus()
        this.props.showLoading()
      }
    }catch (err) {
      console.log(err)
    }
  }


  onCloseAllModal = () => {
    this.setState({ 
      isShowResultModal: false,
    });
  };



  onChangeRate=(e)=>{ //開頭不能輸入符號、負數
    let regex = /^[0-9]*(\.[0-9]{0,6})?$/;
    let value = e.target.value
    if (!(regex.test(value))
      ||(value.startsWith('-'))
      ) return false
    else{
      if (value.startsWith('-')) {
        value = value.substring('')
      }else{
        this.setState({
          rate:value
        }
        // ,()=>{console.log('state_buy_rate:',this.state.state_buy_rate)}
        )
      }
    }
  }
  
  
  getInitialStatus = () =>{ //顯示初始狀態
      setTimeout(()=>{
        if(this.props.status===0){
          this.setState({
            switch_on:false //關閉
          })
        }
        else{
          this.setState({
            switch_on:true
          })
        }
    },200)
  }

  componentDidMount(){
    this.getInitialStatus()
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log(this.props.dataLength === nextProps.dataLength)
  //   if (this.props.dataLength !== nextProps.dataLength) {
  //     this.props.refreshData()
  //     console.log('頁面刷新..')
  //   }
  // }

  render(){
    let {t} = this.props
    let { modifiable } = this.state
    // console.log(this.state.origin_currency)
    // console.log(parseInt(this.state.increment))
    
    return (
        <tr>
          <td>{this.props.id}</td>
          <td>{this.props.origin_currency}</td>
          <td>{this.props.target_currency}</td>
          <td>{Format.thousandsMathRound3(this.props.amount)}</td>
          <td>{Format.thousandsMathRound3(this.props.amount-this.props.received_amount)}</td>
          <td>
            {modifiable?
            <input type="text" className="td-input"
                value={this.state.rate}
                onChange={this.onChangeRate}
              /> 
            :Format.thousandsMathFloor6(this.props.rate)}
          </td>

          {/* 編輯按鈕 */}
          <td className="td-actions-icon"> 
          {!modifiable?
            <button className="table-small-btn"
            onClick={this.onClickEdit}>
            <MdEdit/>
            </button>
          :
            <span className="d-flex">
              <button className="table-small-btn"
                onClick={e=>this.confirmEdited(e, this.props.id)}>
                <MdDone/>
              </button>
              <button className="table-small-btn btn-delete"
                onClick={this.cancelEdited}>
                <MdClear/>
              </button>
            </span>
          }
          </td>

          <td>{this.props.create_datetime}</td>

          <td className="td-actions-icon td-switch">
            <SwitchControl
              // value={this.showSwitchOnOrOff(this.props.status)}
              value={this.state.switch_on}
              onChange={e=>this.switchStatus(e)}
              onText="On"
              offText="Off"
            />
          </td>

          <td className="text-center td-actions-icon">  {/* 刪除按鈕  */}
            <button className="table-small-btn btn-delete"
             onClick={e=>this.showDeleteModal(e)}>
              <MdDelete/>
            </button>
          </td>

          <SweetAlert
            show={this.state.alertShow}
            title={t('app.confirm')+' '+t('app.delete')+' ?'}
            text={this.state.state_error_message}
            showCancelButton
            confirmButtonText={t('app.confirm')}
            cancelButtonText={t('app.cancel')}
            width={300}
            onConfirm={(e) => {
              this.submitDelete(e,this.props.id)
            }}
            onCancel={() => {
              this.setState({ alertShow: false });
            }}
            onEscapeKey={() => this.setState({ alertShow: false })}
            onOutsideClick={() => this.setState({ alertShow: false })}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                this.submitDelete(e,this.props.id)
              }
            }} 
          />

          <Modal open={this.state.isShowResultModal} 
              onClose={this.onCloseAllModal} closeIconSize={0}>
              <div className="modal-inside">
                <div className="modal-body">
                  <span className="text-green text-14">
                    {this.state.state_success_message}
                  </span>
                  <span className="text-red text-14">
                    {this.state.state_error_message}
                  </span>
                </div>
              </div>
          </Modal>

        </tr>
        
      )
    }
}

export default withTranslation()(MyOrderListItem);