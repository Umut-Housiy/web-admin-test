import { FunctionComponent, useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { TextArea } from "../Components/TextArea";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { autonNumericOptions } from "../Services/Functions";
import ReactNumeric from 'react-numeric';

interface RouteParams {
  id: string,
}

export const GeneralMembershipEdit: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(true);

  const [processLoading, setProcessLoading] = useState<boolean>(true);

  const [packageName, setPackageName] = useState<string>("");

  const [price, setPrice] = useState<number>(0);

  const [packageDuration, setPackageDuration] = useState<number>(0);

  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    getMemberShipPackageDetail();
  }, []);

  const getMemberShipPackageDetail = async () => {

    const _result = await ApiService.getMemberShipPackageDetail(Number(params.id));

    if (_result.succeeded === true) {

      setPackageName(_result.data.Title);
      setPrice(Number(_result.data.Price ?? 0));
      setPackageDuration(Number(_result.data.Duration ?? 0));
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
        onClose: () => { context.hideModal(); history.push("/genel-uyelik-paketleri"); }
      });
    }
  }

  const updateMemberShipPackage = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateMemberShipPackage(Number(params.id), packageName, String(price), packageDuration, description);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => { context.hideModal(); history.push("/genel-uyelik-paketleri"); }
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
        <h2 className="pb-4 border-b border-gray-200">Üyelik Paketi Düzenle</h2>
        <div className="w-1/2">
          <Label className="mt-6" title="Paket Adı" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="text" value={packageName} onChange={(e) => { setPackageName(e.target.value); }} />
          }
          <Label className="mt-6" title="Paket Tutarı" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <ReactNumeric
                value={price}
                preDefined={autonNumericOptions.TL}
                onChange={(e, value: number) => { setPrice(value); }}
                className="form-input"
              />
          }
          <Label className="mt-6" title="Paket Süresi (Gün)" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="number" value={packageDuration} onChange={(e) => { setPackageDuration(Number(e.target.value)); }} />
          }
          <Label className="mt-6" title="Paket İçeriği" withoutDots isRequired />
          {
            loading ?
              <Loading inputMd />
              :
              <TextArea
                setText={setDescription}
                text={description}
                placeholder="Açıklama giriniz..."
                maxCount={1000}
              />
          }
        </div>
        <div className="flex mt-6">
          <Button isLoading={processLoading} textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { history.push("/genel-uyelik-paketleri"); }} />
          <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updateMemberShipPackage(); }} />
        </div>
      </div>
    </div>
  )
}
