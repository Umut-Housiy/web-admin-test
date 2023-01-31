import { FunctionComponent, useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SERVICES } from "../Services/Constants";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { Dropzone } from "../Components/Dropzone";
import { Image } from "../Components/Image";
import { Button } from "../Components/Button";

interface RouteParams {
  id: string,
}

export const GeneralSellerContentEdit: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(true);

  const [processLoading, setProcessLoading] = useState<boolean>(true);

  const [contentId, setContentId] = useState<number>(Number(params?.id ?? "0"));

  const [iconUrl, setIconUrl] = useState<string>("");

  const [photoUrl, setPhotoUrl] = useState<string>("");

  const [order, setOrder] = useState<number>(0);

  const [title, setTitle] = useState<string>("");

  const [subTitle, setSubTitle] = useState<string>("");

  const [buttonTitle, setButtonTitle] = useState<string>("");

  const [description, setDescription] = useState<string>("");

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
      getAboutContentDetail();
    }
    else {
      setLoading(false);
      setProcessLoading(false);
    }
  }, [contentId]);

  const getAboutContentDetail = async () => {

    const _result = await ApiService.getAboutContentDetail(contentId);

    if (_result.succeeded === true) {

      setIconUrl(_result.data.IconUrl);
      setPhotoUrl(_result.data.PhotoUrl);
      setOrder(_result.data.OrderBy);
      setTitle(_result.data.Title);
      setSubTitle(_result.data.SubTitle);
      setButtonTitle(_result.data.ButtonText);
      setDescription(_result.data.Description);

      setLoading(false);
      setProcessLoading(false);
    }
    else {
      setLoading(false);
      setProcessLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push("/genel-satici-icerikleri"); }
      });
    }
  }

  const createAboutContent = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createAboutContent(6, iconUrl, photoUrl, order, title, subTitle, buttonTitle, description);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => { context.hideModal(); history.push("/genel-satici-icerikleri"); }
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

  const updateAboutContent = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateAboutContent(contentId, 6, iconUrl, photoUrl, order, title, subTitle, buttonTitle, description);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => { context.hideModal(); history.push("/genel-satici-icerikleri"); }
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

  const addIcon = (e) => {
    setIconUrl(e[0].FileUrl);
  }

  const addPhoto = (e) => {
    setPhotoUrl(e[0].FileUrl);
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="pb-4 border-b border-gray-200">İçerik Düzenle</h2>
        <div className="w-1/2">
          <Label className="mt-6" title="Icon" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <>
                <Dropzone
                  fileUploaderCss
                  accept={["image"]}
                  addFiles={addIcon}
                  maxFileSizeAsMB={5}
                  uploadUrl={SERVICES.API_ADMIN_GENERAL_URL + "/upload-general-content-media"}
                  maxFileCount={1}
                  sizeDescription={"32x32 px"}
                  warningDescription={"Yüklenen görseller seçili gösterim alanlarına göre otomatik boyutlandırılacaktır."}
                ></Dropzone>
                {
                  (iconUrl !== "" && iconUrl !== undefined && iconUrl !== null) &&
                  <img src={iconUrl} className="w-24 h-24 object-contain" />
                }
              </>
          }
          <Label className="mt-6" title="Ana Görsel" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <>
                <Dropzone
                  fileUploaderCss
                  accept={["image"]}
                  addFiles={addPhoto}
                  maxFileSizeAsMB={5}
                  uploadUrl={SERVICES.API_ADMIN_GENERAL_URL + "/upload-general-content-media"}
                  maxFileCount={1}
                  sizeDescription={"587x462 px"}
                  warningDescription={"Yüklenen görseller seçili gösterim alanlarına göre otomatik boyutlandırılacaktır."}
                ></Dropzone>
                {
                  (photoUrl !== "" && photoUrl !== undefined && photoUrl !== null) &&
                  <img src={photoUrl} className="w-24 h-24 object-contain" />
                }
              </>
          }
          <Label className="mt-6" title="Gösterim Sırası" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="number" value={order} onChange={(e) => { setOrder(parseInt(e.target.value)); }} />
          }
          <Label className="mt-6" title="Ana Başlık" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="text" value={title} onChange={(e) => { setTitle(e.target.value); }} />
          }
          <Label className="mt-6" title="Alt Başlık" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="text" value={subTitle} onChange={(e) => { setSubTitle(e.target.value); }} />
          }
          <Label className="mt-6" title="Buton Yazısı" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="text" value={buttonTitle} onChange={(e) => { setButtonTitle(e.target.value); }} />
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
        </div>
        <div className="flex mt-6">
          <Button isLoading={processLoading} textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { history.push("/genel-satici-icerikleri"); }} />
          {
            contentId > 0 ?
              <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updateAboutContent(); }} />
              :
              <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { createAboutContent(); }} />
          }
        </div>
      </div>
    </div>
  )
}
