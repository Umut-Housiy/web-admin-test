import { FunctionComponent, useContext, useRef, useState } from "react"
import { useHistory } from "react-router-dom";
import { AlertIcon, EditIcon, PlusIcon } from "../Components/Icons";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Image } from "../Components/Image"
import { Table } from "../Components/Table";
import { Button } from "../Components/Button";
import { Modal } from "../Components/Modal";
import { Label } from "../Components/Label";
import { FileUploader } from "../Components/FileUploader";

export const MemberSocieties: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const [showAddSocietyModal, setShowAddSocietyModal] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>("");

  const [selectedNewLogo, setSelectedNewLogo] = useState<File | undefined>();

  const [oldLogo, setOldLogo] = useState<string>("");

  const [selectedSocietyId, setSelectedSocietyId] = useState<number>(0);


  const getSocietysList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSocietyLists(page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  const handleCreateSociety = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createSociety(name, selectedNewLogo);

    setProcessLoading(false);
    setShowAddSocietyModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "İçerik oluşturuldu",
        onClose: () => {
          context.hideModal();
          tableEl.current?.reload();
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal(); setShowAddSocietyModal(true);
        }
      });
    }
  }

  const handleUpdateSociety = async () => {
    setProcessLoading(true);
    const _result = await ApiService.updateSociety(selectedSocietyId, selectedNewLogo, name);

    setProcessLoading(false);
    setShowAddSocietyModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi",
        onClose: () => {
          context.hideModal();
          tableEl.current?.reload();
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

  const handleEditSociety = (item) => {
    setSelectedSocietyId(item.Id);
    setName(item.Title);
    setOldLogo(item.PhotoUrl);
    setShowAddSocietyModal(true);
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Üye Dernekleri Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Dernek Bulunamadı"}
          getDataFunction={getSocietysList}
          addNewButton={
            <Button buttonMd textTiny color="text-blue-400" className="w-60" design="button-blue-100" text="Yeni Dernek Ekle" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => {
              setSelectedNewLogo(undefined);
              setName("");
              setOldLogo("");
              setSelectedSocietyId(0);
              setShowAddSocietyModal(true);
            }} />}
          header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2 flex items-center">
              <span className="p-sm-gray-400">
                Dernek Logosu
              </span>
            </div>
            <div className="lg:col-span-10">
              <span className="p-sm-gray-400">
                Dernek Adı
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-2 flex items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2"> Dernek Logosu: </span>
                <Image src={e.PhotoUrl} alt={e.Title} className="w-14 h-14 object-contain" />
              </div>

              <div className="lg:col-span-10 flex justify-between">
                <div>
                  <span className="p-sm-gray-700 lg:hidden mr-2"> Dernek Adı: </span>
                  <p className="p-sm">
                    {e.Title}
                  </p>
                </div>
                <div className="text-gray-700 flex gap-2 items-center">
                  <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all"
                    onClick={() => { handleEditSociety(e) }} />
                </div>
              </div>
            </div>
          }}
        />
      </div>
      <Modal
        modalType="fixedSm"
        showModal={showAddSocietyModal}
        onClose={() => {
          setShowAddSocietyModal(false);
          setName("");
          setSelectedNewLogo(undefined);
          setOldLogo("");
          setSelectedSocietyId(0);
        }}
        title={selectedSocietyId > 0 ? "Üye Derneği Düzenle" : "Yeni Üye Derneği Oluştur"}
        body={
          <>
            <Label title="Dernek Adı" withoutDots isRequired />
            <input className="form-input" type="text" placeholder="Giriniz" value={name} onChange={(e) => { setName(e.target.value); }} />
            <Label className="mt-4" title="Dernek Logosu" withoutDots isRequired />
            <div className="flex items-center text-sm mb-2">
              <AlertIcon className="icon-sm mr-1 text-red-400" />
              <span>Yükleyeceğiniz logolar kare olmalı ve 500*500 px alana sığdırılmalıdır.</span>
            </div>
            <FileUploader onFileSelected={item => { setSelectedNewLogo(item) }} oldPreview={selectedSocietyId === 0 ? undefined : oldLogo} />
          </>
        }
        footer={
          selectedSocietyId > 0 ?
            <Button block isLoading={processLoading} design="button-blue-400" text="Değişiklikleri Kaydet" className="mt-6" onClick={() => handleUpdateSociety()} />
            :
            <Button block isLoading={processLoading} design="button-blue-400" text="Oluştur" className="mt-6" onClick={() => handleCreateSociety()} />
        }
      />
    </div>
  )
}
