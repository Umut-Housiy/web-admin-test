import { FunctionComponent, useContext, useEffect, useState } from "react"
import { Label } from "../Components/Label";
import { Dropzone } from "../Components/Dropzone";
import { Dropdown } from "../Components/Dropdown";
import { ToggleButton } from "../Components/ToggleButton";
import { Button } from "../Components/Button";
import { useHistory, useParams } from "react-router-dom";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Loading } from "../Components/Loading";
import { SERVICES } from "../Services/Constants";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


interface RouteParams {
  id: string,
}

export const GeneralPromotionEdit: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const categoryOptions = [
    { key: "1", value: "Housiy Satıcı" },
    { key: "2", value: "Housiy Profesyonel" }
  ];

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [selectedCategoryOption, setSelectedCategoryOption] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(true);

  const [processLoading, setProcessLoading] = useState<boolean>(true);

  const [contentId, setContentId] = useState<number>(Number(params?.id ?? "0"));

  const [photoUrl, setPhotoUrl] = useState<string>("");

  const [title, setTitle] = useState<string>("");

  const [order, setOrder] = useState<number>(0);

  const [description, setDescription] = useState<string>("");

  const [buttonUrl, setButtonUrl] = useState<string>("");

  const [buttonText, setButtonText] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  ClassicEditor.defaultConfig = {
    ...ClassicEditor.defaultConfig,
    mediaEmbed: {
      previewsInData: true
    },
    ckfinder: {
      uploadUrl: `${SERVICES.API_ADMIN_GENERAL_URL}/ck-inner-media`
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
      ]
    }
  };

  useEffect(() => {
    if (contentId > 0) {
      getPromotionInfoDetail();
    }
    else {
      setLoading(false);
      setProcessLoading(false);
    }
  }, [contentId]);

  const getPromotionInfoDetail = async () => {

    const _result = await ApiService.getPromotionInfoDetail(contentId);

    if (_result.succeeded === true) {

      setPhotoUrl(_result.data.PhotoUrl);
      setTitle(_result.data.Title);
      setOrder(_result.data.OrderBy);
      setDescription(_result.data.Description);
      setButtonText(_result.data.ButtonText ?? "");
      setButtonUrl(_result.data.ButtonUrl ?? "");
      setSelectedCategoryOption(categoryOptions.find(x => x.key == _result.data.WhereToShow.toString()) ?? { key: "0", value: "Seçiniz..." });
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
        onClose: () => { context.hideModal(); history.push("/genel-anasayfa-icerikleri/2"); }
      });
    }
  }

  const createPromotionInfo = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createPromotionInfo(photoUrl, order, title, description, isEnabled, Number(selectedCategoryOption.key ?? "0"), buttonText, buttonUrl);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => { context.hideModal(); history.push("/genel-anasayfa-icerikleri/2"); }
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

  const updatePromotionInfo = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updatePromotionInfo(contentId, photoUrl, order, title, description, isEnabled, Number(selectedCategoryOption.key ?? "0"), buttonText, buttonUrl);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => { context.hideModal(); history.push("/genel-anasayfa-icerikleri/2"); }
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

  const addFile = (e) => {
    setPhotoUrl(e[0].FileUrl);
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="pb-4 border-b border-gray-200">{contentId > 0 ? "Tanıtım Bilgisi Düzenle" : "Yeni Tanıtım Bilgisi Oluştur"}</h2>
        <div className="w-1/2">
          <Label className="mt-6" title="Tanıtım Başlığı" withoutDots />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="text" value={title} onChange={(e) => { setTitle(e.target.value); }} />
          }
          <Label className="mt-6" title="İçerik Görseli" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <>
                <Dropzone
                  fileUploaderCss
                  accept={["image"]}
                  addFiles={addFile}
                  maxFileSizeAsMB={5}
                  uploadUrl={SERVICES.API_ADMIN_GENERAL_URL + "/upload-general-content-media"}
                  maxFileCount={1}
                  sizeDescription={"587x462 px"}
                  warningDescription={"Yüklenen görseller seçili gösterim alanlarına göre otomatik boyutlandırılacaktır."}
                ></Dropzone>
                {
                  (photoUrl !== "" && photoUrl !== undefined && photoUrl !== null) &&
                  <img src={photoUrl} className="w-72 h-48 object-contain" />
                }
              </>
          }
          <Label className="mt-6" title="Kategori" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <Dropdown
                isDropDownOpen={currentOpenedFilterButton === "categorySelect"}
                onClick={() => { setCurrentOpenedFilterButton("categorySelect"); }}
                className="w-full text-black-700 text-sm border-gray-300"
                label={selectedCategoryOption.value}
                items={categoryOptions}
                onItemSelected={item => { setSelectedCategoryOption(item); }} />
          }
          <Label className="mt-6" title="Gösterim Sırası" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="number" value={order} onChange={(e) => { setOrder(parseInt(e.target.value)); }} />
          }
          <Label className="mt-6" title="Açıklama" withoutDots isRequired />
          {
            loading ?
              <Loading inputMd />
              :
              <CKEditor
                editor={ClassicEditor}
                data={description}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setDescription(data);
                }}
              />
          }

          <Label className="mt-6" title="Buton Başlığı" withoutDots />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="text" value={buttonText} onChange={(e) => { setButtonText(e.target.value); }} />
          }
          <Label className="mt-6" title="Buton Yönlendirme Linki" withoutDots />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="text" value={buttonUrl} onChange={(e) => { setButtonUrl(e.target.value); }} />
          }

          {
            loading ?
              <Loading textMd />
              :
              <div className="flex mt-4  align-items-center">
                <div className="text-gray-900 text-sm font-medium">Aktif olarak göster</div>
                <div className="ml-auto">
                  <ToggleButton onClick={() => { setIsEnabled(!isEnabled) }} defaultValue={isEnabled} />
                </div>
              </div>
          }
        </div>
        <div className="flex mt-6">
          <Button isLoading={processLoading} textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { history.push("/genel-anasayfa-icerikleri/2"); }} />
          {
            contentId > 0 ?
              <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updatePromotionInfo(); }} />
              :
              <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { createPromotionInfo(); }} />
          }
        </div>
      </div>
    </div>
  )
}
