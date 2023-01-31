import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { Button } from "../Components/Button";
import { FileUploader } from "../Components/FileUploader";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { ToggleButton } from "../Components/ToggleButton";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

interface RouteParams {
  id: string,
}

export const HelpGroupDetail: FunctionComponent = () => {
  const params = useParams<RouteParams>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [Id, setId] = useState<number>(Number(params.id));

  const [groupName, setGroupName] = useState<string>("");

  const [oldGroupPhoto, setOldGroupPhoto] = useState<string>("");

  const [selectedPhoto, setSelectedPhoto] = useState<File | undefined>();

  const [displayOrder, setDisplayOrder] = useState<number>();

  const [description, setDescription] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  useEffect(() => {
    getHelpGroupDetail();
  }, []);

  const getHelpGroupDetail = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getHelpGroupDetail(Id);

    if (_result.succeeded === true) {
      setGroupName(_result.data.Title);
      setDisplayOrder(_result.data.OrderBy);
      setOldGroupPhoto(_result.data.PhotoUrl);
      setDescription(_result.data.Description ?? "");
      setIsEnabled(_result.data.IsEnabled);

      setLoading(false);
      setProcessLoading(false);
    }
    else {
      setLoading(false);
      setProcessLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push('/yardim-grup-listesi'); }
      });
    }
  }

  const handleUpdateHelpGroup = async () => {
    setProcessLoading(true);

    const _result = await ApiService.handleUpdateHelpGroup(Id, groupName, selectedPhoto, displayOrder ?? 0, description, isEnabled);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Yardım grubu başarıyla güncellendi",
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

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="border-b pb-5">Grup Bilgilerini Düzenle</h2>
        <div className="flex flex-col">
          <div className="w-1/2">
            <Label isRequired withoutDots title="Grup Adı" className="mt-4" />
            {
              loading ?
                <Loading inputSm />
                :
                <input className={`${loading ? "loading-form-input" : "form-input"}`} value={groupName} onChange={(e) => { setGroupName(e.target.value) }} />
            }
            <Label isRequired withoutDots title="Grup Görseli" className="mt-4" />
            {
              loading ?
                <Loading inputSm />
                :
                <FileUploader onFileSelected={item => { setSelectedPhoto(item) }} oldPreview={oldGroupPhoto} isLoading={loading} sizeDescription={"52x52 px"} />
            }
            <Label isRequired withoutDots title="Grup Sıralaması" className="mt-4" />
            {
              loading ?
                <Loading inputSm />
                :
                <input className="form-input" value={displayOrder} onChange={(e) => { setDisplayOrder(parseInt(e.target.value)) }} />
            }
            <Label withoutDots title="Genel Grup Açıklaması" className="mt-4" />
            {
              loading ?
                <Loading inputMd />
                :
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-sm w-full px-3 py-2 text-black-700 border rounded-lg focus:outline-none resize-none leading-5 mb-1"
                  value={description}
                  rows={3}
                />
            }
            {
              loading ?
                <Loading textMd />
                :
                <div className="flex items-center justify-between mb-4">
                  <span className="p-sm font-medium text-gray-700">Grubu aktif olarak göster</span>
                  <ToggleButton onClick={() => { setIsEnabled(!isEnabled) }} defaultValue={isEnabled} />
                </div>
            }
          </div>
          <div className="flex">
            <Button textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { history.push('/yardim-grup-listesi'); }} />
            <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Değişiklikleri Kaydet" onClick={() => { handleUpdateHelpGroup() }} />
          </div>
        </div>
      </div>
    </div>

  )
}
