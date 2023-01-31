import { FunctionComponent, useContext, useRef } from "react"
import { Table } from "../Components/Table";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Image } from "../Components/Image";
import { ChevronRightIcon } from "../Components/Icons";
import { Link, useHistory } from "react-router-dom";
import ApiService from "../Services/ApiService";
import { readPageQueryString } from "../Services/Functions";

export const ProWorkReportList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const getWorkReportList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getWorkReportList(page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  const handleJsTime = (JsTime) => {
    var time = new Date(JsTime);
    return time.toLocaleDateString() ?? "-";
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Hizmet Sorun Bildirimleri</h2>
        <Table
          ref={tableEl}
          emptyListText={"Bildirim Bulunamadı"}
          getDataFunction={getWorkReportList}
          header={<div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Tarih
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Müsteri Bilgisi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Profesyonel Bilgisi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                İş Tanımı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                İş Başlangıç Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                İş Teslim Tarihi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Şikayet Nedeni
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-8 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {handleJsTime(e.CreatedDateJS)}
                </p>
              </div>
              <div className="lg:col-span-1 gap-2 flex items-center">
                <Image src={e.UserPhoto} alt={e.UserName} className="w-8 h-8 rounded-full object-cover" />
                <p className="p-sm">
                  {e.UserName}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="text-sm underline text-blue-400 font-medium cursor-pointer" onClick={() => { history.push(`/pro-profesyonel-detay/${e.ProId}`); }}>
                  {e.ProStoreName}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.WorkName}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {
                    e.WorkStartDateJS && e.WorkStartDateJS > 0 ?
                      <>
                        {handleJsTime(e.WorkStartDateJS)}
                      </>
                      :
                      e.PlannedWorkStartDate && e.PlannedWorkStartDate > 0 ?
                        <>
                          {handleJsTime(e.PlannedWorkStartDate)}
                        </>
                        :
                        <>{"-"}</>
                  }
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {
                    e.WorkCompleteDate && e.WorkCompleteDate > 0 ?
                      <>
                        {handleJsTime(e.WorkCompleteDate)}
                      </>
                      :
                      e.PlannedWorkCompleteDate && e.PlannedWorkCompleteDate > 0 ?
                        <>
                          {handleJsTime(e.PlannedWorkCompleteDate)}
                        </>
                        :
                        <>{"-"}</>
                  }
                </p>
              </div>
              <div className="lg:col-span-2 flex items-center justify-between">
                <p className="p-sm">
                  {e.RejectTitle}
                </p>
                <Link to={{ pathname: `/hizmet-detay/${e.WorkId}`, state: { prevTitle: "Hizmet Sorun Bildirimleri", prevPath: window.location.pathname, tabId: 1, queryPage: Number(readPageQueryString(window.location) ?? "1") } }}>
                  <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 text-gray-700 cursor-pointer transition-all" />
                </Link>
              </div>
            </div>
          }}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
        />
      </div>
    </div>
  )
}
