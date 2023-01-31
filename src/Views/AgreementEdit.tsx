import { FunctionComponent, useContext, useEffect, useState } from "react"
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { useHistory, useParams } from "react-router-dom";
import ApiService from "../Services/ApiService";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { ToggleButton } from "../Components/ToggleButton";
import { Button } from "../Components/Button";
import { SERVICES } from "../Services/Constants";

interface RouteParams {
  id: string,
}

export const AgreementEdit: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [type, setType] = useState<number>(0);

  const [title, setTitle] = useState<string>("");

  const [order, setOrder] = useState<number>(0);

  const [description, setDescription] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState<boolean>(true);


  ClassicEditor.defaultConfig = {
    ...ClassicEditor.defaultConfig,
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
    getAgreementDetail();
  }, []);

  const getAgreementDetail = async () => {
    setLoading(true);

    const _result = await ApiService.getAgreementDetail(Number(params.id));

    if (_result.succeeded === true) {
      setType(_result.data.Type);
      setTitle(_result.data.Title);
      setOrder(_result.data.OrderBy);
      setDescription(_result.data.Description);
      setIsEnabled(_result.data.IsEnabled);

      setLoading(false);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setLoading(false); history.push("/sozlesme-listesi"); }
      });
    }
  }

  const updateAgreement = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateAgreement(Number(params.id), type, title, order, description, isEnabled);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => { context.hideModal(); history.push("/sozlesme-listesi"); }
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
        <h2 className="pb-4 border-b border-gray-200">Sözleşme İçeriği Düzenle</h2>
        <div className="w-1/2">
          <Label className="mt-4" title="Başlık" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="text" value={title} onChange={(e) => { setTitle(e.target.value); }} />
          }
          <Label className="mt-4" title="Gösterim Sırası" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="number" value={order} onChange={(e) => { setOrder(parseInt(e.target.value)); }} />
          }
          <Label className="mt-4" title="Açıklama" withoutDots isRequired />
          {
            loading ?
              <Loading inputMd />
              :
              <div className="max-h-screen overflow-y-auto custom-scrollbar">
                <CKEditor
                  editor={ClassicEditor}
                  data={description}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setDescription(data);
                  }}
                />
              </div>

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
          <Button isLoading={processLoading} textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { history.push("/sozlesme-listesi"); }} />
          <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updateAgreement(); }} />
        </div>
      </div>
    </div>
  )
}
