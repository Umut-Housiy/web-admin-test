import { FunctionComponent, useContext, useRef, useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { ChevronRightIcon, EditIcon, PlusIcon, TrashIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Modal } from "../Components/Modal";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

interface RouteParams {
  id: string
}

interface LocationModel {
  queryPage: number
}

export const SiteRefundOptionList: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const params = useParams<RouteParams>();

  const location = useLocation<LocationModel>();

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [showEditOptionModal, setShowEditOptionModal] = useState<boolean>(false);

  const [modalId, setModalId] = useState<number>(0);

  const [modalTitle, setModalTitle] = useState<string>("");

  const [modalDescription, setModalDescription] = useState<string>("");

  const getRefundOptionList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getRefundOptionList(page, take, searchText, order, Number(params.id ?? "0"));

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

  const createRefundOption = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createRefundOption(modalTitle, modalDescription, Number(params.id ?? "0"));

    setShowEditOptionModal(false);
    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Seçenek eklendi.",
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

  const updateRefundOption = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateRefundOption(modalId, modalTitle, modalDescription);

    setShowEditOptionModal(false);
    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Seçenek düzenlendi.",
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

  const handleOpenDeleteModal = async (OptionId) => {
    context.showModal({
      type: "Question",
      title: "Seçenek silinecek. Emin misiniz?",
      onClose: () => { context.hideModal(); },
      onClick: async () => { await deleteRefundOption(OptionId); return true; }
    });
  }

  const deleteRefundOption = async (OptionId) => {

    const _result = await ApiService.deleteRefundOption(OptionId);

    context.hideModal();

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Seçenek silindi.",
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

  const handleOpenAddModal = () => {
    setModalId(0);
    setModalTitle("");
    setModalDescription("");
    setShowEditOptionModal(true);
  }

  const handleOpenEditModal = (item) => {
    setModalId(item.Id);
    setModalTitle(item.Title);
    setModalDescription(item.Description);
    setShowEditOptionModal(true);
  }



  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={`${location.state?.queryPage !== 1 ? `/iptal-iade-yonetimi?sayfa=${location.state?.queryPage ?? 1}` : "/iptal-iade-yonetimi"}`} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            İptal-İade Yönetimi
          </div>
        </Link>
        <h2 className="mb-5">İptal-İade Seçenekleri</h2>
        <Table
          ref={tableEl}
          emptyListText={"İçerik Bulunamadı"}
          getDataFunction={getRefundOptionList}
          addNewButton={
            <Button buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { handleOpenAddModal(); }} />}
          header={<div className=" lg:grid-cols-4 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                İçerik Başlığı
              </span>
            </div>
            <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Açıklama
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-4 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.Title}
                </p>
              </div>
              <div className="lg:col-span-3 flex justify-between">
                <p className="p-sm">
                  {e.Description}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { handleOpenEditModal(e); }} />
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleOpenDeleteModal(e.Id); }} />
                </div>
              </div>
            </div>
          }}
        />
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showEditOptionModal}
        onClose={() => { setShowEditOptionModal(false); }}
        title="İptal-İade Seçeneği Oluştur"
        body={
          <>
            <Label className="mt-6" title="İçerik Başlığı" withoutDots isRequired />
            <input className="form-input" type="text" placeholder="İçerik Başlığı" value={modalTitle} onChange={(e) => { setModalTitle(e.target.value); }} />
            <Label className="mt-6" title="İçerik Açıklaması" withoutDots isRequired />
            <textarea className="text-sm w-full p-3 text-gray-900 border   border-gray-300 rounded-lg focus:outline-none resize-none leading-5"
              placeholder="Özellik ile ilgili müşteriye verilecek ekstra bilgileri girin."
              rows={3} value={modalDescription} onChange={(e) => { setModalDescription(e.target.value); }} />
          </>
        }
        footer={
          modalId == 0 ?
            <Button isLoading={processLoading} textTiny className="w-full" design="button-blue-400" text="Düzenle" onClick={() => { createRefundOption(); }} />
            :
            <Button isLoading={processLoading} textTiny className="w-full" design="button-blue-400" text="Düzenle" onClick={() => { updateRefundOption(); }} />
        }
      />
    </div>
  )
}
