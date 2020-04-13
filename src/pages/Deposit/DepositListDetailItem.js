import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
// import { MdEdit, MdDone, MdClear } from "react-icons/md";
import { apiPostVerify,
        apiPostUploadDepositReceipt,
        apiGetDepositBank,
        apiGetUploadReceipt } from '../../services/apiService';
import { DEPOSIT_DETAIL_STATUS} from '../../const';
// import { MdZoomIn, MdClear } from "react-icons/md";
import { GoCheck } from "react-icons/go";
import { FaCopy } from "react-icons/fa";
import { MdDone, MdZoomIn, MdClear } from "react-icons/md";
import { TiLocationArrow } from "react-icons/ti";
import Modal from "react-responsive-modal";
import moment from "moment";
import { ClipLoader } from 'react-spinners';
import  Format  from '../../services/Format';


class DepositListItem extends Component {

  state = {
    modifiable: false,
    unverifiedDepositList: [],
    isOpenUploadPhoto:false,
    isOpenBankAccountVerify:false,
    isText01Copy:false,
    isText02Copy:false,
    lineActiveNow:false,
    hasActiveOnce:false,
    img_zoom_in:false,
    getRemark:'',
    // canShowPhoto:true,
    nowShowPhoto:'',
    nowShowRemark:'',
    photoRemarkList:[],
    photoRemarkApiList:[],
    selfApiPhotoRemarkList:[],
    otherApiPhotoRemarkList:[],
    firstImage:'',
    firstRemark:'',
    showAddPhotoBtn:false,
    imageGetError:false,
    showAddRemarkBtn:false,
    highlightAddPhotoBtn:false,
    isRepeatClickStop:false,
    isRepeatClickStop2:false,
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

  sendVerify = async(id, verify) => {
    const postData = {
      result: verify
    }
    let resp = await apiPostVerify(id, postData);
    if(resp.statusText === "OK") {
      alert('更新成功')
    }
  }

  // ********** 1. api-get:查看匯款的帳戶**********
  onOpenBankAccountVerify = async () => {
    console.log("選擇的單據id:",this.props.id)
    this.setState({ isOpenBankAccountVerify: true });
    try {
      let res = await apiGetDepositBank(this.props.id)
      if(res.data.code===1){
        let resultData = res.data.data.deposit_account[0]
        // console.log(resultData)
        this.setState({
          verify_account_name: resultData.account_name,
          verify_account_number: resultData.account_number,
          verify_bank_name: resultData.bank_name,
          verify_bank_branch: resultData.bank_branch,
          verify_bank_code: resultData.bank_code,
          verify_currency_type: resultData.currency_type,
          verify_id: resultData.id,
          verify_swift_code: resultData.swift_code,
          verify_bank_state_code: resultData.bank_state_code,
          verify_type: resultData.type,
        })
      }
    }catch(err) {
      console.log(err);
    }
  };


  // ********** 2. 開啟上傳彈框 (or觀看我的已上傳的單據) **********
  onOpenUploadPhoto = async() => {
    let {t} = this.props
    this.showLoading()
    this.setState({ isOpenUploadPhoto: true });
    // 狀態大於30時，才能去抓上傳過的單據 ↓
    if(this.props.status>20){
      try{ //---------- api:get:觀看我的單據----------
        let res_selfImage = await apiGetUploadReceipt(this.props.id)
        if (res_selfImage.data.code===1){
          this.setState({
            selfApiPhotoRemarkList:res_selfImage.data.data.deposit_image,
            firstImage:res_selfImage.data.data.deposit_image[0].image,
            firstRemark:res_selfImage.data.data.deposit_image[0].remark,
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
  }

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
      // showAddPhotoBtn:false,
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
  
  // ********** api-post: 上傳我的單據  **********
  submitUploadPhoto = async() => {
    let postData= this.state.photoRemarkList
    // console.log('postData:',postData)
    if(this.state.photoRemarkList.length<1){
      this.showAddPhotoFirst() //沒有單據不給上傳
    }
    else{
      this.stopRepeatClick2()
      try{
        let res = await apiPostUploadDepositReceipt(this.props.id,postData)
        if(res.data.code===1){
          console.log('上傳成功 ↓',postData)
          // this.delayToShowPhoto()
          this.showSubmitSuccess()
          this.showLongTimeLoading()
          setTimeout(() => {
            this.props.refreshData()
          }, 300);
        }
      }catch (err) {
        console.log(err);
        this.showSubmitError()
      }
    }
  }

   // ********** submit成功訊息 **********
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


  // ********** 功能:關閉所有Modal **********
  onCloseAllModal = () => {
    this.setState({
      isOpenUploadPhoto: false,
      isOpenBankAccountVerify:false,
      img_zoom_in:false,
      nowShowPhoto:'',
      nowShowRemark:'',
      photoRemarkList:[],
    });
  };

  showNullLine = (value) => {
    if(value==='' || value===undefined || value===null){
      return '-'
    }
    else{
      return value
    }
  }

  // ********** 計算到期時間 **********
  showExpiredTime =()=>{
    if(this.props.create_datetime===undefined || this.props.create_datetime===''){
      return '-'
    }
    else{
      let dateString = new Date(this.props.create_datetime)
      dateString.setHours(dateString.getHours()+2)
      return moment(dateString).format('YYYY-MM-DD HH:mm:ss')
    }
  }

  //  ********** submit失敗訊息 **********
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

  // ========== 功能:放大、縮小單據 ==========
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

  componentDidMount(){
    if(this.props.id===this.props.depositDetailItem_id){
      this.showActiveLine()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.depositDetail !== this.state.depositDetail) {
      setTimeout(()=>{
        this.getInitialData()
        console.log('存款詳細頁(單筆)刷新',new Date().getMinutes(),':',new Date().getSeconds())
      },5000)
    }
  }

  componentWillReceiveProps(nextProps){
    // id不同時，把點擊過歸零
    if(this.props.depositDetailItem_id !== nextProps.depositDetailItem_id){
      this.setState({
        hasActiveOnce:false
      })
    }
    //id相同，但尚未點選過該通知時，要閃爍
    if(this.props.id === nextProps.depositDetailItem_id
      && this.state.hasActiveOnce === false){
      this.showActiveLine()
    }
  }


  render() {
    const { t, status } = this.props;
    let {nowShowPhoto} = this.state;
    let uploadIconSRC = require('../../assets/images/upload_icon.png')

    return (
      <React.Fragment>
        <tr className={this.state.lineActiveNow? "td-active":''}>
          <td>{this.props.id}</td>
          <td>{this.props.serial_number}</td>
          <td>{Format.thousandsToFix3(this.props.amount)}</td>
          {/* <td>{this.showNullLine(this.props.remark)}</td> */}
          {/*  -------- ﹝彈窗1﹞查看要匯款的帳戶 -------- */}
          <td>
            {status<30||status>40? // 管理員分配銀行帳戶前(或被拒絕)，不能點選  <=>  分配後，才可點開
              <button
               className={status<20||status===60?"table-small-btn btn-small-not-yet":"table-small-btn"}
              // className="table-small-btn"
                onClick={()=>this.onOpenBankAccountVerify()}>
                <TiLocationArrow/>
              </button>
              :
              //上傳過的話 -> 變成打勾
              <button className="table-small-btn table-small-done"
                onClick={()=>this.onOpenBankAccountVerify()}>
                <GoCheck/>
              </button>
            }
          </td>
          {/*  -------- ﹝按鈕2﹞上傳我的匯款單據 -------- */}
          <td>
            {status<30||status>40?
              <button
                className={status<20||status===60?"table-small-btn btn-small-not-yet":"table-small-btn"}
                onClick={e=>this.onOpenUploadPhoto(e,this.props.id,this.props.buyer_id)}>
                <TiLocationArrow/>
              </button>
              :
              <button className="table-small-btn table-small-done"
                onClick={e=>this.onOpenUploadPhoto(e,this.props.id,this.props.buyer_id)}>
                <GoCheck/>
              </button>
            }
          </td>
          <td className={this.props.status>40?"text-failed":""}>
            {t(DEPOSIT_DETAIL_STATUS[status])}
          </td>
          <td>{this.props.mainTicketExpireTime}</td>
          <td>{this.props.update_datetime}</td>
        </tr>

        {/*  -------- ﹝彈窗1﹞查看要匯款的帳戶 -------- */}
        <Modal open={this.state.isOpenBankAccountVerify}
          onClose={this.onCloseAllModal} closeIconSize={0}>
          <div className="modal-inside">
            <div className="modal-body">
              <h5>{t('app.account_info')}</h5>
              <div className="modal-body-text-section">

                <div className="bank-info-line">
                  <div className="info-label">{t('app.bank_account_name')} : </div>
                  <input type="text" className="info-value"
                    value={this.state.verify_account_name}
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
              <button className="modal-action-button"
              onClick={this.onCloseAllModal}>
              {t('app.close')}
              </button>
            </div>
          </div>
        </Modal>

        {/*  -------- ﹝彈窗2﹞上傳我的單據 -------- */}
        <Modal open={this.state.isOpenUploadPhoto}
          onClose={this.onCloseAllModal} closeIconSize={0}>
           {/* {console.log(this.props.buyer_image)} */}
           {this.props.status < 30?
            <div className="modal-inside">
              <h5>{t('app.upload_image')}</h5>
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

                  {/* ********** 備註欄位  ********** */}
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
                      <button className="btn-zoom-in-close" 
                        onClick={this.onClickZoomOut} >
                        <MdClear/>
                      </button>
                    </div>
                  :''}
                </div>
              }

              {/* ********** 備註欄位 (查看對方) ********** */}
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
              <div className="remark-input-section font-12">
                {t('app.make_sure_amount_and_account_are_filled_in_correctly')}
              </div>
            
              <div className="text-center">
                 {this.state.state_success_message}
                 {this.state.state_error_message}
              </div>
              <div className="modal-footer">
                <button className="modal-action-button" 
                  onClick={this.onCloseAllModal}>
                  {t('app.close')}
                </button>
              </div>
            </div>
          }
        </Modal>

      </React.Fragment>
    );
  }
}

export default withTranslation()(DepositListItem);
