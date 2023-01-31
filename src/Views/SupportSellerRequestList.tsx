import { FunctionComponent, useContext, useRef, useState } from "react"
import { Link } from "react-router-dom";
import { Button } from "../Components/Button";
import { EyeIcon, TrashIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Modal } from "../Components/Modal";
import { Table } from "../Components/Table";
import { SupportRequestModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const SupportSellerRequestList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const getSupportRequestList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSupportRequestList(page, take, searchText, order, 3);

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

  const handleJsTime = (JsTime) => {
    var time = new Date(JsTime);
    return time.toLocaleString() ?? "-";
  }


  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);

  const [selectedSupport, setSelectedSupport] = useState<SupportRequestModel>({
    Id: 0,
    CreatedDate: 0,
    Subject: "",
    Name: "",
    Email: "",
    Description: "",
    Type: 0,
    StoreId: 0
  });

  const handleShowSupportDeleteModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Destek talebini sil",
      message: `${item.Name} isimli satıcıya ait destek talebini silmek istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.removeSupportRequest(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Destek talebi silindi",
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

  const showModal = (item) => {
    setShowSupportModal(true);
    setSelectedSupport(item)
  }

  const clearData = () => {
    setSelectedSupport(
      {
        Id: 0,
        CreatedDate: 0,
        Subject: "",
        Name: "",
        Email: "",
        Description: "",
        Type: 0,
        StoreId: 0
      }
    );
    setShowSupportModal(false);
  }
  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Satıcı Destek Talepleri</h2>
        <Table
          ref={tableEl}
          emptyListText={"Talep Bulunamadı"}
          getDataFunction={getSupportRequestList}
          header={<div className=" lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Tarih
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Satıcı Adı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                E-posta
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Konu
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Mesaj
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                İşlemler
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-11 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {handleJsTime(e.CreatedDate)}
                </p>
              </div>
              <div className="lg:col-span-2">
                <Link to={{ pathname: `/satici-detay/${e.StoreId}`, state: { prevTitle: "Satıcı Destek Talepleri", prevPath: window.location.pathname, tabId: 1 } }}>
                  <p className="text-sm font-medium underline text-blue-400">
                    {e.Name}
                  </p>
                </Link>
              </div>
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {e.Email}
                </p>
              </div>
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {e.Subject}
                </p>
              </div>
              <div className="lg:col-span-3">
                <p className="p-sm line-clamp-1">
                  {e.Description}
                </p>
              </div>
              <div className="lg:col-span-1 text-gray-700 flex items-center gap-x-2">
                <EyeIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all"
                  onClick={() => { showModal(e); }} />
                <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleShowSupportDeleteModal(e) }} />
              </div>
            </div>
          }}
        />
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showSupportModal}
        onClose={() => { clearData(); }}
        title="Destek talep detayı"
        body=
        {
          <>
            <Label title="Konu" isRequired withoutDots />
            <p className="form-input bg-gray-100 border-gray-200 pointer-events-none">{selectedSupport.Subject}</p>

            <Label title="Mesaj" isRequired withoutDots className="mt-4" />
            <p className="p-3 h-32 bg-gray-100  max-h-32 overflow-auto  custom-scrollbar border pointer-events-noe rounded-lg text-sm">{selectedSupport.Description}</p>
          </>
        }
        footer={
          <Button text="Kapat" design="bg-blue-400 w-full text-white mt-4" onClick={() => clearData()} />
        }
      />
    </div>
  )
}
