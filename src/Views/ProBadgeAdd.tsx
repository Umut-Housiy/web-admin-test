import React, { FunctionComponent, useContext, useState } from "react"
import { useHistory } from "react-router-dom";
import { Button } from "../Components/Button";
import { FileUploader } from "../Components/FileUploader";
import { Label } from "../Components/Label";
import { ToggleButton } from "../Components/ToggleButton";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const ProBadgeAdd: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [processloading, setProcessLoading] = useState<boolean>(false);

  const [badgeName, setBadgeName] = useState<string>("");

  const [badgeDescription, setBadgeDescription] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const createBadge = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createBadge(badgeName, selectedFile, badgeDescription, isEnabled);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Rozet oluşturuldu.",
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

  return (
    <div className="content-wrapper mb-5">
      <div className="portlet-wrapper">
        <h2 className="mb-5">
          Yeni Rozet Oluştur
        </h2>
        <div className="border-t border-gray-200">
          <div className="w-1/2">
            <Label className="mt-4" title="Rozet Adı" withoutDots isRequired />
            <input className="form-input" type="text" placeholder="Rozet Adı" value={badgeName} onChange={(e) => { setBadgeName(e.target.value) }} />
            <Label className="mt-4" title="Rozet Görseli" withoutDots isRequired />
            <FileUploader onFileSelected={item => { setSelectedFile(item) }} sizeDescription={"(Min.) 144x144 px"} />
            <Label className="mt-4" title="Rozet Açıklaması" withoutDots isRequired />
            <textarea className="form-input resize-none leading-5"
              placeholder="Bu rozet hakkında kısa bir açıklama yazın."
              rows={3} value={badgeDescription} onChange={(e) => { setBadgeDescription(e.target.value) }} />
            <div className="flex mt-4 w-full align-items-center">
              <div className="text-gray-600 text-sm">Rozeti aktif olarak göster</div>
              <div className="ml-auto">
                <ToggleButton onClick={() => { setIsEnabled(!isEnabled) }} defaultValue={isEnabled} />
              </div>
            </div>
          </div>
          <div className="flex">
            <Button isLoading={processloading} textTiny className="w-72 ml-auto" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { createBadge(); }} />
          </div>
        </div>
      </div>
    </div>
  )
}
