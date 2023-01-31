import { FunctionComponent, useContext, useRef } from "react";
import { EyeIcon } from "../Components/Icons";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Image } from "../Components/Image";
import { Link } from "react-router-dom";

export const ProductQuestionList: FunctionComponent = () => {

  const sortOptions = [
    { key: "1", value: "Soyu Sayısı Artan" },
    { key: "2", value: "Cevaplanmamış Soru Sayısı Artan" }
  ];

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const getProductQuestionList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProductQuestion(page, take, order, searchText);

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
        <h2 className="pb-5">Ürün Soru & Cevapları</h2>
        <Table
          ref={tableEl}
          emptyListText={"Soru Bulunamadı"}
          getDataFunction={getProductQuestionList}
          header={<div className="lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-3 flex items-center">
              <span className="p-sm-gray-400">
                Ürün Adı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Barkod No
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Model No
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Kategori
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Toplam Soru Sayısı
              </span>
            </div>
            <div className="lg:col-span-2 flex items-center">
              <span className="p-sm-gray-400">
                Onay Bekleyen Yanıt Sayısı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                İşlemler
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-11 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid gap-4 items-center">
              <div className="lg:col-span-3 flex items-center">
                <Image src={e.MainPhoto} alt={e.ProductName} className="w-14 h-14 object-contain mr-2" />
                <p className="p-sm">{e.ProductName}</p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="p-sm">
                  {e.BarcodeNo}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="p-sm">
                  {e.ModelNo}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="p-sm overlfow-auto custom-scrollbar">
                  {e.Category}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="p-sm">
                  {e.QuestionCount}
                </p>
              </div>
              <div className="lg:col-span-2 flex items-center">
                <p className="p-sm">
                  {e.WaitingApprovalQuestionCount}
                </p>
              </div>
              <div className="lg:col-span-2 flex items-center">
                <Link to={{ pathname: `${"/urun-detay/" + e.ProductId}`, state: { tabId: 4 } }} className="flex items-center text-sm text-black-400">
                  <EyeIcon className="icon-md mr-2" />
                  Soru & Cevapları Gör
                </Link>
              </div>
            </div>
          }}
          sortOptions={sortOptions}
        />
      </div>
    </div>
  )
}
