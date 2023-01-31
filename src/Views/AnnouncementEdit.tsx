import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { BellIcon, CheckIcon, ChevronRightIcon, EditIcon, PlusIcon, TrashIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { TextArea } from "../Components/TextArea";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Dropzone } from "../Components/Dropzone";
import { SERVICES } from "../Services/Constants";
import { Dropdown } from "../Components/Dropdown";
import { ToggleButton } from "../Components/ToggleButton";
import ApiService from "../Services/ApiService";
import { AnnouncementDetailModel, AnnouncementReceiverModel, ProModel, SellerModel } from "../Models";
import { EmptyList } from "../Components/EmptyList";
import { Modal } from "../Components/Modal";
import { useStateEffect } from "../Components/UseStateEffect";
import { Table } from "../Components/Table";

interface RouteParams {
  id: string
}

interface LocationModel {
  prevTitle: string,
  prevPath: string,
  tabId: number,
  isEditActive: boolean
}

export const AnnouncementEdit: FunctionComponent = () => {

  const history = useHistory();

  const location = useLocation<LocationModel>();

  const params = useParams<RouteParams>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setPorcessLoading] = useState<boolean>(false);

  const [isEditActive, setIsEditActive] = useState<boolean>(location?.state?.isEditActive ? location?.state?.isEditActive : false);

  const [announcementDetail, setAnnouncementDetail] = useState<AnnouncementDetailModel>();

  const [title, setTitle] = useState<string>("");

  const [description, setDescription] = useState<string>("");

  const [url, setUrl] = useState<string>("");

  const [photoUrl, setPhotoUrl] = useState<string>("");

  const whereToShowOptions = [
    { key: "1", value: "Housiy Satıcı" },
    { key: "2", value: "Housiy Profesyonel" }
  ];

  const [selectedWhereToShowOption, setSelectedWhereToShowOption] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const sendTypeOptions = [
    { key: "1", value: "Özel Liste" },
    { key: "2", value: "Son 3 gün içerisinde sipariş almış üyeler" }
  ];

  const [selectedSendTypeOption, setSelectedSendTypeOption] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [isSendLater, setIsSendLater] = useState<boolean>(false);

  const [receiverList, setReceiverList] = useState<AnnouncementReceiverModel[]>([]);

  const [receiverTempList, setReceiverTempList] = useState<AnnouncementReceiverModel[]>([]);

  const [isSms, setIsSms] = useState<boolean>(true);

  const [isPush, setIsPush] = useState<boolean>(true);

  const [isWebPush, setIsWebPush] = useState<boolean>(true);

  const [showSelectModal, setShowSelectModal] = useState<boolean>(false);

  const addFile = (e) => {
    if (e && e.length > 0) {
      setPhotoUrl(e[0].FileUrl);
    }
  }

  useEffect(() => {
    if (params.id) {
      getAnnouncementDetail();
    }
  }, [params.id]);

  useStateEffect(() => {
    if (announcementDetail && selectedWhereToShowOption.key !== String(announcementDetail.WhereToShow)) {
      setReceiverList(JSON.parse(JSON.stringify([])));
    }
    else if (announcementDetail && selectedWhereToShowOption.key === String(announcementDetail.WhereToShow)) {
      setReceiverList(JSON.parse(JSON.stringify(announcementDetail.ReceiverData)));
    }
    else {
      setReceiverList(JSON.parse(JSON.stringify([])));
    }
  }, [selectedWhereToShowOption]);

  const handleAddRemoveReceiverTempListSeller = (item: SellerModel) => {
    if (receiverTempList.find(x => x.StoreId === item.Id)) {
      let tempList: AnnouncementReceiverModel[] = receiverTempList.filter(x => x.StoreId !== item.Id);
      setReceiverTempList(JSON.parse(JSON.stringify(tempList)));
    }
    else {
      let tempList: AnnouncementReceiverModel[] = receiverTempList;
      tempList.push(
        {
          StoreId: item.Id,
          StoreName: item.StoreName,
          MembershipDateJSTime: 0
        }
      );
      setReceiverTempList(JSON.parse(JSON.stringify(tempList)));
    }
  }

  const handleAddRemoveReceiverTempListProfessional = (item: ProModel) => {
    if (receiverTempList.find(x => x.StoreId === item.Id)) {
      let tempList: AnnouncementReceiverModel[] = receiverTempList.filter(x => x.StoreId !== item.Id);
      setReceiverTempList(JSON.parse(JSON.stringify(tempList)));
    }
    else {
      let tempList: AnnouncementReceiverModel[] = receiverTempList;
      tempList.push(
        {
          StoreId: item.Id,
          StoreName: item.StoreName,
          MembershipDateJSTime: 0
        }
      );
      setReceiverTempList(JSON.parse(JSON.stringify(tempList)));
    }
  }

  const handleRemoveFromReceiverList = (StoreId: number) => {
    let tempList: AnnouncementReceiverModel[] = receiverList.filter(x => x.StoreId !== StoreId);
    setReceiverList(JSON.parse(JSON.stringify(tempList)));
  }

  const getAnnouncementDetail = async () => {
    setLoading(true);

    const _result = await ApiService.getAnnouncementDetail(Number(params.id ?? "0"));

    if (_result.succeeded === true) {
      setAnnouncementDetail(_result.data);
      setTitle(_result.data.Title);
      setDescription(_result.data.Description);
      setUrl(_result.data.RedirectUrl);
      setPhotoUrl(_result.data.PhotoUrl);
      setSelectedWhereToShowOption(whereToShowOptions.find(x => x.key === String(_result.data.WhereToShow)) ?? { key: "0", value: "Seçiniz..." });
      setSelectedSendTypeOption(sendTypeOptions.find(x => x.key === String(_result.data.SendOption)) ?? { key: "0", value: "Seçiniz..." });
      setIsSendLater(_result.data.IsSendLater);
      setReceiverList(JSON.parse(JSON.stringify(_result.data.ReceiverData)));
      setIsSms(_result.data.IsSendSms);
      setIsPush(_result.data.IsSendPush);
      setIsWebPush(_result.data.IsSendWebPush);

      setLoading(false);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setLoading(false); history.push("/duyuru-yonetimi"); }
      });
    }
  }

  const createAnnouncement = async () => {

    setPorcessLoading(true);

    const _result = await ApiService.createAnnouncement(title, description, url, photoUrl, Number(selectedWhereToShowOption.key), receiverList.map((item) => { return item.StoreId }), isSms, isPush, isWebPush, true, Number(selectedSendTypeOption.key));

    setPorcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Duyuru eklendi",
        onClose: () => { context.hideModal(); history.push("/duyuru-yonetimi"); }
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

  const createAnnouncementAndSendNotification = async () => {

    setPorcessLoading(true);

    const _result = await ApiService.createAnnouncementAndSendNotification(title, description, url, photoUrl, Number(selectedWhereToShowOption.key), receiverList.map((item) => { return item.StoreId }), isSms, isPush, isWebPush, false, Number(selectedSendTypeOption.key));

    setPorcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Duyuru eklendi ve gönderildi",
        onClose: () => { context.hideModal(); history.push("/duyuru-yonetimi"); }
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

  const updateAnnouncement = async () => {

    setPorcessLoading(true);

    const _result = await ApiService.updateAnnouncement(Number(params.id ?? "0"), title, description, url, photoUrl, Number(selectedWhereToShowOption.key), receiverList.map((item) => { return item.StoreId }), isSms, isPush, isWebPush, isSendLater, Number(selectedSendTypeOption.key));

    setPorcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Duyuru güncellendi",
        onClose: () => { context.hideModal(); history.push("/duyuru-yonetimi"); }
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

  const sendAnnouncementNotification = async () => {

    setPorcessLoading(true);

    const _result = await ApiService.sendAnnouncementNotification(Number(params.id ?? "0"));

    setPorcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Duyuru iletildi",
        onClose: () => { context.hideModal(); }
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

  const deleteAnnouncement = () => {
    context.showModal({
      type: "Question",
      title: "Duyuru Sil",
      message: "Duyuru silinecek. Emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.deleteAnnouncement(Number(params.id ?? "0"));

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Duyuru silindi",
            onClose: () => { context.hideModal(); history.push("/duyuru-yonetimi"); }
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

  const handleCancelEdit = () => {
    if (announcementDetail) {
      setTitle(announcementDetail.Title);
      setDescription(announcementDetail.Description);
      setUrl(announcementDetail.RedirectUrl);
      setSelectedWhereToShowOption(whereToShowOptions.find(x => x.key === String(announcementDetail.WhereToShow)) ?? { key: "0", value: "Seçiniz..." });
      setSelectedSendTypeOption(sendTypeOptions.find(x => x.key === String(announcementDetail.SendOption)) ?? { key: "0", value: "Seçiniz..." });
      setIsSms(announcementDetail.IsSendSms);
      setIsPush(announcementDetail.IsSendPush);
      setIsWebPush(announcementDetail.IsSendWebPush);
      setReceiverList(JSON.parse(JSON.stringify(announcementDetail.ReceiverData)));

      setIsEditActive(false);
    }
    else {
      history.push("/duyuru-yonetimi");
    }
  }

  const tableEl = useRef<any>();

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

  const getProList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getProList(page, take, order, searchText);

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

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={location.state?.prevPath ?? "/duyuru-yonetimi"} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            {location.state?.prevTitle ?? "Duyuru Yönetimi"}
          </div>
        </Link>
        <div className="flex justify-between items-center pb-5 border-b border-gray-200">
          <h2>Duyuru Detayı</h2>
          {
            (!isEditActive && announcementDetail) &&
            <div className="flex items-center gap-2">
              {
                announcementDetail.IsSendLater &&
                <>
                  <Button isLoading={processLoading} textTiny className="w-52" buttonSm design="button-blue-400" text="Duyuru Gönder" hasIcon icon={<BellIcon className="icon-sm mr-2" />} onClick={() => { sendAnnouncementNotification(); }} />
                  <Button isLoading={processLoading} textTiny className="w-36" buttonSm design="button-gray-100" text={"Düzenle"} hasIcon icon={<EditIcon className="icon-sm mr-2" />} onClick={() => { setIsEditActive(true); }} />
                </>
              }
              <Button isLoading={processLoading} textTiny className="w-28" buttonSm design="button-gray-100" text="Sil" hasIcon icon={<TrashIcon className="icon-sm mr-2" />} onClick={() => { deleteAnnouncement(); }} />
            </div>
          }
        </div>
        <div className="w-1/2">
          <Label className="mt-4" title="Duyuru Başlığı" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input disabled={!isEditActive} className={`${!isEditActive ? "bg-gray-100" : ""} form-input`} type="text" value={title} onChange={(e) => { setTitle(e.target.value); }} />
          }
          <Label className="mt-4" title="Duyuru İçeriği" withoutDots isRequired />
          {
            loading ?
              <Loading inputMd />
              :
              <TextArea disabled={!isEditActive} setText={setDescription} text={description} maxCount={200} />
          }
          <Label className="mt-4" title="Duyurunun Yönlendireceği Sayfa (URL)" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input disabled={!isEditActive} className={`${!isEditActive ? "bg-gray-100" : ""} form-input`} type="text" value={url} onChange={(e) => { setUrl(e.target.value); }} />
          }
          <Label className="mt-4" title="Görsel" withoutDots />
          {
            loading ?
              <Loading inputSm />
              :
              <>
                <Dropzone
                  disabled={!isEditActive}
                  fileUploaderCss
                  accept={["image"]}
                  addFiles={addFile}
                  maxFileSizeAsMB={5}
                  uploadUrl={SERVICES.API_ADMIN_GENERAL_URL + "/upload-general-content-media"}
                  maxFileCount={1}
                ></Dropzone>
                {
                  (photoUrl !== "" && photoUrl !== undefined && photoUrl !== null) &&
                  <img src={photoUrl} className="w-72 h-48 object-contain" />
                }
              </>
          }
          <Label className="mt-4" title="Gönderim Alanı" isRequired withoutDots />
          {
            loading ?
              <Loading inputSm />
              :
              <Dropdown
                isDisabled={!isEditActive}
                isDropDownOpen={currentOpenedFilterButton === "whereToSelect"}
                onClick={() => { setCurrentOpenedFilterButton("whereToSelect"); }}
                className="w-full text-black-700 text-sm border-gray-300"
                label={selectedWhereToShowOption.value}
                items={whereToShowOptions}
                onItemSelected={item => { setSelectedWhereToShowOption(item); }} />
          }
          <Label className="mt-4" title="Seçenekler" isRequired withoutDots />
          {
            loading ?
              <Loading inputSm />
              :
              <Dropdown
                isDisabled={!isEditActive || selectedWhereToShowOption.key === "0"}
                isDropDownOpen={currentOpenedFilterButton === "typeSelect"}
                onClick={() => { setCurrentOpenedFilterButton("typeSelect"); }}
                className="w-full text-black-700 text-sm border-gray-300"
                label={selectedSendTypeOption.value}
                items={sendTypeOptions}
                onItemSelected={item => { setSelectedSendTypeOption(item); }} />
          }
        </div>
        {
          selectedSendTypeOption.key === "1" &&
          <>
            <div className="py-4 mt-4 border-t border-gray-200">
              <h2>Özel Liste</h2>
              {
                isEditActive &&
                <Button buttonMd textTiny color="text-blue-400" className="w-48 mt-4" design="button-blue-100" text={selectedWhereToShowOption.key === "1" ? "Satıcı Seç" : selectedWhereToShowOption.key === "2" ? "Profesyonel Seç" : ""} hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { setReceiverTempList(JSON.parse(JSON.stringify(receiverList))); setShowSelectModal(true); }} />
              }
              <div className="mt-4 lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                <div className="lg:col-span-12">
                  <span className="p-sm-gray-400">
                    Mağaza Adı
                  </span>
                </div>
              </div>
              {
                receiverList.length > 0 ?
                  <>
                    {
                      receiverList.map((e, i) => (
                        <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
                          <div className="lg:col-span-12 flex items-center justify-between">
                            <p className="p-sm">
                              {e.StoreName}
                            </p>
                            {
                              isEditActive &&
                              <div className="text-gray-700 flex gap-2 items-center">
                                <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { handleRemoveFromReceiverList(e.StoreId); }} />
                              </div>
                            }
                          </div>
                        </div>
                      ))
                    }
                  </>
                  :
                  <div className="pt-4">
                    <EmptyList text="Seçili Üye Bulunamadı" />
                  </div>
              }
            </div>
          </>
        }
        <div className="w-1/2">
          {
            loading ?
              <Loading textMd />
              :
              <>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-gray-600 text-sm">SMS olarak bildir</div>
                  <div className="ml-auto">
                    <ToggleButton isDisabled={!isEditActive} onClick={() => { setIsSms(!isSms) }} defaultValue={isSms} />
                  </div>
                </div>
              </>
          }
          {
            loading ?
              <Loading textMd />
              :
              <>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-gray-600 text-sm">Push gönder</div>
                  <div className="ml-auto">
                    <ToggleButton isDisabled={!isEditActive} onClick={() => { setIsPush(!isPush) }} defaultValue={isPush} />
                  </div>
                </div>
              </>
          }
          {
            loading ?
              <Loading textMd />
              :
              <>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-gray-600 text-sm">Web Push gönder</div>
                  <div className="ml-auto">
                    <ToggleButton isDisabled={!isEditActive} onClick={() => { setIsWebPush(!isWebPush) }} defaultValue={isWebPush} />
                  </div>
                </div>
              </>
          }
        </div>
        {
          isEditActive &&
          <div className="flex items-center gap-4 justify-end mt-12">
            <Button isLoading={processLoading} textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { handleCancelEdit(); }} />
            <Button isLoading={processLoading} textTiny className="w-72" text="Kaydet" design="button-blue-400" onClick={() => {
              if (announcementDetail) {
                updateAnnouncement();
              }
              else {
                createAnnouncement();
              }
            }} />
            {
              !announcementDetail &&
              <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-100" color={"text-blue-400"} text="Duyuru Gönder" onClick={() => { createAnnouncementAndSendNotification(); }} />
            }
          </div>
        }
      </div>
      <Modal
        modalType="fixedMd"
        showModal={showSelectModal}
        onClose={() => { setShowSelectModal(false); }}
        title={selectedWhereToShowOption.key === "1" ? "Satıcı Seç" : selectedWhereToShowOption.key === "2" ? "Profesyonel Seç" : ""}
        body=
        {
          <div className="">
            <div className="flex gap-3 justify-end items-center text-sm my-4">
              <div className="text-gray-700"><span className="text-gray-900 font-medium">{receiverTempList.length} / 200</span>{selectedWhereToShowOption.key === "1" ? " Satıcı Seçildi" : selectedWhereToShowOption.key === "2" ? " Profesyonel Seçildi" : ""}</div>
              <Button buttonMd text={selectedWhereToShowOption.key === "1" ? "Seçili Satıcıları Ekle" : selectedWhereToShowOption.key === "2" ? "Seçili Profesyonelleri Ekle" : ""} design="button-blue-400 w-60" onClick={() => {
                setReceiverList(JSON.parse(JSON.stringify(receiverTempList))); setShowSelectModal(false);
              }} />
            </div>
            {
              selectedWhereToShowOption.key === "1" ?
                <>
                  <Table
                    ref={tableEl}
                    emptyListText={"Satıcı Bulunamadı"}
                    getDataFunction={getSellerApprovedList}
                    header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                      <div className="lg:col-span-6">
                        <span className="p-sm-gray-400">
                          Mağaza Adı
                        </span>
                      </div>
                    </div>}
                    renderItem={(e: SellerModel, i) => {
                      return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
                        <div className="lg:col-span-12 flex items-center justify-between">
                          <p className="p-sm">
                            {e.StoreName}
                          </p>
                          {
                            receiverTempList.find(x => x.StoreId === e.Id) ?
                              <>
                                <Button text="" hasIcon className="w-16" buttonSm design="button-blue-400" icon={<CheckIcon className="icon-sm text-white" />} onClick={() => { handleAddRemoveReceiverTempListSeller(e); }} />
                              </>
                              :
                              <>
                                <Button text="Seç" className="w-16" buttonSm hasIcon design="button-blue-100 text-blue-400" onClick={() => { handleAddRemoveReceiverTempListSeller(e); }} />
                              </>
                          }
                        </div>
                      </div>
                    }}
                  />
                </>
                :
                selectedWhereToShowOption.key === "2" ?
                  <>
                    <Table
                      ref={tableEl}
                      emptyListText={"Profesyonel Bulunamadı"}
                      getDataFunction={getProList}
                      header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                        <div className="lg:col-span-12">
                          <span className="p-sm-gray-400">
                            Mağaza Adı
                          </span>
                        </div>
                      </div>}
                      renderItem={(e: ProModel, i) => {
                        return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
                          <div className="lg:col-span-12 flex items-center justify-between">
                            <p className="p-sm">
                              {e.StoreName}
                            </p>
                            {
                              receiverTempList.find(x => x.StoreId === e.Id) ?
                                <>
                                  <Button text="" hasIcon className="w-16" buttonSm design="button-blue-400" icon={<CheckIcon className="icon-sm text-white" />} onClick={() => { handleAddRemoveReceiverTempListProfessional(e); }} />
                                </>
                                :
                                <>
                                  <Button text="Seç" className="w-16" buttonSm hasIcon design="button-blue-100 text-blue-400" onClick={() => { handleAddRemoveReceiverTempListProfessional(e); }} />
                                </>
                            }
                          </div>
                        </div>
                      }}
                    />
                  </>
                  :
                  <></>
            }
          </div>
        }
      />
    </div>
  )
}
