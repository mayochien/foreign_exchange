import React from 'react';


export default class EmployeeAdd extends React.Component{

  render(){
    return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-exchange">

                <div className="header text-center">
                  <h4 className="title">編輯銀行帳戶</h4>
                </div>

                <div className="content">
                  <form className="form-horizontal"
                  // onSubmit={handleSubmit}
                  >

                  <div className="form-group">
                    <label className="col-md-3 label-exchange">編號</label>
                    <div className="col-md-6">
                      <input
                        className=""
                        type="text"
                        />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="col-md-3 label-exchange">姓名</label>
                    <div className="col-md-6">
                      <input
                        className=""
                        type="number"
                        />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="col-md-3 label-exchange">權限</label>
                    <div className="col-md-6">
                      <input
                        className=""
                        type="text"
                        />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="col-md-3"></label>
                    <div className="col-md-6">
                      <button type="submit" className="btn form-btn-exchange">新增</button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="footer">
                <div className="legend">
                  <div className="item">
                    <i className="fa fa-circle text-info"></i> Status1
                  </div>
                  <div className="item">
                    <i className="fa fa-circle text-danger"></i> Status2
                  </div>
                  <div className="stats"><i className="fa fa-clock-o"></i> 2019/10/10</div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    )
  }
}