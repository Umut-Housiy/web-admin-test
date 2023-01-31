import { FunctionComponent, useContext, useRef } from "react"
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { Link, useHistory } from "react-router-dom";
import { Table } from "../../Components/Table";
import { UserWorkListInnerForAdminModel, WorkStatus } from "../../Models";
import { CheckIcon, ChevronRightIcon, CloseIcon, EyeIcon } from "../../Components/Icons";

interface ProfessionalEvaluationsProps {
  UserId: number,
}

export const ProfessionalEvaluations: FunctionComponent<ProfessionalEvaluationsProps> = (props: ProfessionalEvaluationsProps) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const history = useHistory();

  const getUserProfessionalEvaluatesForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getUserProfessionalEvaluatesForAdmin(props.UserId, page, take, searchText, order);

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

  const handleJsDate = (JsTime) => {
    try {
      if (JsTime < 0) {
        return "-";
      }
      else {
        var time = new Date(JsTime);
        return time.toLocaleDateString() ?? "";
      }
    }
    catch {
      return ""
    }
  }

  return (
    <Table
      ref={tableEl}
      emptyListText={"Değerlendirme Bulunamadı"}
      getDataFunction={getUserProfessionalEvaluatesForAdmin}
      header={
        <div className=" lg:grid-cols-10 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4 flex items-center">
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Tarih
            </span>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <span className="p-sm-gray-400">
              Profesyonel Bilgisi
            </span>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <span className="p-sm-gray-400">
              İş Başlangıç Tarihi
            </span>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <span className="p-sm-gray-400">
              İş Teslim Tarihi
            </span>
          </div>
          <div className="lg:col-span-3 flex items-center">
            <span className="p-sm-gray-400">
              İş Durumu
            </span>
          </div>
        </div>
      }
      renderItem={(e: UserWorkListInnerForAdminModel, i) => {
        return <div className="lg:grid-cols-10 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center" key={i} >
          <div className="lg:col-span-1 gap-2 flex items-center">
            <p className="p-sm" >
              {handleJsDate(e.CreatedDateJSTime)}
            </p>
          </div>
          <div className="lg:col-span-2 flex items-center gap-2">
            <p className="text-sm text-blue-400 font-medium underline" onClick={() => { history.push("/pro-profesyonel-detay/" + e.ProId); }}>
              {e.StoreName}
            </p>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <p className="p-sm">
              {e.WorkName}
            </p>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <p className="p-sm" >
              {handleJsDate(e.WorkStartDateJSTime)}
            </p>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <p className="p-sm" >
              {handleJsDate(e.WorkCompleteDateJSTime)}
            </p>
          </div>
          <div className="lg:col-span-3 flex justify-between">
            <div className="text-gray-700 flex gap-1 justify-between items-center">
              {
                (e.Status === WorkStatus.WORK_CANCELED_BY_PRO || e.Status === WorkStatus.WORK_CANCELED_BY_USER) ?
                  <div className="flex items-center text-red-400 font-medium gap-2">
                    <CloseIcon className="icon-sm text-red-400" />
                    <div>Hizmet İptali</div>
                  </div>
                  :
                  e.Status === WorkStatus.WORK_COMPLETED ?
                    <div className="flex items-center text-gray-900 font-medium">
                      <CheckIcon className="icon-sm text-gray-900" />
                      <div>Teslim Edildi</div>
                    </div>
                    :
                    <></>
              }
              <div className="flex gap-2 items-center ml-auto cursor-pointer" onClick={() => { history.push("/hizmet-detay/" + e.WorkId); }}>
                <EyeIcon className="icon-sm text-gray-900" />
                <div className="text-sm text-gray-900">Değerlendirmeyi Gör</div>
                <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all " />
              </div>
            </div>
          </div>
        </div>
      }}
    />
  )
}
