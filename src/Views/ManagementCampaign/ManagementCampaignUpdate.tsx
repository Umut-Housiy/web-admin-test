import { FunctionComponent, useContext, useEffect, useState } from "react";
import { DatePicker } from "../../Components/DatePicker";
import { Label } from "../../Components/Label";
import { ToggleButton } from "../../Components/ToggleButton";
import { Dropzone } from "../../Components/Dropzone";
import { SERVICES } from "../../Services/Constants";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../Components/Button";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel, } from "../../Services/SharedContext";
import { TrashIcon } from "../../Components/Icons";
import { Image } from "../../Components/Image";

interface RouteParams {
  id: string;
}

export const ManagementCampaignUpdate: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);
  const history = useHistory();
  const params = useParams<RouteParams>();

  const [updateProcessLoading, setUpdateProcessLoading] = useState<boolean>(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date(selectedStartDate.getTime() + 86400000));
  const [hasCountDown, setHasCountDown] = useState<boolean>(false);
  const [campaignName, setCampaignName] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [campaignSortNumber, setCampaignSortNumber] = useState<number>(1);

  const addFiles = (e) => {
    setFileUrl(e[0].FileUrl);
  };

  useEffect(() => {
    getManagementCampaignDetail();
  }, []);

  const getManagementCampaignDetail = async () => {
    const response = await ApiService.getManagementCampaignDetail(Number(params.id ?? "0"));

    if (response.succeeded) {
      const data = response.data;
      setFileUrl(data.PhotoUrl);
      setCampaignName(data.CampaignName);
      setSelectedStartDate(new Date(data.StartDateJSTime));
      setSelectedEndDate(new Date(data.EndDateJSTime));
      setHasCountDown(data.ShowCountdown);
      setCampaignSortNumber(data.SortNumber)
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
          history.push("/yonetim-kampanyalari");
        },
      });
    }
  };
  const updateManagementCampaign = async () => {
    setUpdateProcessLoading(true);

    const response = await ApiService.updateManagemenetCampaign(
      Number(params.id ?? "0"),
      selectedStartDate.getTime(),
      selectedEndDate.getTime(),
      campaignName,
      fileUrl,
      hasCountDown,
      campaignSortNumber
    );

    if (response.succeeded) {
      setUpdateProcessLoading(false);

      context.showModal({
        type: "Success",
        title: "Kampanya başarıyla güncellendi",
        onClose: () => {
          context.hideModal();
          history.push(`/yonetim-kampanyasi-detay/${params.id}`);
        },
      });
    } else {
      setUpdateProcessLoading(false);
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => context.hideModal(),
      });
    }
  };
  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Kampanya Bilgilerini Düzenle</h2>
        <div className="w-2/3">
          <Label title="Kampanya Başlangıç Tarihi" isRequired withoutDots />
          <DatePicker
            isFull
            value={selectedStartDate}
            minDate={selectedStartDate}
            setSelectedDate={(e) => {
              setSelectedStartDate(e);
              setSelectedEndDate(e);
            }}
          />
          <Label
            className="mt-4"
            title="Kampanya Bitiş Tarihi"
            isRequired
            withoutDots
          />
          <DatePicker
            isFull
            value={selectedEndDate}
            minDate={new Date(selectedStartDate.getTime() + 86400000)}
            setSelectedDate={(e) => setSelectedEndDate(e)}
          />
          <div className="flex items-center justify-between my-4">
            <span className="p-sm font-medium text-gray-700">
              Geri sayım sayacı çalıştır
            </span>
            <ToggleButton
              onClick={() => setHasCountDown(!hasCountDown)}
              defaultValue={hasCountDown}
            />
          </div>
          <Label
            className="mt-4"
            title="Kampanya Başlığı"
            isRequired
            withoutDots
          />
          <input
            className=" form-input"
            type="text"
            value={campaignName}
            onChange={({target: {value}}) => setCampaignName(value)}
          />
          <Label
            className="mt-4"
            title="Kampanya Sıralaması"
            isRequired
            withoutDots
          />
          <input
            type="number"
            className="form-input"
            min={1}
            value={campaignSortNumber}
            onChange={(e) => {
              if (e.target.value === "") {
                setCampaignSortNumber(1);
              }
              const i: number = Number.parseInt(e.target.value) ?? 0;
              if (i <= 0 || isNaN(i)) {
                setCampaignSortNumber(1);
              } else {
                setCampaignSortNumber(i);
              }
            }}
          />
          <Label
            className="mt-4"
            title="Kampanya Görseli"
            isRequired
            withoutDots
          />
          <Dropzone
            fileUploaderCss
            accept={["image"]}
            addFiles={addFiles}
            maxFileSizeAsMB={10}
            uploadUrl={`${SERVICES.API_ADMIN_CAMPAIGN_URL}/upload-campaign-photo`}
            maxFileCount={1}
          />
          {fileUrl !== "" && (
            <div className="relative inline-block">
              <Image key={"fileUrl"} src={fileUrl} className="w-full" />
              <div className="absolute top-2 right-2 p-2 bg-white rounded-lg">
                <TrashIcon className="icon-sm" onClick={() => setFileUrl("")} />
              </div>
            </div>
          )}
        </div>
        <div className="my-3 flex items-center justify-end">
          <span
            className="text-tiny font-medium text-gray-700 mr-8 cursor-pointer"
            onClick={() => history.push(`/yonetim-kampanyasi-detay/${params.id}`)}
          >
            Vazgeç
          </span>
          <Button
            textTiny
            isLoading={updateProcessLoading}
            text="Kaydet ve Tamamla"
            design="button-blue-400 text-white w-72"
            onClick={() => updateManagementCampaign()}
          />
        </div>
      </div>
    </div>
  );
};
