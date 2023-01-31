import { FunctionComponent, useContext, useRef, useState } from "react"
import { Button } from "../Components/Button";
import { EditIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { Modal } from "../Components/Modal";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const SeoProductGroup: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [showSeoModal, setShowSeoModal] = useState<boolean>(false);

  const [modalId, setModalId] = useState<number>(0);

  const [title, setTitle] = useState<string>("");

  const [description, setDescription] = useState<string>("");

  const getSellerCategoryGroupList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerCategoryGroupList(page, take, searchText, order);

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

  const getSellerCategoryGroupSeoData = async (Id: number) => {
    setLoading(true);
    setShowSeoModal(true);

    const _result = await ApiService.getSellerCategoryGroupSeoData(Id);

    if (_result.succeeded === true) {
      setModalId(Id);
      setTitle(_result.data.SeoTitle);
      setDescription(_result.data.SeoDescription);

      setLoading(false);
    }
    else {
      setShowSeoModal(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  const updateSellerCategoryGroupSeoData = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateSellerCategoryGroupSeoData(modalId, title, description);

    setProcessLoading(false);
    setShowSeoModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişikler kaydedildi",
        onClose: () => { context.hideModal(); }
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


  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="pb-5">Ürün Kategori Grup SEO</h2>
        <Table
          ref={tableEl}
          emptyListText={"Grup Bulunamadı"}
          getDataFunction={getSellerCategoryGroupList}
          header={
            <div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4 flex items-center">
              <div className="lg:col-span-12">
                <span className="p-sm-gray-400">
                  Grup Adı
                </span>
              </div>
            </div>
          }
          renderItem={(e, i) => {
            return <div className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center" key={i} >
              <div className="lg:col-span-12 flex justify-between items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Grup Adı: </span>
                <p className="p-sm">
                  {e.GroupName}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { getSellerCategoryGroupSeoData(e.Id); }} />
                </div>
              </div>
            </div>
          }}
        />
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showSeoModal}
        onClose={() => { setShowSeoModal(false); }}
        title="Grup SEO Düzenle"
        body=
        {
          <>
            <Label withoutDots isRequired title="Title" className="mt-4" />
            {
              loading ?
                <Loading inputSm />
                :
                <input className="form-input" type="text" value={title} onChange={(e) => { setTitle(e.target.value); }} />
            }
            <Label withoutDots isRequired title="Description" className="mt-4" />
            {
              loading ?
                <Loading inputSm />
                :
                <input className="form-input" type="text" value={description} onChange={(e) => { setDescription(e.target.value); }} />
            }
          </>
        }
        footer={
          <Button isLoading={processLoading || loading} textTiny className="w-full mt-4 " design="button-blue-400" text="Kaydet" onClick={() => { updateSellerCategoryGroupSeoData(); }} />
        }
      />
    </div>
  )
}
