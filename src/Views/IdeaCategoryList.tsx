import { FunctionComponent, useContext, useRef } from "react"
import { useHistory } from "react-router"
import { Link } from "react-router-dom"

import { ChevronRightIcon, EditIcon, TrashIcon } from "../Components/Icons"
import ApiService from "../Services/ApiService"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext"
import { Table } from "../Components/Table"
import { Image } from "../Components/Image"
import { readPageQueryString } from "../Services/Functions"


export const IdeaCategoryList: FunctionComponent = () => {
  const tableEl = useRef<any>();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" },
  ];

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const getCategoryList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getIdeaCategoryList(page, take, searchText, order);

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

  const handleDeleteCategory = (item) => {
    context.showModal({
      type: "Question",
      title: `Kategori silinmesi durumunda bu kategoriye bağlı olan fikirler pasife alınacaktır. Onaylıyor musunuz ? `,
      onClose: () => { context.hideModal(); },
      onClick: async () => {

        const _result = await ApiService.deleteIdeaCategory(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Kategori silindi.",
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
        return true
      }
    });
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Kategori Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Kategori Bulunamadı"}
          getDataFunction={getCategoryList}
          header={
            <div className=" lg:grid-cols-12 px-2 border-b border-t py-3 border-gray-200 hidden lg:grid gap-4">
              <div className="lg:col-span-2 flex items-center">
                <span className="p-sm-gray-400">
                  Kategori Sırası
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="p-sm-gray-400">
                  Kategori Görseli
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="p-sm-gray-400">
                  Kategori Adı
                </span>
              </div>
              <div className="lg:col-span-4">
                <span className="p-sm-gray-400">
                  Kategori Kodu
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
            return <div className=" lg:grid-cols-12 px-2 border-b py-3.5 border-gray-200 hidden lg:grid flex gap-4 items-center" key={i}>
              <div className="lg:col-span-2 flex items-center">
                <p className="p-sm">
                  {e.Order}
                </p>
              </div>
              <div className="lg:col-span-2 flex items-center">
                <Image src={e.PhotoPath} alt={e.Name} className="w-14 h-14 object-contain" />
              </div>
              <div className="lg:col-span-2 flex items-center">
                <p className="p-sm">
                  {e.Name}
                </p>
              </div>
              <div className="lg:col-span-4 flex items-center">
                <p className="p-sm">
                  {e.Code}
                </p>
              </div>
              <div className="lg:col-span-2 flex items-center justify-between">
                <p className={`${e.IsEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                  {e.IsEnabled === true ? "Aktif" : "Pasif"}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <Link to={{ pathname: `${"/fikir-kategori-detay/" + e.Id}`, state: { isEditActive: true, queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                    <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" />
                  </Link>
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleDeleteCategory(e); }} />
                  <Link to={{ pathname: `${"/fikir-kategori-detay/" + e.Id}`, state: { isEditActive: false, queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
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
