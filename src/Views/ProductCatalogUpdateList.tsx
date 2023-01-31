import { FunctionComponent, useContext, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Image } from "../Components/Image";
import { Table } from "../Components/Table";
import { AlertIcon, ChevronRightIcon, InfoIcon, TrashIcon } from "../Components/Icons";
import { fraction, readPageQueryString } from "../Services/Functions";
import { ProductUpdateRequestListInnerModel } from "../Models";
import { Modal } from "../Components/Modal";
import { DateView } from "../Components/DateView";
import { Button } from "../Components/Button";

export const ProductCatalogUpdateList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const [selectedRow, setSelectedRow] = useState<ProductUpdateRequestListInnerModel>(
    {
      ProductId: 0,
      ProductRequestId: 0,
      ProductName: "",
      ProductMainPhoto: "",
      BarcodeNo: "",
      ModelNo: "",
      Category: "",
      Brand: "",
      SellerCount: 0,
      VariationCount: 0,
      BuyboxPrice: 0,
      CreatedDateJSTime: 0,
      SellerId: 0,
      StoreName: "",
      Status: 0,
      RejectReason: "",
      RejectDateJSTime: 0,
    }
  );

  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);

  const handleJsTime = (JsTime) => {
    var time = new Date(JsTime);
    return time.toLocaleString() ?? "-";
  }

  const getProductUpdateRequestList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProductUpdateRequestList(page, take, searchText, order);

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

  const handleRejectModal = (item) => {
    setSelectedRow(item);
    setShowRejectModal(true);
  }

  const showDeleteModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Güncellenmeyi Sil",
      message: `${item.ProductName} isimli ürün için gelen güncellenme isteğini listeden kaldırmak istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.deleteProductUpdateRequest(item.ProductRequestId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Güncellenme isteği başarıyla silindi",
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
        <h2 className="mb-5">Katalog Güncellemesi Bekleyen Ürünler</h2>
        <Table
          ref={tableEl}
          key={"1"}
          emptyListText={"Ürün Bulunamadı"}
          getDataFunction={getProductUpdateRequestList}
          header={<div className=" lg:grid-cols-10 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4 ">
            <div className="lg:col-span-2 flex items-center">
              <span className="p-sm-gray-400">
                Ürün Adı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Güncelleyen Satıcı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Oluşturulma Tarihi
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Barkod No
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Model No
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Kategori
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center gap-1">
              <span className="p-sm-gray-400">
                BUYBOX
              </span>
              <AlertIcon className="w-3 h-3 text-gray-400 transform rotate-180" />
            </div>
            <div className="lg:col-span-1 flex  gap-1">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-10 px-2 border-b py-5 border-gray-200 hidden lg:grid flex gap-4 items-center ">
              <div className="lg:col-span-2 flex items-center gap-2">
                <Image src={e.ProductMainPhoto} alt={e.ProductName} className="w-14 h-14 object-contain" />
                <p className="p-sm">
                  {e.ProductName}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="text-sm font-medium text-blue-400 underline cursor-pointer" onClick={() => { history.push("/satici-detay/" + e.SellerId); }}>
                  {e.StoreName}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="p-sm">
                  {handleJsTime(e.CreatedDateJSTime)}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="p-sm">
                  {e.BarcodeNo}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="p-sm">
                  {e.ModelNo}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="p-sm">
                  {e.Category}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="text-sm font-medium text-green-400">
                  {fraction.format(e.BuyboxPrice ?? 0) + " TL"}
                </p>
              </div>
              <div className="lg:col-span-2">
                <div className="text-gray-700 flex gap-2 items-center justify-between">
                  {e.Status === 0 ?
                    <div className="rounded-full w-36 py-2 bg-yellow-100 text-yellow-600 text-sm text-center my-auto">Onay Bekliyor</div>
                    : e.Status === 1 ?
                      <div className="rounded-full w-36 py-2 bg-green-100 text-green-400 text-sm text-center my-auto">Onaylandı</div>
                      :
                      <div className="flex items-center justify-start">
                        <div className="rounded-full w-36 py-2 bg-red-100 text-red-400 text-sm text-center my-auto">Reddedildi</div>
                        <InfoIcon className="w-5 h-5 ml-2 cursor-pointer text-red-400 transform -rotate-180" onClick={() => handleRejectModal(e)} />
                      </div>
                  }
                  <div className="flex items-center divide-x gap-x-2">
                    <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => showDeleteModal(e)} />
                    <Link to={{ pathname: `/urun-katalogu-guncelleme-detay/${e.ProductRequestId}`, state: { queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                      <ChevronRightIcon className="icon-md hover:text-blue-400 cursor-pointer transition-all" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          }}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
        />
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showRejectModal}
        onClose={() => { setShowRejectModal(false); }}
        title="Red Detayı"
        body={
          <div>
            <div className="text-type-12-medium text-gray-700 mt-4">Red Tarihi</div>
            <div className="text-sm  font-medium mt-2">
              <DateView className="text-sm font-medium" dateNumber={selectedRow.RejectDateJSTime ?? 0} pattern="dd/MM/yyyy" />
            </div>
            <div className="text-type-12-medium text-gray-700 mt-4">Red Nedeni</div>
            <div className="text-sm  font-medium mt-2">{selectedRow.RejectReason}</div>
          </div>
        }
        footer={
          <Button block design="button-blue-400 mt-4 w-full" text="Kapat" onClick={() => { setShowRejectModal(false); }} />
        }
      />
    </div>
  )
}
