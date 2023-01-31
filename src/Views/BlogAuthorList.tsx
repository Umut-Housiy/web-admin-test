import { FunctionComponent, useContext, useRef, useState } from "react"
import { Button } from "../Components/Button"
import { EditIcon, PlusIcon, TrashIcon } from "../Components/Icons"
import { Label } from "../Components/Label"
import { Modal } from "../Components/Modal"
import { Table } from "../Components/Table"
import ApiService from "../Services/ApiService"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext"

export const BlogAuthorList: FunctionComponent = () => {

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" }
  ];

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [modalId, setModalId] = useState<number>(0);

  const [modalName, setModalName] = useState<string>("");

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [showAuthorEditModal, setShowAutohoeEditModal] = useState<boolean>(false);

  const getBlogAuthorList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getBlogAuthorList(page, take, searchText, order);

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

  const handleOpenCreateModal = () => {
    setIsEdit(false);
    setModalId(0);
    setModalName("");
    setShowAutohoeEditModal(true);
  }

  const createAuthor = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createBlogAuthor(modalName);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Yazar oluşturuldu.",
        onClose: () => {
          context.hideModal(); setProcessLoading(false);
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
        onClose: () => { context.hideModal(); setProcessLoading(false); }
      });
    }
  }

  const handleOpenDeleteModal = async (AuthorId) => {
    context.showModal({
      type: "Question",
      title: "Yazarı silmek istiyor musunuz?",
      onClose: () => { context.hideModal(); },
      onClick: async () => { await deleteAuthor(AuthorId); return true; }
    });
  }

  const deleteAuthor = async (AuthorId) => {
    setProcessLoading(true);

    const _result = await ApiService.deleteBlogAuthor(AuthorId);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Yazar silindi.",
        onClose: () => {
          context.hideModal(); setProcessLoading(false);
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
        onClose: () => { context.hideModal(); setProcessLoading(false); }
      });
    }
  }

  const handleOpenUpdateModal = (item) => {
    setIsEdit(true);
    setModalId(item.Id);
    setModalName(item.Name);
    setShowAutohoeEditModal(true);
  }

  const updateAuthor = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateBlogAuthor(modalId, modalName);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => {
          context.hideModal(); setProcessLoading(false);
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
        onClose: () => { context.hideModal(); setProcessLoading(false); }
      });
    }
  }


  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Blog Yazarları Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Yazar Bulunamadı"}
          getDataFunction={getBlogAuthorList}
          addNewButton={
            <Button isLoading={processLoading} buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni Yazar Ekle" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { handleOpenCreateModal(); }} />}
          header={<div className=" lg:grid-cols-2 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Yazar Adı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Oluşturulma Tarihi
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-2 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.Name}
                </p>
              </div>
              <div className="lg:col-span-1 flex justify-between">
                <p className="p-sm">
                  {e.CreatedDate}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all"
                    onClick={() => { handleOpenUpdateModal(e); }} />
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleOpenDeleteModal(e.Id); }} />
                </div>
              </div>
            </div>
          }}
          sortOptions={sortOptions}
        />
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showAuthorEditModal}
        onClose={() => { setShowAutohoeEditModal(false); }}
        title="Yeni Yazar Ekle"
        body={
          <div>
            <Label isRequired withoutDots title="Yazar Adı" className="mt-4" />
            <input className="form-input" value={modalName} onChange={(e) => { setModalName(e.target.value); }} />
          </div>
        }
        footer={
          isEdit ?
            <Button isLoading={processLoading} block design="button-blue-400 mt-4" text="Kaydet ve Tamamla" onClick={() => { setShowAutohoeEditModal(false); updateAuthor(); }} />
            :
            <Button isLoading={processLoading} block design="button-blue-400 mt-4" text="Kaydet ve Tamamla" onClick={() => { setShowAutohoeEditModal(false); createAuthor(); }} />
        }
      />
    </div>
  )
}
