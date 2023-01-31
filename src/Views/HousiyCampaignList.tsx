import { FunctionComponent, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "../Components/Button";
import { CountDown } from "../Components/CountDown";
import { DateView } from "../Components/DateView";
import { ChevronRightIcon, NewTabIcon, PlusIcon } from "../Components/Icons";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { CampaignStatusText } from "../Components/CampaignStatusText";
import { SITE_URLS } from "../Services/Constants";
import { readPageQueryString } from "../Services/Functions";

export const HousiyCampaignList: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const history = useHistory();

  const getHousiyCampaignList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getHousiyCampaignList(page, take, searchText, order);

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
        <h2 className="mb-5">Kampanya Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Kampanya Bulunamadı"}
          getDataFunction={getHousiyCampaignList}
          addNewButton={
            <Button buttonMd textTiny color="text-blue-400" className="w-96" design="button-blue-100" text="Yeni Kampanya Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { history.push("/housiy-kampanyasi-ekle") }} />}
          header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-3 flex items-center">
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
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Kampanya Adı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kalan Süre
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Komisyon İndrimi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kampanya Türü: </span>
                <p className="p-sm">
                  {e.CampaignType}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2"> Başlangıç Tarihi:</span>
                <DateView className="text-sm font-medium" dateNumber={e.StartDateJSTime} pattern="dd/MM/yyyy" />
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Bitiş Tarihi: </span>
                <DateView className="text-sm font-medium" dateNumber={e.EndDateJSTime} pattern="dd/MM/yyyy" />
              </div>
              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kampanya Adı:</span>
                <p className="p-sm">
                  {e.CampaignName}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kalan Süre: </span>
                <CountDown startDate={e.StartDateJSTime} endDate={e.EndDateJSTime} />
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Komisyon İndrimi: </span>
                <p className="p-sm">
                  %{e.DiscountCommissionPercentage}
                </p>
              </div>
              <div className="lg:col-span-2 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Durum: </span>
                  {e.Status === false ? <span className="text-sm font-medium text-gray-700">Pasif</span>
                    :
                    <CampaignStatusText startDate={e.StartDateJSTime} endDate={e.EndDateJSTime} />
                  }
                </div>
                <div className="ml-auto flex items-center divide-x">
                  <a className="pr-3" target="_blank" href={`${SITE_URLS.SITE_URL}/kampanya/${e.CampaignSeoUrl ?? ""}`} >
                    <NewTabIcon className="icon-sm text-blue-400" />
                  </a>
                  <Link to={{ pathname: `/housiy-kampanyasi-detayi/${e.CampaignId}`, state: { queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                    <ChevronRightIcon className="icon-md cursor-pointer" />
                  </Link>
                </div>
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
