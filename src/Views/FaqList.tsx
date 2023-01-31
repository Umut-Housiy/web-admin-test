import { FunctionComponent, useContext, useRef } from "react"
import { useHistory } from "react-router";
import { Button } from "../Components/Button";
import { EditIcon, PlusIcon, TrashIcon } from "../Components/Icons";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const FaqList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" }
  ];

  const getFaqList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getFaqList(page, take, searchText, order);

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

  const deleteFaq = (item) => {
    context.showModal({
      type: "Question",
      title: "Soru Sil",
      message: "Soru silinecek. Emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.deleteFaq(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Soru silindi.",
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
        <h2 className="mb-5">S.S.S. Yönetimi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Soru Bulunamadı"}
          getDataFunction={getFaqList}
          addNewButton={
            <Button buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni Soru Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { history.push("/sss-duzenle") }} />}
          header={<div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Gösterim Sırası
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Soru
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-7 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.OrderBy}
                </p>
              </div>
              <div className="lg:col-span-3">
                <p className="p-sm">
                  {e.Question}
                </p>
              </div>
              <div className="lg:col-span-3 flex justify-between">
                <p className={`text-sm font-medium ${e.IsEnabled ? "text-green-400" : "text-red-400"}`}>
                  {e.IsEnabled ? "Aktif" : "Pasif"}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { history.push(`/sss-duzenle/${e.Id}`); }} />
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { deleteFaq(e); }} />
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
