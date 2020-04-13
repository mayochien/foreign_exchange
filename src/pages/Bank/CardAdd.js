// import React from 'react';
// import { apiPostCardAdd } from '../../services/apiService'
// import {withTranslation} from 'react-i18next';
// import { Link } from 'react-router-dom';
// import Modal from "react-responsive-modal";
// // import { ERRORCODE } from '../../const'
// import { GoArrowLeft } from "react-icons/go";
// import { MdDone,MdRemoveRedEye,MdInfo } from "react-icons/md";


// class CardAdd extends React.Component{
//   constructor(props) {
//     super(props)
//     this.state = {
//       type:2,
//       account_name: '',
//       account_number: '',
//       bank_branch: '',
//       bank_code:'',
//       bank_name: '',
//       country: '',
//       swift_code: '',
//       currency_type: '',
//       state_success_message:'',
//       state_error_message:'',
//       isShowResultModal:false,
//       isRepeatClickStop:false,
//       showRedirectBtn:false,
//       currencyOptions:[]
//     }
//   }

//   onChange_all = (e) => {
//     let regex = /^[A-Za-z0-9]+$/
//     let value = e.target.value
//     if (!(regex.test(value) || value === '')) 
//     return false
//     this.setState({
//       [e.target.name]:e.target.value
//     })
//   }

//   clearStateData=()=>{
//     let { t } = this.props
//     this.setState({
//       currencyOptions:[t('app.please_select')],
//       currency_type: '',
//       account_name: '',
//       account_number: '',
//       bank_branch: '',
//       bank_code:'',
//       bank_name: '',
//       country: '',
//       swift_code: '',
//     },()=>{setTimeout(() => {
//       this.showCurrencyTypeArray()
//     }, 500)})
//   }
  
//   showSubmitError = () =>{
//     let {t} = this.props
//     this.setState({
//       state_error_message: t('app.add_fail')
//     })
//     setTimeout(() => {
//       this.setState({
//         state_error_message:' '
//       })
//     }, 2000)
//   }

//   showSubmitSuccess = () =>{
//     let {t} = this.props
//     this.setState({
//       state_success_message: <span className="text-green">
//       <MdDone/> {t('app.add_success')}</span>
//     })
//     setTimeout(() => {
//       this.setState({
//         showRedirectBtn:true,
//         state_success_message: t('app.go') + ' ' + t('app.list_page') + ' ? '
//       })
//     }, 2000)
//   }

//   showInputDataMissing=()=>{
//     let {t} = this.props
//     console.log('有欄位未填寫')
//     this.setState({
//       isShowResultModal:true,
//       state_error_message:t('app.please_check_required_fields')
//     })
//    this.clearMessageAndCloseModal()
//   }
 
//   clearMessageAndCloseModal=()=>{
//     this.clearStateData()
//     setTimeout(() => {
//       this.setState({
//         isShowResultModal:false,
//         state_error_message:'',
//         state_success_message:'',
//         showRedirectBtn:false,
//       })
//     }, 2000)
//   }

//   clearMessageAndCloseModalQuick=()=>{
//     this.clearStateData()
//     this.setState({
//       isShowResultModal:false,
//       state_error_message:'',
//       state_success_message:'',
//       showRedirectBtn:false,
//     })
//   }

//   stopRepeatClick = () => {
//     this.setState({
//       isRepeatClickStop:true,
//     })
//     setTimeout(()=>{
//       this.setState({
//         isRepeatClickStop:false,
//       })
//     },2000)
//   }

//   //================= Api:post ===================//
//   submitPost = async() => {
//     this.setState({
//       isRepeatClickStop:true,
//     })
//     setTimeout(()=>{
//       this.setState({
//         isRepeatClickStop:false,
//       })
//     },2000)

//     let {t} = this.props
//     let postData = {
//       type: 2,
//       account_name: this.state.account_name,
//       account_number: this.state.account_number,
//       bank_branch: this.state.bank_branch,
//       bank_code: this.state.bank_code,
//       bank_name: this.state.bank_name,
//       country: this.state.country,
//       swift_code: this.state.swift_code,
//       currency_type: this.state.currency_type,
//       payee_addr: this.state.payee_address,
//       bank_addr: this.state.bank_address,
//       beneficiary_addr: this.state.beneficiary_address,
//     }
    
//     this.stopRepeatClick()

//     if(this.state.account_name === ''
//       ||this.state.account_number ===''
//       ||this.state.bank_branch ===''
//       ||this.state.bank_code === ''
//       ||this.state.bank_name === ''
//     ){
//       this.showInputDataMissing() //有欄位未填時
//     }
//     else{
//       console.log('postData:',postData)
//       try {
//         let res = await apiPostCardAdd(postData)
//         if(res.data.code === 1){
//           this.stopRepeatClick()
//           console.log('post:BankAdd ↓',postData)
//           this.setState({
//             isShowResultModal:true,
//             })
//           this.showSubmitSuccess()
//           this.clearStateData()
//         }else{
//         //   this.setState({
//         //     isShowResultModal:true,
//         //     state_error_message:t(ERRORCODE[res.data.code]) 
//         //   })
//         // this.clearMessageAndCloseModal()
//         }
//     } catch (err) {
//       console.log(err);
//       this.setState({
//         isShowResultModal:true,
//         state_error_message:t('app.add_fail') //無法顯示後端錯誤時
//       })
//       this.clearMessageAndCloseModal()
//     }
//     }
//   }
//   //=============================================//

//   showCurrencyTypeArray = () => {
//     let { t } = this.props
//     this.setState({
//       currencyOptions:[t('app.please_select'),"USD","MYR","CNY",
//       "HKD","PHP","SGD","EUR","GBP","IDR","THB","TWD","AUD","VND",
//       "JPY","KRW"]
//     })
//   }

//   componentDidMount(){
//     this.showCurrencyTypeArray()
//   }


//   render(){
//     let {t} = this.props

//     return (
//       <div className="container-fluid">
//           <div className="row">
//             <div className="col-md-10">
//               <div className="card card-exchange">

//                 <div className="card-top-info">
//                   <span className="left-info">
//                     <span className="remind-text"><MdInfo/> {t('app.confirm_account_activity')} </span>
//                   </span>
//                   <span className="right-info">
//                     <Link to="/bank/bank-list" className="linkBtn">
//                       <MdRemoveRedEye/>
//                       <span className="ml-5">{t('app.see_list')}</span>
//                     </Link>
//                   </span>
//                 </div>
                
//                 <div className="header text-center">
//                   <h4 className="title">{t('app.card_add')}</h4>
//                 </div>

//                 <div className="content">
//                   <div className="form-horizontal">

//                     {/* ********** 幣別 ********** */}
//                     <div className="form-group">
//                       <label className="col-md-4 label-exchange">
//                         <span className="text-red">* </span>
//                         {t('app.currency_type')}
//                       </label>
//                       <div className="col-md-6">
//                           <select
//                           onChange={e=>this.setState({
//                             currency_type:e.target.value
//                           })} 
//                           className="table-select"
//                           >
//                           {this.state.currencyOptions.map((item,index) => 
//                             <option key={index} value={item} label={item}>
//                               {item}
//                             </option>)
//                         }
//                       </select>
//                       </div>
//                     </div>

//                     {/* ********** 帳戶名稱 ********** */}
//                     <div className="form-group">
//                       <label className="col-md-4 label-exchange">
//                         <span className="text-red">* </span>
//                         {t('app.bank_account_name')}
//                       </label>
//                       <div className="col-md-6">
//                         <input
//                           className=""
//                           type="text"
//                           onChange={this.onChange_all}
//                           name="account_name"
//                           value={this.state.account_name}
//                           autoComplete="off"
//                           maxLength="20"
//                           />
//                       </div>
//                     </div>
                    
//                     {/* ********** 帳號 ********** */}
//                     <div className="form-group">
//                       <label className="col-md-4 label-exchange">
//                         <span className="text-red">* </span>
//                         {t('app.account_number')}
//                       </label>
//                       <div className="col-md-6">
//                         <input
//                           className=""
//                           type="text"
//                           onChange={this.onChange_all}
//                           name="account_number"
//                           value={this.state.account_number}
//                           autoComplete="off"
//                           maxLength="20"
//                         />
//                       </div>
//                     </div>

//                     {/* ********** 銀行名稱 ********** */}
//                     <div className="form-group">
//                       <label className="col-md-4 label-exchange">
//                         <span className="text-red">* </span>
//                         {t('app.bank_name')}
//                       </label>
//                       <div className="col-md-6">
//                         <input
//                           className=""
//                           type="text"
//                           onChange={this.onChange_all}
//                           name="bank_name"
//                           value={this.state.bank_name}
//                           autoComplete="off"
//                           maxLength="20"
//                           />
//                       </div>
//                     </div>

//                     {/* ********** 銀行代碼 ********** */}
//                     <div className="form-group">
//                       <label className="col-md-4 label-exchange">
//                         <span className="text-red">* </span>
//                         {t('app.bank_code')}
//                       </label>
//                       <div className="col-md-6">
//                         <input
//                           className=""
//                           type="text"
//                           onChange={this.onChange_all}
//                           name="bank_code"
//                           value={this.state.bank_code}
//                           autoComplete="off"
//                           maxLength="20"
//                         />
//                       </div>
//                     </div>

//                     {/* ********** 分行 ********** */}
//                     <div className="form-group">
//                       <label className="col-md-4 label-exchange">
//                         <span className="text-red">* </span>
//                         {t('app.bank_branch')}
//                       </label>
//                       <div className="col-md-6">
//                         <input
//                           className=""
//                           type="text"
//                           onChange={this.onChange_all}
//                           name="bank_branch"
//                           value={this.state.bank_branch}
//                           autoComplete="off"
//                           maxLength="20"
//                           />
//                       </div>
//                     </div>

//                     {/* ********** 國家 ********** */}
//                     <div className="form-group">
//                       <label className="col-md-4 label-exchange">
//                         <span className="text-red">* </span>
//                         {t('app.country')}
//                       </label>
//                       <div className="col-md-6">
//                         <input
//                           className=""
//                           type="text"
//                           onChange={this.onChange_all}
//                           name="country"
//                           value={this.state.country}
//                           autoComplete="off"
//                           maxLength="20"
//                         />
//                       </div>
//                     </div>

//                     {/* ********** 國際代碼 ********** */}
//                     <div className="form-group">
//                       <label className="col-md-4 label-exchange">
//                         <span className="text-red">* </span>
//                         {t('app.swift_code')}
//                       </label>
//                       <div className="col-md-6">
//                         <input
//                           className=""
//                           type="text"
//                           onChange={this.onChange_all}
//                           name="swift_code"
//                           value={this.state.swift_code}
//                           autoComplete="off"
//                           maxLength="20"
//                           onKeyPress={event => {
//                             if (event.key === 'Enter') {
//                               this.submitPost()
//                             }
//                           }} 
//                         />
//                       </div>
//                     </div>

//                     {/* ********** 收款人地址 ********** */}
//                     <div className="form-group">
//                       <label className="col-md-4 label-exchange">
//                         {t('app.payee_address')}
//                       </label>
//                       <div className="col-md-6">
//                         <input
//                           type="text"
//                           onChange={this.onChange_all}
//                           name="payee_address"
//                           value={this.state.payee_address}
//                           autoComplete="off"
//                           maxLength="30"
//                         />
//                       </div>
//                     </div>

//                     {/* ********** 銀行地址 ********** */}
//                     <div className="form-group">
//                       <label className="col-md-4 label-exchange">
//                         {t('app.bank_address')}
//                       </label>
//                       <div className="col-md-6">
//                         <input
//                           type="text"
//                           onChange={this.onChange_all}
//                           name="bank_address"
//                           value={this.state.bank_address}
//                           autoComplete="off"
//                           maxLength="30"
//                         />
//                       </div>
//                     </div>

//                     {/* ********** 受益人地址 ********** */}
//                     <div className="form-group">
//                       <label className="col-md-4 label-exchange">
//                         {t('app.beneficiary_address')}
//                       </label>
//                       <div className="col-md-6">
//                         <input
//                           type="text"
//                           onChange={this.onChange_all}
//                           name="beneficiary_address"
//                           value={this.state.beneficiary_address}
//                           autoComplete="off"
//                           maxLength="30"
//                           onKeyPress={event => {
//                             if (event.key === 'Enter') {
//                               this.submitPost()
//                             }
//                           }} 
//                         />
//                       </div>
//                     </div>

//                     <br/>
                    
//                     <div className="form-group">
//                       <div className="col-md-12">
//                         <button 
//                           type="button"
//                           className="card-submit-btn"
//                           onClick={this.state.isRepeatClickStop? '':this.submitPost}
//                           >
//                           {t('app.submit')}
//                         </button>
//                       </div>
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Modal open={this.state.isShowResultModal} 
//             onClose={this.clearMessageAndCloseModalQuick} closeIconSize={0}>
//             <div className="modal-inside">
//               <div className="modal-body ">
//                 <span>
//                   {this.state.state_success_message}
//                 </span>
//                 <span className="text-red">
//                   {this.state.state_error_message}
//                 </span>
//               </div>
//               {this.state.showRedirectBtn?
//                 <div className="modal-footer">
//                   <button className="table-small-btn"
//                     onClick={()=>window.location.href="/#/bank/card-list"}>
//                     <span className="btn-icon">
//                       <GoArrowLeft/>{t('app.go')}
//                     </span>
//                   </button>
//                   <button className="table-small-btn"
//                     onClick={this.clearMessageAndCloseModalQuick}>
//                     {t('app.continue_to_add')}
//                   </button>
//                 </div>
//               :''}
//             </div>
//           </Modal>

//       </div>
//     )
//   }
// }

// export default withTranslation()(CardAdd);