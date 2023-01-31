import { FunctionComponent, useContext, useRef } from "react"
import { useHistory } from "react-router-dom";

import { ChevronRightIcon } from "../Components/Icons";
import { Table } from "../Components/Table"
import ApiService from "../Services/ApiService";
import { formatter, fraction } from "../Services/Functions";

export const ListSponsorPrices: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const history = useHistory();

  const getListSponsorPriceList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getListSponsorPriceList(page, take, searchText, order);

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


  const priceFormatter = (price) => {
    return price % 1 === 0 ?
      <>{fraction.format(price)} TL </>
      :
      <>{formatter.format(price)} TL</>

  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Sponsorluk Ücret Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Fiyat Bulunamadı"}
          getDataFunction={getListSponsorPriceList}
          header={<div className=" lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2 flex items-center">
              <span className="p-sm-gray-400">
                Reklam Türü
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Liste Türü
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Liste Başlığı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                1 günlük ücret
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                3 günlük ücret
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                7 günlük ücret
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                14 günlük ücret
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-11 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center">
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Reklam Türü:</span>
                <p className="p-sm">
                  {e.AdType === "" ? "-" : e.AdType}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Liste Türü:</span>
                <p className="p-sm">
                  {e.ListType === "" ? "-" : e.ListType}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Liste Başlığı:</span>
                <p className="p-sm">
                  {e.ListName === "" ? "-" : e.ListName}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">1 günlük ücret:</span>
                <p className="p-sm">
                  {e.OneDayPrice === "" ? "-" : priceFormatter(e.OneDayPrice)}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">3 günlük ücret:</span>
                <p className="p-sm">
                  {e.ThreeDayPrice === "" ? "-" : priceFormatter(e.ThreeDayPrice)}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">7 günlük ücret:</span>
                <p className="p-sm">
                  {e.SevenDayPrice === "" ? "-" : priceFormatter(e.SevenDayPrice)}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">14 günlük ücret:</span>
                <p className="p-sm">
                  {e.FourteenDayPrice === "" ? "-" : priceFormatter(e.FourteenDayPrice)}
                </p>
              </div>
              <div className="lg:col-span-1 flex justify-between items-center">
                <div className="text-gray-700 flex gap-2 items-center">

                  <ChevronRightIcon className="icon-md hover:text-blue-400 cursor-pointer transition-all " onClick={() =>
                    history.push(`/liste-duzenle/${e.ListId}`)} />

                </div>
              </div>
            </div>
          }}
        />
      </div>
    </div>
  )
}
