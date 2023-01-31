import { FunctionComponent, useContext, useRef } from "react"
import { useHistory } from "react-router-dom";
import { Table } from "../Components/Table";
import { ProModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Link } from "react-router-dom";
import { ChevronRightIcon, EyeIcon, StarIcon } from "../Components/Icons";
import { readPageQueryString } from "../Services/Functions";

export const ProProfessionalReportList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const getReportedProList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getReportedProList(page, take, searchText, order);

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

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Profesyonel Sorun Bildirimleri</h2>
        <Table
          ref={tableEl}
          emptyListText={"Sorun Bildirimi Bulunamadı"}
          getDataFunction={getReportedProList}
          header={< div className=" lg:grid-cols-5 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Profesyonel Adı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Profesyonel Puanı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Toplam Bildirilme Sayısı
              </span>
            </div>
          </div>}
          renderItem={(e: ProModel, i) => {
            return <div className="lg:grid-cols-5 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center" key={i} >
              <div className="lg:col-span-1 flex items-center">
                <p className="text-sm text-blue-400 font-medium underline cursor-pointer" onClick={() => { history.push("/pro-profesyonel-detay/" + e.Id) }}>
                  {e.StoreName}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:flex items-center">
                <StarIcon className="icon-sm text-yellow-600" />
                <div className="text-yellow-600 text-sm font-medium">{e.StoreRate}</div>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                {
                  e.IsEnabled ?
                    <div className="text-sm text-green-400 font-medium">Aktif</div>
                    :
                    <div className="text-sm text-red-400 font-medium">pasif</div>
                }
              </div>
              <div className="lg:col-span-2 flex items-center text-sm">
                <p className="p-sm">{e.ReportCount}</p>
                <Link className="ml-auto flex items-center gap-1" to={{ pathname: `${"/pro-profesyonel-detay/" + e.Id}`, state: { prevTitle: "Profesyonel Sorun Bildirimleri", prevPath: window.location.pathname, queryPage: Number(readPageQueryString(window.location) ?? "1"), tabId: 13 } }} >
                  <EyeIcon className="icon-sm text-gray-700" />
                  <div>Sorun Bildirimlerini İncele</div>
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
