import React, { FunctionComponent, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";

import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Image } from "../Components/Image"
import { EditIcon, PlusIcon, TrashIcon } from "../Components/Icons";
import { Button } from "../Components/Button";


export const HelpGroupList: FunctionComponent = () => {
  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" }
  ];

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const history = useHistory();

  const getHelpGroupList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getHelpGroupList(page, take, searchText, order);

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

  const showDeleteModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Grup Sil",
      message: `${item.Title} isimli grubu silmek istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.deleteHelpGroup(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Grup başarıyla silindi",
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
        <h2 className="mb-5">Yardım Grup Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Grup Bulunamadı"}
          getDataFunction={getHelpGroupList}
          addNewButton={
            <Button buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni Grup Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { history.push("/yardim-grubu-olustur") }} />}
          header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2 flex items-center">
              <span className="p-sm-gray-400">
                Grup Sırası
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Grup Görseli
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Grup Adı
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Oluşturulma Tarihi
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
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Grup Sırası:</span>
                <p className="p-sm">
                  {e.OrderBy}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Grup Resmi:</span>

                <Image src={e.PhotoUrl} alt={e.Title} className="w-14 h-14 object-contain" />
              </div>
              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Grup Adı:</span>
                <p className="p-sm">
                  {e.Title}
                </p>
              </div>
              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Oluşturulma Tarihi:</span>
                <p className="p-sm">
                  {e.CreatedDate}
                </p>
              </div>
              <div className="lg:col-span-2 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Durum: </span>
                  <p className={`${e.IsEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                    {e.IsEnabled === true ? "Aktif" : "Pasif"}
                  </p>
                </div>
                <div className="text-gray-700 flex gap-2 items-center">
                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all"
                    onClick={() => { history.push(`/yardim-grubu-detay/${e.Id}`) }} />
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => showDeleteModal(e)} />

                </div>
              </div>
            </div>
          }}
          sortOptions={sortOptions}
        />
      </div>
    </div>
  )
}
