import { FunctionComponent, useRef } from "react"
import { Table } from "../Components/Table";
import { Image } from "../Components/Image";
import { EyeIcon } from "../Components/Icons";
import { RateStars } from "../Components/RateStars";
import ApiService from "../Services/ApiService";
import { Link } from "react-router-dom";

export const ProductEvaluationList: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const getEvaluationList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getEvaluationList(page, take, searchText, order);

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
        <h2 className="mb-5">Ürün Değerlendirmeleri</h2>
        <Table
          ref={tableEl}
          emptyListText={"Değerlendirme Bulunamadı"}
          getDataFunction={getEvaluationList}
          header={
            <div className=" lg:grid-cols-11 px-2 border-b border-t py-6 border-gray-200 hidden lg:grid gap-4 flex items-center">
              <div className="lg:col-span-2 flex items-center">
                <span className="p-sm-gray-400">
                  Ürün Adı
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="p-sm-gray-400">
                  Barkod No
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="p-sm-gray-400">
                  Kategori
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="p-sm-gray-400">
                  Stok Kodu
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="p-sm-gray-400">
                  Toplam Değerlendirme Sayısı
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="p-sm-gray-400">
                  Ortalama Puan
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="p-sm-gray-400">
                  İşlemler
                </span>
              </div>
            </div>
          }
          renderItem={(e, i) => {
            return (
              <div key={"list" + i} className="lg:grid-cols-11 px-2 border-b  border-gray-200 grid gap-4 items-center py-3 ">
                <div className="lg:col-span-2 flex gap-2 items-center">
                  <Image src={e.ProductMainPhoto} alt={e.ProductName} className="h-12 w-12 mr-2 object-contain" ></Image>
                  <p className="p-sm">
                    {e.ProductName}
                  </p>
                </div>
                <div className="lg:col-span-1 flex items-center">
                  <p className="p-sm">
                    {e.BarcodeNo}
                  </p>
                </div>
                <div className="lg:col-span-1 flex lg:block items-center">
                  <p className="p-sm">
                    {e.ProductCategory}
                  </p>
                </div>
                <div className="lg:col-span-1 flex lg:block items-center">
                  <p className="p-sm">
                    {e.StockCode ?? "-"}
                  </p>
                </div>
                <div className="lg:col-span-2 flex lg:block items-center">
                  <p className="p-sm">
                    {e.EvaluateCount}
                  </p>
                </div>
                <div className="lg:col-span-2 flex lg:block items-center ">
                  <div>
                    <RateStars className="icon-sm text-yellow-600 mr-1" rateValue={e.AdvertRate} />
                  </div>
                </div>
                <div className="lg:col-span-2  flex lg:items-center flex-col lg:flex-row">
                  <Link to={{ pathname: `${"/urun-detay/" + e.ProductId}`, state: { tabId: 3 } }} className="flex items-center gap-2 w-full cursor-pointer">
                    <EyeIcon className="icon-md text-gray-700 cursor-pointer" />
                    <div className="p-sm">Değerlendirmeleri Gör</div>
                  </Link>
                </div>
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}
