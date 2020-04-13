import React from 'react';
import {withTranslation} from 'react-i18next';
import {
  apiPostUploadImage,
  apiGetBankVerify,
  apiGetSellerImage,
  apiGetBuyerImage,
  apiPostCheckImage
} from '../../services/apiService'
import { MdZoomIn, MdClear } from "react-icons/md";
import { TiLocationArrow } from "react-icons/ti";
import { GoCheck } from "react-icons/go";
import { FaCopy } from "react-icons/fa";
// import { FiUpload } from "react-icons/fi";
import { MdDone} from "react-icons/md";
import Modal from "react-responsive-modal";
import { ClipLoader } from 'react-spinners';
// import upload_icon from '../../assets/images/upload_icon'
import Format from '../../services/Format';



class OrderPendingBuyItem extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      modifiable:false,
      account_name: props.account_name,
      alertShow:false,
      isOpenUploadPhoto: false,
      isOpenImageVerify: false,
      isOpenBankAccountVerify: false,
      verify_account_name:'',
      verify_account_number:'',
      verify_bank_branch:'',
      verify_bank_code:'',
      verify_currency_type:'',
      verify_id:'',
      verify_swift_code:'',
      verify_bank_state_code:'',
      verify_type:'',
      file: '',
      noImageText:'',
      showApiResult:'',
      getOtherImage:'',
      getMyImage:'',
      img_zoom_in:false,
      imageGetError:false,
      isText01Copy:false,
      isText02Copy:false,
      showLoading: true,
      nowShowPhoto:'',
      nowShowRemark:'',
      photoNumber:1,
      remarkNumber:1,
      photoRemarkList:[],
      photoRemarkApiList:[],
      selfApiPhotoRemarkList:[],
      otherApiPhotoRemarkList:[],
      firstImage:'',
      firstRemark:'',
      showAddPhotoBtn:false,
      showAddRemarkBtn:false,
      highlightAddPhotoBtn:false,
      isRepeatClickStop:false,
      isRepeatClickStop2:false,
    }
  }

  show500MSLoading = () => {
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

  showLongTimeLoading = () => {
    this.setState({
      showLoading:true,
    },()=>{
      setTimeout(() => {
        this.setState({
          showLoading:false,
        })
      }, 2000);
    })
  }

  onCopyText01 = () => {
    document.getElementById('text01').select();
    document.execCommand("copy");
    console.log("Copied the text:",document.getElementById('text01').value);
    this.setState({
      isText01Copy:true,
      isText02Copy:false
    })
  }

  onCopyText02 = () => {
    document.getElementById('text02').select();
    document.execCommand("copy");
    console.log("Copied the text:",document.getElementById('text02').value);
    this.setState({
      isText02Copy:true,
      isText01Copy:false
    })
  }
  
  stopRepeatClick = () => { //禁止連續點擊
    this.setState({
      isRepeatClickStop:true,
    })
    setTimeout(()=>{
      this.setState({
        isRepeatClickStop:false,
      })
    },2000)
  }

  stopRepeatClick2 = () => { //避免重複影響，多設一組 禁止連續點擊的state
    this.setState({
      isRepeatClickStop2:true,
    })
    setTimeout(()=>{
      this.setState({
        isRepeatClickStop2:false,
      })
    },2000)
  }

  // ========== 1. api-get:查看對方單據 ==========
   onOpenImageVerify = async() => {
    let {t} = this.props
    this.show500MSLoading()
    this.setState({ isOpenImageVerify: true });
    try{
      let res_otherPhoto = await apiGetSellerImage(this.props.id,this.props.seller_id)
      if(res_otherPhoto.data.code===1){
        this.setState({
          otherApiPhotoRemarkList:res_otherPhoto.data.data.deal_image,
          firstImage:res_otherPhoto.data.data.deal_image[0].image,
          firstRemark:res_otherPhoto.data.data.deal_image[0].remark,
          noImageText:'',
          imageGetError:false,
        })
      }
    }catch (err) {
      console.log(err)
      this.setState({
        noImageText:t('ERRORCODE.NO_IMAGE_1001'),
        imageGetError:true
      })
    }
  };

  // ========== 1-2 api-post:確認掛單方單據 ==========
  confirmReceipt = async() => {
    this.stopRepeatClick()
    let postData ={
      id:this.props.id,
      verify:true
    }
    console.log(postData)
    try{
      let res = await apiPostCheckImage(postData)
      if(res.data.code ===1){
        console.log('審核單據成功 ↓',postData)
        this.showSubmitSuccess()
        setTimeout(() => {
          this.props.refreshData()
        }, 300);
      }
    }catch (err) {
      console.log(err);
      this.showSubmitError()
    }
  }

  //同上，但功能為﹝等待﹞
  waitToConfirm = async() => {
    let postData ={
      id:this.props.id,
      verify:false
    }
    console.log(postData)
    try{
      let res = await apiPostCheckImage(postData)
      if(res.data.code ===1){
        // console.log('等待',postData)
        setTimeout(() => {
          this.onCloseAllModal()
          this.props.refreshData()
        }, 500);
      }
    }catch (err) {
      console.log(err);
      this.showSubmitError()
    }
  }


  // ========== 2. api-get:查看對方帳戶 ==========
   onOpenBankAccountVerify = async() => {
    this.setState({ isOpenBankAccountVerify: true });
    try {
    let result_BankVerifyData = await apiGetBankVerify(this.props.id)
    let result_BankVerify = result_BankVerifyData.data.data
    this.setState({
      verify_account_name: result_BankVerify.account_name,
      verify_account_number: result_BankVerify.account_number,
      verify_bank_name: result_BankVerify.bank_name,
      verify_bank_branch: result_BankVerify.bank_branch,
      verify_bank_code: result_BankVerify.bank_code,
      verify_currency_type: result_BankVerify.currency_type,
      verify_id: result_BankVerify.id,
      verify_swift_code: result_BankVerify.swift_code,
      verify_bank_state_code: result_BankVerify.bank_state_code,
      verify_type: result_BankVerify.type,
    })
    }catch(err) {
      console.log(err);
    }
  };

  
  // ========== 3-1 開啟上傳彈框 (or觀看我的已上傳的單據) ==========
   onOpenUploadPhoto = async(key_ticket_id, key_buyer_id) => {
    let {t} = this.props
    this.show500MSLoading()
    this.setState({ isOpenUploadPhoto: true });
    if(this.props.stage>40){
      try{ //---------- api:get:觀看我上傳的單據----------
        let res_selfImage = await apiGetBuyerImage(key_ticket_id,key_buyer_id)
        if(res_selfImage.data.code===1){
          this.setState({
            selfApiPhotoRemarkList:res_selfImage.data.data.deal_image,
            firstImage:res_selfImage.data.data.deal_image[0].image,
            firstRemark:res_selfImage.data.data.deal_image[0].remark,
            noImageText:'',
            imageGetError:false,
          })
        }
        else{
          console.log('沒抓到單據');
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
  };

  canvasDataURL = (path, obj, callback) => {
    var img = new Image();
    img.src = path;
    img.onload = function(){
      var that = this;
      // 默認按比例壓縮
      var w = that.width,
        h = that.height,
        scale = w / h;
        w = obj.width || w;
        h = obj.height || (w / scale);
      var quality = 0.8;  // 默認單據質量為0.8
      //生成canvas
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      // 創建屬性節點
      var anw = document.createAttribute("width");
      anw.nodeValue = w;
      var anh = document.createAttribute("height");
      anh.nodeValue = h;
      canvas.setAttributeNode(anw);
      canvas.setAttributeNode(anh); 
      ctx.drawImage(that, 0, 0, w, h);
      // 圖像質量
      if(obj.quality && obj.quality <= 1 && obj.quality > 0){
        quality = obj.quality;
      }
      // quality值越小，所繪制出的圖像越模糊
      var base64 = canvas.toDataURL('image/jpeg', quality);
      // 回調函數返回base64的值
      callback(base64);
      // console.log(base64);
    }
  }

  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.canvasDataURL(reader.result, { width: 1080 }, (base64String)=>{
          resolve(base64String)
        })
      };
      reader.onerror = error => reject(error);
    });
  }

  onChangePhoto = async(e) => {  // 更換單據
    let targetFiles = e.target.files;
    let base64String = await this.getBase64(targetFiles[0]);
    this.setState({ //不確定是否會非同步
      file: targetFiles,
      nowShowPhoto: base64String,
      showAddPhotoBtn:true,
      showAddRemarkBtn:true,
      nowShowRemark:'',
    });
  }
    
  onChangeRemark = (e) => {
    this.setState({
      nowShowRemark:e.target.value,
    })
  }

  confirmAdd = () => { // 保存單據、備註進去陣列
    this.stopRepeatClick()
    let pushObj = {
      image:this.state.nowShowPhoto,
      remark:this.state.nowShowRemark,
    }
    if(this.state.nowShowPhoto!==''){
      this.setState({
        photoRemarkList:[...this.state.photoRemarkList,pushObj],
      }, ()=>{
        this.show500MSLoading()
        setTimeout(() => {
          this.setState({
            nowShowPhoto:'',
            nowShowRemark:'',
            showAddPhotoBtn:false, //隱藏新增按鈕
            showAddRemarkBtn:false, //隱藏備註輸入框
          })
        }, 500);
      })
    }
  }

  cancelPhoto = () => { //取消正要上傳的單據
    this.setState({
      nowShowPhoto:'',
      nowShowRemark:'',
    })
  }

  deletePhoto = () => { //刪除正要上傳的單據
    this.setState({
      photoRemarkList: this.state.photoRemarkList.filter(item=>item.image!==this.state.nowShowPhoto)
    },()=>{
      this.show500MSLoading()
      setTimeout(() => {
        this.setState({
          nowShowPhoto:'',
          nowShowRemark:'',
        })
      }, 500);
    })
  }

  // ========== 3-2 api-post:上傳我的單據  ==========
  submitUploadPhoto = async()=> {
    let postData={
      id:this.props.id,
      order_id: this.props.order_id,
      buyer_id: this.props.buyer_id,
      seller_id: this.props.seller_id,
      deal_image: this.state.photoRemarkList,
    }
    if(this.state.photoRemarkList.length<1){
      this.showAddPhotoFirst() //沒有單據不給上傳
    }
    else{
      this.stopRepeatClick2()
      try {
        let res = await apiPostUploadImage(postData)
        if(res.data.code ===1){
          this.showSubmitSuccess()
          this.showLongTimeLoading()
          setTimeout(() => {
            this.props.refreshData()
          }, 300);
        }
        else{
          this.showSubmitError()
        }
      } catch (err) {
        console.log(err);
        this.showSubmitError()
      }
    }
  }

  copyAccountInfo = () => {
    // console.log('複製!!')
    var textField = document.createElement('textarea')
    textField.innerText = 'foo bar baz'
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }


  // ========== 功能:關閉所有Modal ==========
  onCloseAllModal = () => {
    this.setState({ 
      isOpenImageVerify: false,
      isOpenBankAccountVerify: false,
      isOpenUploadPhoto: false,
      img_zoom_in:false, //把放大過的單據縮小
      nowShowPhoto:'',
      nowShowRemark:'',
    })
  }

  // ========== 功能:放大、縮小單據 ==========
  onClickZoomIn = () => {
    this.setState({
      img_zoom_in:true
    })
  }

  onClickZoomOut= () =>{
    this.setState({
      img_zoom_in:false
    })
  }


  // ========== 功能:顯示目前進行的階段 (買家)==========
  showNowStage = (key_stage) => {
    let {t} = this.props
    switch(key_stage) {
      case 0:
        return <span className="text-failed">
                {t('app.buyer_seller_refuse_trade')}
              </span>; //掛單方拒絕交易
      case 1:
        return <span className="text-failed">
                {t('app.buyer_you_cancel_trade')}
               </span>; //您已取消交易
      case 2:
        return <span className="text-failed">
                {t('app.transaction_fail')}
               </span>; //交易失敗
      case 3:
        return <span className="text-failed">
                {t('EVENT_TYPE.OFFER_RECEIVE_DEAL_EXPIRE')}
               </span>; //交易逾時
      case 10:
        return <span>
                (1) {t('app.buyer_waiting_seller_accept')}
               </span>; //等待掛單方接受交易
      case 20:
        return <span>
                (2) {t('app.buyer_waiting_seller_payment')}
              </span>; //等待掛單方付款
      case 30:
        return <span>
                (3) {t('app.buyer_confirm_seller_receipt')}
              </span>; //確認掛單方交易明細
      case 35:
        return <span>
                (3) {t('app.buyer_confirm_seller_receipt')}
                </span>; //(同上)確認掛單方交易明細
      case 40:
        return <span>
                (4) {t('app.buyer_send_money_and_upload_receipt')}
              </span>; //請匯款並上傳單據
      case 50:
        return <span>
                (5) {t('app.buyer_waiting_seller_final_confirm')}
              </span>; //等待掛單方確認收款
      case 55:
        return <span>
                (5) {t('EVENT_TYPE.OFFER_RECEIVE_DEAL_AWAIT')}
              </span>; //掛單方已看過單據，請等待確認
      case 60:
        return <span className="text-completed">
                {t('app.transaction_completed')}
              </span>; //交易已完成
      default:
        return '';
    }
  }


  // ========== submit成功訊息 ==========
  showSubmitSuccess = () => {
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
    }, 800)
  }


  //  ========== submit失敗訊息 ==========
  showSubmitError = () => {
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
    }, 1000)
  }

  //  ========== 提醒要先新增圖片 ==========
  showAddPhotoFirst = () =>{
    let {t} = this.props
    this.setState({
      highlightAddPhotoBtn:true,
      state_error_message:<span className="text-red"> {t('app.please_add_photo_first')} </span>
    })
    setTimeout(() => {
      this.setState({
        highlightAddPhotoBtn:false,
        state_error_message:'',
      })
    }, 2000)
  }


  render(){
    let {t, stage} = this.props
    let { nowShowPhoto} = this.state;
    let uploadIconSRC = require('../../assets/images/upload_icon.png')
    // let addImageIconSRC = require('../../assets/images/add_image_icon.png')

    return (
      <tr>
        <td>{this.props.id}</td>
        {this.props.show_serialNumber?
          <td>{this.props.serial_number}</td>
          :<td></td>
        }
        <td>{this.props.order_id}</td>
        <td>{this.props.seller_username}</td>
        <td>{Format.thousandsMathRound6(this.props.currency_rate)}</td>
        <td>{this.props.seller_currency}</td>
        <td>{Format.thousandsMathRound3(this.props.buyer_amount)}</td>
        <td>{this.props.buyer_currency}</td>
        <td>{Format.thousandsToFix3(this.props.buyer_amount*this.props.currency_rate)}</td> {/* 成交價格 */}
        
        {/*  -------- ﹝按鈕1﹞查看對方匯款單據 -------- */}
        <td> 
          {stage<40?
            <button className={stage<30?"table-small-btn btn-small-not-yet":"table-small-btn"}
              onClick={()=>this.onOpenImageVerify()}>
              <TiLocationArrow/>
            </button>
            :
            <button className="table-small-btn table-small-done"
              onClick={()=>this.onOpenImageVerify(this.props.id,this.props.seller_id)}>
              <GoCheck/>
            </button>
          } 
        </td>

         {/*  -------- ﹝按鈕2﹞查看對方帳戶 -------- */}
        <td>
          {stage<50?
            <button className={stage<40?"table-small-btn btn-small-not-yet":"table-small-btn"}
              onClick={()=>this.onOpenBankAccountVerify()}>
              <TiLocationArrow/>
            </button>
            :
            <button className="table-small-btn table-small-done"
              onClick={()=>this.onOpenBankAccountVerify()}>
              <GoCheck/>
            </button>
          }
        </td>

        <td> {/*  -------- ﹝按鈕3﹞上傳我的匯款單據 -------- */}
          {stage<50?
            <button className={stage<40?"table-small-btn btn-small-not-yet":"table-small-btn"}
              onClick={()=>this.onOpenUploadPhoto(this.props.id,this.props.buyer_id)}>
              <TiLocationArrow/>
            </button>
            :
            <button className="table-small-btn table-small-done"
              onClick={()=>this.onOpenUploadPhoto(this.props.id,this.props.buyer_id)}>
              <GoCheck/>
            </button>
          }
        </td>

        <td>{this.showNowStage(this.props.stage)}</td>
        <td>{this.props.update_datetime}</td>


        {/*  -------- ﹝彈窗1﹞ 查看對方單據 -------- */}
        <Modal open={this.state.isOpenImageVerify} 
          onClose={this.onCloseAllModal} closeIconSize={0}>
          <div className="modal-inside">
            <h5>{t('app.seller')} {t('app.receipt')}</h5>

            {this.state.imageGetError? //抓不到單據
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
                    {this.state.otherApiPhotoRemarkList.map((item,index) => 
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
                {this.state.imageGetError?
                  '':
                  <button className="btn-zoom-in" 
                    onClick={this.onClickZoomIn}>
                    <MdZoomIn/>
                  </button>
                }

                {this.state.img_zoom_in?
                  <div className="modal-body-photo-zoomin-section">
                    {/* ↓ 放大後的單據 */}
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

            {/* ********** 備註欄位 (查看對方) ********** 沒有備註就不顯示 */}
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

            <div className="text-center">
              {this.state.showApiResult}
            </div>
            <div className="text-center">
              {this.state.state_success_message}
              {this.state.state_error_message}
            </div>
            {stage<40?
              <div className="modal-footer">
                <button className="modal-action-button" onClick={this.onCloseAllModal}>
                  {t('app.close')}
                </button>
                <button className={stage===35?"modal-action-button modal-action-only-read":"modal-action-button"}
                 onClick={stage===35?'':this.waitToConfirm}>
                  {t('app.wait')}
                </button>
                <button className="modal-action-button" onClick={this.state.isRepeatClickStop?'':this.confirmReceipt}>
                  {t('app.confirm')}
                </button>
              </div>
              :
              <div className="modal-footer">
                <button className="modal-action-button" onClick={this.onCloseAllModal}>
                  {t('app.close')}
                </button>
              </div>
            }
          
          </div>
        </Modal>
        
        {/*  -------- ﹝彈窗2﹞查看對方帳戶 -------- */}
        <Modal open={this.state.isOpenBankAccountVerify} 
          onClose={this.onCloseAllModal} closeIconSize={0}>
          <div className="modal-inside">
            <div className="modal-body">
              <h5>{t('app.seller')} {t('app.account_info')}</h5>
              <div className="modal-body-text-section">

                <div className="bank-info-line">
                  <div className="info-label">{t('app.bank_account_name')} : </div>
                  <input type="text" className="info-value"
                    value={this.state.verify_account_name} 
                    readonly={true}
                    id="text01" spellcheck="false"/>
                  <span className="info-btn">
                    {!this.state.isText01Copy?
                      <button className="id btn-copy" 
                        onClick={this.onCopyText01}>
                        <FaCopy/>
                      </button>
                      :
                      <span className="text-green"><MdDone/></span>
                    }
                  </span>
                </div>

                <div className="bank-info-line">
                  <div className="info-label">{t('app.account_number')} : </div>
                  <input type="text" className="info-value"
                    value={this.state.verify_account_number} 
                    readonly={true}
                    id="text02" spellcheck="false"/>
                  <span className="info-btn">
                    {!this.state.isText02Copy?
                      <button className="id btn-copy" 
                      onClick={this.onCopyText02}>
                      <FaCopy/>
                      </button>
                      :
                      <span className="text-green"><MdDone/></span>
                    }
                  </span>
                </div>

                <div className="bank-info-line">
                  <div className="info-label">{t('app.bank_name')} : </div>
                  <input type="text" className="info-value"
                    value={this.state.verify_bank_name}/>
                  <span className="info-btn">
                  </span>
                </div>

                <div className="bank-info-line">
                  <div className="info-label">{t('app.bank_branch')} : </div>
                  <input type="text" className="info-value"
                    value={this.state.verify_bank_branch}/>
                  <span className="info-btn">
                  </span>
                </div>

                <div className="bank-info-line">
                  <div className="info-label">{t('app.bank_code')} : </div>
                  <input type="text" className="info-value"
                    value={this.state.verify_bank_code}/>
                  <span className="info-btn">
                  </span>
                </div>

                <div className="bank-info-line">
                  <div className="info-label">{t('app.currency_type')} : </div>
                  <input type="text" className="info-value"
                    value={this.state.verify_currency_type}/>
                  <span className="info-btn">
                  </span>
                </div>

                <div className="bank-info-line">
                  <div className="info-label">{t('app.verify_id')} : </div>
                  <input type="text" className="info-value"
                    value={this.state.verify_id}/>
                  <span className="info-btn">
                  </span>
                </div>

                <div className="bank-info-line">
                  <div className="info-label">{t('app.swift_code')} : </div>
                  <input type="text" className="info-value"
                    value={this.state.verify_swift_code}/>
                  <span className="info-btn">
                  </span>
                </div>

                {this.state.verify_currency_type === "AUD"?
                  <div className="bank-info-line">
                    <div className="info-label">{t('app.bank_state_code')} : </div>
                    <input type="text" className="info-value"
                      value={this.state.verify_bank_state_code}/>
                    <span className="info-btn">
                    </span>
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
              <button className="modal-action-button" onClick={this.onCloseAllModal}>
              {t('app.close')}
              </button>
            </div>
          </div>
        </Modal>

        
        {/*  -------- ﹝彈窗3﹞ 上傳我的單據 -------- */}
        <Modal open={this.state.isOpenUploadPhoto} 
          onClose={this.onCloseAllModal} closeIconSize={0}>
           {this.props.stage < 50?
            <div className="modal-inside">            
              <div className="modal-body">
                <div className="modal-body-photo-section">
              
                  <div className="main-photo-section">
                    {/* 顯示的大圖 */}
                      {this.state.showLoading?
                        <ClipLoader
                          sizeUnit={"px"}
                          size={40}
                          color={'#999'}
                          loading={this.state.loading}
                        />
                        : 
                        <React.Fragment>
                          {this.state.nowShowPhoto !=='' ?
                          <div className="main-photo-box">
                            <button name={nowShowPhoto} className="btn-cancel-photo" onClick={this.cancelPhoto}> X </button>
                            <img className="preview-image" src={this.state.nowShowPhoto} alt="preview"/>
                          </div>
                          :
                          <div className="main-photo-box">
                            <label name={nowShowPhoto} className="upload-label"> 
                              <img name={nowShowPhoto} className="upload_icon_big" src={uploadIconSRC} alt="upload_icon"/>
                              {t('app.upload_image')}
                              {/* 真正具有功能的﹝選擇檔案﹞按鈕  ↓↓ */}
                              <input name={nowShowPhoto} className="upload-input-btn" type="file"  
                                onChange={this.onChangePhoto}
                                />
                            </label>
                          </div>
                          }
                        </React.Fragment>
                    }
                  </div>

                  {/* ********** 備註欄位 (正要上傳) ********** */}
                  {this.state.showAddRemarkBtn===false && this.state.nowShowRemark==='' ? 
                    '': //新照片前、新增照片以後備註為空，都不顯示
                    <div className="remark-input-section">
                      <span className="remark-label" >{t('app.remark')}：</span>
                      <input 
                         className="remark-input" 
                         type="text"
                         onChange={this.onChangeRemark}
                         value={this.state.nowShowRemark}
                         autoComplete="off"
                         maxLength="30"
                       />
                    </div>
                  }
                  
                  {this.state.showAddPhotoBtn? 
                    <div className="text-center">
                      <button className={this.state.highlightAddPhotoBtn? 'btn-upload-highlight':'btn-upload'}
                        onClick={this.state.isRepeatClickStop?'':this.confirmAdd}>
                        {t('app.add')}
                      </button>
                    </div>
                    :  
                   ""
                  }

                  {/* 請務必確保數額和帳戶填寫正確，如有進多，本公司一概不負責任。 */}
                  <div className="remark-input-section font-12">
                    {t('app.make_sure_amount_and_account_are_filled_in_correctly')}
                  </div>

                  {this.state.nowShowPhoto !=='' && !this.state.showAddPhotoBtn ? 
                    <div className="text-center d-flex">
                      <button name={nowShowPhoto} className="btn-upload btn-delete" onClick={this.deletePhoto}>
                        {t('app.delete')}
                      </button>
                      <label name={nowShowPhoto} className="continue-upload-label"> 
                        {t('app.continue_adding')}
                        <input name={nowShowPhoto} className="upload-input-btn" type="file"  
                          onChange={this.onChangePhoto}
                        />
                      </label>
                    </div>
                    :  
                    ""
                  }

                  <div className="list-photo-section">
                    {this.state.photoRemarkList.map((item,index) => 
                      <div className="small-photo-box">
                        <button 
                          index={index}
                          {...item}
                          name={item.image} 
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
                      )
                    }
                  </div>
                </div>
              </div>

              <div className="modal-body-hr"></div>

              <div className="text-center">
                {this.state.state_success_message}
                {this.state.state_error_message}
              </div>

              <div className="modal-footer">
                <button className="modal-action-button" onClick={this.onCloseAllModal}>
                  {t('app.cancel')}
                </button>
                <button className="modal-action-button" 
                  onClick={this.state.isRepeatClickStop2?'':this.submitUploadPhoto}>
                  {t('app.upload')}
                </button>
              </div>
            </div>

             :

            // *****************************************************
            //  ****************** 已上傳單據改成顯示 ↓ **************
            <div className="modal-inside">
              <h5>{t('app.already_upload')}</h5>
              
              {this.state.imageGetError? //抓不到單據
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
                      {this.state.selfApiPhotoRemarkList.map((item,index) => 
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
                      {/* ↓ 放大後的單據 */}
                      <img className="zoomin-image" 
                        src={this.state.nowShowPhoto ===''? this.state.firstImage : this.state.nowShowPhoto}  
                        alt="preview"
                      />
                      <button className="btn-zoom-in-close" onClick={this.onClickZoomOut} >
                        <MdClear/>
                      </button>
                    </div>
                  :''}
                </div>
              }

              {/* ********** 備註欄位 (查看) ********** */}
              {this.state.imageGetError || this.state.nowShowRemark==='' ? '' :
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
              <div className="remark-input-section font-12">
                {t('app.make_sure_amount_and_account_are_filled_in_correctly')}
              </div>

              <div className="text-center">
                {this.state.state_success_message}
                {this.state.state_error_message}
              </div>
              <div className="modal-footer">
                <button className="modal-action-button" onClick={this.onCloseAllModal}>
                  {t('app.close')}
                </button>
              </div>
            </div>
          }
        </Modal>

      </tr>
    )
  }
}
export default withTranslation()(OrderPendingBuyItem);