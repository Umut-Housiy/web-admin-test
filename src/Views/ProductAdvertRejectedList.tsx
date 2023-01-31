import { FunctionComponent, useRef, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { Image } from "../Components/Image";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { AlertIcon, ChevronRightIcon, InfoIcon } from "../Components/Icons";
import { Modal } from "../Components/Modal";
import { readPageQueryString } from "../Services/Functions";

export const ProductAdvertRejectedList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Fiyata göre azalan" },
    { key: "4", value: "Fiyata göre artan" }
  ];

  const [showModal, setShowModal] = useState<boolean>(false);

  const [rejectDate, setRejectDate] = useState<string>("");

  const [rejectTitle, setRejectTitle] = useState<string>("");

  const [rejectReason, setRejectReason] = useState<string>("");

  const handleJsTime = (JsTime) => {
    if (JsTime !== undefined && JsTime !== null && JsTime !== "") {
      var time = new Date(JsTime);
      return time.toLocaleString() ?? "-";
    }
    else {
      return "-";
    }
  }

  const getRejectedProductDraftList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getRejectedProductDraftList(page, take, searchText, order);

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

  const handleOpenRejectModal = (item) => {
    setRejectDate(handleJsTime(item.RejectDateJsTime) ?? "-");
    setRejectTitle(item.RejectTitle ?? "-");
    setRejectReason(item.RejectDescription ?? "-");
    setShowModal(true);
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Reddedilen İlanlar</h2>
        <Table
          ref={tableEl}
          key={"1"}
          emptyListText={"İlan Bulunamadı"}
          getDataFunction={getRejectedProductDraftList}
          header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2 flex items-center">
              <span className="p-sm-gray-400">
                Ürün Adı
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
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Stok Kodu
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Stok Miktarı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Piyasa Satış Fiyatı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Satış Fiyatı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center gap-1">
              <span className="p-sm-gray-400">
                BUYBOX
              </span>
              <AlertIcon className="w-3 h-3 text-gray-400 transform rotate-180" />
            </div>
            <div className="lg:col-span-2 flex items-center">
              <span className="p-sm-gray-400">
                Satıcı Adı
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b h-20 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-2 flex gap-4 items-center">
                <Image src={e.ProductMainPhoto} alt={e.ProductName} className="w-14 h-14 object-contain" />
                <p className="p-sm">
                  {e.ProductName}
                </p>
              </div>
              <div className="lg:col-span-1 flex ">
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
                <p className="p-sm">
                  {e.StockCode}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="p-sm">
                  {e.StockCount}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="p-sm">
                  {e.MarketPrice}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="p-sm">
                  {e.SalePrice}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="text-sm font-medium text-green-400">
                  {e.BuyboxPrice ?? "-"}
                </p>
              </div>
              <div className="lg:col-span-2 flex justify-between">
                <p className="text-sm font-medium text-blue-400 underline">
                  {e.SellerName}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <InfoIcon className="w-5 h-5 hover:hover:text-blue-400   cursor-pointer transition-all "
                    onClick={() => { handleOpenRejectModal(e); }} />
                  <Link className="ml-auto" to={{ pathname: `/onay-bekleyen-ilan-detay/${e.DraftId}`, state: { prevPath: window.location.pathname, queryPage: Number(readPageQueryString(window.location) ?? "1") } }}>
                    <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400 cursor-pointer transition-all border-l pl-1" />
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
      <Modal
        modalType="fixedSm"
        showModal={showModal}
        onClose={() => { setShowModal(false); }}
        title="Başvuru Red Detayı"
        body={<>
          <div>
            <div className="flex">
              <AlertIcon className="w-4 h-4 text-red-400 my-auto" />
              <div className="text-sm font-medium text-red-400 my-auto ml-2">Bu başvuru admin tarafından reddedildi.</div>
            </div>
            <div className="text-type-12-medium text-gray-700 mt-4">Red Tarihi</div>
            <div className="text-sm  font-medium mt-2">{rejectDate ?? "-"}</div>
            <div className="text-type-12-medium text-gray-700 mt-4">Red Nedeni</div>
            <div className="text-sm  font-medium mt-2">{rejectTitle ?? "-"}</div>
            <div className="text-type-12-medium text-gray-700 mt-4">Açıklama</div>
            <div className="text-sm  font-medium mt-2">
              {rejectReason ?? "-"}
            </div>
          </div>
        </>} />
    </div>
  )
}
