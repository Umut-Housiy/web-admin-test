import { FunctionComponent, useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { TextArea } from "../Components/TextArea";
import { ToggleButton } from "../Components/ToggleButton";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SERVICES } from "../Services/Constants";

interface RouteParams {
  id: string,
}

export const FaqEdit: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(true);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [faqId, setFaqId] = useState<number>(Number(params?.id ?? "0"));

  const [question, setQuestion] = useState<string>("");

  const [answer, setAnswer] = useState<string>("");

  const [order, setOrder] = useState<number>(0);

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
    if (faqId > 0) {
      getFaqDetail();
    }
    else {
      setLoading(false);
    }
  }, [faqId]);

  const getFaqDetail = async () => {

    const _result = await ApiService.getFaqDetail(faqId);

    if (_result.succeeded === true) {

      setQuestion(_result.data.Question);
      setAnswer(_result.data.Answer);
      setOrder(_result.data.OrderBy);
      setIsEnabled(_result.data.IsEnabled);

      setLoading(false);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setLoading(false); history.push("/sss-listesi"); }
      });
    }
  }

  const createFaq = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createFaq(question, answer, order, isEnabled);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => { context.hideModal(); history.push("/sss-listesi"); }
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

  const updateFaq = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateFaq(faqId, question, answer, order, isEnabled);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => { context.hideModal(); history.push("/sss-listesi"); }
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
        <h2 className="pb-4 border-b border-gray-200">Soru İçeriği Düzenle</h2>
        <div className="w-1/2">
          <Label className="mt-4" title="Soru" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="text" value={question} onChange={(e) => { setQuestion(e.target.value); }} />
          }
          <Label className="mt-4" title="Cevap" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <CKEditor
                editor={ClassicEditor}
                data={answer}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setAnswer(data);
                }}
              />
          }
          <Label className="mt-4" title="Gösterim Sırası" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="number" value={order} onChange={(e) => { setOrder(parseInt(e.target.value)); }} />
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
          <Button isLoading={processLoading} textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { history.push("/sss-listesi"); }} />
          {
            faqId > 0 ?
              <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updateFaq(); }} />
              :
              <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { createFaq(); }} />
          }
        </div>
      </div>
    </div>
  )
}
