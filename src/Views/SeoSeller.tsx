import { FunctionComponent, useContext, useRef, useState } from "react"
import { Button } from "../Components/Button";
import { CheckIcon, PlusIcon, StarIcon } from "../Components/Icons";
import { Label } from "../Components/Label"
import { Modal } from "../Components/Modal";
import { Table } from "../Components/Table";
import { useStateEffect } from "../Components/UseStateEffect";
import { SellerModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const SeoSeller: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");

  const [description, setDescription] = useState<string>("");

  const [showSelectModal, setShowSelectModal] = useState<boolean>(false);

  const [selectedItem, setSelectedItem] = useState<SellerModel>();

  const tableEl = useRef<any>();

  useStateEffect(() => {
    setTitle("");
    setDescription("");
  }, [selectedItem])

  const getSellerApprovedList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerApprovedList(page, take, searchText, order);

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

  const updateSellerSeoData = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateSellerSeoData((selectedItem?.Id ?? 0), title, description);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişikler kaydedildi",
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
        <h2 className="pb-4 border-b border-gray-200">Satıcı SEO</h2>
        <div className="w-1/2">
          <Button textTiny buttonSm className="px-4 mt-4" design="button-blue-100 text-blue-400" hasIcon icon={selectedItem ? <></> : <PlusIcon className="icon-sm text-blue-400 mr-2" />} text={selectedItem ? selectedItem.StoreName : "Satıcı Seç"} onClick={() => { setSelectedItem(undefined); setShowSelectModal(true); }} />
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
          <Button isLoading={processLoading} textTiny className="w-72 ml-auto" design="button-blue-400" text="Kaydet" onClick={() => { updateSellerSeoData(); }} />
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
              emptyListText={"Satıcı Bulunamadı"}
              getDataFunction={getSellerApprovedList}
              header={<div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Mağaza Adı
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Telefon No.
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400 ">
                    Email
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Başvuru Tarihi
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Firma Tipi
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Mağaza Puanı
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Durum
                  </span>
                </div>
              </div>}
              renderItem={(e: SellerModel, i) => {
                return <div key={"list" + i} className="lg:grid-cols-7 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
                  <div className="lg:col-span-1">
                    <p className="p-sm whitespace-nowrap overflow-auto custom-scrollbar">
                      {e.StoreName}
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <p className="p-sm">
                      {e.Phone}
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <p className="p-sm overflow-auto custom-scrollbar">
                      {e.Email}
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <p className="p-sm">
                      {e.RecourseDate}
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <p className="p-sm">
                      {e.CompanyType === 1 ?
                        <>Anonim Şirket</>
                        :
                        e.CompanyType === 2 ?
                          <>Şahıs Şirketi</>
                          :
                          e.CompanyType === 3 ?
                            <>Limited Şirket</>
                            :
                            e.CompanyType === 4 ?
                              <>Kolektif Şirket</>
                              :
                              e.CompanyType === 5 ?
                                <>Kooperatif Şirket</>
                                :
                                e.CompanyType === 6 ?
                                  <>Adi Ortaklık</>
                                  :
                                  <></>
                      }
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex">
                    <StarIcon className="w-4 h-4 text-yellow-600" />
                    <span className="ml-2 text-sm text-yellow-600 font-medium">
                      {e.StoreRate}
                    </span>
                  </div>
                  <div className="lg:col-span-1 flex justify-between">
                    {
                      e.IsEnabled === true ?
                        <span className="text-sm text-green-400 font-medium">
                          Aktif
                        </span>
                        :
                        <span className="text-sm text-red-400 font-medium">
                          Pasif
                        </span>

                    }
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
