import { FunctionComponent, useRef, useContext, useState } from "react";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { Image } from "../Components/Image";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { AlertIcon, InfoIcon, TrashIcon } from "../Components/Icons";
import { Modal } from "../Components/Modal";
import { readPageQueryString } from "../Services/Functions";
import { DateView } from "../Components/DateView";

export const ReportedProductList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Fiyata göre azalan" },
    { key: "4", value: "Fiyata göre artan" }
  ];

  const [showModal, setShowModal] = useState<boolean>(false);

  const [reportTitle, setReportTitle] = useState<string>("");

  const [reportReason, setReportReason] = useState<string>("");

  const getReportedProductList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getReportedProductList(page, take, searchText, order);

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

  const handleOpenReportModal = (reportTitle: string, reportReason: string) => {
    setReportTitle(reportTitle);
    setReportReason(reportReason);
    setShowModal(true);
  }

  const deleteReportOfProductFunc = (reportId: number) => {
    context.showModal({
      type: "Question",
      title: "Bildiriyi Sil",
      message: "İlan bildirimi silinecek. Emin misiniz?",
      onClick: async () => {

        const _result = await ApiService.deleteReportForProduct(reportId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "İlan bildirimi başarıyla silindi",
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
        <h2 className="mb-5">Bildirilen İlan Listesi</h2>
        <Table
          ref={tableEl}
          key={"1"}
          emptyListText={"Bildirilen İlan Bulunamadı"}
          getDataFunction={getReportedProductList}
          header={<div className=" lg:grid-cols-10 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-3 flex items-center">
              <span className="p-sm-gray-400">
                Ürün Adı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Ürünü Satan Mağaza
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Bildiren Kullanıcı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Bildirme Tarihi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400 text-center block">
                İşlemler
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-10 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
              <div className="lg:col-span-3 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Ürün Adı:</span>
                <div className="flex gap-4 items-center">
                  <Image src={e.ProductPhoto} alt={e.ProductName} className="w-14 h-14 object-contain" />
                  <p className="p-sm">
                    {e.ProductName}
                  </p>
                </div>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Ürünü Satan Mağaza :</span>
                <p className="p-sm">
                  {e.SellerStoreName}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Bildiren Kullanıcı :</span>
                <p className="p-sm">
                  {e.UserNameSurname}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Bildirme Tarihi :</span>
                <p className="p-sm">
                  <DateView className="text-sm text-gray-700 mb-1 font-medium" dateNumber={e.ReportDate} pattern="dd/MM/yyyy HH:mm" />
                </p>
              </div>
              <div className="lg:col-span-1 flex justify-center items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">İşlemler :</span>
                <div className="text-gray-700 flex gap-2 items-center">
                  <InfoIcon className="w-5 h-5 hover:hover:text-blue-400 cursor-pointer transition-all" onClick={() => { handleOpenReportModal(e.ReportTitle, e.ReportReason); }} />
                  <TrashIcon className="w-8 h-5 icon-sm hover:text-blue-400 cursor-pointer transition-all border-l pl-1" onClick={() => { deleteReportOfProductFunc(e.ReportId); }} />
                </div>
              </div>
            </div>
          }}
          sortOptions={sortOptions}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
        />
      </div>

      <Modal
        modalType="fixedSm"
        showModal={showModal}
        onClose={() => { setShowModal(false); }}
        title="Bildirilen İlan Detayı"
        body={<>
          <div>
            <div className="flex">
              <AlertIcon className="w-4 h-4 text-red-400 my-auto" />
              <div className="text-sm font-medium text-red-400 my-auto ml-2">Bu ilana kullanıcı tarafından sorun bildirildi</div>
            </div>
            <div className="text-type-12-medium text-gray-700 mt-4">Bildirme Nedeni</div>
            <div className="text-sm  font-medium mt-2">{reportTitle}</div>
            <div className="text-type-12-medium text-gray-700 mt-4">Bildirme Açıklaması</div>
            <div className="text-sm  font-medium mt-2">{reportReason}</div>
          </div>
        </>} />
    </div>
  )
}
