import React, { FunctionComponent, useContext, useState } from "react"
import { useHistory } from "react-router"

import { Label } from "../Components/Label"
import { ToggleButton } from "../Components/ToggleButton"
import { FileUploader } from "../Components/FileUploader"
import { Button } from "../Components/Button"
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext"
import ApiService from "../Services/ApiService"

export const SellerCategoryGroupAdd: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const history = useHistory();

  const [groupName, setGroupName] = useState<string>("");

  const [orderBy, setOrderBy] = useState<number>(0);

  var file = new File([""], "empty.txt", {
    type: "text/plain",
  });

  const [selectedFile, setSelectedFile] = useState<File>(file);

  const [groupDescription, setGroupDescription] = useState<string>("");

  const [isActive, setIsActive] = useState<boolean>(true);

  const createSellerCategoryGroup = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createSellerCategoryGroup(groupName, orderBy, groupDescription, isActive, selectedFile);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Satıcı kategori grubu başarıyla oluşturuldu",
        onClose: () => { context.hideModal(); history.push(`/satici-kategori-grup-listesi`) }
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
          Yeni Kategori Grubu Oluştur
        </h2>
        <div className="border-t border-gray-200 lg:w-1/2">
          <Label className="mt-6" title="Grup Adı" withoutDots isRequired />
          <input className="form-input" type="text" placeholder="Grup Adı" value={groupName} onChange={(e) => { setGroupName(e.target.value) }} />
          <Label className="mt-6" title="Grup Sıralaması" withoutDots isRequired />
          <input className="form-input" type="number" placeholder="Grup Sıralaması" value={orderBy} onChange={(e) => { setOrderBy(parseInt(e.target.value)) }} />
          <Label className="mt-6" title="Grup Görseli" withoutDots isRequired />
          <FileUploader onFileSelected={item => { setSelectedFile(item) }} sizeDescription={"242x194 px"} warningDescription={"Yüklenen görseller seçili gösterim alanlarına göre otomatik boyutlandırılacaktır."} />
          <Label className="mt-6" title="Grup Açıklaması" withoutDots isRequired />
          <textarea
            placeholder="Grup detayında görünecek ve kullanıcıları bilgilendirecek bir açıklama yazısı ekleyin."
            onChange={(e) => setGroupDescription(e.target.value)}
            className="text-sm w-full px-3 py-2 text-black-700 border rounded-lg focus:outline-none resize-none leading-5"
            value={groupDescription}
            rows={3}
          />
          <div className="flex mt-4 align-items-center">
            <div className="text-gray-600 text-sm">Grubu aktif olarak göster</div>
            <div className="ml-auto">
              <ToggleButton onClick={() => { setIsActive(!isActive) }} defaultValue={isActive} />
            </div>
          </div>
        </div>
        <div className="flex">
          <Button isLoading={processLoading} textTiny className="w-72 ml-auto mt-4" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { createSellerCategoryGroup(); }} />
        </div>
      </div>
    </div>
  )
}
