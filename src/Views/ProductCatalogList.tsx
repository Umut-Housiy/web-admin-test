import { FunctionComponent, useContext, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { Image } from "../Components/Image";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { AlertIcon, ChevronRightIcon, EditIcon, EyeIcon, EyeOffIcon, SeoIcon } from "../Components/Icons";
import { formatter, fraction, readPageQueryString } from "../Services/Functions"
import { Modal } from "../Components/Modal";
import { Label } from "../Components/Label";
import { Button } from "../Components/Button";

export const ProductCatalogList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const tableEl = useRef<any>();

  const handleJsDate = (JsTime) => {
    try {
      var time = new Date(JsTime);
      return time.toLocaleDateString() ?? "";
    }
    catch {
      return ""
    }
  }

  const getProductList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProductList(page, take, searchText, order);

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

  const changeProductStatus = (Id, isEnabled) => {
    context.showModal({
      type: "Question",
      title: isEnabled ? "Ürünü Pasifleştir" : "Ürünü Aktifleştir",
      message: isEnabled ? "Ürün pasifleştirilecek. Emin misiniz ?" : "Ürün aktifleştirilecek. Emin misiniz ?",
      onClick: async () => {
        const _result = await ApiService.changeProductStatus(Id, !isEnabled);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Ürün durumu değiştirildi",
            onClose: () => {
              context.hideModal();
              if (tableEl.current) {
                tableEl.current.reload();
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

  //#region Seo
  const [showSeoModal, setShowSeoModal] = useState<boolean>(false);

  const [seoId, setSeoId] = useState<number>(0);

  const [seoName, setSeoName] = useState<string>("");

  const [seoTitle, setSeoTitle] = useState<string>("");

  const [seoDescription, setSeoDescription] = useState<string>("");

  const handleOpenSeoModal = (item) => {
    setSeoId(item.ProductId ?? 0);
    setSeoName(item?.ProductName ?? "");
    setSeoTitle(item?.SeoTitle ?? "");
    setSeoDescription(item?.SeoDescription ?? "");
    setShowSeoModal(true);
  }

  const updateSingleProductSeo = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateSingleProductSeo(seoId, seoTitle, seoDescription);

    setProcessLoading(false);
    setShowSeoModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Seo bilgileri güncellenmiştir",
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
        onClose: () => { context.hideModal(); setShowSeoModal(true); }
      });
    }
  }
  //#endregion

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Ürün Katalog Listesi</h2>
        <Table
          ref={tableEl}
          key={"1"}
          emptyListText={"Ürün Bulunamadı"}
          getDataFunction={getProductList}
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
                Marka
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Oluşturulma Tarihi
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center gap-1">
              <span className="p-sm-gray-400">
                BUYBOX
              </span>
              <AlertIcon className="w-3 h-3 text-gray-400 transform rotate-180" />
            </div>
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Satıcı Sayısı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center gap-1">
              <span className="p-sm-gray-400">
                Varyasyon Sayısı
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center gap-1">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
            <div className="lg:col-span-1 flex items-center gap-1">
              <span className="p-sm-gray-400">
                İşlemler
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b h-20 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-2 flex items-center gap-2">
                <Image src={e.ProductMainPhoto} alt={e.ProductName} className="w-14 h-14 object-contain" />
                <p className="p-sm">
                  {e.ProductName}
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
                <p className="p-sm">
                  {e.Brand}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="p-sm">
                  {handleJsDate(e.CreatedDateJSTime)}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="text-sm font-medium text-green-400">
                  {e.BuyboxPrice % 1 === 0 ?
                    <>{fraction.format(e.BuyboxPrice)} TL </>
                    :
                    <>{formatter.format(e.BuyboxPrice)} TL</>
                  }
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="p-sm">
                  {e.SellerCount}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className="p-sm">
                  {e.VariationCount}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <p className={`${e.IsEnabled ? "text-green-400" : "text-red-400"} text-sm font-medium `}>
                  {e.IsEnabled ? "Aktif" : "Pasif"}
                </p>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <div className="text-gray-700 flex gap-2 items-center">
                  <EditIcon className="w-5 h-5 hover:hover:text-blue-400 cursor-pointer transition-all pl-1" onClick={() => { history.push(`/urun-duzenle/${e.ProductId}`); }} />
                  <SeoIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleOpenSeoModal(e); }} />
                  {
                    e.IsEnabled ?
                      <EyeIcon className="w-5 h-5 hover:hover:text-blue-400 cursor-pointer transition-all pl-1" onClick={() => { changeProductStatus(e.ProductId, e.IsEnabled); }} />
                      :
                      <EyeOffIcon className="w-5 h-5 hover:hover:text-blue-400 cursor-pointer transition-all pl-1" onClick={() => { changeProductStatus(e.ProductId, e.IsEnabled); }} />
                  }
                  <Link to={{ pathname: `/urun-detay/${e.ProductId}`, state: { tabId: 1, queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                    <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" />
                  </Link>
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
        showModal={showSeoModal}
        onClose={() => { setShowSeoModal(false); }}
        title="SEO Bilgileri"
        body={
          <div>
            <Label withoutDots title="Ürün Adı" className="mt-4" />
            <div className="text-sm text-gray-900">{seoName}</div>
            <Label isRequired withoutDots title="Title" className="mt-4" />
            <input className="form-input" type="text" value={seoTitle} onChange={(e) => { setSeoTitle(e.target.value); }} />
            <Label isRequired withoutDots title="Description" className="mt-4" />
            <input className="form-input" type="text" value={seoDescription} onChange={(e) => { setSeoDescription(e.target.value); }} />
          </div>
        }
        footer={
          <Button className="w-full" isLoading={processLoading} design="button-blue-400" text="Kaydet" onClick={() => { updateSingleProductSeo(); }}></Button>
        }
      />
    </div>
  )
}
