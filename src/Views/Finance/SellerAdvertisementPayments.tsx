import { FunctionComponent, useRef } from "react"
import { Link } from "react-router-dom";
import { DateView } from "../../Components/DateView";
import { Table } from "../../Components/Table"
import { fraction } from "../../Models";
import ApiService from "../../Services/ApiService";
import { formatter } from "../../Services/Functions";

export const SellerAdvertisementPayments: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Toplam Fiyat Artan" },
    { key: "4", value: "Toplam Fiyat Azalan" }
  ];


  const getSellerWaitingAdvertisementPayments = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerWaitingAdvertisementPayments(page, take, searchText, order);

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
        <h2 className="mb-5">
          Satıcı Reklam Ödemeleri
        </h2>
        <Table
          ref={tableEl}
          emptyListText={"Ödeme Bulunamadı"}
          getDataFunction={getSellerWaitingAdvertisementPayments}
          header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Reklam ID
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Satıcı Bilgisi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Reklam Türü
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Reklam Süresi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Ürün Sayısı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Ödeme Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Toplam Tutar
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                İşlemler
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Reklam ID:</span>
                <p className="p-sm">
                  {e.AdvretiseId}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Satıcı Bilgisi:</span>
                <Link to={`/satici-detay/${e.SellerId}`} className="underline text-blue-400 font-medium text-sm">{e.SellerStoreName}</Link>
              </div>

              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Reklam Türü:</span>
                {/* //#TODO: Finans - Reklam Türleri? */}
                <p className="p-sm">
                  {e.AdvertiseType}
                </p>
              </div>

              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Reklam Süresi:</span>
                <p className="p-sm">
                  {e.AdvertiseDay} gün
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Ürün Sayısı:</span>
                <p className="p-sm">
                  {e.AdvertCount}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Ödeme Tarihi:</span>
                <DateView className="text-sm text-gray-700 mb-1" dateNumber={e.PayedDateJSTime} pattern="dd/MM/yyyy" />
              </div>

              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Toplam Tutar:</span>
                <p className="p-sm">
                  {e.TotalPrice % 1 === 0 ?
                    <>{fraction.format(e.TotalPrice)} TL </>
                    :
                    <>{formatter.format(e.TotalPrice)} TL</>
                  }
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">İşlemler</span>
                {/* //#TODO: Finans - Bu link ne yapacak? Servis Yok 06/10/21 */}
                <p className="text-sm text-blue-400 font-medium underline">
                  İşlemi Faturalandır
                </p>
              </div>
            </div>
          }}
          sortOptions={sortOptions}
        />
      </div>
    </div>
  )
}
