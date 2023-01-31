import React, { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { FileUploader } from "../Components/FileUploader";
import { ChevronRightIcon, EditIcon, EyeOffIcon, StarIcon, TrashIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { Image } from "../Components/Image";
import { TabsTitle } from "../Components/TabsTitle";
import { ToggleButton } from "../Components/ToggleButton";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { BadgeModel } from "../Models";
import { Table } from "../Components/Table";

interface RouteParams {
  id: string
}

interface LocationModel {
  isEditActive: boolean,
  queryPage: number
}

export const ProBadgeDetail: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const params = useParams<RouteParams>();

  const location = useLocation<LocationModel>();

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const [processloading, setProcessLoading] = useState<boolean>(false);

  const [isEditActive, setIsEditActive] = useState<boolean>(location.state?.isEditActive ?? false);

  const tabList = [{ id: 1, name: "Rozet Bilgisi" }, { id: 2, name: "Atanmış Profesyonel Listesi" }];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const [badgeDetail, setBadgeDetail] = useState<BadgeModel>();

  const [badgeName, setBadgeName] = useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const [oldPhoto, setOldPhoto] = useState<string>("");

  const [description, setDescription] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const tableEl = useRef<any>();

  useEffect(() => {
    getBadgeDetail();
  }, []);

  const getBadgeDetail = async () => {
    setLoading(true);

    const _result = await ApiService.getBadgeDetail(Number(params.id));

    if (_result.succeeded === true) {
      setBadgeDetail(_result.data);
      setBadgeName(_result.data.Name);
      setDescription(_result.data.Description);
      setIsEnabled(_result.data.IsEnabled);
      setOldPhoto(_result.data.PhotoUrl);

      setLoading(false);
    }
    else {
      setLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push("/pro-rozet-listesi"); }
      });
    }
  }

  const updateBadge = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateBadge(Number(params.id), badgeName, selectedFile, description);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => { context.hideModal(); history.push("/pro-rozet-listesi"); }
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

  const changeBadgeStatus = () => {
    context.showModal({
      type: "Question",
      message: isEnabled ? "Rozeti pasif duruma geçirmek istediğinizden emin misiniz?" : "Rozeti aktif duruma geçirmek istediğinizden emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.changeBadgeStatus(Number(params.id), !isEnabled);

        context.hideModal();

        if (_result.succeeded === true) {
          setIsEnabled(!isEnabled);
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

  const deleteBadge = () => {
    context.showModal({
      type: "Question",
      title: "Rozet Sil",
      message: "Rozet silinecek. Emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.deleteBadge(Number(params.id));

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Rozet silindi.",
            onClose: () => { context.hideModal(); history.push("/pro-rozet-listesi"); }
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

  const getProListForBadgeDetail = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProListForBadgeDetail(page, take, searchText, order, Number(params.id ?? "0"));

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

  const handleChangeTab = (Id) => {
    if (isEditActive) {
      context.showModal({
        type: "Error",
        message: "Devam etmek için lütfen değişiklikleri kaydediniz.",
        onClose: () => { context.hideModal(); }
      });
    }
    else {
      setSelectedTabsId(Id)
    }
  }

  const handleCanceUpdate = () => {
    setBadgeName(badgeDetail?.Name ?? "");
    setDescription(badgeDetail?.Description ?? "");
    setSelectedFile(undefined);
    setIsEditActive(false);
  }

  const removeAssignmentFromBadge = (proId) => {
    context.showModal({
      type: "Question",
      title: "Rozet Kaldır",
      message: "Rozet seçili profesyonelden kaldırılacak. Emin misiniz?",
      onClick: async () => {
        const _result = await ApiService.removeAssignmentFromBadge(proId, Number(params.id));

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Rozet kaldırıldı.",
            onClose: () => { context.hideModal(); }
          });
          if (tableEl.current) {
            tableEl.current?.reload();
          }
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

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={`${location.state?.queryPage !== 1 ? `/pro-rozet-listesi?sayfa=${location.state?.queryPage ?? 1}` : "/pro-rozet-listesi"}`} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Rozet Listesi
          </div>
        </Link>
        <div className="flex align-items-center mb-5">
          <h2>Rozet Detayı</h2>
          {
            (!isEditActive) &&
            <>
              <Button isLoading={processloading} textTiny className="w-72 ml-auto" buttonSm design="button-blue-400" text="Rozet Bilgilerini Düzenle" hasIcon icon={<EditIcon className="icon-sm mr-2" />} onClick={() => { setIsEditActive(true); setSelectedTabsId(1); }} />
              <Button isLoading={processloading} textTiny className={`${isEditActive ? "ml-auto" : "ml-2"} w-60`} buttonSm design="button-gray-100" text={isEnabled ? "Rozeti Pasife Al" : "Rozeti Aktifleştir"} hasIcon icon={<EyeOffIcon className="icon-sm mr-2" />} onClick={() => { changeBadgeStatus(); }} />
              <Button isLoading={processloading} textTiny className="w-32 ml-2" buttonSm design="button-gray-100" text="Sil" hasIcon icon={<TrashIcon className="icon-sm mr-2" />} onClick={() => { deleteBadge(); }} />
            </>
          }
        </div>
        <TabsTitle list={tabList} selectedTabsId={selectedTabsId} onItemSelected={item => { handleChangeTab(item.id) }} />
        {
          selectedTabsId === 1 ?
            <div className="border-t border-gray-200">
              <div className="w-1/2">
                <Label className="mt-6" title="Kategori Adı" withoutDots isRequired />
                {
                  loading ?
                    <Loading inputSm />
                    :
                    <input className={`${isEditActive ? "" : "bg-gray-100"} form-input`} type="text" placeholder="Rozet Adı" disabled={!isEditActive} value={badgeName} onChange={(e) => { setBadgeName(e.target.value) }} />
                }
                <Label className="mt-6" title="Rozet Görseli" withoutDots isRequired />
                {
                  loading ?
                    <Loading inputSm />
                    :
                    isEditActive ?
                      <FileUploader oldPreview={oldPhoto} onFileSelected={item => { setSelectedFile(item) }} sizeDescription={"(Min.) 144x144 px"} />
                      :
                      <Image src={oldPhoto} className="w-20 h-20 rounded-lg object-contain"></Image>

                }
                <Label className="mt-6" title="Rozet Açıklaması" withoutDots isRequired />
                {
                  loading ?
                    <Loading inputMd />
                    :
                    <textarea className={`${isEditActive ? "" : "disabled-50 bg-gray-100"} w-full text-sm p-3 text-gray-900 border  border-gray-300 rounded-lg focus:outline-none resize-none leading-5`}
                      placeholder="Kategori detayında görünecek ve kullanıcıları bilgilendirecek bir açıklama yazısı ekleyin."
                      rows={3} disabled={!isEditActive} value={description} onChange={(e) => { setDescription(e.target.value) }} />
                }
              </div>
              {
                isEditActive &&
                <div className="flex">
                  <Button isLoading={processloading} textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { handleCanceUpdate(); }} />
                  <Button isLoading={processloading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updateBadge(); }} />
                </div>
              }
            </div>
            :
            selectedTabsId === 2 ?
              <>
                <Table
                  ref={tableEl}
                  key={"1"}
                  emptyListText={"Profesyonel Bulunamadı"}
                  getDataFunction={getProListForBadgeDetail}
                  header={<div className=" lg:grid-cols-6 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Profesyonel Adı
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Profesyonel Puanı
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Favoriye Eklenme Sayısı
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Aktif İş Sayısı
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Tamamlanan Hizmet Sayısı
                      </span>
                    </div>
                    <div className="lg:col-span-1">
                      <span className="p-sm-gray-400">
                        Rozet Atama Tarihi
                      </span>
                    </div>
                  </div>}
                  renderItem={(e, i) => {
                    return <div className=" lg:grid-cols-6 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4" key={i}>
                      <div className="lg:col-span-1">
                        <span className="p-sm">
                          {e.StoreName}
                        </span>
                      </div>
                      <div className="lg:col-span-1">
                        <div className="flex items-center gap-2">
                          <StarIcon className="w-4 h-4 text-yellow-600" />
                          <span className="text-yellow-600 text-sm">{e.StoreRate}</span>
                        </div>
                      </div>
                      <div className="lg:col-span-1">
                        <span className="p-sm ">
                          {e.FavoriteCount}
                        </span>
                      </div>
                      <div className="lg:col-span-1">
                        <span className="p-sm ">
                          {e.OfferCount}
                        </span>
                      </div>
                      <div className="lg:col-span-1">
                        <span className="p-sm ">
                          {e.ServiceCount}
                        </span>
                      </div>
                      <div className="lg:col-span-1 flex justify-between ">
                        <span className="p-sm ">
                          {e.AssignmentDate}
                        </span>
                        <div className="text-gray-700 flex gap-2 items-center">
                          <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { removeAssignmentFromBadge(e.Id); }} />
                          <Link to={{ pathname: `${"/pro-profesyonel-detay/" + e.Id}`, state: { prevTitle: "Profesyonel Listesi", prevPath: "/pro-profesyonel-listesi", tabId: 6 } }} >
                            <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  }}
                />
              </>
              :
              <></>
        }

      </div>
    </div>
  )
}
