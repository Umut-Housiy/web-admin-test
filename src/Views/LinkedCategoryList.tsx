import { FunctionComponent, useContext, useRef } from "react"
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Image } from "../Components/Image";
import { Link, useHistory } from "react-router-dom";
import { PlusIcon, TrashIcon } from "../Components/Icons";
import { Button } from "../Components/Button";

export const LinkedCategoryList: FunctionComponent = () => {
  const sortOptions = [
    { key: "1", value: "Yeniden Eskiye" },
    { key: "2", value: "Eskiden Yeniye" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" }
  ];

  const tableEl = useRef<any>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const getSellerLinkedCategoriesListForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerLinkedCategoriesListForAdmin(page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount,
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
      title: "Kategori Linkleme Sil",
      message: `${item.SelectedCategoryName} isimli kategoriyi ${item.LinkedCategoryName} kategorisinden çıkarmak istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.removeSellerLinkedCategoryForAdmin(item.RelationId);

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
        <h2 className="mb-5">Kategori Linkleme</h2>
        <Table
          ref={tableEl}
          emptyListText={"Kategori Bulunamadı"}
          getDataFunction={getSellerLinkedCategoriesListForAdmin}
          addNewButton={
            <Button buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni Kategori Linkle" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { history.push('/satici-yeni-kategori-linkle') }} />}
          header={<div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Seçili Kategori
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Bağlandığı Kategori
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Gösterim Sırası
              </span>
            </div>

          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-7 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Seçili Kategori:</span>
                <div className="flex items-center">
                  <Link to={`/satici-kategori-bilgileri-detay/${e.SelectedCategoryId}`}>
                    <Image src={e.SelectedCategoryPhoto} className="min-h-14 min-w-14 max-w-14 max-h-14 object-contain mr-2" />
                  </Link>
                  <p className="p-sm">
                    {e.SelectedCategoryName}
                  </p>
                </div>
              </div>
              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Bağlandığı Kategori:</span>
                <div className="flex items-center">
                  <Link to={`/satici-kategori-bilgileri-detay/${e.LinkedCategoryId}`}>
                    <Image src={e.LinkedCategoryPhoto} className="min-h-14 min-w-14 max-w-14 max-h-14 object-contain mr-2" />
                  </Link>
                  <p className="p-sm">
                    {e.LinkedCategoryName}
                  </p>
                </div>
              </div>
              <div className="lg:col-span-1 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="p-sm-gray-700 lg:hidden mr-2">Gösterim Sırası: </span>
                  <p className="p-sm">
                    {e.CategoryOrder}
                  </p>
                </div>
                <div className="text-gray-700 flex gap-2 items-center">
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
