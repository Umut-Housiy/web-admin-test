import { FunctionComponent, useContext, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "../Components/Button"
import { EditIcon, PlusIcon, TrashIcon } from "../Components/Icons"
import { Label } from "../Components/Label"
import { Modal } from "../Components/Modal"
import { Table } from "../Components/Table"
import { WorkRejectReasonListInnerModel } from "../Models"
import ApiService from "../Services/ApiService"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext"

interface RouteParams {
  type: string,
}

export const RejectReasonList: FunctionComponent = () => {

  const params = useParams<RouteParams>();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" }
  ];

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [createNewText, setcreateNewText] = useState<string>("");

  const [createNewModalShow, setCreateNewModalShow] = useState<boolean>(false);

  const [isShowUpdateModal, setIsShowUpdateModal] = useState<boolean>(false);

  const [updateRejectReasonId, setUpdateRejectReasonId] = useState<number>(0);

  const [updateText, setUpdateText] = useState<string>("");

  const getRejectReasonList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getRejectReasonList(parseInt(params.type), page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data?.Data || [],
        TotalCount: _result.data?.TotalCount || 0
      }
    }
    else {
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  const createReason = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createRejectReason(parseInt(params.type), createNewText);

    setCreateNewModalShow(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Seçenek Oluşturuldu",
        onClose: () => {
          context.hideModal();
          setcreateNewText("");
          tableEl?.current.reload();
          setProcessLoading(false);
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal();
          setCreateNewModalShow(true);
          setProcessLoading(false);
        }
      });
    }
  }

  const updateReason = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateRejectReason(updateRejectReasonId, updateText);

    setIsShowUpdateModal(false);

    if (_result.succeeded === true) {
      setUpdateRejectReasonId(0);
      setUpdateText("");
      context.showModal({
        type: "Success",
        title: "Başarılı",
        message: "Seçenek Güncellendi",
        onClose: () => {
          context.hideModal();
          tableEl?.current.reload();
          setProcessLoading(false);
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal();
          setProcessLoading(false);
        }
      });
    }
  }

  const deleteReason = async (reason) => {

    context.showModal({
      type: "Question",
      title: `${reason.Text} isimli seçenek silinecek. Onaylıyor musunuz?`,
      onClick: async () => {
        const _result = await ApiService.removeRejectReason(reason.Id);

        context.hideModal();

        if (_result.succeeded === true) {

          context.showModal({
            type: "Success",
            title: "Başarılı",
            message: "Seçenek Silindi",
            onClose: () => {
              context.hideModal();
              tableEl?.current.reload();
            }
          });
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => {
              context.hideModal();
            }
          });
        }
        return true;
      },
      onClose: () => { context.hideModal(); },
    });
  }

  const getPageTitle = () => {

    switch (parseInt(params.type)) {
      case 7:
        return "Talep İptal Seçenekleri";
      case 1:
        return "Talep Red Seçenekleri";
      case 2:
        return "Teklif Red Seçenekleri";
      case 3:
        return "Hizmet İptal (Profesyonel) Seçenekleri";
      case 4:
        return "Hizmet İptal (Kullanıcı) Seçenekleri";
      case 5:
        return "Profesyonel Sorun Bildir Seçenekleri";
      case 6:
        return "Hizmet Sorun Bildir Seçenekleri";
      case 8:
        return "Talep İptali Red Seçenekleri";
      default:
        return "-";
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">{getPageTitle()}</h2>
        <Table
          ref={tableEl}
          emptyListText={"Seçenek Bulunamadı"}
          addNewButton={
            <Button isLoading={processLoading} buttonMd textTiny color="text-blue-400" className="w-80" design="button-blue-100" text="Yeni Seçenek Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { setCreateNewModalShow(true); }} />}
          getDataFunction={getRejectReasonList}
          header={<div className=" lg:grid-cols-1 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                İşlem Adı
              </span>
            </div>
          </div>}
          renderItem={(e: WorkRejectReasonListInnerModel, i) => {
            return <div key={"list" + i} className="lg:grid-cols-1 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">

              <div className="lg:col-span-1 flex lg:justify-between">
                <span className="p-sm-gray-700 lg:hidden mr-2">İşlem Adı:</span>
                <div className="flex flex-1 justify-between">
                  <p className="p-sm">
                    {e.Text}
                  </p>
                  <div className="flex items-center text-gray-900">
                    <EditIcon className="icon-sm mr-2 cursor-pointer " onClick={() => {
                      setUpdateRejectReasonId(e.Id);
                      setUpdateText(e.Text);
                      setIsShowUpdateModal(true);
                    }} />
                    <TrashIcon className="icon-sm cursor-pointer" onClick={() => {
                      deleteReason(e);
                    }} />
                  </div>
                </div>

              </div>
            </div>
          }}
          sortOptions={sortOptions}
        />
        <Modal
          modalType="fixedSm"
          showModal={createNewModalShow}
          onClose={() => { setCreateNewModalShow(false); setcreateNewText(""); }}
          title="Yeni Seçenek Oluştur"
          body={
            <>
              <Label title="İçerik Başlığı" withoutDots isRequired />
              <input className="form-input" type="text" value={createNewText} onChange={(e) => { setcreateNewText(e.target.value); }} />
            </>
          }
          footer={
            <>
              <Button isLoading={processLoading} textTiny className="w-full" design="button-blue-400" text="Oluştur" onClick={() => {
                createReason();
              }} />
            </>
          }
        />
        <Modal
          modalType="fixedSm"
          showModal={isShowUpdateModal}
          onClose={() => {
            setIsShowUpdateModal(false);
            setUpdateText("");
            setUpdateRejectReasonId(0);
          }}
          title="Seçeneği Düzenle"
          body={
            <>
              <Label title="İçerik Başlığı" withoutDots isRequired />
              <input className="form-input" type="text" value={updateText} onChange={(e) => { setUpdateText(e.target.value); }} />
            </>
          }
          footer={
            <>
              <Button isLoading={processLoading} textTiny className="w-full" design="button-blue-400" text="Güncelle" onClick={() => {
                updateReason();
              }} />
            </>
          }
        />
      </div>
    </div>
  )
}
