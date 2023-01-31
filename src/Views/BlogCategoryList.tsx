import { FunctionComponent, useContext, useRef, useState } from "react"
import { useHistory } from "react-router-dom"
import { Button } from "../Components/Button"
import { EditIcon, PlusIcon, TrashIcon } from "../Components/Icons"
import { Table } from "../Components/Table"
import ApiService from "../Services/ApiService"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext"

export const BlogCategoryList: FunctionComponent = () => {

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" }
  ];

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const getBlogCategoryList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getBlogCategoryList(page, take, searchText, order);

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


  const handleOpenDeleteModal = async (CategoryId) => {
    context.showModal({
      type: "Question",
      title: "Kategori silmek istiyor musunuz?",
      onClose: () => { context.hideModal(); },
      onClick: async () => { await deleteBlogCategory(CategoryId); return true; }
    });
  }

  const deleteBlogCategory = async (CategoryId) => {
    setProcessLoading(true);

    const _result = await ApiService.deleteBlogCategory(CategoryId);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Kategori silindi.",
        onClose: () => {
          context.hideModal(); setProcessLoading(false);
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
        onClose: () => { context.hideModal(); setProcessLoading(false); }
      });
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Kategori Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Kategori Bulunamadı"}
          getDataFunction={getBlogCategoryList}
          addNewButton={
            <Button isLoading={processLoading} buttonMd textTiny color="text-blue-400" className="w-80" design="button-blue-100" text="Yeni Kategori Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { history.push("/blog-kategori-ekle"); }} />}
          header={<div className=" lg:grid-cols-4 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kategori Sırası
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kategori Adı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Oluşturulma Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-4 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.OrderBy}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.Name}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.CreatedDate}
                </p>
              </div>
              <div className="lg:col-span-1 flex justify-between">
                <p className={`${e.IsEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                  {e.IsEnabled === true ? "Aktif" : "Pasif"}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all"
                    onClick={() => { history.push(`/blog-kategori-duzenle/${e.Id}`); }} />
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleOpenDeleteModal(e.Id); }} />
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
