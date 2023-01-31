import { FunctionComponent, useContext, useRef } from "react"
import { useHistory } from "react-router-dom";
import ApiService from "../Services/ApiService";
import { Image } from "../Components/Image"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Table } from "../Components/Table";
import { Button } from "../Components/Button";
import { EditIcon, PlusIcon, TrashIcon } from "../Components/Icons";

export const BlogList: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const getBlogList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getBlogList(page, take, searchText, order);

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
      title: "Blog Sil",
      message: "Blog silinecek. Emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.deleteBlog(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Blog silindi.",
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
        <h2 className="mb-5">Blog Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Blog Bulunamadı"}
          getDataFunction={getBlogList}
          addNewButton={
            <Button buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni Blog Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { history.push("/blog-ekle") }} />}
          header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2 flex items-center">
              <span className="p-sm-gray-400">
                Kapak Görseli
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Blog Adı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Kategori
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Blog Yazarı
              </span>
            </div>
            <div className="lg:col-span-2">
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
            return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-2 flex items-center">
                <Image src={e.PhotoUrl} alt={e.CategoryName} className="w-14 h-14 object-cover" />
              </div>
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {e.Title}
                </p>
              </div>
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {e.CategoryName}
                </p>
              </div>
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {e.AuthorName ?? "-"}
                </p>
              </div>
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {e.CreatedDate}
                </p>
              </div>
              <div className="lg:col-span-2 flex justify-between">
                <p className={`${e.IsEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                  {e.IsEnabled === true ? "Aktif" : "Pasif"}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all"
                    onClick={() => { history.push(`/blog-duzenle/${e.Id}`); }} />
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { showDeleteModal(e); }} />
                </div>
              </div>
            </div>
          }}
        />
      </div>
    </div>
  )
}
