import { FunctionComponent, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { CampaignStatusText } from "../Components/CampaignStatusText";
import { CountDown } from "../Components/CountDown";
import { DateView } from "../Components/DateView";
import { ChevronRightIcon } from "../Components/Icons";
import { Table } from "../Components/Table"
import ApiService from "../Services/ApiService";
import { formatter, fraction, readPageQueryString } from "../Services/Functions"

export const SellerCampaignList: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const history = useHistory();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Başlangıç Tarihine Göre" },
    { key: "4", value: "Bitiş Tarihine Göre" }
  ];

  const getSellerCampaignList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerCampaignList(page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Satıcı Kampanya Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Kampanya Bulunamadı"}
          getDataFunction={getSellerCampaignList}
          header={<div className=" lg:grid-cols-10 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Mağaza Adı
              </span>
            </div>
            <div className="lg:col-span-2 flex items-center">
              <span className="p-sm-gray-400">
                Kampanya Türü
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Başlangıç Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Bitiş Tarihi
              </span>
            </div>

            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kalan Süre
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                İndirim
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-10 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Mağaza Adı:</span>
                <span className="text-sm text-blue-400 font-medium underline" onClick={() => history.push(`/satici-detay/${e.SellerId}`)}>{e.StoreName}</span>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kampanya Türü:</span>
                <p className="p-sm">
                  {e.CampaignType}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center flex items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Başlangıç Tarihi:</span>
                <DateView className="text-sm font-medium" dateNumber={e.StartDateJSTime} pattern="dd/MM/yyyy" />
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Bitiş Tarihi:</span>
                <DateView className="text-sm font-medium" dateNumber={e.EndDateJSTime} pattern="dd/MM/yyyy" />
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kalan Süre:</span>
                <CountDown startDate={e.StartDateJSTime} endDate={e.EndDateJSTime} />
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Komisyon İndrimi:</span>
                <p className="text-black-400 text-sm font-medium">
                  {
                    e.DiscountType === 1 ?
                      "% " + e.Discount
                      :
                      <>
                        {e.Discount % 1 === 0 ?
                          <>{fraction.format(e.Discount)} TL </>
                          :
                          <>{formatter.format(e.Discount)} TL</>
                        }
                      </>
                  }
                </p>
              </div>
              <div className="lg:col-span-2 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 font-medium lg:hidden mr-2">Durum: </span>
                  {e.Status === false ? <span className="text-sm font-medium text-gray-700">Pasif</span>
                    :
                    <CampaignStatusText startDate={e.StartDateJSTime} endDate={e.EndDateJSTime} />
                  }
                </div>
                <Link to={{ pathname: `/satici-kampanya-detay/${e.CampaignId}`, state: { queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                  <ChevronRightIcon className="icon-md text-gray-700 cursor-pointer" />
                </Link>
              </div>
            </div>
          }}
          sortOptions={sortOptions}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
        />
      </div>
    </div>
  )
}
