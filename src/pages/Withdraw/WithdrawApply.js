import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { apiGetWithdrawAccount,
        apiGetWithdrawCurrency,
        apiPostWithdrawApply,
      } from '../../services/apiService';
import { MdRemoveRedEye, MdDone } from "react-icons/md";
import { GoArrowLeft } from "react-icons/go";
import { Link } from 'react-router-dom';
import Modal from "react-responsive-modal";
import  Format  from '../../services/Format';


class WithdrawApply extends Component {
  state = {
    modifiable: false,
    state_success_message:'',
    state_error_message:'',
    isShowResultModal:false,
    currencyOptions:[], // 選項:幣別
    withdrawWayOptions:[], //選項:提款方式
    accountOptions:[], //選項:帳號選項
    select_withdraw_way:'', //key:提款方式
    select_currency:'',  //key:幣別
    select_account:'',  //key:帳號
    maximum_amount: '', //key:最大提領數量
    amount: '',  //key:申請數量
    remark: '',  //key:備註
    showRedirectBtn:false,
    withdrawRate:0,
    isRepeatClickStop:false,
  }


  clearStateData=()=>{
    let { t } = this.props
    this.setState({
      currencyOptions:[t('app.please_select')],
      withdrawWayOptions:[],
      accountOptions:[],
      select_currency:'',
      select_account:'',
      currency: '',
      amount: '',
      remark: '',
    },()=>{setTimeout(() => {
      this.getOpenCurrencyList()
      this.showWithdrawWayOptions()
      this.getWithdrawAccount()
    }, 100)})
  }

  onCloseAllModal = () => {
    this.setState({ 
      isShowResultModal: false,
      state_error_message:'',
      state_success_message:'',
      showRedirectBtn:false,
    });
  };
  
  clearMessageAndCloseModal=()=>{
    setTimeout(() => {
      this.setState({
        isShowResultModal:false,
        state_error_message:'',
        state_success_message:'',
        showRedirectBtn:false,
      })
    }, 2000)
  }

  showSubmitSuccess = () =>{
    let {t} = this.props
    this.setState({
      state_success_message:<span className="text-green">
      <MdDone/> {t('app.add_success')}</span>
    })
    setTimeout(() => {
      this.setState({
        state_success_message:t('app.go')+t('app.list_page')+' ?',
        showRedirectBtn:true
      })
    }, 2000)
  }

  showInputDataMissing = () => {
    let {t} = this.props
    console.log('有欄位未填寫')
    this.setState({
      isShowResultModal:true,
      state_error_message:t('app.please_check_required_fields')
    })
   this.clearMessageAndCloseModal()
  }

  showMinimumAmount = () => { //警告：提領數量至少10,000
    let {t} = this.props
    this.setState({
      isShowResultModal:true,
      state_error_message:t('app.withdrawal_amount_minimum')
    })
   this.clearMessageAndCloseModal()
  }

  showWithdrawWayOptions = () => { // 【顯示】提款方式選項
    let { t } = this.props
    this.setState({
      withdrawWayOptions:[
        {label:t('app.cash'),value:1},
        {label:t('app.transfer'),value:2}
      ]
    })
  }

  onChangeWithdrawWay  = (e) => { // 【選擇】提款方式
    this.setState({
      select_withdraw_way:e.target.value,
    }
    // ,()=>{console.log(this.state.select_withdraw_way);}
    )
  }

  getOpenCurrencyList = async() => { // 【顯示】提款幣別選項
    try{
      let res = await apiGetWithdrawCurrency()
        if(res.data.code === 1){
          this.setState({
            currencyOptions:Object.keys(res.data.data.withdraw_currency)
          })
        }
        else{
          this.setState({
            currencyOptions:[]
          })
        }
    }catch (err) {
      console.log(err)
    }
  }

  onChangeCurrency = (e) => { // 【選擇】提款幣別
    this.setState({
      select_currency:e.target.value
    }, ()=>{
      this.getWithdrawRate()
      this.getWithdrawAccount()
    })
  }

  getWithdrawRate = async() =>{ // 【顯示】對港幣的匯率、提款上限
    try {
      let res = await apiGetWithdrawCurrency()
      if(res.data.code===1){
        // console.log(res.data.data.available_withdraw_amount);
        this.setState({
          withdrawRate:res.data.data.withdraw_currency[this.state.select_currency],
          maximum_amount:Format.thousands(res.data.data.available_withdraw_amount)
        })
      }
    } catch (err) {
      console.log(err);
    }
  }

  getWithdrawAccount = async () => { // 【顯示】提款帳號選單
    try {
      let res = await apiGetWithdrawAccount(this.state.select_currency)
      // let listFirstText = [{account_name:'', account_number:t('app.please_select')}]
      if(res.data.code === 1){
        this.setState({
          accountOptions:res.data.data.bank
        })
      }
    } catch (err) {
      console.log(err);
    }
  }

  onChangeAccount = (e) => { // 【選擇】帳號
    this.setState({
      select_account:e.target.value
    }
    // ,()=>{console.log('select_account:',this.state.select_account);}
    )
  }

  onChangeAmount = async(e) => { //開頭不能輸入0、不能輸入符號、負數、小數點
    let value = e.target.value.replace(/[^\d]/,'')
    if (value.startsWith('0')) {
      value = value.substring('1')
    }
    else{
      this.setState({
        amount:value
      },()=>{
        this.getWithdrawRate()
      })
    }
  }

  onChangeRemark = (e) => {
    this.setState({
      remark: e.target.value
    })
  }

  stopRepeatClick = () => {
    this.setState({
      isRepeatClickStop:true,
    })
    setTimeout(()=>{
      this.setState({
        isRepeatClickStop:false,
      })
    },2000)
  }



  // ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ post:存款 ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇
  submitPost = async() => {
    let {t} = this.props
    let { select_withdraw_way, amount, select_currency, remark ,select_account } = this.state;
    // 注意 select_withdraw_way 一開始是字串

    let showPostData = () =>{
      if(select_withdraw_way==="1"){
        // console.log('post:現金');
        return { //現金的帳號要回傳空值
          approach:parseInt(select_withdraw_way,10),  // *提領方式
          amount: parseFloat(amount,10),  // *申請數量
          currency: select_currency,  // *幣別
          exchange_rate: this.state.withdrawRate, // *對應匯率
          remark: remark,  // 備註 (選填)
          withdraw_bank_id:'' //帳號
        }
      }
      else if (select_withdraw_way==="2") {
        // console.log('post:轉帳');
        return {
          approach:parseInt(select_withdraw_way,10),  // *提領方式
          amount: parseFloat(amount,10),  // *申請數量
          currency: select_currency,  // *幣別
          exchange_rate: this.state.withdrawRate, // *對應匯率
          remark: remark,  // 備註 (選填)
          withdraw_bank_id:parseInt(select_account,10) //帳號
        }
      }
    }

    this.stopRepeatClick()

    if(select_withdraw_way === '' 
      || amount === ''
      || select_currency === 'none'
      ){
        this.showInputDataMissing() 
    }
    else if( select_withdraw_way === "2" && select_account === '' ){ // 如果選轉帳，當然就要選帳號啊
      this.showInputDataMissing() 
    }
    else if(parseFloat(amount)<10000){ //提領數量至少10,000
      console.log('拜託至少領個一萬');
      this.showMinimumAmount()
    }
    else{
      console.log('進行post',showPostData());
      try{
        let res = await apiPostWithdrawApply(showPostData());
        if(res.data.code===1){
          this.setState({
            isShowResultModal:true
          })
          this.showSubmitSuccess()
          setTimeout(() => {
            this.clearStateData()
          }, 500);
        }
      } catch(err) {
        console.log(err);
        this.setState({
          isShowResultModal:true,
          state_error_message:t('app.add_fail') //無法顯示後端錯誤時
        })
        this.clearMessageAndCloseModal()
      }
    }
  }

  componentDidMount() {
    this.showWithdrawWayOptions() //顯示提款方式
    this.getOpenCurrencyList()  // api get 開放幣別
  }


  render() {
    let { t } = this.props;
    let { currencyOptions,
          accountOptions,
         } = this.state;
    // console.log(this.state.currency)
    // console.log(this.countConvertWalletAmount());
    // console.log(this.state.select_account==='');
 
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-10">
            <div className="card card-exchange">

              <div className="text-right">
                <Link to="/withdraw/withdraw-list"
                  className="text-page-link">
                  <MdRemoveRedEye/>
                  <span className="ml-5">{t('app.see_list')}</span>
                </Link>
              </div>

              <div className="header text-center">
                <h4 className="title">{t('app.withdraw_apply')}</h4>
              </div>

              <div className="content">
                <div className="form-horizontal">

                  {/* ----- 1. 提款方式 ----- */}
                  <div className="form-group">
                    <label className="col-md-4 label-exchange">{t('app.choose_withdrawal_method')}</label>
                    <div className="col-md-6">
                      <select
                        onChange={this.onChangeWithdrawWay}
                        className="table-select"
                      >
                         <option key="" value=""  // "請選擇"要寫在Render內，不然無法即時翻譯
                            label={t('app.please_select')}>
                          </option> 
                        {this.state.withdrawWayOptions.map((item,index) => 
                          <option key={index} value={item.value} label={item.label}>
                            {item.value}
                          </option>)
                        }
                      </select>
                    </div>
                  </div>

                  {/* ----- 2. 幣別 ----- */}
                  <div className="form-group">
                    <label className="col-md-4 label-exchange">{t('app.currency_type')}</label>
                    <div className="col-md-6">
                    {currencyOptions instanceof Array
                      && currencyOptions.length > 0 ?
                      
                      <select onChange={this.onChangeCurrency} 
                        className="table-select">
                        <option key="" value=""  // "請選擇"要寫在Render內，不然無法即時翻譯
                            label={t('app.please_select')}>
                        </option> 
                        {currencyOptions.map((item,index) => 
                          <option key={index} value={item} label={item}> {item} </option>)
                        }
                      </select>
                      :
                      <select className="table-select">
                        <option key="" value=""
                          label={t('app.no_options')}>
                           {t('app.no_options')}
                        </option>
                      </select>
                    }
                    </div>
                  </div>

                  {/* ----- 3. 銀行帳戶 ----- */}
                  {this.state.select_withdraw_way==='1'?  //現金不顯示此欄位
                    ''
                    :
                    <div className="form-group">
                      <label className="col-md-4 label-exchange">{t('app.bank_account')}</label>
                      <div className="col-md-6">
                        {accountOptions instanceof Array
                          && accountOptions.length > 0 ?
                        
                          <select onChange={this.onChangeAccount} 
                            className="table-select">
                            <option key="" value=""  label={t('app.please_select')}></option> 
                            {accountOptions.map((item,index) => 
                              <option key={index} 
                                value={item.id}
                                label={item.account_number}> 
                              </option>)
                            }
                          </select>
                          :
                          // ----- 如果沒帳戶 顯示 ↓ ------ 
                          <select className="table-select"> 
                            <option key="" value=""
                              label={this.state.select_currency===''? '':t('app.no_bank_account')} >
                            </option>
                        </select>
                        }
                      </div>
                    </div>
                  }

                  {/* ----- 4. 可提款的平台(HKD)數量上限 ----- */}
                  <div className="form-group">
                    <label className="col-md-4 label-exchange">
                     {t('app.maximum_withdrawal_amount')}
                    </label>
                    <div className="col-md-6">
                      <div className="input-only-read">
                        {this.state.select_currency==="" || this.state.withdrawRate===undefined?
                          ''
                          : 
                          <span>
                            {this.state.maximum_amount<1 ? t('app.insufficient_withdrawal_amount') : this.state.maximum_amount}
                          </span>
                        }
                      </div>
                    </div>
                  </div>

                  {/* ----- 5. 申請提款數量 ----- */}
                  <div className="form-group">
                    <label className="col-md-4 label-exchange">{t('app.withdrawal_amount')}</label>
                    <div className="col-md-6">
                      <input
                        className="input-general"
                        type="text"
                        onChange={e=>this.onChangeAmount(e)}
                        value={this.state.amount}
                        maxLength={12}
                      />
                    </div>
                  </div>

                  {/* ----- 6. 匯率 ----- */}
                  <div className="form-group">
                    <label className="col-md-4 label-exchange">
                      {t('app.rate')}
                    </label>
                    <div className="col-md-6">
                      <div className="input-only-read">
                        {this.state.select_currency==="" || this.state.withdrawRate===undefined?
                          '':Format.thousandsToFix6(this.state.withdrawRate)
                        }
                      </div>
                    </div>
                  </div>

                  {/* ----- 7. 轉換數量 ----- */}
                  <div className="form-group">
                    <label className="col-md-4 label-exchange">
                      {t('app.convert_amount')}
                    </label>
                    <div className="col-md-6">
                      <div className="input-only-read">
                        {this.state.amount==="" || this.state.select_currency==='' ?
                          '':
                          <span>
                            {Format.thousands(this.state.amount*this.state.withdrawRate)}
                          </span>
                          }
                      </div>
                    </div>
                  </div>

                  {/* ----- 8.備註 ----- */}
                  <div className="form-group">
                    <label className="col-md-4 label-exchange">{t('app.remark')}</label>
                    <div className="col-md-6">
                      <input
                        className="input-general"
                        type="text"
                        onChange={this.onChangeRemark}
                        value={this.state.remark}
                        onKeyPress={event => {
                          if (event.key === 'Enter') {
                            this.submitPost()
                          }
                        }} 
                      />
                    </div>
                  </div>
                  
                  <br/>
                  {/* ----- 9.送出按鈕 ----- */}
                  <div className="form-group">
                    <label className="col-md-0"></label>
                    <div className="col-md-12">
                      <button 
                        type="button" 
                        className="card-submit-btn" 
                        onClick={this.state.isRepeatClickStop? '':this.submitPost}>
                        {t('app.submit')}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal open={this.state.isShowResultModal} 
          onClose={this.onCloseAllModal} closeIconSize={0}>
          <div className="modal-inside">
            <div className="modal-body ">
              <span className="">
                {this.state.state_success_message}
              </span>
              <span className="text-red">
                {this.state.state_error_message}
              </span>
            </div>
            {this.state.showRedirectBtn?
              <div className="modal-footer">
                <button className="modal-action-button"
                  onClick={()=>window.location.href="/#/withdraw/withdraw-list"}>
                  <span className="btn-icon">
                    <GoArrowLeft/>{t('app.go')}
                  </span>
                </button>
                <button className="modal-action-button"
                  onClick={this.onCloseAllModal}>
                  {t('app.continue_to_add')}
                </button>
              </div>
              :''}
          </div>
        </Modal>

      </div>
    );
  }
}

export default withTranslation()(WithdrawApply);
