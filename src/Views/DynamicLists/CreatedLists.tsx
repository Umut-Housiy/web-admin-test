import { FunctionComponent, useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "../../Components/Button";
import { ChevronRightIcon, EditIcon, PlusIcon, TrashIcon } from "../../Components/Icons";
import { InfoBoxWithOverlay } from "../../Components/InfoBoxWithOverlay";
import { Table } from "../../Components/Table";
import ApiService from "../../Services/ApiService";
import { readPageQueryString } from "../../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";

export const CreatedLists: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const history = useHistory();

  const listTypes = [
    { key: "1", value: "Ürün" },
    { key: "2", value: "Kategori (Ürün)" },
    { key: "3", value: "Profesyonel" },
    { key: "4", value: "Kategori (Profesyonel)" },
    { key: "5", value: "Fikir" },
    { key: "9", value: "Kategori (Fikir)" },
    { key: "6", value: "Ürün-Fikir" },
    { key: "7", value: "Blog" },
    { key: "8", value: "Blok Görsel" },
    { key: "10", value: "İçerik" }
  ]

  const shownTypes = [
    { key: "1", value: "Tip 1" },
    { key: "2", value: "Tip 2" },
    { key: "3", value: "Tip 3" },
    { key: "4", value: "Tip 4" },
    { key: "5", value: "Tip 5" },
    { key: "6", value: "Tip 6" },
    { key: "7", value: "Tip 7" },
    { key: "8", value: "Tip 8" },
    { key: "9", value: "Tip 9" },
    { key: "10", value: "Tip 10" },
    { key: "11", value: "Tip 11" },
    { key: "12", value: "Tip 12" },
    { key: "13", value: "Tip 13" },
    { key: "14", value: "Tip 14" },
    { key: "15", value: "Tip 15" }

  ]

  const getDynamicListForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getDynamicListForAdmin(page, take, searchText, order);

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
      title: "Listeyi Sil",
      message: `${item.Title} isimli listeyi silmek istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.deleteDynamicList(item.DynamicListId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Liste başarıyla silindi",
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
        <h2 className="mb-5">Oluşturulan Listeler</h2>
        <Table
          ref={tableEl}
          emptyListText={"Liste Bulunamadı"}
          getDataFunction={getDynamicListForAdmin}
          addNewButton={
            <Button buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni İçerik Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { history.push("/yeni-liste-olustur") }} />}
          header={<div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Liste Türü
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Başlık
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Gösterim Tipi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                İçerik Sayısı
              </span>
            </div>
            <div className="lg:col-span-1">
              <div className="flex items-center">
                <span className="p-sm-gray-400 inline-block mr-2">
                  Gösterim Alanı Sayısı
                </span>
                <InfoBoxWithOverlay text="Bu listenin kaç farklı yerleşim yerinde kullanıldığını gösterir." />
              </div>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-8 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center">
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Liste Türü:</span>
                <p className="p-sm">
                  {listTypes.find(i => i.key === String(e.Type))?.value ?? "-"}
                </p>
              </div>
              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Başlık:</span>
                <p className="p-sm">
                  {e.Title === "" ? "-" : e.Title}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Gösterim Tipi:</span>
                <p className="p-sm">
                  {shownTypes.find(i => i.key === String(e.ShownType))?.value ?? "-"}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">İçerik Sayısı:</span>
                <p className="p-sm">
                  {e.ContentCount}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Gösterim Alanı Sayısı:</span>
                <p className="p-sm">
                  {e.PlacementCount}
                </p>
              </div>
              <div className="lg:col-span-1 flex justify-between items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">İşlemler: </span>
                <div className="text-gray-700 flex gap-2 items-center ml-auto">
                  <Link to={{ pathname: `/liste-duzenle/${e.DynamicListId}`, state: { queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                    <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" />
                  </Link>

                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => showDeleteModal(e)} />
                  <Link to={{ pathname: `/liste-detay/${e.DynamicListId}`, state: { queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                    <ChevronRightIcon className="icon-md text-gray-700 border-l cursor-pointer" />
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
