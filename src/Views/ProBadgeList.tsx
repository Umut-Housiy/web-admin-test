import React, { FunctionComponent, useContext, useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom";
import { ChevronRightIcon, EditIcon, TrashIcon } from "../Components/Icons";
import { Table } from "../Components/Table"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import ApiService from "../Services/ApiService";
import { Image } from "../Components/Image";
import { readPageQueryString } from "../Services/Functions";

export const ProBadgeList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const getBadgeList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getBadgeList(page, take, searchText, order);

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
      title: "Rozet Sil",
      message: "Rozet silinecek. Emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.deleteBadge(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Rozet silindi.",
            onClose: () => { context.hideModal(); }
          });
          if (tableEl.current) {
            tableEl.current?.reload();
          }
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
        <h2 className="mb-5">Rozet Listesi</h2>
        <Table
          ref={tableEl}
          key={"1"}
          emptyListText={"Kategori Bulunamadı"}
          getDataFunction={getBadgeList}
          header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Rozet Görseli
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Rozet Adı
              </span>
            </div>
            <div className="lg:col-span-4">
              <span className="p-sm-gray-400">
                Rozet Açıklaması
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Atanmış Profesyonel Sayısı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div className=" lg:grid-cols-12 px-2 border-b border-t min-h-20 py-5 border-gray-200 hidden lg:grid gap-4" key={i}>
              <div className="lg:col-span-1 flex items-center">
                <span className="p-sm-gray-400">
                  <Image src={e.PhotoUrl} alt={e.Name} className="w-14 h-14 object-contain" />
                </span>
              </div>
              <div className="lg:col-span-2 flex items-center">
                <span className="p-sm">
                  {e.Name}
                </span>
              </div>
              <div className="lg:col-span-4 flex items-center">
                <span className="p-sm">
                  {e.Description}
                </span>
              </div>
              <div className="lg:col-span-3 flex items-center">
                <span className="p-sm ">
                  {e.ProCount}
                </span>
              </div>
              <div className="lg:col-span-2 flex justify-between ">
                <p className={`${e.IsEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm my-auto`}>
                  {e.IsEnabled === true ? "Aktif" : "Pasif"}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <Link to={{ pathname: `${"/pro-rozet-detay/" + e.Id}`, state: { isEditActive: true, queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                    <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" />
                  </Link>
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { showDeleteModal(e); }} />
                  <Link to={{ pathname: `${"/pro-rozet-detay/" + e.Id}`, state: { isEditActive: false, queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                    <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" />
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
