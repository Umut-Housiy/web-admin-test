import React, { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { useHistory } from "react-router";

import { Label } from "../Components/Label";
import { FileUploader } from "../Components/FileUploader";
import { Button } from "../Components/Button";
import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronRightIcon, EditIcon, EyeIcon, EyeOffIcon, SubListIcon, TrashIcon } from "../Components/Icons";
import { TabsTitle } from "../Components/TabsTitle";
import { SellerCategoryGroupListInnerModel } from "../Models";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import ApiService from "../Services/ApiService";
import { Loading } from "../Components/Loading";
import { Table } from "../Components/Table";
import { Image } from "../Components/Image";


interface RouteParams {
  id: string
}

interface LocationModel {
  isEditActive: boolean,
  queryPage: number
}

export const SellerCategoryGroupDetail: FunctionComponent = () => {

  const [groupDetail, setGroupDetail] = useState<SellerCategoryGroupListInnerModel>(
    {
      Id: 0,
      OrderBy: 0,
      PhotoPath: "",
      GroupName: "",
      GroupDescription: "",
      IsActive: false
    }
  );

  const tabsLink = [
    { id: 1, name: `Grup Bilgisi` },
    { id: 2, name: `Gruba Bağlı Kategori Listesi` },
  ]
  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const params = useParams<RouteParams>();

  const location = useLocation<LocationModel>();

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [isEditActive, setIsEditActive] = useState<boolean>(location?.state?.isEditActive ?? false)

  const [groupId, setGroupId] = useState<number>(Number(params.id))

  const [orderBy, setOrderBy] = useState<number>(0);

  const [groupName, setGroupName] = useState<string>("");

  const [groupPhoto, setGroupPhoto] = useState<string>("");

  var file = new File([""], "empty.txt", {
    type: "text/plain",
  });

  const [selectedFile, setSelectedFile] = useState<File>(file);

  const [groupDescription, setGroupDescription] = useState<string>("");

  const [isActive, setIsActive] = useState<boolean>(true);


  useEffect(() => {
    getSellerCategoryGroupDetail();
  }, [])

  const getSellerCategoryGroupDetail = async () => {
    setLoading(true);

    const _result = await ApiService.getSellerCategoryGroupDetail(groupId);

    if (_result.succeeded === true) {
      setGroupDetail(_result.data.groupData);
      setGroupName(_result.data.groupData.GroupName);
      setOrderBy(_result.data.groupData.OrderBy);
      setGroupPhoto(_result.data.groupData.PhotoPath)
      setGroupDescription(_result.data.groupData.GroupDescription);
      setIsActive(_result.data.groupData.IsActive);

      setLoading(false);
    }
    else {
      setLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push('/satici-kategori-grup-listesi') }
      });
    }
  }

  const updateSellerCategoryGroupDetail = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateSellerCategoryGroupDetail(groupId, groupName, orderBy, groupDescription, isActive, selectedFile);

    setProcessLoading(false);

    if (_result.succeeded === true) {

      setIsEditActive(false);

      const _curryObj: SellerCategoryGroupListInnerModel = groupDetail;
      _curryObj.Id = groupId;
      _curryObj.OrderBy = orderBy;
      _curryObj.PhotoPath = selectedFile.size > 0 ? URL.createObjectURL(selectedFile) : groupPhoto;
      _curryObj.GroupName = groupName;
      _curryObj.GroupDescription = groupDescription;
      _curryObj.IsActive = isActive;

      { selectedFile.size > 0 && setGroupPhoto(URL.createObjectURL(selectedFile)) }

      context.showModal({
        type: "Success",
        title: "Satıcı kategori grubu başarıyla güncellendi",
        onClose: () => { context.hideModal() }
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

  const showChangeSellerCategoryGroupStatus = () => {
    context.showModal({
      type: "Question",
      title: "Satıcı grup durumunu değiştir",
      message: `Satıcı grubunu ${isActive ? "pasif" : "aktif"} duruma geçirmek istediğinize emin misiniz?`,
      onClose: () => { context.hideModal(); },
      onClick: async () => {
        setProcessLoading(true);

        const _result = await ApiService.changeSellerCategoryGroupStatus(groupId, !isActive);

        setProcessLoading(false);
        context.hideModal();

        if (_result.succeeded === true) {
          setIsActive(!isActive);
          context.showModal({
            type: "Success",
            title: `Kategori başarıyla ${!isActive ? "aktif" : "pasif"} duruma geçirildi`,
            onClose: () => { context.hideModal(); }
          });
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => { context.hideModal(); }
          });
        } return true;
      },
    })
  }

  const showDeleteSellerCategoryGroup = () => {
    context.showModal({
      type: "Question",
      title: "Kategori Grubunu Sil",
      message: `${groupName} isimli kategori grubunu silmek istediğinize emin misiniz?`,
      onClose: () => { context.hideModal(); },
      onClick: async () => {
        setProcessLoading(true);

        const _result = await ApiService.removeSellerCategoryGroup(groupId);

        setProcessLoading(false);
        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Kategori grubu başarıyla silindi",
            onClose: () => { context.hideModal(); history.push('/satici-kategori-grup-listesi') }
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
    })
  }

  const handleClearInput = () => {
    setIsEditActive(false);
    setGroupName(groupDetail.GroupName);
    setOrderBy(groupDetail.OrderBy);
    setGroupPhoto(groupDetail.PhotoPath)
    setGroupDescription(groupDetail.GroupDescription);
    setIsActive(groupDetail.IsActive);
    setSelectedFile(file)
  }

  //#region TABS 2 START

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" },
  ]

  const tableEl = useRef<any>();

  const getSellerCategoryListForGroups = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerCategoryListForGroups(Number(params.id), page, take, searchText, order);

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

  //#endregion


  return (
    <div className="content-wrapper mb-5">
      <div className="portlet-wrapper">
        <Link to={`${location.state?.queryPage !== 1 ? `/satici-kategori-grup-listesi?sayfa=${location.state?.queryPage ?? 1}` : "/satici-kategori-grup-listesi"}`} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Kategori Grup Listesi
          </div>
        </Link>
        <div className="flex align-items-center mb-5">
          <h2>Kategori Grup Detayı</h2>
          {!isEditActive &&
            <div className="ml-auto flex gap-2">
              <Button pageLoading={loading} isLoading={processLoading} textTiny className="w-72 ml-auto" buttonSm design="button-blue-400" text="Grup Bilgilerini Düzenle" hasIcon icon={<EditIcon className="icon-sm mr-2" />} onClick={() => { setIsEditActive(true) }} />
              <Button pageLoading={loading} isLoading={processLoading} textTiny className={`${isEditActive ? "ml-auto" : "ml-2"} w-60`} buttonSm design="button-gray-100" text={`Kategoriyi ${isActive ? "Pasife" : "Aktife"} Al`} hasIcon icon={
                isActive ?
                  <EyeOffIcon className="icon-sm mr-2" />
                  :
                  <EyeIcon className="icon-sm mr-2" />
              }
                onClick={() => { showChangeSellerCategoryGroupStatus(); }} />
              <Button pageLoading={loading} isLoading={processLoading} textTiny className="w-32 ml-2" buttonSm design="button-gray-100" text="Sil" hasIcon icon={<TrashIcon className="icon-sm mr-2" />} onClick={() => { showDeleteSellerCategoryGroup(); }} />
            </div>
          }
        </div>
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id); }} />
        {selectedTabsId === 1 ? <>
          <div className="w-1/2">
            <Label className="mt-6" title="Grup Adı" withoutDots isRequired />
            {loading ?
              <Loading inputSm />
              :
              <input className={`${isEditActive ? "" : "bg-gray-100"} form-input`} type="text" placeholder="Grup Adı" disabled={!isEditActive} value={groupName} onChange={(e) => { setGroupName(e.target.value) }} />
            }
            <Label className="mt-6" title="Grup Sıralaması" withoutDots isRequired />
            {loading ?
              <Loading inputSm />
              :
              <input className={`${isEditActive ? "" : "bg-gray-100"} form-input`} type="text" placeholder="Grup Sıralaması" disabled={!isEditActive} value={orderBy} onChange={(e) => { setOrderBy(parseInt(e.target.value)) }} />
            }
            <Label className="mt-6" title="Grup Görseli" withoutDots isRequired />
            {isEditActive &&
              <div className="mb-2">
                {loading ?
                  <Loading inputSm />
                  :
                  <FileUploader onFileSelected={item => { setSelectedFile(item) }} oldPreview={groupPhoto} isLoading={loading} sizeDescription={"242x194 px"} warningDescription={"Yüklenen görseller seçili gösterim alanlarına göre otomatik boyutlandırılacaktır."} />

                }
              </div>
            }
            {loading ?
              <Loading height="h-20" width="w-20" />
              :
              isEditActive === false &&
              <img src={groupPhoto} alt={groupName} className="w-20 h-20 rounded-lg object-contain" />
            }
            <Label className="mt-6" title="Grup Açıklaması" withoutDots />
            {loading ?
              <Loading inputMd />
              :
              <textarea className={`${isEditActive ? "" : "bg-gray-100"} w-full text-sm p-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none resize-none leading-5`}
                placeholder="Grup detayında görünecek ve kullanıcıları bilgilendirecek bir açıklama yazısı ekleyin."
                rows={3} disabled={!isEditActive} value={groupDescription} onChange={(e) => { setGroupDescription(e.target.value) }} />
            }
          </div>
          {isEditActive &&
            <div className="flex">
              <Button textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { handleClearInput(); }} />
              <Button textTiny isLoading={processLoading} className="w-72" design="button-blue-400" text="Değişiklikleri Kaydet" onClick={() => { updateSellerCategoryGroupDetail(); }} />
            </div>
          }
        </>
          :
          <>
            <Table
              ref={tableEl}
              emptyListText={"Veri Bulunamadı"}
              getDataFunction={getSellerCategoryListForGroups}
              header={
                <div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4 flex items-center">
                  <div className="lg:col-span-2 flex items-center">
                    <span className="p-sm-gray-400">
                      Kategori Görseli
                    </span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">
                      Kategori Adı
                    </span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">
                      Kategori Kodu
                    </span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">
                      Üst Kategori
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">
                      Kategori Sırası
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">
                      Komisyonu
                    </span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">
                      Durum
                    </span>
                  </div>
                </div>
              }
              renderItem={(e, i) => {
                return <div className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center" key={i} >
                  <div className="lg:col-span-2 flex items-center">
                    <Image src={e.PhotoPath} alt={e.CategoryName} className="w-14 h-14 object-contain" />
                  </div>
                  <div className="lg:col-span-2  flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Adı: </span>
                    <p className="p-sm">
                      {e.CategoryName}
                    </p>
                  </div>
                  <div className="lg:col-span-2  flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Kodu: </span>
                    <p className="p-sm">
                      {e.CategoryCode}
                    </p>
                  </div>
                  <div className="lg:col-span-2  flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Üst Kategori: </span>
                    <p className="p-sm">
                      {e.ParentName ? e.ParentName : "-"}
                    </p>
                  </div>
                  <div className="lg:col-span-1  flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Sırası: </span>
                    <p className="p-sm">
                      {e.CategoryOrder}
                    </p>
                  </div>
                  <div className="lg:col-span-1  flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2"> Komisyonu: </span>
                    <p className="p-sm">
                      %{e.CommissionPercentage}
                    </p>
                  </div>
                  <div className="lg:col-span-2 flex justify-between">
                    <div className="flex items-center">
                      <span className="p-sm-gray-700 lg:hidden mr-2">Durum: </span>
                      <p className={`${e.CategoryStatus === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                        {e.CategoryStatus === true ? "Aktif" : "Pasif"}
                      </p>
                    </div>

                    <div className="text-gray-700 flex gap-2 items-center">
                      <Link to={{ pathname: `${"/satici-alt-kategori-listesi/" + e.Id}`, state: { prevTitle: "Kategori Grup Listesi", prevPath: window.location.pathname } }} >
                        <SubListIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all  mx-1" />
                      </Link>
                      <Link to={{ pathname: `${"/satici-kategori-bilgileri-detay/" + e.Id}`, state: { isEditActive: true } }} >
                        <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" />
                      </Link>
                      <Link to={{ pathname: `${"/satici-kategori-bilgileri-detay/" + e.Id}`, state: { isEditActive: false } }} >
                        <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              }}
              sortOptions={sortOptions}
            />
          </>
        }
      </div>
    </div>
  )
}
