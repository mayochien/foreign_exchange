import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { apiPostCustomerMsg } from '../../services/apiService';
import { MdDone, MdCloudUpload, MdClear} from "react-icons/md";
// import { Link } from 'react-router-dom';
// import styled from 'styled-components'
import Modal from "react-responsive-modal";
import { GoArrowLeft } from "react-icons/go";


class NewMessage extends Component {

  state = {
    serviceType: '',
    serviceTypeOptions:[],
    title:'',
    messageArea:'',
    // objUrl: '',
    // base64Url: '',
    state_success_message: '',
    state_error_message: '',
    isShowResultModal: false,
    isRepeatClickStop: false,
    imageName: '',
    imagePreviewUrl:'',
    showRedirectBtn:false,
  };

  onTitleChange = e => {
    this.setState({
      title: e.target.value
    })
  }

  onMessageChange = e => {
    this.setState({
      messageArea: e.target.value
    })
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
      var quality = 0.8;  // 默認圖片質量為0.8
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

  handlePhotoChange = async (e) => {
    let targetFiles = e.target.files;
    let base64String = await this.getBase64(targetFiles[0]);
    this.setState({ //不確定是否會非同步
      file: targetFiles,
      imagePreviewUrl: base64String
    });
  };

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

  //================= Api:post 向管理員發送訊息===================//
  submitAddMessage = async() => {
    const { serviceType, title, messageArea, imagePreviewUrl } = this.state;
    if(serviceType!=='' && title!=='' && messageArea!=='' ) {
      // 把錯誤通知清空
      this.setState({
        state_error_message: null
      })
      const postData = {
        service_type: parseInt(serviceType,10),
        title: title,
        message: messageArea,
        image: imagePreviewUrl,
      }
      try {
        let resp = await apiPostCustomerMsg(postData);
        if(resp.data.code === 1) {
          this.stopRepeatClick()
          this.setState({
            isShowResultModal:true,
            serviceTypeOptions:[], //清空Array選項
            service_type:'',
            title: '',
            messageArea: '',
            imagePreviewUrl: '',
          })
          this.showSubmitSuccess();
          this.showOptionArray() //生成Array選項
          // window.location.reload();
        }
      } catch (error) {
        console.log(error);
      }
    }else{
      this.showInputDataMissing()
    }
  }

  showSubmitSuccess = () =>{
    let {t} = this.props
    this.setState({
      state_success_message: <span className="text-green">
      <MdDone/> {t('app.add_success')}</span>
    })
    setTimeout(() => {
      this.setState({
        state_success_message:t('app.go')+t('app.list_page')+' ?',
        showRedirectBtn:true,
      })
    }, 2000)
  }

  showInputDataMissing=()=>{
    let {t} = this.props
    console.log('有欄位未填寫')
    this.setState({
      isShowResultModal:true,
      state_error_message:t('app.please_check_required_fields')
    })
    this.clearMessageAndCloseModal()
  }

  cancelPhoto = () => { //取消正要上傳的圖片
    this.setState({
      imagePreviewUrl: '',
    })
  }

  clearMessageAndCloseModal=()=>{    
    setTimeout(() => {
      this.setState({
        isShowResultModal:false,
        state_error_message:'',
        state_success_message:'',
      })
    }, 2000)
  }

  onCloseAllModal = () => {
    this.setState({
      isShowResultModal: false,
      showRedirectBtn:false,
      state_error_message:'',
      state_success_message:'',
    });
  };

  showOptionArray = () => { //載入才生成Array選項，也能讓post後刷新重置
    let {t}  = this.props
    this.setState({
      serviceTypeOptions : [
        // { value: "default", label: t('app.please_select') },
        { value: "10", label: t('app.order') },
        { value: "20", label: t('app.transaction') },
        { value: "30", label: t('app.suggestion') },
        { value: "40", label: t('app.account') },
        { value: "90", label: t('app.other') },
      ]
    })
  }

  componentDidMount(){
    this.showOptionArray()
  }

  render() {
    const { t } = this.props;
    // console.log(this.state.serviceType);

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-10">
            <div className="card card-exchange">

              <div className="header text-center">
                <h4 className="title">{t('app.create_message')}</h4>
              </div>

              <div className="content">
                <div className="form-horizontal form-service">

                  <div className="form-group">
                    <label className="col-md-3">
                    <span className="text-red">* </span>
                      {t('app.type')}
                    </label>
                    <div className="col-md-6">
                      <select
                        onChange={e=>this.setState({
                          serviceType:e.target.value
                        })}
                        className="table-select">
                        <option key="" value=""  // "請選擇"要寫在Render內，不然無法即時翻譯
                          label={t('app.please_select')}>
                        </option> 
                        {this.state.serviceTypeOptions.map((item,index) => 
                            <option key={index} value={item.value} label={item.label}>
                              {item.label}
                            </option>)
                          }
                      {/* <option value="default">{t('app.please_select')}</option>
                      <option value="10">{t('app.order')}</option>
                      <option value="20">{t('app.transaction')}</option>
                      <option value="30">{t('app.suggestion')}</option>
                      <option value="40">{t('app.account')}</option>
                      <option value="90">{t('app.other')}</option> */}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="col-md-3">
                    <span className="text-red">* </span>
                      {t('app.title')}
                    </label>
                    <div className="col-md-6">
                      <input
                        className="input-general"
                        type="text"
                        onChange={this.onTitleChange}
                        value={this.state.title}
                        placeholder=""
                        maxLength="20"
                      />
                    </div>
                  </div>

                  <div className="form-group message-form-group">
                    <label className="col-md-3">
                    <span className="text-red">* </span>
                      {t('app.content')}
                    </label>
                    <div className="col-md-6 message-textera-box">
                      <textarea className="message-textera"
                        onChange={this.onMessageChange}
                        value={this.state.messageArea}
                      />
                    </div>
                  </div>

                  {/* ********** 上傳照片 ********** */}
                  <div className="form-group service-photo-form-group">
                    <label className="col-md-3">
                      {t('app.upload_photo')}
                    </label>
                    <div className="col-md-6">
                      {this.state.imagePreviewUrl !==''?
                        <div className="img-label">
                          <button name={this.state.imageName}
                            className="btn-cancel-photo" 
                            onClick={this.cancelPhoto}> 
                              <MdClear/>
                          </button>  
                          <input className="upload-input" type="file"
                            onChange={this.handlePhotoChange}
                            name={this.state.imageName}/>
                          <img className="preview-img" alt="" src={this.state.imagePreviewUrl}/>
                        </div>
                      :
                        <label className="img-label">
                          <input className="upload-input" type="file"
                            onChange={this.handlePhotoChange}
                            name={this.state.imageName}/>
                          <MdCloudUpload className="MdCloudUpload"/>
                        </label>
                      }
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="col-md-12 text-center">
                      <button
                       className="card-submit-btn"
                       onClick={this.state.isRepeatClickStop?'':this.submitAddMessage}>
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
            <div className="modal-body">
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
                  onClick={()=>window.location.href="/#/service/QA-center"}>
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

export default withTranslation()(NewMessage);
