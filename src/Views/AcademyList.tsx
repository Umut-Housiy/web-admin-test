import { FunctionComponent, useContext, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ApiService from "../Services/ApiService";
import { Image } from "../Components/Image"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Table } from "../Components/Table";
import { Button } from "../Components/Button";
import { ChevronRightIcon, EditIcon, PlusIcon, TrashIcon } from "../Components/Icons";
import { readPageQueryString } from "../Services/Functions";

export const AcademyList: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" }
  ];

  const getAcademyList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getAcademyList(page, take, searchText, order);

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
      title: "İçerik silinecek. Emin misiniz?",
      onClick: async () => {
        context.hideModal();
        setProcessLoading(true);

        const _result = await ApiService.deleteAcademy(item.Id);

        setProcessLoading(false);

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "İçerik silindi",
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
        <h2 className="mb-5">Eğitim Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Eğitim Bulunamadı"}
          getDataFunction={getAcademyList}
          addNewButton={
            <Button isLoading={processLoading} buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni İçerik Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { history.push("/akademi-ekle") }} />}
          header={<div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Görüntüleme Sırası
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kapak Görseli
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Eğitim Adı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kategori
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Eğitim İçeriği
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Oluşturulma Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Gösterim Alanı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-8 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.OrderBy}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <Image src={e.PhotoUrl} alt={e.Title} className="w-14 h-14 object-cover" />
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.Title}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.CategoryName}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.AcademyTypeStr}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.CreatedDate}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.CategoryTypeStr}
                </p>
              </div>
              <div className="lg:col-span-1 flex justify-between">
                <p className={`${e.IsEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                  {e.IsEnabled === true ? "Aktif" : "Pasif"}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { history.push(`/akademi-duzenle/${e.Id}`); }} />
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { showDeleteModal(e); }} />
                  <Link to={{ pathname: `/akademi-detay/${e.Id}`, state: { queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
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
