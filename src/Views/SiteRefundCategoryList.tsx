import { FunctionComponent, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Image } from "../Components/Image";
import { ChevronRightIcon } from "../Components/Icons";
import { readPageQueryString } from "../Services/Functions";

export const SiteRefundCategoryList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" }
  ];

  const getRefundCategoryList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getRefundCategoryList(page, take, searchText, order);

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
        <h2 className="mb-5">İptal-İade Yönetimi</h2>
        <Table
          ref={tableEl}
          emptyListText={"İçerik Bulunamadı"}
          getDataFunction={getRefundCategoryList}
          header={<div className=" lg:grid-cols-5 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Kategori Görseli
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kategori Adı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kategori Kodu
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Üst Kategori
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                İptal-İade Seçenek Sayısı
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-5 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-1 flex items-center">
                <Image src={e.PhotoPath} alt={e.CategoryName} className="w-14 h-14 object-cover" />
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.CategoryName}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.CategoryCode}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.ParentName}
                </p>
              </div>
              <div className="lg:col-span-1 flex justify-between">
                <p className="p-sm">
                  {e.RefundOptionCount}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <Link to={{ pathname: `/iptal-iade-secenekleri/${e.Id}`, state: { queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                    <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" />
                  </Link>
                </div>
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
