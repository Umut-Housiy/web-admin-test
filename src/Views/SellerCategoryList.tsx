import { FunctionComponent, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon, EditIcon, SubListIcon, TrashIcon } from "../Components/Icons";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Table } from "../Components/Table";
import { Image } from "../Components/Image";
import { readPageQueryString } from "../Services/Functions";

export const SellerCategoryList: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" },
  ]

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  //<<--- Seller Category Functions --->>

  const getSellerCategoryList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerCategoryList(page, take, searchText, order);

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

  const handleShowQuesionModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Kategori Sil",
      message: `${item.CategoryName} isimli kategoriyi silmek istediğinize emin misiniz?`,
      onClick: async () => {

        const _result = await ApiService.removeSellerCategory(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {

          context.showModal({
            type: "Success",
            title: "Kategori başarıyla silindi",
            onClose: () => {
              context.hideModal();
              if (tableEl.current) {
                tableEl.current?.reload();
              }
            }
          });
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => { context.hideModal(); }
          });
        }
        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="pb-5">Kategori Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Kategori Bulunamadı"}
          getDataFunction={getSellerCategoryList}
          header={
            <div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4 flex items-center">
              <div className="lg:col-span-2 flex items-center">
                <span className="p-sm-gray-400">
                  Kategori Görseli
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="p-sm-gray-400">
                  Kategori Adı
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="p-sm-gray-400">
                  Kategori Kodu
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="p-sm-gray-400">
                  Üst Kategori
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="p-sm-gray-400">
                  Kategori Sırası
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="p-sm-gray-400">
                  Komisyonu
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="p-sm-gray-400">
                  Durum
                </span>
              </div>
            </div>
          }
          renderItem={(e, i) => {
            return <div className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center" key={i} >
              <div className="lg:col-span-2 flex items-center">
                <Image src={e.PhotoPath} alt={e.CategoryName} className="w-14 h-14 object-contain" />
              </div>
              <div className="lg:col-span-2  flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Adı: </span>
                <p className="p-sm">
                  {e.CategoryName}
                </p>
              </div>
              <div className="lg:col-span-2  flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Kodu: </span>
                <p className="p-sm">
                  {e.CategoryCode}
                </p>
              </div>
              <div className="lg:col-span-2  flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Üst Kategori: </span>
                <p className="p-sm">
                  {e.ParentName ? e.ParentName : "-"}
                </p>
              </div>
              <div className="lg:col-span-1  flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Sırası: </span>
                <p className="p-sm">
                  {e.CategoryOrder}
                </p>
              </div>
              <div className="lg:col-span-1  flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2"> Komisyonu: </span>
                <p className="p-sm">
                  %{e.CommissionPercentage}
                </p>
              </div>
              <div className="lg:col-span-2 flex justify-between">
                <div className="flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Durum: </span>
                  <p className={`${e.CategoryStatus === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                    {e.CategoryStatus === true ? "Aktif" : "Pasif"}
                  </p>
                </div>
                <div className="text-gray-700 flex gap-2 items-center">
                  <Link to={{ pathname: `${"satici-alt-kategori-listesi/" + e.Id}`, state: { prevTitle: "Satıcı Kategori Listesi", prevPath: window.location.pathname } }} >
                    <SubListIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all  mx-1" />
                  </Link>
                  <Link to={{ pathname: `${"/satici-kategori-bilgileri-detay/" + e.Id}`, state: { isEditActive: true, queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                    <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" />
                  </Link>
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => handleShowQuesionModal(e)} />
                  <Link to={{ pathname: `${"/satici-kategori-bilgileri-detay/" + e.Id}`, state: { isEditActive: false, queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
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
