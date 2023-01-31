import React, { FunctionComponent, useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import { Button } from "../Components/Button";
import { FileUploader } from "../Components/FileUploader";
import { Label } from "../Components/Label";
import { ToggleButton } from "../Components/ToggleButton";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const HelpGroupAdd: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [groupName, setGroupName] = useState<string>("");

  const [selectedPhoto, setSelectedPhoto] = useState<File | undefined>();

  const [displayOrder, setDisplayOrder] = useState<number>(0);

  const [description, setDescription] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  const handleSaveGroup = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createHelpGroup(groupName, selectedPhoto, displayOrder ?? 0, description, isEnabled);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Yeni yardım grubu başarıyla oluşturuldu",
        onClose: () => { context.hideModal(); history.push('/yardim-grup-listesi'); }
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
        <h2 className="border-b pb-5">Yeni Yardım Grubu Oluştur</h2>
        <div className="flex flex-col">
          <div className="w-1/2">
            <Label isRequired withoutDots title="Grup Adı" className="mt-4" />
            <input className="form-input" value={groupName} onChange={(e) => { setGroupName(e.target.value) }} />
            <Label isRequired withoutDots title="Grup Görseli" className="mt-4" />
            <FileUploader onFileSelected={item => { setSelectedPhoto(item) }} sizeDescription={"52x52 px"} />
            <Label isRequired withoutDots title="Grup Sıralaması" className="mt-4" />
            <input className="form-input" type="number" value={displayOrder} onChange={(e) => { setDisplayOrder(parseInt(e.target.value)) }} />
            <Label withoutDots title="Genel Grup Açıklaması" className="mt-4" />
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm w-full px-3 py-2 text-black-700 border rounded-lg focus:outline-none resize-none leading-5 mb-1"
              value={description}
              rows={3}
            />
            <div className="flex items-center justify-between mb-4">
              <span className="p-sm font-medium text-gray-700">Grubu aktif olarak göster</span>
              <ToggleButton onClick={() => { setIsEnabled(!isEnabled) }} defaultValue={isEnabled} />
            </div>
          </div>
          <Button isLoading={processLoading} textTiny design="button-blue-400 ml-auto w-72" text="Kaydet ve Tamamla" onClick={() => { handleSaveGroup(); }} />
        </div>
      </div>
    </div>
  )
}
