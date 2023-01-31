import { FunctionComponent, useContext, useRef, useState } from "react"
import { Button } from "../Components/Button";
import { EditIcon, PlusIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Modal } from "../Components/Modal";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const BrandList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [showEditBrandModal, setShowEditBrandModal] = useState<boolean>(false);

  const [brandId, setBrandId] = useState<number>(0);

  const [brandName, setBrandName] = useState<string>("");

  const getBrandList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getBrandList(page, take, searchText, order);


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

  const handleOpenCreateBrandModal = () => {
    setBrandId(0);
    setBrandName("");
    setShowEditBrandModal(true);
  }

  const handleOpenUpdateBrandModal = (item) => {
    setBrandId(item.Id);
    setBrandName(item.Name);
    setShowEditBrandModal(true);
  }

  const createBrand = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createBrand(brandName);

    setProcessLoading(false);
    setShowEditBrandModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "İçerik oluşturuldu.",
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
  }

  const updateBrand = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateBrand(brandId, brandName);

    setProcessLoading(false);
    setShowEditBrandModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
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
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Marka Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Marka Bulunamadı"}
          getDataFunction={getBrandList}
          addNewButton={
            <Button isLoading={processLoading} buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni Marka Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { handleOpenCreateBrandModal(); }} />}
          header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-12">
              <span className="p-sm-gray-400">
                Marka Adı
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-12 flex justify-between">
                <p className="p-sm">
                  {e.Name}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all"
                    onClick={() => { handleOpenUpdateBrandModal(e); }} />
                </div>
              </div>
            </div>
          }}
        />
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showEditBrandModal}
        onClose={() => { setShowEditBrandModal(false); }}
        title="Marka Düzenle"
        body={
          <div>
            <Label isRequired withoutDots title="Marka Adı" className="mt-4" />
            <input className="form-input" value={brandName} onChange={(e) => { setBrandName(e.target.value); }} />
          </div>
        }
        footer={
          brandId === 0 ?
            <Button isLoading={processLoading} block design="button-blue-400 mt-4" text="Oluştur" onClick={() => { createBrand(); }} />
            :
            <Button isLoading={processLoading} block design="button-blue-400 mt-4" text="Oluştur" onClick={() => { updateBrand(); }} />
        }
      />
    </div>
  )
}
