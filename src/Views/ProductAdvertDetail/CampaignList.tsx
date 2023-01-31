import { FunctionComponent, useContext, useRef } from "react"
import { useHistory } from "react-router-dom";
import { ChevronDownIcon, ChevronRightIcon } from "../../Components/Icons";
import { Table } from "../../Components/Table";
import { ProductCampaignListInnerModel } from "../../Models";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { CountDown } from "../../Components/CountDown";


export interface CampaignListPropModel {
  advertId: number
}

export const CampaignList: FunctionComponent<CampaignListPropModel> = (props: CampaignListPropModel) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const getAdvertCampaignList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getAdvertCampaignList(props.advertId, page, take, searchText, order);

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
      var time = new Date(JsTime);
      return time.toLocaleDateString() ?? "";
    }
    catch {
      return ""
    }
  }

  return (
    <>
      <Table
        ref={tableEl}
        emptyListText={"Kampanya Bulunamadı"}
        getDataFunction={getAdvertCampaignList}
        header={
          <div className=" lg:grid-cols-9 px-2 border-b border-t py-6 border-gray-200 hidden lg:grid gap-4 flex items-center">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Kampanya Tipi
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Kampanya Türü
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Başlangıç Tarihi
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Bitiş Tarihi
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Kalan Süre
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Kampanyalı Satıcı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center gap-1">
              <span className="p-sm-gray-400">
                İndirim Oranı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Komisyon İndirimi
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center gap-1">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
          </div>
        }
        renderItem={(e: ProductCampaignListInnerModel, i) => {
          return (
            <div key={"list" + i} className="lg:grid-cols-9 px-2 border-b  border-gray-200 grid gap-4 items-center py-6 ">
              <div className="lg:col-span-1 flex items-center gap-2">
                <p className="p-sm">
                  {e.CampaignType}
                </p>
              </div>
              <div className="lg:col-span-1 flex gap-2 text-sm font-medium text-yellow-600  items-center">
                <p className="p-sm">
                  {e.CampaignTypeByte === 1 ? "Tekil Ürün Kampanyası"
                    : e.CampaignTypeByte === 2 ? "İlişkili Ürün Kampanyası" :
                      e.CampaignTypeByte === 3 ? "Kasa Önü Kampanyası" :
                        e.CampaignTypeByte === 4 ? "İndirim Kampanyası" :
                          e.CampaignTypeByte === 5 ? "X Al Y Öde Kampanyası" :
                            e.CampaignTypeByte === 6 ? "-" :
                              "-"}
                </p>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="p-sm">
                  {handleJsDate(e.StartDateJSTime)}
                </p>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="p-sm">
                  {handleJsDate(e.EndDateJSTime)}
                </p>
              </div>
              <div className="lg:col-span-1 flex gap-2 items-center">
                <CountDown startDate={e.StartDateJSTime} endDate={e.EndDateJSTime} />
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="text-sm text-blue-400 underline font-medium cursor-pointer" onClick={() => { history.push("/satici-detay/" + e.SellerId); }}>
                  {e.StoreName}
                </p>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="p-sm">
                  {
                    (e.DiscountRate ?? 0) > 0 ?
                      <>%{e.DiscountRate}</>
                      :
                      <>-</>
                  }
                </p>
              </div>
              <div className="lg:col-span-1  items-center">
                <p className="p-sm">
                  {
                    (e.CommissionDiscountRate ?? 0) > 0 ?
                      <>%{e.CommissionDiscountRate}</>
                      :
                      <>-</>
                  }
                </p>
              </div>
              <div className="lg:col-span-1  flex items-center">
                <div className="flex items-center w-full">
                  {
                    e.Status ?
                      <p className="text-sm font-medium text-green-400">Aktif</p>
                      :
                      <p className="text-sm font-medium text-red-400">Pasif</p>
                  }
                  {
                    e.CampaignType === "Satıcı Kampanyası" ?
                      <ChevronRightIcon className="icon-md text-gray-700 ml-auto cursor-pointer" onClick={() => { history.push("/satici-kampanya-detay/" + e.CampaignId); }} />
                      :
                      e.CampaignType === "Housiy Kampanyası" ?
                        <ChevronRightIcon className="icon-md text-gray-700 ml-auto cursor-pointer" onClick={() => { history.push("/housiy-kampanyasi-detayi/" + e.CampaignId); }} />
                        :
                        e.CampaignType === "Yönetim Kampanyası" ?
                          <ChevronRightIcon className="icon-md text-gray-700 ml-auto cursor-pointer" onClick={() => { history.push("/yonetim-kampanyasi-detay/" + e.CampaignId); }} />
                          :
                          <></>
                  }
                </div>
              </div>
            </div>
          )
        }}
      />
    </>
  )
}
