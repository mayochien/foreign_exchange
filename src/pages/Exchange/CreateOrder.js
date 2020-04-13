import React from 'react';
import {withTranslation} from 'react-i18next';
import { apiPostBankerOrderAdd, 
         apiGetMyTradeBankList ,
         apiGetRate,
         apiGetTransactionCurrency,
         } from '../../services/apiService'
import { MdDone,MdRemoveRedEye } from "react-icons/md";
import { FaSort } from "react-icons/fa";
import { GoArrowRight,GoArrowLeft } from "react-icons/go";
import { Link } from 'react-router-dom';
import Modal from "react-responsive-modal";
// import { ERRORCODE } from '../../const'
import Format from '../../services/Format'; 


class CreateOrder extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      originCurrencyOptions:[],
      targetCurrencyOptions:[],
      origin_currency:'',
      target_currency:'',
      amount:'',
      rate:'',
      state_success_message:'',
      state_error_message:'',
      isShowResultModal:false,
      myBankList:[],
      selectBankId:'',
      isShowRateModal:false,
      oneDollorTargetRate:'',
      isRepeatClickStop:false,
      showRedirectBtn:false,
    }
  }

  getTransactionCurrency = async() => {
    try {
      let res = await apiGetTransactionCurrency()
      if(res.data.code===1){
        this.setState({
          originCurrencyOptions: res.data.data.open_currency,
          targetCurrencyOptions: res.data.data.open_currency
        })
      }
    } catch (err) {
      console.log(err);
    }
  }

  onChangeOriginCurrency = (e) => {
    this.setState({
      origin_currency:e.target.value,
      rate:'',
      amount:'',
      myBankList:[]
    },()=>this.getCurrencyRate() // 抓取匯率
    )
    setTimeout(() => { 
      // if(this.state.origin_currency !=='' ){  // ▇▇▇ 選擇某原始幣別ex:USD後，目標幣別就要去除USD ▇▇▇
        // this.setState({ 
          // targetCurrencyOptions:this.state.targetCurrencyOptions.filter(i => i !== this.state.origin_currency)
        // })
      // }
      this.checkIsCurrencySame() //檢查貨幣是否相同
      this.getMyTradeBankList()  // 抓取銀行帳戶清單
    }, 100);
  }

  onChangeTargteCurrency = (e) => {
    this.setState({
      target_currency:e.target.value,
      rate:'',
      amount:'',
      myBankList:[]
    },()=>this.getCurrencyRate() // 抓取匯率
    )
    setTimeout(() => {
      this.checkIsCurrencySame() //檢查貨幣是否相同
      this.getMyTradeBankList()  // 抓取銀行帳戶清單
    }, 100);
  
  }

  checkIsCurrencySame = () => {
    if(this.state.origin_currency === this.state.target_currency){
      let { t } = this.props
      this.setState({  //﹝原始幣別﹞、﹝目標幣別﹞相同時
        target_currency:'', //強制把目標貨幣重製
        isShowResultModal:true,
        state_error_message: "﹝" + t('app.origin_currency')  + "﹞"  
         + "﹝" + t('app.target_currency') + "﹞" + t('app.cannot_be_the_same')
      })
      this.clearMessageAndCloseModal()
    }
  }

  // ********** 幣別調換功能 ↓↓ **********
  swapOriginCurrency = () => {
    this.setState({ // 1.先儲存目前的【原始貨幣】為 saveOriginCurrency
      saveOriginCurrency:this.state.origin_currency,
      myBankList:[] //讓已選擇的銀行重置
    },
      ()=>{setTimeout(() => { // 2.替換【原始幣別】to【目標幣別】
        this.setState({
          origin_currency:this.state.target_currency,
        })
      }, 100)}
    )
    setTimeout(() => { // 3.執行替換【原始幣別】to【目標幣別】
      this.swapTargetCurrency()
    }, 200)
  } 

  swapTargetCurrency = () => { // 4. 使用先前的saveOriginCurrency ~收工
    // console.log('執行替換【原始幣別】to【目標幣別】')
    this.setState({
      target_currency:this.state.saveOriginCurrency,
      amount:0,
    },()=>this.getCurrencyRate())
    setTimeout(() => {
      this.getMyTradeBankList()
      // console.log('置換後的target_currency:',this.state.target_currency);
      this.setState({
        target_currency:this.state.saveOriginCurrency,
      })
    }, 100);
  }
  // ********** 幣別調換功能 ↑↑ **********


  // ********** get 可交易的銀行帳戶 **********
  getMyTradeBankList = async() => { // 初始載入  (get銀行帳戶)
    if(this.state.target_currency !==''){
      try{
        let res = await apiGetMyTradeBankList(this.state.target_currency)
          if(res.data.code === 1){
            // let listFirstText = [{bank_name:t('app.please_select') , account_number:''}]
            this.setState({
              myBankList:res.data.data.banks
            })
          }
      }catch (err) {
        console.log(err)
      }
    }
  }

  // ********** get參考匯率 **********
  getCurrencyRate = async() => {
    let { origin_currency,target_currency } = this.state
    if(origin_currency!=='' && target_currency !== ''){
      try {
        let res = await apiGetRate(origin_currency, target_currency)
        if(res.data.code===1){
          this.setState({
            oneDollorTargetRate:Format.thousandsToFix6(Object.keys(res.data.data).map((i=>res.data.data[i]))[0])
          },()=>{
            // console.log( this.state.oneDollorTargetRate )
            setTimeout(() => { //同時要帶入給【匯率】欄位
              this.setState({
                rate:this.state.oneDollorTargetRate
              })
            }, 150);
          })
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  
  onChangeRate = (e) => { //開頭不能輸入符號、負數
    let regex = /^[0-9]*(\.[0-9]{0,6})?$/;
    let value = e.target.value
    if (!(regex.test(value))
      ||(value.startsWith('-'))
      ) return false
    else{
      this.setState({
        rate:value
      })
    }
  }

  onChangeAmount = (e) => { //開頭不能輸入0、不能輸入符號、負數、小數點
    let value = e.target.value.replace(/[^\d]/,'')
    if (value.startsWith('0')) {
      value = value.substring('1')
    }
    else{
      this.setState({
        amount:value
      })
    }
  }

  showTargeAmount = () => { //開頭不能輸入0、不能輸入符號、負數、小數點
    if(this.state.amount===undefined || this.state.amount==='' || this.state.amount === 0){
      return ''
    }
    else{
      if(typeof(this.state.rate)==='string'){
        // 自動帶入的匯率會是字串，須先轉成數字
        // console.log('哇 是字串啊!!');
        let turnRateStringToNumber = parseFloat(this.state.rate.toString().replace(/,/g, ''));
        return Format.thousandsMathRound3(turnRateStringToNumber*this.state.amount)
      }
      else{
        // console.log('是 number ~');
        return Format.thousandsMathRound3(this.state.rate*this.state.amount)
      }
    }
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


  // ********** Api:post **********
  submitPost = async() => {
    let {t} = this.props
    let postData ={
      origin_currency: this.state.origin_currency,
      target_currency: this.state.target_currency,
      amount:parseInt(this.state.amount,10),
      rate: parseFloat(this.state.rate,10),
      bank_account_id:parseInt(this.state.selectBankId,10)
    }
    // console.log(typeof(parseInt(this.state.amount))==="number")
    // console.log(typeof(parseFloat(this.state.rate))==="number")
    console.log('postData:',postData)

    this.stopRepeatClick()
    
    if(this.state.origin_currency === ''
      || this.state.target_currency === ''
      || this.state.amount === ''
      || this.state.rate === ''
      ){
        this.showInputDataMissing() //有欄位未填時
    }
    else if(this.state.origin_currency === this.state.target_currency){
      this.setState({  //﹝原始幣別﹞、﹝目標幣別﹞相同時
        isShowResultModal:true,
        state_error_message:
        "﹝"+ t('app.origin_currency') +"﹞"
        +"﹝"+ t('app.target_currency') + "﹞"
        + t('app.cannot_be_the_same')
      })
      this.clearMessageAndCloseModal()
    }else{
      try {
        let res = await apiPostBankerOrderAdd(postData)
        if(res.data.code===1){
          this.setState({
            isShowResultModal:true
          })
          this.showSubmitSuccess()
        }
        else{
          // this.setState({
          //   isShowResultModal:true,
          //   state_error_message:t(ERRORCODE[res.data.code]) 
          // })
          // this.clearMessageAndCloseModal()
        }
      } catch (err) {
        console.log(err);
        this.setState({
          isShowResultModal:true,
          state_error_message:t('app.add_fail') //無法顯示後端錯誤時
        })
        this.clearMessageAndCloseModal()
      }
    }
  }

  showInputDataMissing=()=>{
    let {t} = this.props
    // console.log('有欄位未填寫')
    this.setState({
      isShowResultModal:true,
      state_error_message:t('app.please_check_required_fields')
    })
   this.clearMessageAndCloseModal()
  }

  showSubmitSuccess = () =>{
    let {t} = this.props
    this.setState({
      state_success_message: <span className="text-green">
        <MdDone/>{t('app.add_success')}</span>
    })
    setTimeout(()=>{
      this.setState({
        state_success_message: t('app.go_to_transaction_orders'),
        showRedirectBtn:true,
        origin_currency:'',
        target_currency:'',
        amount:'',
        rate:'',
        myBankList:[]
      })
    },2000)
    // this.clearMessageAndCloseModal()
  }

  onCloseAllModal = () => {
    this.setState({ 
      isShowResultModal: false,
      isShowRateModal: false,
      showRedirectBtn:false,
      state_error_message:'',
      state_success_message:'',
    });
  };

  clearMessageAndCloseModal=()=>{
    setTimeout(() => {
      this.setState({
        isShowResultModal:false,
        isShowRateModal: false,
        state_error_message:'',
        state_success_message:'',
      })
    }, 2000)
  }

  componentDidMount(){
    this.getTransactionCurrency() //取得可交易的貨幣選項
  }


  render(){
    let {t} = this.props
    let { myBankList } = this.state

    return (
      <div className="container-fluid">
          <div className="row">
            <div className="col-md-10">
              <div className="card card-exchange card-CreateOrder">

                <div className="text-right">
                  <Link to="/exchange/my-selling-list"
                    className="text-page-link">
                    <MdRemoveRedEye/>
                    <span className="ml-5">{t('app.see_list')}</span>
                  </Link>
                </div>

                <div className="header ">
                  <h4 className="title text-center">{t('app.my_selling_order_add')}</h4>
                </div>

                <div className="content">
                  <div className="form-horizontal">

                    {/* ----- 1. 原始幣別 ----- */}
                    <div className="form-group mb-4"> 
                      <label className="col-md-4 label-exchange">
                        {t('app.origin_currency')}
                      </label>
                      <div className="col-md-6">
                        <select
                          onChange={this.onChangeOriginCurrency} 
                          className="table-select"
                          value={this.state.origin_currency}
                        >
                          <option key="index" value=""  // "請選擇"要寫在Render內，不然無法即時翻譯
                            label={t('app.please_select')}>
                          </option> 
                          {this.state.originCurrencyOptions.map((item,index) => 
                            <option key={index} value={item}>
                              {item}
                            </option>)
                          }
                        </select>
                      </div>
                    </div>

                    {/* ----- 上下調換按鈕 ----- */}
                    <div className="form-group form-group-currency-change mb-4">
                      <label className="col-md-4 label-exchange"></label>
                      <div className="col-md-6 currency-change-btn-section">
                        <button className="currency-change-btn"
                         onClick={this.swapOriginCurrency}>
                          <FaSort/>
                        </button>
                      </div>
                    </div>

                    {/* ----- 2. 目標幣別 ----- */}
                    <div className="form-group">
                      <label className="col-md-4 label-exchange">
                        {t('app.target_currency')}
                      </label>
                      <div className="col-md-6">
                        <select
                          onChange={this.onChangeTargteCurrency} 
                          className="table-select"
                          value={this.state.target_currency}
                        >
                          <option key="index" value=""  // "請選擇"要寫在Render內，不然無法即時翻譯
                            label={t('app.please_select')}>
                          </option> 
                          {this.state.targetCurrencyOptions.map((item,index) => 
                            <option key={index} value={item}>
                              {item}
                            </option>)
                          }
                        </select>
                      </div>
                    </div>

                    {/* ----- 3. 參考匯率 ----- */}
                    <div className="form-group">
                      <label className="col-md-4 label-exchange">
                      {t('app.reference_exchange_rate')}
                      </label>
                      <div className="col-md-6">
                        <div className="input-only-read">
                          {this.state.target_currency===""?
                            '':this.state.oneDollorTargetRate}
                        </div>
                      </div>
                    </div>
                    
                    {/* ----- 4. 匯率 ----- */}
                    <div className="form-group">
                      <label className="col-md-4 label-exchange">
                        {t('app.rate')}
                      </label>
                      <div className="col-md-6">
                      <input
                          onChange={this.onChangeRate}
                          name="rate"
                          defaultValue={this.state.oneDollorTargetRate}
                          value={this.state.rate}
                          autoComplete="off"
                          />
                      </div>
                    </div>
                    
                    {/* ----- 5. 原始貨幣數量 ----- */}
                    <div className="form-group">
                      <label className="col-md-4 label-exchange">
                        {t('app.origin_currency_amount')}
                      </label>
                      <div className="col-md-6">
                        <input
                          onChange={this.onChangeAmount}
                          name="amount"
                          value={this.state.amount}
                          autoComplete="off"
                          maxLength={12}
                          />
                      </div>
                    </div>
                      
                    {/* ----- 6. 目標貨幣數量 ----- */}
                    <div className="form-group">
                      <label className="col-md-4 label-exchange">
                        {t('app.target_currency_amount')}
                      </label>
                      <div className="col-md-6">
                        <div className="input-only-read">
                         {this.showTargeAmount()}
                        </div>
                      </div>
                    </div>

                    {/* ----- 7. 選擇銀行帳戶 ----- */}
                    <div className="form-group">
                      <label className="col-md-4 label-exchange">
                        {/* {t('app.target_currency')} */}
                        {t('app.bank_account')}
                      </label>
                      <div className="col-md-6">
                        {myBankList instanceof Array
                          && myBankList.length > 0 ?
                          // && this.state.rate!==""
                          // && this.state.amount!==""? 
                          // ----- 如果有銀行帳戶 顯示 ↓ ------ 
                          <select
                            className="table-select"
                            onChange={e=>this.setState({
                              selectBankId:e.target.value
                            })}>
                              <option key="" value=""
                                label={t('app.please_select')}>
                               </option> 
                              {myBankList.map((item,index) => 
                                <option key={index} 
                                  label={item.bank_name +'  ' + item.account_number}
                                  value={item.id} 
                                  >
                                  {/* item.account_name */}
                                </option>)
                              }
                          </select>
                          :  
                          // ----- 如果沒銀行帳戶 顯示 ↓ ------ */}
                          <select className="table-select" >
                            <option key="" label={this.state.target_currency===''? '':t('app.no_bank_account')} >
                              {/* {t('app.no_options')} */}
                            </option>
                          </select>
                        }
                      </div>
                    </div>

                  
                    {/* ----- 結果顯示文字 ----- */}
                    {/* <div className="submit-alert-section">
                      <label className="col-md-4"></label>
                      <div className="col-md-6">
                        <div className="submit-alert-text text-red">
                          {this.state.state_error_message}
                        </div>
                      </div>
                    </div> */}

                    <br/>

                    {/* ----- 送出按鈕 ----- */}
                    <div className="form-group">
                      <label className="col-md-0"></label>
                      <div className="col-md-12">
                        <button  
                          type="button"
                          className="card-submit-btn"
                          onClick={this.state.isRepeatClickStop? '':this.submitPost}
                          >
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
                    onClick={()=>window.location.href="/#/exchange/my-selling-list"}>
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

          <Modal open={this.state.isShowRateModal} 
            onClose={this.onCloseAllModal} closeIconSize={0}>
            {this.state.origin_currency ==='' || this.state.target_currency ===''?
              <div className="modal-inside">
                 <div className="modal-body">
                  {t('app.please_enter')}﹝{t('app.origin_currency')}﹞﹝{t('app.target_currency')}﹞
                 </div>
              </div>
             :
              <div className="modal-inside">
                <div className="modal-body modal-body-rate">
                  <div className="rate-line-info">
                    <div className="rate-line-info-box">
                      <div className="rate-line-text">{this.state.origin_currency}</div>
                      <div className="rate-line-number">1</div>
                    </div>
                    <div className="rate-arrow"><GoArrowRight/></div>
                    <div className="rate-line-info-box">
                      <div className="rate-line-text">{this.state.target_currency}</div>
                      <div className="rate-line-number">{this.state.oneDollorTargetRate}</div>
                    </div>
                  </div>
                  <div className="rate-line-answer">
                    <span className="rate-line-rate">{this.state.amount}</span>
                    <span className="rate-line-rate">
                      {(this.state.amount * this.state.oneDollorTargetRate).toFixed(6)}
                    </span>
                  </div>
                </div>
              </div>
              }
          </Modal>

      </div>
    )
  }
}

export default withTranslation()(CreateOrder);


// swapOriginCurrency = () => {
//   this.setState({ // 1.先儲存目前的【原始貨幣】為 saveOriginCurrency
//     saveOriginCurrency:this.state.origin_currency
//   },
//     ()=>{setTimeout(() => { // 2.替換【原始幣別】to【目標幣別】
//       this.setState({
//         origin_currency:this.state.target_currency
//       })
//     }, 200)}
//   )
//   setTimeout(() => { // 3.執行替換【原始幣別】to【目標幣別】
//     this.swapTargetCurrency()
//   }, 400)
// }

// swapTargetCurrency = () => { // 使用先前的saveOriginCurrency ~耶
//   console.log('替換【原始幣別】to【目標幣別】')
//   this.setState({ 
//     target_currency:this.state.saveOriginCurrency
//   })
// }