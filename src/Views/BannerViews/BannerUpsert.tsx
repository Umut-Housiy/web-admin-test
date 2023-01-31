import { Label } from "../../Components/Label";
import { FileUploader } from "../../Components/FileUploader";
import { useCallback, useContext, useEffect, useState } from "react";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { Button } from "../../Components/Button";
import { useHistory, useParams } from "react-router-dom";
import { DateRangePicker } from "../../Components/DateRangePicker";
import { Dropdown } from "../../Components/Dropdown";
import { ToggleButton } from "../../Components/ToggleButton";
import ApiService from "../../Services/ApiService";
import { Loading } from "../../Components/Loading";

const bannerTargetTypes = [
  {key: "0", value: "Self"},
  {key: "1", value: "Blank"},
  {key: "2", value: "Parent"},
  {key: "3", value: "Top"},
]

export function BannerUpsert() {
  const {id} = useParams<{ id: string }>();
  const context = useContext<SharedContextProviderValueModel>(SharedContext);
  const history = useHistory();

  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedFile, setSelectedFile] = useState<File>();
  const [targetURL, setTargetURL] = useState<string>("");
  const [selectedTargetType, setSelectedTargetType] = useState<{ key: string, value: string }>({
    key: "-1",
    value: "Seçiniz..."
  });
  const [skipSecond, setSkipSecond] = useState<string>("0");
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [oldPreview, setOldPreview] = useState<string>("");

  const upsertBanner = useCallback(async () => {
    setIsBusy(true);

    const body = {
      Id: '',
      Name: name,
      Photo: selectedFile || "",
      TargetUrl: targetURL,
      Description: description,
      IsEnabled: isEnabled,
      BackgroundColor: "#ffffff00",
      TargetType: selectedTargetType.key,
      SkipSecond: skipSecond,
      StartDate: startDate,
      EndDate: endDate,
    }

    let response;
    if (!id) {
      response = await ApiService.createBanner(body);
    } else {
      body.Id = id;
      response = await ApiService.updateBanner(body);
    }

    if (response.succeeded) {
      context.showModal({
        type: "Success",
        title: id ? "Değişiklikler kaydedildi." : "Banner oluşturuldu.",
        onClose: () => {
          context.hideModal();
          setIsBusy(false);
          history.push("/liste-banner");
        }
      });
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
          setIsBusy(false);
        }
      });
    }
  }, [name, selectedFile, targetURL, description, isEnabled, skipSecond, startDate, endDate, id]);

  const fetchById = useCallback(async () => {
    setIsBusy(true);
    await ApiService.getBannerById({Id: Number(id)})
      .then((response => {
        const banner = response.data;
        if (banner) {
          setName(banner.Name);
          setDescription(banner.Description);
          setStartDate(new Date(banner.StartDate));
          setEndDate(new Date(banner.EndDate));
          setOldPreview(banner.PhotoUrl);
          setTargetURL(banner.TargetUrl);
          setSelectedTargetType(bannerTargetTypes[banner.TargetType]);
          setSkipSecond(String(banner.SkipSecond));
          setIsEnabled(banner.IsEnabled);
        }
      }));
    setIsBusy(false);
  }, [id]);


  useEffect(() => {
    if (id) fetchById()

  }, [id]);

  return (
      <div className="content-wrapper mb-5">
        <div className="portlet-wrapper">
          <h2 className="mb-5">
            Yeni Banner Oluştur
          </h2>
          <div className="border-t border-gray-200">
            <Label className="mt-4" title="Banner Başlığı" withoutDots isRequired/>
            {isBusy ? <Loading inputSm/> :
                <input
                    className="w-1/2 rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm"
                    type="text" placeholder="Banner Başlığı" value={name}
                    onChange={(e) => setName(e.target.value)}
                />}
            <Label className="mt-4" title="Banner Açıklaması" withoutDots/>
            {isBusy ? <Loading inputSm/> :
                <input
                    className="w-1/2 rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm"
                    type="text" placeholder="Banner Açıklaması" value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />}
            <Label className="mt-4" title="Banner Geçerlilik Tarihi" withoutDots isRequired/>
            <div className="w-1/2">
              {isBusy ? <Loading inputSm/> :
                  <DateRangePicker
                      setMaxDate={setEndDate}
                      setMinDate={setStartDate}
                      minValue={startDate}
                      maxValue={endDate}
                  />}
            </div>
            <div className="w-full flex">
              <div className="w-1/2">
                <Label className="mt-4" title="Banner Target Linki" withoutDots isRequired/>
                {isBusy ? <Loading inputSm/> :
                    <input
                        className="w-full rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm"
                        type="text"
                        placeholder="Banner Target URL"
                        value={targetURL}
                        onChange={(e) => setTargetURL(e.target.value)}
                    />}
              </div>
              <div className="w-1/4">
                <Label className="mt-4 ml-4" title="Banner Target Tipi" withoutDots isRequired/>
                <div className="ml-4">
                  {isBusy ? <Loading inputSm/> :
                      <Dropdown
                          className="w-full text-black-700 text-sm"
                          label={selectedTargetType.value}
                          items={bannerTargetTypes}
                          onItemSelected={item => setSelectedTargetType(item)}/>}
                </div>
              </div>
            </div>
            <Label className="mt-4" title="Banner Görseli" withoutDots isRequired/>
            <div className="w-1/2">
              {isBusy ? <Loading inputSm/> :
                  <FileUploader onFileSelected={item => setSelectedFile(item)}
                                sizeDescription={"1440x62 px"}
                                {...(id ? {oldPreview} : {})}
                  />}
            </div>
            <div className="w-1/2 mt-4 flex">
              <div className="w-3/4">
                <Label title="Banner Skip Süresi (saniye)" withoutDots isRequired/>
                {isBusy ? <Loading inputSm/> :
                    <input
                        className="w-full rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm"
                        type="text" placeholder="Banner Skip Süresi (saniye)" value={skipSecond}
                        onChange={(e) => setSkipSecond(e.target.value)}
                    />}
              </div>
              <div className="w-1/4 flex-col align-items-center">
                <Label className="ml-4" title="Aktif" withoutDots/>
                <div className="ml-4 flex p-2">
                  {isBusy ? <Loading inputSm/> :
                      <ToggleButton onClick={() => setIsEnabled(s => !s)} defaultValue={isEnabled}/>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex mt-4">
            <Button isLoading={isBusy} textTiny
                    className="w-24 ml-auto"
                    text="Vazgeç"
                    color="text-gray-400"
                    onClick={() => history.push("/liste-banner")}/>
            <Button isLoading={isBusy} textTiny
                    className="w-72"
                    text="Kaydet ve Tamamla"
                    design="button-blue-400"
                    onClick={() => upsertBanner()}/>
          </div>
        </div>
      </div>
  );
}
