import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { apiGetQuestionAnswerCenter, apiGetImage } from '../../services/apiService';
import Pagination from "react-js-pagination";
import SingleQuestionAnswer from"./SingleQuestionAnswer";
// import styled from 'styled-components'
import { ClipLoader } from 'react-spinners';


class QuestionAnswerCenter extends Component {
  state = {
    modifiable: false,
    state_remark: '',
    customerProcessingList: [],
    imageUrl:'',
    state_pages_total:0,
    activePage:1,
    success_messege: '',
    alert_messege: '',
    isShowResultModal:false,
    showLoading:true,
    service_type:''
  };

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
  
  handlePageChange (pageNumber) { // 切換頁面
    this.showLoading()
    this.setState({
      activePage: pageNumber
    },()=>{this.getInitialData()})
  }

  viewPhoto = async(id) => {
    try {
      let result_getImage = await apiGetImage(id);
      this.setState({
        imageUrl: result_getImage.data.data,
      })
    } catch(err) {
      console.log(err);
    }
  }

  onClickEdit = (remark) => {
    this.setState({
      modifiable:true,
      state_remark: remark || '',
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

  cancelEdited= (id) => {
    this.setState({
      modifiable: false,
    });
  }

  onCloseAllModal = () => {
    this.setState({
      isShowResultModal: false,
    });
  }

  onChangeServiceType = (e) => { //切換類型
    this.showLoading()
    if(e.target.value===''){
      this.setState({
        activePage:1,
        service_type:''
      },()=>{this.getFilterData()})
    }
    else{
      this.setState({
        activePage:1,
        service_type: e.target.value
      }
      ,()=>{this.getFilterData()}
      )
    }
  }

  getFilterData = async() => {
    let {activePage, service_type} = this.state
    try {
      let res = await apiGetQuestionAnswerCenter(activePage, service_type)
      if(res.data.code===1){
        this.setState({
          customerProcessingList: res.data.data.customer_services,
          state_pages_total: res.data.data.total_pages,
        })
      }
    }catch (err) {
      console.log(err)
    }
    this.setState({
      hasClickSearch:true
    })
  }

  getInitialData = async() => {
    this.showLoading()
    try {
      let res = await apiGetQuestionAnswerCenter(1,'')
      if(res.data.code===1){
        this.setState({
          customerProcessingList: res.data.data.customer_services,
          state_pages_total: res.data.data.total_pages,
        })
      }
    } catch(err) {
      console.log(err);
    }
  }

  componentDidMount(){
    this.getInitialData()
    this.refreshPage = setInterval(()=>{
      this.getFilterData()
      console.log('刷新-客訴處理階段',new Date().getMinutes(),':',new Date().getSeconds())
    },6000)
  }

  componentWillUnmount(){
    clearInterval(this.refreshPage);
  }


  render() {
    const { t } = this.props;
    const { customerProcessingList, state_pages_total, activePage } = this.state;

    let path_link = (this.props.location.pathname).replace("/service/QA-center/",'')
    let path_id = parseInt(path_link,10)

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">
              <div className="header text-center">
                <h4 className="title">{t('app.message_processing')}</h4>
              </div>

              
              <div className="filter-section">
                <div className="table-filter-section">
                  <span className="table-filter-label">
                    {t('app.type')}  : 
                  </span>
                    <select
                      onChange={e=>this.onChangeServiceType(e)} 
                      className="table-select">
                        <option
                          label={t('app.all')}
                          value={''} 
                          >
                        </option>
                          <option
                          label={t('app.order')}
                          value={10} 
                          >
                        </option>
                        <option
                          label={t('app.transaction')}
                          value={20} 
                          >
                        </option>
                        <option
                          label={t('app.suggestion')}
                          value={30} 
                          >
                        </option>
                        <option
                          label={t('app.account')}
                          value={40} 
                          >
                        </option>
                        <option
                          label={t('app.other')}
                          value={90} 
                          >
                        </option>
                    </select>
                  <span className="mr-15"></span>
                </div>
              </div>

              <div className="content table-responsive table-full-width">
              {this.state.showLoading?
                  <table className="table table-exchange text-center m-tb-30">
                  <ClipLoader
                    sizeUnit={"px"}
                    size={40}
                    color={'#999'}
                    loading={this.state.loading}
                  />
                </table>
                  :
                <table className="table table-bigboy table-exchange">
                  <thead>
                    <tr>
                      <th>{t('app.id')}</th>
                      <th>{t('app.create_datetime')}</th>
                      <th>{t('app.type')}</th>
                      <th>{t('app.username')}</th>
                      <th>{t('app.photo')}</th>
                      <th>{t('app.content')}</th>
                    </tr>
                  </thead>

                
                  <tbody>
                    {(customerProcessingList === undefined
                      || !customerProcessingList instanceof Array
                      || customerProcessingList.length === 0 ) &&
                      <td className="table-no-data" colSpan="20">
                        {t('app.no_data')}
                      </td>
                    }
                    {customerProcessingList.map((data, index) => (
                      <SingleQuestionAnswer
                        key={index}
                        data={data}
                        subData={data.customer_service_replies}
                        // refreshData={this.getInitialData.bind(this, 1)}
                        refreshData={()=>this.getInitialData()}
                        path_id={path_id}
                        />
                      ))
                    }
                  </tbody>
                  
                </table>
                }

                {state_pages_total > 0 ?
                  <div className="page-section">
                    <Pagination
                      activePage={activePage}
                      itemsCountPerPage={20}
                      totalItemsCount={state_pages_total*20}
                      pageRangeDisplayed={3}
                      onChange={e=>this.handlePageChange(e)}
                    />
                  </div>
                :''}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(QuestionAnswerCenter);
