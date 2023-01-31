import React, { FunctionComponent, useContext, useRef } from "react"
import { useHistory } from "react-router"

import { Button } from "../Components/Button"
import { ChevronRightIcon, EditIcon, PlusIcon, TrashIcon } from "../Components/Icons"
import ApiService from "../Services/ApiService"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext"
import { Table } from "../Components/Table"
import { Image } from "../Components/Image"
import { Link } from "react-router-dom"
import { readPageQueryString } from "../Services/Functions"

export const SellerCategoryGroupList: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" },
  ]

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const getSellerCategoryGroupList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerCategoryGroupList(page, take, searchText, order);

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


  const showDeleteModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Kategori sil",
      message: `${item.GroupName} isimli kategori grubunu silmek istediğinize emin misiniz?`,
      onClick: async () => {

        const _result = await ApiService.removeSellerCategoryGroup(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          tableEl.current?.reload();
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
        <h2 className="mb-5">Kategori Grup Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Kategori Bulunamadı"}
          getDataFunction={getSellerCategoryGroupList}
          addNewButton={
            <Button buttonMd textTiny color="text-blue-400" className="mr-3 px-2 w-72" design="button-blue-100" text="Yeni Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { history.push("/satici-kategori-grup-ekle") }} />
          }
          header={
            <div className=" lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
              <div className="lg:col-span-2 flex items-center">
                <span className="p-sm-gray-400">
                  Grup Görseli
                </span>
              </div>
              <div className="lg:col-span-4">
                <span className="p-sm-gray-400">
                  Grup Adı Adı
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="p-sm-gray-400">
                  Kategori Kodu
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="p-sm-gray-400">
                  Gösterim Sırası
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
            return <div className="lg:grid-cols-11 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-2 flex items-center">
                <Image src={e.PhotoPath} alt={e.GroupName} className="w-14 h-14 object-contain" />
              </div>
              <div className="lg:col-span-4">
                <p className="p-sm">
                  {e.GroupName}
                </p>
              </div>
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {e.GroupCode}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.OrderBy}
                </p>
              </div>
              <div className="lg:col-span-2 flex justify-between">
                <p className={`${e.IsActive === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                  {e.IsActive === true ? "Aktif" : "Pasif"}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <Link to={{ pathname: `${"/satici-kategori-grup-detay/" + e.Id}`, state: { isEditActive: true, queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                    <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" />
                  </Link>
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => showDeleteModal(e)} />
                  <Link to={{ pathname: `${"/satici-kategori-grup-detay/" + e.Id}`, state: { isEditActive: false, queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
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
