import React, { Component } from 'react';
import styled from 'styled-components'
import { withTranslation } from 'react-i18next';
// import { apiPostVerify, } from '../../services/apiService';
import Modal from "react-responsive-modal";
import { MdDone, MdClear, MdZoomIn, MdReportProblem } from "react-icons/md";

export class ImagePopup extends Component {

  state = {
    modifiable: false,
    success_messege: '',
    alert_messege: '',
    isShowResultModal: false,
    closeId: '',
    img_zoom_in: false, //圖片放大
  }

  // ========== 功能:放大、縮小圖片 ==========
  onClickZoomIn = (zoom) => {
    this.setState({
      img_zoom_in: zoom
    })
  }

  showSuccess = (msg) =>{
    // let {t} = this.props
    this.setState({
      success_messege: <span>{msg}</span>
    })
    setTimeout(() => {
      this.setState({
        isShowResultModal: false,
      })
    }, 1500)
  }

  showAlert = (msg) =>{
    // let {t} = this.props
    this.setState({
      isShowResultModal: true,
      success_messege: null
    })
    this.setState({
      alert_messege: <span>{msg}</span>
    })
    setTimeout(() => {
      this.setState({
        isShowResultModal: false,
      })
    }, 1500)
  }

  escFunction = (event) => {
    const { imageId } = this.props;
    const msgBoxEl = document.querySelector(`#CustomerImage${imageId}`);

    if(event.keyCode === 27 && msgBoxEl) {
      msgBoxEl.checked = false;
      this.setState({
        img_zoom_in: false
      })
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escFunction);

    this.setState({
      closeId:this.props.imageId
    })
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.escFunction);
  }

  render() {
    const {imageId, imageData, t} = this.props;
    const {img_zoom_in} = this.state;

    return (
      <React.Fragment>
      <PopupTrigger id={`CustomerImage${imageId}`} type="checkbox"/>
      <PopupBackdrop/>

       {/* ---------------放大圖檔------------------- */}
      <PopupBox>

          {img_zoom_in
            ?
            <div className="zoomInImgBox">
              <img src={imageData} alt="zoom-in-img"/>
              <ZoominCloseBtn onClick={this.onClickZoomIn.bind(this, false)}><MdClear/></ZoominCloseBtn>                 
            </div>
          :''}

          <div style={{textAlign: "center", margin: "0 auto", display:"flex",flexDirection: "column", maxHeight: "100%"}}>
            {/* ---------------原始圖檔------------------- */}
            <div className="imgBox">
              {imageData ? <img src={imageData} alt="zoom-in-img"/> : <span>{t('app.noImage')}</span>}
            </div>

            {/*  ---------------放大按鈕 --------------- */}
            <div style={{display: "flex", justifyContent:"center", alignItems: "center"}}>
              {!img_zoom_in?
                <ZoominBtn
                  onClick={this.onClickZoomIn.bind(this, true)}>
                    <MdZoomIn/>
                </ZoominBtn>
              :''
              }
            </div>

            {/*  ---------------關閉按鈕 --------------- */}
            <div style={{textAlign: "center", marginTop: "15px", display:"flex", justifyContent: "space-around"}}>
              <label className="popup-action-btn" htmlFor={`CustomerImage${imageId}`}>{t('app.close')}</label>
            </div>
          </div>

          {/*  ---------------提示文字 --------------- */}
          <Modal open={this.state.isShowResultModal}
            onClose={this.onCloseAllModal} closeIconSize={0}>
            <div className="modal-inside"><br/>
              <div className="modal-body ">
                {this.state.success_messege
                ?<span className="text-green">
                  <React.Fragment><MdDone/>&nbsp;{this.state.success_messege}</React.Fragment>
                  </span>
                  :null
                }

                {this.state.alert_messege
                ?<span className="text-red">
                  <React.Fragment><MdReportProblem/>&nbsp;{this.state.alert_messege}</React.Fragment>
                  </span>
                  :null
                }
              </div>
            </div><br/>
          </Modal>
        </PopupBox>
      </React.Fragment>
    );
  }
}

export default withTranslation()(ImagePopup);

const PopupBackdrop = styled.div`
  width: 100%;
  height: 100%;
  background-color:  rgba(0,0,0,0.75);
  position: fixed;
  display: none;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  z-index: 999;
`;

const PopupBox = styled.div`
  width: 35%;
  max-width: 500px;
  min-width: 340px;
  background-color: #f3f4f5 ;
  position: fixed;
  display: none;
  top: 19%;
  left: 40%;
  z-index: 999;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  @media (max-width: 1024px) {
    max-width: 500px;
    height: 380px;
    left: 25%;
  }
  @media (max-width: 768px) {
    max-width: 460px;
    height: 360px;
    left: 20%;
  }
  @media (max-width: 585px) {
    max-width: 390px;
    height: 310px;
    left: 15%;
    top: 18%;
  }
  @media (max-width: 414px) {
    max-width: 360px;
    height: 325px;
    left: 6%;
    top: 23%;
  }
  @media (max-width: 375px) {
    max-width: 300px;
    height: 295px;
    left: 10%;
    top: 18%;
  }
  @media (max-width: 320px) {
    max-width: 273px;
    height: 295px;
    left: 8%;
    top: 18%;
  }
`;

const PopupTrigger = styled.input`
  display: none;
  &:checked + ${PopupBackdrop} {
    display: flex;
  }
  &:checked + ${PopupBackdrop} +${PopupBox} {
    display: flex;
  }
`;

// const ZoominBox = styled.div`
//   position: fixed;
//   margin: 0 auto;
//   top: 10%;
//   display: flex;
//   width: auto;
// `;

const ZoominBtn = styled.button`
  margin: 12px;
  background: transparent;
  border: none !important;
  transition:0.2s;
  padding: 0;
  width: 20px;
  font-size: 24px;
  color: $primary-text-color;
  &:hover{
    cursor: pointer;
    color: $primary-text-color;
    transform: scale(1.3);
  }
  &:focus{
    outline: none;
  }
  @media (max-width:768px) {
    display: none;
  }
`;

// const ZoominImg = styled.img`
//   max-width: 1200px;
//   max-height: 800px;
//   width: 250%;
//   height: 250%;
//   position: relative;
// `;

const ZoominCloseBtn = styled.button`
  margin: 6px;
  padding: 3px;
  background: #666;
  border-radius: 3px;
  border: none !important;
  transition:0.2s;
  font-size: 22px;
  width: 28px;
  height: 28px;
  color: #fff;
  &:hover{
    cursor: pointer;
    background: $primary-color-d-10;
  }
  &:focus{
    outline: none;
  }
`;
