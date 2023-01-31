import { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { Button } from "../Components/Button";
import { Dropdown } from "../Components/Dropdown";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { Modal } from "../Components/Modal";
import { Table } from "../Components/Table";
import { useStateEffect } from "../Components/UseStateEffect";
import { SellerCategoryListInnerModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Image } from "../Components/Image"
import { CheckIcon, PlusIcon } from "../Components/Icons";

export const SeoProduct: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");

  const [description, setDescription] = useState<string>("");

  const [showSelectModal, setShowSelectModal] = useState<boolean>(false);

  const [selectedItem, setSelectedItem] = useState<SellerCategoryListInnerModel>();

  const tableEl = useRef<any>();

  useStateEffect(() => {
    setTitle("");
    setDescription("");
  }, [selectedItem])


  const getSellerCategoryList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerCategoryList(page, take, searchText, order);

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

  const updateProductSeoData = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateProductSeoData((selectedItem?.Id ?? 0), title, description);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi",
        onClose: () => { context.hideModal(); setSelectedItem(undefined); }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  const handleAddDynamicString = (dynamicString) => {
    setTitle(title + " " + dynamicString);
    setDescription(title + " " + dynamicString);
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="pb-4 border-b border-gray-200">Ürün SEO</h2>
        <div className="w-1/2">
          <Button textTiny buttonSm className="px-4 mt-4" design="button-blue-100 text-blue-400" hasIcon icon={selectedItem ? <></> : <PlusIcon className="icon-sm text-blue-400 mr-2" />} text={selectedItem ? selectedItem.CategoryName : "Kategori Seç"} onClick={() => { setSelectedItem(undefined); setShowSelectModal(true); }} />
          <Label withoutDots title="Dinamik Veriler" className="mt-4" />
          <div className="flex gap-2 items-center">
            <Button buttonSm design={"button-blue-100 text-blue-400 px-4"} text={"Mağaza Adı"} onClick={() => { handleAddDynamicString("_-MagazaAdi-_"); }}></Button>
            <Button buttonSm design={"button-blue-100 text-blue-400 px-4"} text={"Ürün Adı"} onClick={() => { handleAddDynamicString("_-UrunAdi-_"); }}></Button>
            <Button buttonSm design={"button-blue-100 text-blue-400 px-4"} text={"Fiyat"} onClick={() => { handleAddDynamicString("_-Fiyat-_"); }}></Button>
            <Button buttonSm design={"button-blue-100 text-blue-400 px-4"} text={"Kısa Açıklama"} onClick={() => { handleAddDynamicString("_-KisaAciklama-_"); }}></Button>
          </div>
          <Label withoutDots isRequired title="Title" className="mt-4" />
          <input className="form-input" type="text" value={title} onChange={(e) => { setTitle(e.target.value); }} />
          <Label withoutDots isRequired title="Description" className="mt-4" />
          <input className="form-input" type="text" value={description} onChange={(e) => { setDescription(e.target.value); }} />
        </div>
        <div className="flex mt-6">
          <Button isLoading={processLoading} textTiny className="w-72 ml-auto" design="button-blue-400" text="Kaydet" onClick={() => { updateProductSeoData(); }} />
        </div>
      </div>
      <Modal
        modalType="fixedMd"
        showModal={showSelectModal}
        onClose={() => { setShowSelectModal(false); }}
        title="Satıcı Seç"
        body=
        {
          <div className="">
            <Table
              ref={tableEl}
              emptyListText={"Kategori Bulunamadı"}
              getDataFunction={getSellerCategoryList}
              header={
                <div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4 flex items-center">
                  <div className="lg:col-span-2 flex items-center">
                    <span className="p-sm-gray-400">
                      Kategori Görseli
                    </span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">
                      Kategori Adı
                    </span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">
                      Kategori Kodu
                    </span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">
                      Üst Kategori
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">
                      Kategori Sırası
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">
                      Komisyonu
                    </span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">
                      Durum
                    </span>
                  </div>
                </div>
              }
              renderItem={(e: SellerCategoryListInnerModel, i) => {
                return <div className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center" key={i} >
                  <div className="lg:col-span-2 flex items-center">
                    <Image src={e.PhotoPath} alt={e.CategoryName} className="w-14 h-14 object-contain" />
                  </div>
                  <div className="lg:col-span-2  flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Adı: </span>
                    <p className="p-sm  whitespace-nowrap overflow-auto custom-scrollbar">
                      {e.CategoryName}
                    </p>
                  </div>
                  <div className="lg:col-span-2  flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Kodu: </span>
                    <p className="p-sm  whitespace-nowrap overflow-auto custom-scrollbar">
                      {e.CategoryCode}
                    </p>
                  </div>
                  <div className="lg:col-span-2  flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Üst Kategori: </span>
                    <p className="p-sm  whitespace-nowrap overflow-auto custom-scrollbar">
                      {e.ParentName ? e.ParentName : "-"}
                    </p>
                  </div>
                  <div className="lg:col-span-1  flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Sırası: </span>
                    <p className="p-sm">
                      {e.CategoryOrder}
                    </p>
                  </div>
                  <div className="lg:col-span-1  flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2"> Komisyonu: </span>
                    <p className="p-sm">
                      %{e.CommissionPercentage}
                    </p>
                  </div>
                  <div className="lg:col-span-2 flex justify-between">
                    <div className="flex items-center">
                      <span className="p-sm-gray-700 lg:hidden mr-2">Durum: </span>
                      <p className={`${e.CategoryStatus === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                        {e.CategoryStatus === true ? "Aktif" : "Pasif"}
                      </p>
                    </div>
                    {
                      selectedItem?.Id === e.Id ?
                        <Button textTiny buttonSm className="w-16" design="button-blue-400" hasIcon icon={<CheckIcon className="icon-sm text-white" />} text="" />
                        :
                        <Button textTiny buttonSm className="w-16" design="button-blue-100 text-blue-400" text="Seç" onClick={() => { setSelectedItem(e); }} />
                    }
                  </div>
                </div>
              }}
            />
          </div>
        }
        footer={
          selectedItem &&
          <Button textTiny className="w-full" design="button-blue-400" text="Seç" onClick={() => { setShowSelectModal(false); }} />
        }
      />
    </div>
  )
}
