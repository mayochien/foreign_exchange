import React from 'react';
import {withTranslation} from 'react-i18next';
import { MdDone, MdShoppingCart, MdVerticalAlignTop } from "react-icons/md";
import { GoArrowLeft } from "react-icons/go";
import { apiGetMyTradeBankList, apiPostOrderBuy } from '../../services/apiService'
import Modal from "react-responsive-modal";
// import { ERRORCODE } from '../../const'
import store from '../../store'
import Format from '../../services/Format';

class ExchangeMarketItem extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      modifiable:false,
      amount: props.amount,
      rate:props.rate,
      isShowSelectBankModal:false,
      state_buy_amount:'',
      state_buy_rate:'',
      errText:'',
      state_success_message:'',
      state_error_message:'',
      state_normal_messege:'',
      myBankList:[],
      isShowResultModal:false,
      selectBankId:'',
      showRedirectBtn:false,
    }
  }

  isHighlighthBnker = () => { //凸顯莊家
    if(this.props.username.indexOf('(B)') !== -1 ){
      return 'hightlight-banker'
    }
    else{
      return ''
    }
  }

  onChangeBuyAmount=(e)=>{ //開頭不能輸入0、不能輸入符號、負數、小數點
    let regex = /^[0-9]*(\.[0-9])?$/
    let value = e.target.value
    if (!(regex.test(value))||(value.startsWith('-'))) return false
    if (value.startsWith('0')) {
      value = value.substring('1')
    }
    else{
      this.setState({
        state_buy_amount:value
      })
    }
  }

  onChangeBuyRate=(e)=>{ //開頭不能輸入符號、負數
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
          state_buy_rate:value
        }
        // ,()=>{console.log('state_buy_rate:',this.state.state_buy_rate)}
        )
      }
    }
  }
  
  onClickInsertAll = () => { // 全買
    this.setState({
      state_buy_amount: Format.thousands(this.props.amount-this.props.received_amount),
      state_buy_rate:this.props.rate
    })
  }


  //=============== 確認購買彈框 (get銀行帳戶) ===============
  onClickShowSelectBankModal = async(key_amount,key_rate) => {
    // console.log('this.props:',this.props)
    // console.log('this.state:',this.state)
    // console.log(key_amount,key_rate)
    let{t} = this.props
    if(parseFloat(key_rate)===0 
    || parseFloat(key_amount)===0
    || key_rate===''
    || key_amount===''){
    this.setState({ 
      isShowSelectBankModal: false,
      isShowResultModal:true,
      state_error_message:t('app.please_enter_amount_rate')
    })
    this.clearMessageCloseAllModal()
    }
    else{
      this.setState({ 
        isShowSelectBankModal: true 
      })
      try{
        let res = await apiGetMyTradeBankList(this.props.origin_currency)
        // console.log('res.data:',res.data)
          if(res.data.code === 1){
            this.setState({
              myBankList:res.data.data.banks
            })
          }
      }catch (err) {
        console.log(err)
      }
    }
  }

  //=============== 選取要交易的銀行 ===============
  getSelectedBank=(e,key_bank_id)=>{
    // console.log('this.props:',this.props)
    // console.log('已經選擇帳戶')
    this.setState({
      selectBankId:key_bank_id
    }
    // ,()=>{console.log('已選擇帳戶:',this.state.selectBankId)}
    )
  }
 
  //=============== 確認購買 ===============
   onClickBuy = async(key_order_id, key_user_id,key_amount,key_rate,key_bank_account) => {
    let {t} = this.props
    let postData = {
      "order_id": key_order_id,
      "seller_id": key_user_id,
      "rate": parseFloat(key_rate),
      "amount": parseFloat(key_amount.toString().replace(/,/g, '')),
      "bank_account_id":parseInt(key_bank_account,10)
    }
    console.log('postData:',postData)

    if(key_bank_account===''|| key_bank_account===undefined){
      this.setState({ 
        state_error_message:t('app.select_trade_account')
      })  
      setTimeout(() => {
        this.setState({ 
          state_error_message:''
        })
      }, 1500);
    } else{
      try {
        let res = await apiPostOrderBuy(postData);
        if(res.data.code === 1){
          console.log('postData:',postData)
          this.setState({
            isShowSelectBankModal: false,
            state_buy_amount:'',
            state_buy_rate:'',
            isShowResultModal:true
          })
          this.setState({
            state_success_message: <span className="text-green"> <MdDone/> {t('app.add_success')} </span>
          })
          setTimeout(() => {
            this.setState({
              state_success_message: t('app.go_to_transaction_orders'),
              showRedirectBtn:true
            })
          }, 2000);
        }else{
          // console.log(res.data.code)
          // this.setState({ 
          //   isShowSelectBankModal: false,
          //   isShowResultModal:true,
          //   state_error_message:t(ERRORCODE[res.data.code]) 
          // })
          // this.clearMessageCloseAllModal()
        }
      }catch (err) {
        console.log(err)
      }
    }
  }

  onCloseAllModal = () => {
    this.setState({ 
      isShowResultModal: false,
      isShowSelectBankModal:false,
    });
  };

  clearMessageCloseAllModal = () =>{
    setTimeout(() => {
      this.setState({
        isShowResultModal:false,
        isShowSelectBankModal:false,
        state_error_message:'',
        state_success_message:''
      })
    }, 2200)
  }

  componentWillReceiveProps(nextProps){
     //翻頁時要清空已輸入、但未送出的數值
    if(this.props.nowPage !== nextProps.nowPage){
      this.setState({
        state_buy_amount:'',
        state_buy_rate:''
      })
    }
  }

  render(){
    let {t} = this.props
    let {myBankList,state_success_message,state_error_message} = this.state
    // console.log(store.getState().UserReducer.user.id);
    // console.log('this.props:',this.props)
    // console.log('this.state:',this.state)
    // console.log(this.state.origin_currency)
    // console.log(parseInt(this.state.increment))
    // console.log(this.props.nowPage)
    
    return (
        <tr>
          <td>{this.props.id}</td>

          {store.getState().UserReducer.user.id === this.props.user_id?
            <td className="text-primary-l-5">
              {t('app.myself')}
            </td>
            :
            <td className={this.isHighlighthBnker()}>
              {this.props.username}
            </td>
          }

          <td>{this.props.origin_currency}</td>
          <td>{Format.thousandsMathRound3(this.props.amount)}</td>
          <td>{Format.thousandsMathRound3((this.props.amount-this.props.received_amount))}</td>
          <td>{this.props.target_currency}</td>
          <td>{Format.thousandsMathRound6(this.props.rate)}</td>
          <td>{this.props.create_datetime}</td>

          {/* 出價數量 */}
          <td className="text-center td-actions-icon">
            <input className="td-input-order"
              value={this.state.state_buy_amount}
              onChange={this.onChangeBuyAmount}
              maxLength={12}
              onKeyDown={(e) => {
                // ***** 如果已經全買，要再修改數字 ↓ ***** 
                // 1.判斷目前是否等於全買數字
                if(this.state.state_buy_amount===Format.thousands(this.props.amount-this.props.received_amount)){
                  // 2.去除逗號，再轉為數字
                  this.setState({
                    state_buy_amount:parseFloat(e.target.value.toString().replace(/,/g, ''))
                  })
                }
              }} 
              />
          </td>

          {/* 出價匯率 */}
          <td className="text-center td-actions-icon">
            <input className="td-input-order"
              value={this.state.state_buy_rate}
              onChange={this.onChangeBuyRate}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.onClickShowSelectBankModal(
                    this.state.state_buy_amount,
                    this.state.state_buy_rate,
                   )
                }
              }} 
              />
          </td>

          <td className="text-center td-actions-icon">  {/* 全部購買  全買 */}
            <button className="table-small-btn"
             onClick={this.onClickInsertAll}>
              <MdVerticalAlignTop/>
            </button>
          </td>

          <td className="text-center td-actions-icon">  {/* 購買按鈕  */}
            <button className="table-small-btn"
             onClick={()=>this.onClickShowSelectBankModal(
               this.state.state_buy_amount,
               this.state.state_buy_rate,
              )}>
              <MdShoppingCart/>
            </button>
          </td>



          <Modal open={this.state.isShowSelectBankModal} 
            onClose={this.onCloseAllModal} closeIconSize={0}>

          {myBankList instanceof Array
            && myBankList.length !== 0 ? 
            // ----- 如果有銀行帳戶 顯示 ↓ ------
            <div className="modal-inside">
              {/* 標題：選擇您要交易的帳戶 */}
              <h5>{t('app.select_trade_account')}:</h5>
              <div className="modal-body">
                <div className="select-bank-card-box">
                  {myBankList.map((item,index) => 
                      <button className="select-bank-card"
                      key={index}
                      index={index}
                      {...item}
                      onClick={e=>this.getSelectedBank(e,item.id)}
                    >
                      {/* {t('app.id')}: {item.id}<br/> */}
                      {t('app.account_number')}: {item.account_number}<br/>
                      {t('app.bank_name')}: {item.bank_name}<br/>
                      {t('app.currency_type')}: {item.currency_type}<br/>
                    </button>)
                  }
                </div>
              </div>

              <div className="text-center">
                <span className="text-green text-14">
                  {/* {state_success_message} */}
                </span>
                <span className="text-red text-14">
                  {state_error_message}
                </span>
              </div>
              
              <div className="modal-footer">
                <button className="modal-action-button" onClick={this.onCloseAllModal}>
                  {t('app.cancel')}
                </button>
                <button className="modal-action-button"
                  onClick={() => {
                    this.onClickBuy(
                      this.props.id,
                      this.props.user_id,
                      this.state.state_buy_amount,
                      this.state.state_buy_rate,
                      this.state.selectBankId
                    )
                  }}>
                  {t('app.buy')}
                </button>
              </div>
            </div>
          : 
            // ----- 如果沒銀行帳戶 顯示 ↓ ------
            <div className="modal-inside">
              <div className="modal-body">
                {/* 標題：無此幣別銀行帳戶，無法交易 */}
                <div className="table-no-data p-10 text-center"> 
                  <span className="text-red"> {t('app.no_this_currency_account_no_trade')}</span>
                  <div>
                  {t('app.you_can_go')}
                    <a className="link-text" href="/#/bank/bank-add">{t('app.bank_add')}</a>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <span className="text-green text-14">{state_success_message}</span>
                <span className="text-red text-14">{state_error_message}</span>
                {/* <button className="table-small-btn" onClick={this.onCloseAllModal}>
                  {t('app.go')} {t('app.bank_add')}
                </button> */}
                <button className="modal-action-button" onClick={this.onCloseAllModal}>
                  {t('app.close')}
                </button>
              </div>
            </div>
          }
          </Modal>

          <Modal open={this.state.isShowResultModal} 
            onClose={this.onCloseAllModal} closeIconSize={0}>
            <div className="modal-inside">
              <div className="modal-body ">
                <span className="text-14">
                  {this.state.state_success_message}
                </span>
                <span className="text-red text-14">
                  {this.state.state_error_message}
                </span>
                {/* <span className="text-14">
                  {this.state.state_normal_messege}
                </span> */}
              </div>
              {this.state.showRedirectBtn?
                <div className="modal-footer">
                  <button className="modal-action-button"
                    onClick={()=>window.location.href="/#/exchange/order-pending-buy"}>
                    <span className="btn-icon">
                      <GoArrowLeft/>{t('app.go')}
                    </span>
                  </button>
                  <button className="modal-action-button"
                    onClick={this.onCloseAllModal}>
                    {t('app.continue_to_buy')}
                  </button>
                </div>
                :''}
            </div>
          </Modal>

          {/* <Modal open={this.state.isShowredirectModal} 
            onClose={this.onCloseAllModal} closeIconSize={0}>
            <div className="modal-inside">
              <div className="modal-body ">
                <span className="text-green text-14">
                  {this.state.state_success_message} 
                </span>
                <button onClick={this.onCloseAllModal}>
                  {t('app.close')}
                </button>
                <button 
                  onClick={()=>window.location.href="/#/exchange//my-selling-list"}>
                  {t('app.success')}
                </button>
              </div>
            </div>
          </Modal> */}

        </tr>
      )
    }
}

export default withTranslation()(ExchangeMarketItem);