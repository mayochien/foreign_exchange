import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
// import { MdEdit, MdDone, MdClear } from "react-icons/md";
import { apiPostVerify, 
        //  apiGetWithdrawCurrency,
         apiGetWithdrawBank,
         apiGetWithdrawReceipt,
         apiPostWithdrawConfirm
       } from '../../services/apiService';
import { WITHDRAW_STATUS_TRANSFER, CURRENCIES_STR} from '../../const';
// import { MdZoomIn, MdClear } from "react-icons/md";
// import { FaSearch } from "react-icons/fa";
import { TiLocationArrow } from "react-icons/ti";
import { GoCheck } from "react-icons/go";
// import { Link } from 'react-router-dom'
import  Format  from '../../services/Format';
import Modal from "react-responsive-modal";
import { ClipLoader } from 'react-spinners';
import { MdZoomIn, MdClear } from "react-icons/md";


class WithdrawListItem extends Component {

  state = {
    isOpenPhotoModal:false,
    isOpenBankAccountInfo:false,
    // withdrawRate:[],
    withDrawCurrency:'',
    nowShowPhoto:'',
    nowShowRemark:'',
    photoRemarkList:[],
    photoRemarkApiList:[],
    firstImage:'',
    firstRemark:'',
    showAddPhotoBtn:false,
    imageGetError:false,
    img_zoom_in:false,
    lineActiveNow:false,
    hasActiveOnce:false,
    isRepeatClickStop:false
  }

  showLoading = () => {
    this.setState({
      showLoading:true,
    },()=>{
      setTimeout(() => {
        this.setState({
          showLoading:false,
        })
      }, 500);
    })
  }

  //  ********** 點通知該行發亮 **********
  showActiveLine = () => {
    this.setState({
      lineActiveNow:true,
      hasActiveOnce:true
    },()=>{
      setTimeout(() => {
        this.setState({
          lineActiveNow:false
        })
      }, 2800);
    })
  }

  sendVerify = async(id, verify) => {
    const postData = {
      result: verify
    }
    let resp = await apiPostVerify(id, postData);
    if(resp.statusText === "OK") {
      alert('更新成功')
    }
  }

  // ========== 功能:更換單據 ==========
  _handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }
    reader.readAsDataURL(file)
  }
  
  // ========== submit成功訊息 ==========
  showSubmitSuccess = () =>{
    let {t} = this.props
    this.setState({
      state_success_message:
      <span className="text-green">
        {t('app.success')}
      </span>
    })
    setTimeout(() => {
      this.setState({
        state_success_message:'',
        state_error_message:''
      });
      this.onCloseAllModal()
    }, 1500)
  }

  // ========== 功能:關閉所有Modal ==========
  onCloseAllModal = () => {
    this.setState({ 
      isOpenPhotoModal: false,
      isOpenBankAccountInfo:false,
      img_zoom_in:false,
      nowShowPhoto:'',
      nowShowRemark:'',
      photoRemarkList:[],
    });
  };

  // ========== 功能:放大、縮小圖片 ==========
  onClickZoomIn = () => {
    this.setState({
      img_zoom_in:true
    })
  }

  onClickZoomOut = () => {
    this.setState({
      img_zoom_in:false
    })
  }

  showNullLine = (value) => {
    if(value==='' || value===undefined){
      return '-'
    }
    else{
      return value
    }
  }

  //  ========== submit失敗訊息 ==========
  showSubmitError = () =>{
    let {t} = this.props
    this.setState({
      state_error_message:<span className="text-red">
      {t('app.fail')}
      </span>
    })
    setTimeout(() => {
      this.setState({
        state_error_message:'',
        state_success_message:''
      })
    }, 1500)
  }

  // getWithdrawRate = async() => {
  //   try{
  //     let res = await apiGetWithdrawCurrency()
  //       if(res.data.code === 1){
  //         this.setState({
  //           withdrawRate:res.data.data.withdraw_currency
  //       })
  //     }
  //   }catch (err) {
  //     console.log(err)
  //   }
  // }

  stopRepeatClick = () =>{
    this.setState({
      isRepeatClickStop:true,
    })
    setTimeout(()=>{
      this.setState({
        isRepeatClickStop:false,
      })
    },2500)
  }

  // ========== ﹝彈窗1﹞查看銀行帳戶 ==========
  onOpenBankAccountInfo = async () => {
    // console.log('withdraw_bank_id:',this.props.withdraw_bank_id);
    this.setState({ isOpenBankAccountInfo: true });
    try {
      let res = await apiGetWithdrawBank(this.props.withdraw_bank_id)
      if(res.data.code===1){
        let resData = res.data.data.bank
        // console.log(resData)
        this.setState({
          verify_account_name: resData.account_name,
          verify_account_number: resData.account_number,
          verify_bank_name: resData.bank_name,
          verify_bank_branch: resData.bank_branch,
          verify_bank_code: resData.bank_code,
          verify_currency_type: resData.currency_type,
          verify_id: resData.id,
          verify_swift_code: resData.swift_code,
          verify_type: resData.type,
        })
      }
    }catch(err) {
      console.log(err);
    }
  };

  // ========== ﹝彈窗2﹞查看匯款單據 ==========
  onOpenUploadPhoto = async() => {
    this.showLoading()
    let {t} = this.props
    // console.log("選擇的單據id:",this.props.id)
    this.setState({ isOpenPhotoModal: true });
    try{ //---------- api:get:觀看我的單據----------
      let res_image = await apiGetWithdrawReceipt(this.props.id)
      if (res_image.data.code===1){
        this.setState({
          photoRemarkList:res_image.data.data.image,
          firstImage:res_image.data.data.image[0].image,
          firstRemark:res_image.data.data.image[0].remark,
          noImageText:'',
          imageGetError:false,
        }
        // ,()=>{console.log(this.state.photoRemarkList);}
        )
      }
      else{
        console.log('沒抓到圖片');
        this.setState({
          noImageText:t('ERRORCODE.NO_IMAGE_1001'),
          imageGetError:true
        })
      }
    }catch (err) {
      console.log(err)
      this.setState({
        noImageText:t('ERRORCODE.NO_IMAGE_1001'),
        imageGetError:true
      })
    }
  }

  // ==========  api-post:最終確認交易完成 ==========
  confirmReceipt = async() => {
    this.stopRepeatClick()
    let postData ={
      verify:true
    }
    console.log('postData:',postData)
    try{
      let res = await apiPostWithdrawConfirm(this.props.id,postData)
      if(res.data.code===1){
        // console.log('最終審核成功 ↓',postData)
        this.showSubmitSuccess()
      }
    }catch (err) {
      console.log(err);
      this.showSubmitError()
    }
  }

  //同上，但功能為﹝等待﹞
  waitToConfirm = async() => {
    let postData ={
      verify:false
    }
    // console.log('postData:',postData)
    try{
      let res = await apiPostWithdrawConfirm(this.props.id,postData)
      if(res.data.code===1){
        // console.log('等待',postData)
        setTimeout(() => {
          this.onCloseAllModal()
        }, 500);
      }
    }catch (err) {
      console.log(err);
      this.showSubmitError()
    }
  }

  componentDidMount(){
    if(this.props.id===this.props.path_id){
      this.showActiveLine()
    }
  }

  
  componentWillReceiveProps(nextProps){
    // id不同時，把點擊過歸零
    if(this.props.path_id !== nextProps.path_id){
      this.setState({
        hasActiveOnce:false
      })
    }
    //id相同，但尚未點選過該通知時，要閃爍
    // console.log(this.props.data.id,nextProps.path_id)
    if(this.props.id === nextProps.path_id
      && this.state.hasActiveOnce === false){
      this.showActiveLine()
    }
  }

  render() {
    const { t, status,approach } = this.props;

    
    return (
      <React.Fragment>
        <tr className={this.state.lineActiveNow? "td-active":''}>
          <td>{this.props.id}</td>

          {this.props.show_serialNumber?
            <td>{this.props.serial_number}</td>
            :<td></td>
          }

          {/* 提款方式 */}
          {approach===1?
            <td>{t('app.cash')}</td>
            :
            <td>{t('app.transfer')}</td>
          }

          <td>{Format.thousandsMathRound3(this.props.amount)}</td>   {/* 提款數量 */}
          <td>{CURRENCIES_STR[this.props.currency]}</td>     {/* 幣別 */}

          <td>  {/* 轉換數量 */}
            {Format.thousandsMathRound3(this.props.amount*this.props.exchange_rate)}
          </td>

          {/* 查看銀行帳戶 */}
          {approach === 1 
           ? <td> - </td> :
            <td>
              <button className={status<70? 'table-small-btn' : 'table-small-btn table-small-done'}
                onClick={this.onOpenBankAccountInfo}>
                {status<70? <TiLocationArrow/> : <GoCheck/>}
              </button>
            </td>
          }
         

          {/*  20: //莊家申請提款單      30: //管理員接受申請      40: //管理員拒絕申請
               50: //管理員上傳單據      60: //莊家按【等待】      70: //莊家已確認       */}


          {/* 單據 */}
          {/* {approach === 1 ?  */}
          {/* <td> - </td> : */}
            <td>  
              {status<70?
                //管理員還沒上傳單據(或是被拒絕)，不能點  <=>  管理員已上傳單據，才可點開
                <button className={status<50?"table-small-btn btn-small-not-yet":"table-small-btn"}
                  onClick={this.onOpenUploadPhoto}>
                  <TiLocationArrow/>
                </button>
                :
                //莊家已確認單據
                <button className="table-small-btn table-small-done"
                onClick={this.onOpenUploadPhoto}>
                  <GoCheck/>
                </button>
              } 
            </td>
          {/* } */}

          {/* 狀態 (引用的翻譯不同)  */} 
          {/* {approach === 1 ? */}
            {/* <td className={status===40?"text-failed":""}>
              {t(WITHDRAW_STATUS_CASH[status])}
            </td> */}
            {/* : */}
            <td className={status===40?"text-failed":""}>
              {t(WITHDRAW_STATUS_TRANSFER[status])}
            </td>
          {/* } */}
         
          <td>{this.props.create_datetime}</td>
          <td>{this.showNullLine(this.props.remark)}</td>
        </tr>


        {/* ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ ﹝彈窗1﹞查看銀行帳戶 ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ */}
        <Modal open={this.state.isOpenBankAccountInfo} 
          onClose={this.onCloseAllModal} closeIconSize={0}>
          <div className="modal-inside">
            <div className="modal-body">
              <h5>{t('app.account_info')}</h5>
              <div className="modal-body-text-section">

                <div className="bank-info-line">
                  <div className="info-label">{t('app.bank_account_name')} : </div>
                  <input type="text" className="info-value" readOnly="true"
                    value={this.state.verify_account_name}/>
                </div>

                <div className="bank-info-line">
                  <div className="info-label">{t('app.account_number')} : </div>
                  <input type="text" className="info-value"
                    value={this.state.verify_account_number}/>
                </div>

                <div className="bank-info-line">
                  <div className="info-label">{t('app.bank_name')} : </div>
                  <input type="text" className="info-value"
                    value={this.state.verify_bank_name}/>
                </div>

                <div className="bank-info-line">
                  <div className="info-label">{t('app.bank_branch')} : </div>
                  <input type="text" className="info-value"
                    value={this.state.verify_bank_branch}/>
                </div>

                <div className="bank-info-line">
                  <div className="info-label">{t('app.bank_code')} : </div>
                  <input type="text" className="info-value"
                    value={this.state.verify_bank_code}/>
                </div>

                <div className="bank-info-line">
                  <div className="info-label">{t('app.currency_type')} : </div>
                  <input type="text" className="info-value"
                    value={this.state.verify_currency_type}/>
                </div>

                {/* <div className="bank-info-line">
                  <div className="info-label">{t('app.verify_id')} : </div>
                  <input type="text" className="info-value"
                    value={this.state.verify_id}/>
                </div> */}

                <div className="bank-info-line">
                  <div className="info-label">{t('app.swift_code')} : </div>
                  <input type="text" className="info-value"
                    value={this.state.verify_swift_code}/>
                </div>

                {this.state.verify_currency_type === "AUD"?
                  <div className="bank-info-line">
                    <div className="info-label">{t('app.bank_state_code')} : </div>
                    <input type="text" className="info-value"
                      value={this.state.verify_bank_state_code}/>
                  </div>
                  :""
                }

              </div>
            </div>

            {/* 請務必確保數額和帳戶填寫正確，如有進多，本公司一概不負責任。 */}
            <div className="remark-input-section font-12">
              {t('app.make_sure_amount_and_account_are_filled_in_correctly')}
            </div>

            <div className="modal-footer">
              <button className="modal-action-button"
              onClick={this.onCloseAllModal}>
              {t('app.close')}
              </button>
            </div>
          </div>
        </Modal>


        {/* ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ ﹝彈窗2﹞查看匯款單據 ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ */}
        <Modal open={this.state.isOpenPhotoModal}
          onClose={this.onCloseAllModal} closeIconSize={0}>
            <div className="modal-inside">
              
            {this.state.imageGetError? //抓不到圖片
              <div className="modal-body">
                <div className="modal-body-photo-section">
                  <div className="main-photo-box text-center m-tb-30">
                    {this.state.noImageText}
                  </div>
                </div>
              </div>
              :
              <div className="modal-body">
                <div className="modal-body-photo-section">
                  <div className="main-photo-section">
                    {this.state.showLoading?
                      <div className="main-photo-box">
                        <ClipLoader
                          sizeUnit={"px"}
                          size={40}
                          color={'#999'}
                          loading={this.state.loading}
                        />
                      </div>
                      :
                      <div className="main-photo-box">
                        <img className="preview-image" 
                          src={this.state.nowShowPhoto ===''? this.state.firstImage : this.state.nowShowPhoto}
                          alt="preview"
                        />
                      </div>
                    }
                  </div>
          
                  <div className="list-photo-section">
                    {this.state.photoRemarkList.map((item,index) => 
                      <div className="small-photo-box">
                        <button name={item.image} 
                          index={index}
                          {...item}
                          onClick={()=>this.setState({nowShowPhoto:item.image,nowShowRemark:item.remark})} 
                          className="btn-small-photo"
                        >
                          <img name={item.image} 
                            onClick={()=>this.setState({nowShowPhoto:item.image,nowShowRemark:item.remark})} 
                            className="photo-small" 
                            src={item.image} 
                            alt="preview"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ↓ 放大按鈕 */}
                {this.state.imageGetError?'':
                  <button className="btn-zoom-in" 
                    onClick={this.onClickZoomIn}>
                    <MdZoomIn/>
                  </button>}

                {this.state.img_zoom_in?
                  <div className="modal-body-photo-zoomin-section">
                    {/* ↓ 放大後的圖片 */}
                    <img className="zoomin-image" 
                      src={this.state.nowShowPhoto ===''? this.state.firstImage : this.state.nowShowPhoto}  
                      alt="preview"
                    />
                    <button className="btn-zoom-in-close" 
                      onClick={this.onClickZoomOut} >
                      <MdClear/>
                    </button>
                  </div>
                :''}
              </div>
            }

            {/* ********** 備註欄位 (查看) ********** */}
            {(this.state.nowShowPhoto ==='' && this.state.firstRemark==='') 
              || (this.state.nowShowPhoto !=='' && this.state.nowShowRemark==='')?
              "":
              <div className="remark-input-section">
                <span className="remark-label" >{t('app.remark')}：</span>
                <input 
                  className="remark-input-readonly" 
                  type="text"
                  value={this.state.nowShowPhoto ===''? this.state.firstRemark : this.state.nowShowRemark}
                  readOnly={true}
                />
              </div>
            }

            {/* 請務必確保數額和帳戶填寫正確，如有進多，本公司一概不負責任。 */}
            {this.state.imageGetError?'':
              <div className="remark-input-section font-12">
                {t('app.make_sure_amount_and_account_are_filled_in_correctly')}
              </div>
            }
            
            <div className="text-center">
                {this.state.state_success_message}
                {this.state.state_error_message}
            </div>
            <div className="modal-footer">
              <button className="modal-action-button" onClick={this.onCloseAllModal}>
                {t('app.close')}
              </button>
              {this.props.status<70?
                <button className={this.props.status===60?"modal-action-button modal-action-only-read":"modal-action-button"}
                  onClick={this.props.status===60?'':this.waitToConfirm}>
                  {t('app.wait')}
                </button>
              :
                ''  // status=70 提款完成結束
              }
              {this.props.status<70?
                <button className="modal-action-butto" 
                  onClick={this.state.isRepeatClickStop?'':this.confirmReceipt}>
                  {t('app.confirm')}
                </button>
              :
                ''
              }
              
            </div>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withTranslation()(WithdrawListItem);
