import { FunctionComponent, useContext, useRef, useState } from "react";
import { Button } from "../Components/Button";
import { Table } from "../Components/Table";
import { EditIcon, PlusIcon, TrashIcon } from "../Components/Icons";
import { Image } from "../Components/Image";
import { useHistory } from "react-router-dom";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import ApiService from "../Services/ApiService";

export const GeneralSellerContent: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const getAboutContentList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getAboutContentList(page, take, searchText, order, 6);

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

  const removeGeneralContent = (ContentId) => {
    context.showModal({
      type: "Question",
      title: "İçerik Sil",
      message: "Seçili içerik silinecek. Emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.removeGeneralContent(ContentId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "İçerik başarıyla silindi",
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
        <h2 className="mb-5">Hakkımızda İçeriği</h2>
        <Table
          ref={tableEl}
          emptyListText={"İçerik Bulunamadı"}
          getDataFunction={getAboutContentList}
          addNewButton={
            <Button buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni İçerik Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { history.push("/genel-satici-icerik-duzenle"); }} />}
          header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2 flex items-center">
              <span className="p-sm-gray-400">
                Görüntüleme Sırası
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Icon
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Ana Görsel
              </span>
            </div>
            <div className="lg:col-span-4">
              <span className="p-sm-gray-400">
                Ana Başlık
              </span>
            </div>
            <div className="lg:col-span-4">
              <span className="p-sm-gray-400">
                Alt Başlık
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {e.OrderBy}
                </p>
              </div>
              <div className="lg:col-span-1">
                <Image src={e.IconUrl} className="w-12 h-12 object-cover " />
              </div>
              <div className="lg:col-span-1">
                <Image src={e.PhotoUrl} className="w-12 h-12 object-cover " />
              </div>
              <div className="lg:col-span-4">
                <p className="p-sm">
                  {e.Title}
                </p>
              </div>
              <div className="lg:col-span-4 flex justify-between">
                <p className="p-sm">
                  {e.SubTitle}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { history.push(`/genel-satici-icerik-duzenle/${e.Id}`); }} />
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { removeGeneralContent(e.Id); }} />
                </div>
              </div>
            </div>
          }}
        />
      </div>
    </div>
  )
}
