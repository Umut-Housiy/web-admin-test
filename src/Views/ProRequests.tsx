import { FunctionComponent, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { CountDown } from "../Components/CountDown";
import { ChevronRightIcon } from "../Components/Icons";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { readPageQueryString } from "../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const ProRequests: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const getProRequestList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProRequestList(page, take, searchText, order);

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
        <h2 className="mb-5">Talepler</h2>
        <Table
          ref={tableEl}
          emptyListText={"Talep Bulunamadı"}
          getDataFunction={getProRequestList}
          header={< div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2 flex items-center">
              <span className="p-sm-gray-400">
                Müşteri Bilgisi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Profesyonel Bilgisi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Talep Tarihi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                İş Tanımı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Teklif için kalan süre
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Talep Durumu
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div className="lg:grid-cols-12 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0" key={i} >
              <div className="lg:col-span-2 flex items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Müşteri Bilgisi: </span>
                <p className="p-sm">
                  {e.ClientName}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Profesyonel Bilgisi: </span>
                <Link to={`/pro-profesyonel-detay/${e.ProId}`} className="text-sm text-blue-400 underline font-medium">
                  {e.StoreName}
                </Link>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Talep Tarihi: </span>
                <p className="p-sm">
                  {e.CreatedDate}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2"> İş Tanımı: </span>
                <p className="p-sm">
                  {e.CategoryName}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2"> Teklif için kalan süre: </span>
                {(e.Statue === 1) ?
                  <CountDown fullRemaingTime startDate={-1} endDate={e.RemainingOfferDateJS} />
                  :
                  "-"
                }
              </div>
              <div className="lg:col-span-2 flex items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Talep Durumu: </span>
                {
                  (e.Statue === 1 && Date.now() > e.RemainingOfferDateJS) ?
                    <div className="bg-gray-100 text-gray-900 py-1 w-32 text-center rounded-full text-sm font-medium">
                      Teklif Süresi Doldu
                    </div>
                    :
                    <div className={`${e.Statue === 1 ? "bg-yellow-100 text-yellow-600" : e.Statue === 3 ? "bg-green-100 text-green-400" : e.Statue === 2 ? "bg-gray-100 text-gray-900" : e.Statue === 4 && "bg-red-100 text-red-400"} py-1 w-32 text-center rounded-full text-sm font-medium`}>
                      {e.Statue === 1 ? "Teklif Bekliyor" : e.Statue === 3 ? "Teklif Oluşturuldu" : e.Statue === 2 ? "Talep Reddedildi" : e.Statue === 4 && "Talep İptal Edildi"}
                    </div>
                }
                <Link className="ml-auto" to={{ pathname: `/pro-talep-detay/${e.Id}`, state: { queryPage: Number(readPageQueryString(window.location) ?? "1") } }}>
                  <ChevronRightIcon className="icon-md text-gray-700" />
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
