import { FunctionComponent, useContext, useRef, useState } from "react"
import { Button } from "../Components/Button";
import { EditIcon, PlusIcon, TrashIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Modal } from "../Components/Modal";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const SupportSellerSubjectList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const sortOptions = [
    { key: "1", value: "Yeniden Eskiye" },
    { key: "2", value: "Eskiden Yeniye" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" }
  ];

  const tableEl = useRef<any>();

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const [modalId, setModalId] = useState<number>(0);

  const [subjectTitle, setSubjectTitle] = useState<string>("");

  const [orderBy, setOrderBy] = useState<number>(0);

  const getSupportSubjectList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSupportSubjectList(page, take, searchText, order, 3);

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

  const createSupportSubject = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createSupportSubject(3, subjectTitle, orderBy);

    setProcessLoading(false);
    setShowEditModal(false);

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

  const updateSupportSubject = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateSupportSubject(modalId, subjectTitle, orderBy);

    setProcessLoading(false);
    setShowEditModal(false);

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

  const removeSupportSubject = (item) => {
    context.showModal({
      type: "Question",
      title: "Destek Konusu Sil",
      message: "Destek konusu silinecek. Emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.removeSupportSubject(item.Id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Destek konusu silindi",
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

  const handleOpenCreateModal = () => {
    setModalId(0);
    setSubjectTitle("");
    setOrderBy(0);
    setShowEditModal(true);
  }

  const handleOpenEditModal = (item) => {
    setModalId(item.Id);
    setSubjectTitle(item.Title);
    setOrderBy(item.OrderBy);
    setShowEditModal(true);
  }

  const handleJsTime = (JsTime) => {
    var time = new Date(JsTime);
    return time.toLocaleString() ?? "-";
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Satıcı Destek Konuları</h2>
        <Table
          ref={tableEl}
          emptyListText={"Konu Bulunamadı"}
          getDataFunction={getSupportSubjectList}
          addNewButton={
            <Button isLoading={processLoading} buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni İçerik Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { handleOpenCreateModal(); }} />}
          header={<div className=" lg:grid-cols-10 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2 flex items-center">
              <span className="p-sm-gray-400">
                Görüntüleme Sırası
              </span>
            </div>
            <div className="lg:col-span-4">
              <span className="p-sm-gray-400">
                Konu Başlığı
              </span>
            </div>
            <div className="lg:col-span-4">
              <span className="p-sm-gray-400">
                Oluşturulma Tarihi
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-10 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-2">
                <p className="p-sm">
                  {e.OrderBy}
                </p>
              </div>
              <div className="lg:col-span-4">
                <p className="p-sm">
                  {e.Title}
                </p>
              </div>
              <div className="lg:col-span-4 flex justify-between">
                <p className="p-sm">
                  {handleJsTime(e.CreatedDate)}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { handleOpenEditModal(e); }} />
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { removeSupportSubject(e); }} />
                </div>
              </div>
            </div>
          }}
          sortOptions={sortOptions}
        />
      </div>
      <Modal
        modalType="fixedMd"
        showModal={showEditModal}
        onClose={() => { setShowEditModal(false); }}
        title={modalId > 0 ? "Destek Konusu Düzenle" : "Destek Konusu Ekle"}
        body={
          <div>
            <Label isRequired withoutDots title="Konu Başlığı" className="mt-4" />
            <input className="form-input" type="text" value={subjectTitle} onChange={(e) => { setSubjectTitle(e.target.value); }} />
            <Label isRequired withoutDots title="Görüntülenme Sırası" className="mt-4" />
            <input className="form-input" type="text" value={orderBy} onChange={(e) => { setOrderBy(parseInt(e.target.value)); }} />
          </div>
        }
        footer={
          modalId > 0 ?
            <Button block design="button-blue-400 mt-4" text="Düzenle" onClick={() => { updateSupportSubject(); }} />
            :
            <Button block design="button-blue-400 mt-4" text="Oluştur" onClick={() => { createSupportSubject(); }} />
        }
      />
    </div>
  )
}
