import React from 'react';
import { apiPostBankAdd, apiGetTransactionCurrency } from '../../services/apiService'
import {withTranslation} from 'react-i18next';
import { Link } from 'react-router-dom';
import Modal from "react-responsive-modal";
// import { ERRORCODE } from '../../const'
import { GoArrowLeft } from "react-icons/go";
import { MdDone,MdRemoveRedEye,MdInfo } from "react-icons/md";


class BankAdd extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      create_type:'',
      currency_type: '',
      account_name: '', // 1.帳戶名稱、
      account_number: '', // 2.帳號
      bank_name: '' , // 3.銀行名稱
      bank_code:'', // 4.銀行代碼
      bank_branch: '', // 5.分行
      country: '', // 6.國家
      swift_code: '', // 7.SwiftCode
      payee_address:'', // 8.收款人地址
      bank_address:'', // 9.銀行地址 
      beneficiary_address:'', // 10.受益人地址
      bank_state_code:'', // 11.州分行
      payee_phone_number:'', // 12.收款人電話號碼
      state_success_message:'',
      state_error_message:'',
      isShowResultModal:false,
      isRepeatClickStop:false,
      showRedirectBtn:false,
      currencyOptions:[],
      createTypeOptions:[],
      showOriginDropdownOptions:[],
      showTargetDropdownOptions:[],
      isDefaultCurrency:''  // 判斷是否為預設幣別，且初始不能給true或false
    }
  }

  onChangCreateType = (e)=> {
    this.setState({
      create_type:e.target.value,
      // ↓ 選擇後要清空前次填入的數值
      account_name: '',
      account_number: '',
      bank_name: '',
      bank_code:'',
      bank_branch: '',
      country: '',
      swift_code: '',
      payee_address:'',
      bank_address:'',
      beneficiary_address:'',
      bank_state_code:'',
      payee_phone_number:'',
      state_success_message:'', //每次重選幣別時，清空訊息
      state_error_message:'',//每次重選幣別時，清空訊息
      isDefaultCurrency:'' ,
    })
  }

  onChangCurrencyType = (e) => { // 選擇幣別
    this.setState({
      currency_type:e.target.value,
      // ↓ 選擇後要清空前次填入的數值
      account_name: '',
      account_number: '',
      bank_name: '',
      bank_code:'',
      bank_branch: '',
      country: '',
      swift_code: '',
      payee_address:'',
      bank_address:'',
      beneficiary_address:'',
      bank_state_code:'',
      payee_phone_number:'',
      state_success_message:'', //每次重選幣別時，清空訊息
      state_error_message:'',//每次重選幣別時，清空訊息
      isDefaultCurrency:''
    },()=>{this.judgeDefaultCurrency()})
  }

  judgeDefaultCurrency = () => { //判斷是否為預設幣別
    let {currency_type} = this.state
    if (currency_type==='USD'
        || currency_type==='MYR'
        || currency_type==='CNY'
        || currency_type==='HKD'
        || currency_type==='PHP'

        || currency_type==='SGD'
        || currency_type==='EUR'
        || currency_type==='GBP'
        || currency_type==='IDR'
        || currency_type==='THB'

        || currency_type==='TWD'
        || currency_type==='AUD'
        || currency_type==='VND'
        || currency_type==='JPY'
        || currency_type==='KRW'
        || currency_type==='HKM'
    ){
      this.setState({
        isDefaultCurrency:true
      }
      // ,()=>{console.log('是預設幣別')}
      )
    }
    else{
      this.setState({
        isDefaultCurrency:false
      }
      // ,()=>{console.log('其他幣別~')}
      )
    }
  }

  onChange_all = (e) => {
    this.setState({
      [e.target.name]:e.target.value
    })
  }

  onChangeAccountNumber = (e) => { 
    console.log('預設幣別::',this.state.isDefaultCurrency);
    if(this.state.currency_type==="EUR" 
      || this.state.currency_type==="GBP"
      || this.state.currency_type==="HKM"){
        let regex = /^[A-Za-z0-9]+$/ //只能輸入英文、數字 
        let value = e.target.value
        if (!(regex.test(value) || value === '')) 
        return false
    }
    else if(this.state.isDefaultCurrency===false){ // 任何字元皆可輸入
      this.setState({
        [e.target.name]:e.target.value
      })
    }
    else{
      let regex = /^\d+$/  //只能輸入數字
      let value = e.target.value
      if (!(regex.test(value) || value === '')) 
      return false
    }
    this.setState({
      [e.target.name]:e.target.value
    })
  }

  onChangeBankStateCode = (e) => {
    let value = e.target.value
    let regex = /^[A-Za-z]+$/  //只能輸入英文
    if (!(regex.test(value) || value === '')) 
    return false
    this.setState({
      [e.target.name]:e.target.value
    })
  }

  clearStateData = () => {
    let { t } = this.props
    this.setState({
      create_type:'',
      currency_type: '',
      currencyOptions:[t('app.please_select')],
      account_name: '',
      account_number: '',
      bank_name: '',
      bank_code:'',
      bank_branch: '',
      country: '',
      swift_code: '',
      payee_address:'',
      bank_address:'',
      beneficiary_address:'',
      bank_state_code:'',
      payee_phone_number:'',
      isDefaultCurrency:'' ,
    },()=>{setTimeout(() => {
      this.showCreateTypeOption() //生成下拉選單
      this.getTransactionCurrency()
    }, 700)})
  }
  
  showSubmitError = () =>{
    let {t} = this.props
    this.setState({
      state_error_message: t('app.add_fail')
    })
    setTimeout(() => {
      this.setState({
        state_error_message:' '
      })
    }, 2000)
  }

  showSubmitSuccess = () =>{
    let {t} = this.props
    this.setState({
      state_success_message: <span className="text-green">
      <MdDone/> {t('app.add_success')}</span>
    })
    setTimeout(() => {
      this.setState({
        showRedirectBtn:true,
        state_success_message: t('app.go') + ' ' + t('app.list_page') + ' ? '
      })
    }, 2000)
  }

  showInputDataMissing = () => {
    let {t} = this.props
    this.setState({
      isShowResultModal:true,
      state_error_message:t('app.please_check_required_fields')
    })
   this.closeAllModel()
  }

  closeAllModel = () => {
    setTimeout(() => {
      this.setState({
        isShowResultModal:false,
        state_error_message:'',
        state_success_message:'',
        showRedirectBtn:false,
      })
    }, 1500)
  }
  
  clearMessageAndCloseModalQuick = () => {
    this.clearStateData()
    this.setState({
      isShowResultModal:false,
      state_error_message:'',
      state_success_message:'',
      showRedirectBtn:false,
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

  checksubmitPost = () => { // 檢查所有幣別的必填
    let { create_type, currency_type, account_number, account_name,
          bank_name, bank_code, bank_branch, country, swift_code, payee_address, 
          bank_address, bank_state_code } = this.state

    if(this.state.isDefaultCurrency===true){
       // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
       // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ 15種預設幣別 ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
        if(create_type==='' || currency_type==='' || account_name===''|| account_number===''){
            this.showInputDataMissing()
        }  
        // 只有 JPY、HKM 不填 bank_name ( 注意↓↓此處為不等於 !== )
        else if((currency_type!=='JPY' && currency_type!=='HKM')
          && (bank_name ==='')){
            this.showInputDataMissing()
          }
        else if((currency_type==='USD')
          && (country ===''
              || swift_code ===''
              || bank_address ===''
              || payee_address ===''
            )
          ){
              this.showInputDataMissing()
          }  
        else if((currency_type==='CNY')
          && (bank_branch === '')){
              this.showInputDataMissing()
            }
        else if((currency_type==='HKD')
          && (bank_code ==='')){
              this.showInputDataMissing()
            }
        else if((currency_type==='SGD' || currency_type==='IDR'
              ||currency_type==='THB' || currency_type==='TWD')
          && (country ==='')){
              this.showInputDataMissing()
            }
        else if((currency_type==='EUR'|| currency_type==='GBP')
          && (swift_code ==='' || payee_address ==='')){
              this.showInputDataMissing()
            }
        else if((currency_type==='AUD')
          && (bank_state_code ==='')){
              this.showInputDataMissing()
            }
        else if((currency_type==='JPY')
          && (bank_code ==='' || bank_branch ==='')){
              this.showInputDataMissing()
            }
        else if((currency_type==='KRW')
          && (payee_address ==='')){
              this.showInputDataMissing()
            }
        else{
          this.submitPost() // 完成所有必填，才能進行Post  ↓↓ 下面一位
        }
    }
    // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
    // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ 非預設幣別 ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
    else{
      if(account_name === '' // 1.帳戶名稱
        || account_number === '' // 2.帳號
        || bank_name === ''  // 3.銀行名稱
        || country === '' // 6.國家
      ){
        this.showInputDataMissing()
      }
      else{
        this.submitPost() // 完成所有必填，才能進行Post  ↓↓ 下面一位
      }
    }
  }


  //================= Api:post ===================//
  submitPost = async() => {
    let {t} = this.props
    let postData = {
      type: parseInt(this.state.create_type, 10),
      account_name: this.state.account_name.replace(/(^\s*)|(\s*$)/g, ""),  // 1.帳戶名稱
      account_number: this.state.account_number.replace(/(^\s*)|(\s*$)/g, ""),  // 2.帳號
      bank_name: this.state.bank_name.replace(/(^\s*)|(\s*$)/g, ""), // 3.銀行名稱
      bank_code: this.state.bank_code.replace(/(^\s*)|(\s*$)/g, ""), // 4.銀行代碼
      bank_branch: this.state.bank_branch.replace(/(^\s*)|(\s*$)/g, ""),  // 5.分行
      country: this.state.country.replace(/(^\s*)|(\s*$)/g, ""),  // 6.國家
      swift_code: this.state.swift_code.replace(/(^\s*)|(\s*$)/g, ""), // 7.SwiftCode
      currency_type: this.state.currency_type.replace(/(^\s*)|(\s*$)/g, ""), // 8.收款人地址
      bank_addr: this.state.bank_address.replace(/(^\s*)|(\s*$)/g, ""), // 9.銀行地址 
      payee_addr: this.state.payee_address.replace(/(^\s*)|(\s*$)/g, ""), // 10.受益人地址
      bank_state_code: this.state.bank_state_code.replace(/(^\s*)|(\s*$)/g, ""), // 11.州分行
      payee_phone_number: this.state.payee_phone_number.replace(/(^\s*)|(\s*$)/g, ""),  // 12.收款人電話號碼
    }
    this.stopRepeatClick()
    try {
      let res = await apiPostBankAdd(postData)
      if(res.data.code === 1){
        this.setState({
          isShowResultModal:true,
          createTypeOptions:[], //清空下拉選單
          serviceTypeOptions:[],
          saveType:this.state.create_type //判斷要跳轉到銀行帳戶 or 銀行卡
          })
        this.showSubmitSuccess()
        setTimeout(() => {
          this.clearStateData()
        }, 500);
      }
    } catch (err) {
      console.log(err);
      this.setState({
        isShowResultModal:true,
        state_error_message:t('app.add_fail') //無法顯示後端錯誤時
      })
      this.closeAllModel()
    }
  }
  //=============================================//


  successToPage = () => { //判斷新增的種類，更改跳轉的清單頁
    // console.log(this.state.saveType);
    if(this.state.saveType==='1'){
      window.location.assign("/#/bank/bank-list")

    }else{
      window.location.assign("/#/bank/card-list")
    }
  }

  showCreateTypeOption = () => { //顯示要新增的種類(銀行帳戶or銀行卡)
    let { t } = this.props
    this.setState({
      createTypeOptions : [
        { value:1, label:t('app.bank_account')},
        { value:2, label:t('app.bank_card')}
      ]
    })
  }

  // getTransactionCurrency = () => { //顯示要新增的幣別
  //   // let { t } = this.props
  //   this.setState({
  //     currencyOptions:["USD","MYR","CNY",
  //     "HKD","PHP","SGD","EUR","GBP","IDR","THB","TWD","AUD","VND",
  //     "JPY","KRW","HKM"]
  //   })
  // }
  
  getTransactionCurrency = async() => { //顯示要新增的幣別(API)
    try {
      let res = await apiGetTransactionCurrency()
      if(res.data.code===1){
        // console.log(res.data.data.open_currency);
        this.setState({
          currencyOptions: res.data.data.open_currency,
        })
      }
    } catch (err) {
      console.log(err);
    }
  }

  showRequiredMark = () => { //顯示必填符號
    let { currency_type } = this.state
    if( currency_type==='USD'|| currency_type==='CNY' || currency_type==='HKD'){
      return true
    }
    else{
      return false 
    }
  }


  //********** 下方為各欄位顯示的判斷 (依據幣別) **********

  showAccountName = () => {  // 1.帳戶名稱
    let { currency_type } = this.state
    if(currency_type===''){
      return false 
    }
    else{
      return true 
    }
  }

  showAccountNumber = () => {  // 2.帳號
    if(this.state.currency_type!==''){
      return true 
    }
    else{
      return false 
    }
  }

  showBankName = () => { // 3.銀行名稱
    let { currency_type } = this.state
    if(currency_type==='' || currency_type==='JPY' || currency_type==='HKM'){
      return false 
    }
    else{
      return true 
    }
  }

  showBankCode = () => { // 4.銀行代碼
    let { currency_type, isDefaultCurrency } = this.state
    if(currency_type==='HKD' || currency_type==='SGD' || currency_type==='IDR' 
    || currency_type==='THB' || currency_type==='TWD' || currency_type==='JPY' 
    || isDefaultCurrency===false
    ){
      return true
    }
    else{
      return false
    }
  }

  showBankBranch = () => { // 5.分行
    let { currency_type, isDefaultCurrency } = this.state
    if(currency_type==='CNY' || currency_type==='SGD' || currency_type==='IDR' 
    || currency_type==='THB' || currency_type==='TWD' || currency_type==='JPY'
    || isDefaultCurrency===false
    ){
      return true
    }
    else{
      return false
    }
  }

  showCountry = () => { // 6.國家
    let { currency_type, isDefaultCurrency } = this.state
    if(currency_type==='USD' || currency_type==='SGD' ||  currency_type==='IDR' 
    || currency_type==='THB' || currency_type==='TWD' || isDefaultCurrency===false){
      return true
    }
    else{
      return false
    }
  }

  showSwiftCode = () => { // 7.SwiftCode
    let { currency_type, isDefaultCurrency } = this.state
    if(currency_type==='USD' ||currency_type==='SGD' || currency_type==='EUR' 
    || currency_type==='GBP' || currency_type==='IDR' || currency_type==='THB'
    || currency_type==='TWD'  || currency_type==='KRW' || isDefaultCurrency===false){
      return true
    }
    else{
      return false
    }
  }

  showPayeeAddress = () => { // 8.收款人地址
    let { currency_type, isDefaultCurrency } = this.state
    if(currency_type==='USD' ||currency_type==='SGD' || currency_type==='EUR' 
    || currency_type==='GBP' || currency_type==='IDR' || currency_type==='THB'
    || currency_type==='TWD'  || currency_type==='KRW' || isDefaultCurrency===false){
      return true
    }
    else{
      return false
    }
  }

    
  showBankAddress = () => { // 9.銀行地址
    let { currency_type, isDefaultCurrency } = this.state
    if(currency_type==='USD'|| currency_type==='SGD'|| currency_type==='IDR'
    || currency_type==='THB' || currency_type==='TWD' || isDefaultCurrency===false ){
      return true
    }
    else{
      return false
    }
  }
  
  showBeneficiaryAddress = () => { // 10.受益人地址
    let { currency_type, isDefaultCurrency } = this.state
    if(currency_type==='SGD'||currency_type==='IDR'
    || currency_type==='THB' || currency_type==='TWD' || isDefaultCurrency===false ){
        return true
      }
      else{
        return false
      }
  }

  showBankStateCode = () => { // 11.州分行
    let { currency_type, isDefaultCurrency } = this.state
    if(currency_type==='AUD' || isDefaultCurrency===false ){
        return true
      }
      else{
        return false
      }
  }

  showPayeePhoneNumber = () => { // 12.收款人電話號碼
    let { currency_type, isDefaultCurrency } = this.state
    if(currency_type==='GBP' || isDefaultCurrency===false ){
        return true
      }
      else{
        return false
      }
  }

  showAccountPlaceholder = () => { //帳號顯示的 placeholder 規則
    let { t } = this.props
    let { currency_type, isDefaultCurrency } = this.state
    if(isDefaultCurrency===false){
      return ''
    }
    else if(currency_type==="EUR" || currency_type==="GBP" || currency_type==="HKM"){
      return  t('app.enter_number_en_accepted')
    }
    else{
      return t('app.enter_number_only')
    }
  }


  componentDidMount(){
    this.showCreateTypeOption()
    // this.getTransactionCurrency()
    this.getTransactionCurrency()
  }


  render(){
    let {t} = this.props
    let { currency_type, isDefaultCurrency } = this.state
    // console.log(this.state.isDefaultCurrency);
    // console.log('currency_type:',this.state.currency_type);

    return (
      <div className="container-fluid">
          <div className="row">
            <div className="col-md-10">
              <div className="card card-exchange">

                <div className="card-top-info">
                  <span className="left-info">
                    <span className="remind-text"><MdInfo/> {t('app.confirm_account_activity')} </span>
                  </span>
                  <span className="right-info">
                    <Link to="/bank/bank-list" className="linkBtn">
                      <MdRemoveRedEye/>
                      <span className="ml-5">{t('app.see_list')}</span>
                    </Link>
                  </span>
                </div>

                <div className="header text-center">
                  <h4 className="title">{t('app.bank_add')}</h4>
                </div>

                <div className="content">
                  <div className="form-horizontal">

                    {/* ********** 類型 ********** */}
                    <div className="form-group">
                      <label className="col-md-4 label-exchange">
                      <span className="text-red">* </span>
                        {t('app.type')}
                      </label>
                      <div className="col-md-6">
                        <select
                          onChange={this.onChangCreateType} 
                          className="table-select"
                        >
                          <option key="" value=""  // "請選擇"要寫在Render內，不然無法即時翻譯
                            label={t('app.please_select')}>
                          </option> 
                          {this.state.createTypeOptions.map((item,index) => 
                            <option key={index} value={item.value} label={item.label}>
                              {item.label}
                            </option>)
                          }
                      </select>
                      </div>
                    </div>

                    {/* ********** 幣別 ********** */}
                    <div className="form-group">
                      <label className="col-md-4 label-exchange">
                      <span className="text-red">* </span>
                        {t('app.currency_type')}
                      </label>
                      <div className="col-md-6">
                        <select
                          onChange={this.onChangCurrencyType}
                          className="table-select"
                        >
                        <option key="" value=""  // "請選擇"要寫在Render內，不然無法即時翻譯
                          label={t('app.please_select')}>
                        </option> 
                        {this.state.currencyOptions.map((item,index) => 
                          <option key={index} value={item} label={item}>
                            {item}
                          </option>)
                        }
                      </select>
                      </div>
                    </div>

                    {/* ********** 1.帳戶名稱 ********** */}
                    {this.showAccountName()?
                      <div className="form-group">
                        <label className="col-md-4 label-exchange">
                          <span className="text-red">* </span>
                          {t('app.bank_account_name')}
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            onChange={this.onChange_all}
                            name="account_name"
                            value={this.state.account_name}
                            autoComplete="off"
                            maxLength="20"
                            />
                        </div>
                      </div>
                    :''}
                    
                    {/* ********** 2.帳號 ********** */}
                    {this.showAccountNumber()?
                      <div className="form-group">
                        <label className="col-md-4 label-exchange">
                          <span className="text-red">* </span>
                          {t('app.account_number')}
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            onChange={this.onChangeAccountNumber}
                            name="account_number"
                            value={this.state.account_number}
                            autoComplete="off"
                            placeholder={this.showAccountPlaceholder()}
                            maxLength="20"
                          />
                        </div>
                      </div>
                     :''}

                    {/* ********** 3.銀行名稱 ********** */}
                    {this.showBankName()?
                      <div className="form-group">
                        <label className="col-md-4 label-exchange">
                          <span className="text-red">* </span>
                          {t('app.bank_name')}
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            onChange={this.onChange_all}
                            name="bank_name"
                            value={this.state.bank_name}
                            autoComplete="off"
                            maxLength="20"
                            />
                        </div>
                      </div>
                    :''}

                    {/* ********** 4.銀行代碼 ********** */}
                    {this.showBankCode() ?
                      <div className="form-group">
                        <label className="col-md-4 label-exchange">
                          {currency_type==="HKD"||currency_type==="JPY"?<span className="text-red">* </span>:''}
                          {t('app.bank_code')}
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            onChange={this.onChange_all}
                            name="bank_code"
                            value={this.state.bank_code}
                            autoComplete="off"
                            maxLength="20"
                          />
                        </div>
                      </div>
                    :''}

                    {/* ********** 5.分行 ********** */}
                    {this.showBankBranch() ?
                      <div className="form-group">
                        <label className="col-md-4 label-exchange">
                          {currency_type==="CNY"||currency_type==="JPY"?<span className="text-red">* </span>:''}
                          {t('app.bank_branch')}
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            onChange={this.onChange_all}
                            name="bank_branch"
                            value={this.state.bank_branch}
                            autoComplete="off"
                            maxLength="20"
                            />
                        </div>
                      </div>
                    :''}
                  
                    {/* ********** 6.國家 ********** */}
                    {this.showCountry() ?
                      <div className="form-group">
                        <label className="col-md-4 label-exchange">
                          {/* {!isDefaultCurrency?<span className="text-red">* </span>:''} */}
                          {currency_type==="USD"||currency_type==="SGD"||currency_type==="IDR"
                           ||currency_type==="THB"||currency_type==="TWD"||!isDefaultCurrency?
                            <span className="text-red">* </span>:''}
                          {t('app.country')}
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            onChange={this.onChange_all}
                            name="country"
                            value={this.state.country}
                            autoComplete="off"
                            maxLength="20"
                          />
                        </div>
                      </div>
                    :''}

                    {/* ********** 7.Swift Code ********** */}
                    {this.showSwiftCode() ?
                      <div className="form-group">
                        <label className="col-md-4 label-exchange">
                          {currency_type==="USD"||currency_type==="EUR"||currency_type==="GBP"?
                            <span className="text-red">* </span>:''}
                          {t('app.swift_code')}
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            onChange={this.onChange_all}
                            name="swift_code"
                            value={this.state.swift_code}
                            autoComplete="off"
                            maxLength="20"
                            onKeyPress={event => {
                              if (event.key === 'Enter') {
                                this.submitPost()
                              }
                            }} 
                          />
                        </div>
                      </div>
                    :''}

                    {/* ********** 8.收款人地址 ********** */}
                    {this.showPayeeAddress() ?
                      <div className="form-group">
                        <label className="col-md-4 label-exchange">
                          {currency_type==="USD"||currency_type==="EUR"||currency_type==="GBP"?
                            <span className="text-red">* </span>:''}
                          {t('app.payee_address')}
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            onChange={this.onChange_all}
                            name="payee_address"
                            value={this.state.payee_address}
                            autoComplete="off"
                            maxLength="30"
                          />
                        </div>
                      </div>
                    :''}

                    {/* ********** 9.銀行地址 ********** */}
                    {this.showBankAddress() ?
                      <div className="form-group">
                        <label className="col-md-4 label-exchange">
                          {currency_type==="USD"?<span className="text-red">* </span>:''}
                          {t('app.bank_address')}
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            onChange={this.onChange_all}
                            name="bank_address"
                            value={this.state.bank_address}
                            autoComplete="off"
                            maxLength="30"
                          />
                        </div>
                      </div>
                    :''}

                    {/* ********** 10.受益人地址 ********** */}
                    {this.showBeneficiaryAddress() ?
                      <div className="form-group">
                        <label className="col-md-4 label-exchange">
                          {/* {this.showRequiredMark()?<span className="text-red">* </span>:''} */}
                          {t('app.beneficiary_address')}
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            onChange={this.onChange_all}
                            name="beneficiary_address"
                            value={this.state.beneficiary_address}
                            autoComplete="off"
                            maxLength="30"
                            onKeyPress={event => {
                              if (event.key === 'Enter') {
                                this.submitPost()
                              }
                            }} 
                          />
                        </div>
                      </div>
                    :''}

                    {/* ********** 11.州分行 (只有AUD) ********** */}
                    {this.showBankStateCode() ?
                      <div className="form-group">
                        <label className="col-md-4 label-exchange">
                        {currency_type==="AUD"?<span className="text-red">* </span>:''}
                          {t('app.bank_state_code')}
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            onChange={this.onChangeBankStateCode}
                            name="bank_state_code"
                            value={this.state.bank_state_code}
                            autoComplete="off"
                            maxLength="30"
                            onKeyPress={event => {
                              if (event.key === 'Enter') {
                                this.submitPost()
                              }
                            }} 
                          />
                        </div>
                      </div>
                    :''}

                    {/* ********** 12.收款人電話號碼 (只有GBP) ********** */}  
                    {this.showPayeePhoneNumber() ?
                      <div className="form-group">
                        <label className="col-md-4 label-exchange">
                          {/* {this.showRequiredMark()?<span className="text-red">* </span>:''} */}
                          {t('app.payee_phone_number')}
                        </label>
                        <div className="col-md-6">
                          <input
                            type="text"
                            onChange={this.onChange_all}
                            name="payee_phone_number"
                            value={this.state.payee_phone_number}
                            autoComplete="off"
                            maxLength="30"
                            onKeyPress={event => {
                              if (event.key === 'Enter') {
                                this.submitPost()
                              }
                            }} 
                          />
                        </div>
                      </div>
                    :''}

                    <div className="form-group">
                      <label className="col-md-4"></label>
                      <div className="col-md-6"  style={{textAlign: "right"}}>
                        <span className="text-red">* </span>{t('app.required_max_character')}
                      </div>
                    </div>

                    {/* <br/> */}

                    <div className="form-group">
                      <div className="col-md-12">
                        <button 
                          type="button"
                          className="card-submit-btn"
                          onClick={this.state.isRepeatClickStop? '':this.checksubmitPost}
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
            onClose={this.clearMessageAndCloseModalQuick} closeIconSize={0}>
            <div className="modal-inside">
              <div className="modal-body ">
                <span>
                  {this.state.state_success_message}
                </span>
                <span className="text-red">
                  {this.state.state_error_message}
                </span>
              </div>
              {this.state.showRedirectBtn?
                <div className="modal-footer">
                  <button className="modal-action-button"
                    onClick={this.successToPage}>
                    <span className="btn-icon">
                      <GoArrowLeft/>{t('app.go')}
                    </span>
                  </button>
                  <button className="modal-action-button"
                    onClick={this.clearMessageAndCloseModalQuick}>
                    {t('app.continue_to_add')}
                  </button>
                </div>
              :''}
            </div>
          </Modal>

      </div>
    )
  }
}

export default withTranslation()(BankAdd);