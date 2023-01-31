import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SharedContext, SharedContextProviderValueModel } from "../../../../Services/SharedContext";
import { useHistory } from "react-router";
import { CustomDropdown, Option } from "../../../../Components/CustomDropdown";
import ApiService from "../../../../Services/ApiService";
import { Label } from "../../../../Components/Label";
import { Loading } from "../../../../Components/Loading";
import { Button } from "../../../../Components/Button";
import { SellerModel } from "../../../../Models";
import { ToggleButton } from "../../../../Components/ToggleButton";

export function GroupParticipantSettingsUpsert() {
  const {id} = useParams<{ id: string }>();
  const context = useContext<SharedContextProviderValueModel>(SharedContext);
  const history = useHistory();

  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isGeneral, setIsGeneral] = useState<boolean>(true);
  const [participantCount, setParticipantCount] = useState<string>('0');
  const [selectedSeller, setSelectedSeller] = useState<Option>({key: "-1", value: ""});
  const [oldSellerId, setOldSellerId] = useState<string>('');
  const [sellerList, setSellerList] = useState<SellerModel[]>([]);

  const toggleIsGeneral = useCallback(() => {
    if (isGeneral) {
      setIsGeneral(false);
    } else {
      setSelectedSeller({key: "-1", value: ""});
      setIsGeneral(true);
    }
  }, [isGeneral]);

  const upsertGroupParticipantSetting = useCallback(async () => {
    setIsBusy(true);

    const body = {
      id: -1,
      name,
      description,
      isGeneral,
      sellerId: isGeneral ? null : Number(selectedSeller.key),
      participantCount: parseInt(participantCount),
    }

    let response;
    if (!id) {
      response = await ApiService.createGroupParticipantSettings(body);
    } else {
      body.id = Number(id);
      response = await ApiService.updateGroupParticipantSettings(body);
    }

    if (response.succeeded) {
      context.showModal({
        type: "Success",
        title: id ? "Değişiklikler kaydedildi." : "Katılımcı Ayarı oluşturuldu.",
        onClose: () => {
          context.hideModal();
          setIsBusy(false);
          history.push("/grup-alim-katilimci-ayarlari");
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
  }, [name, description, participantCount, isGeneral, selectedSeller, id]);

  const fetchById = useCallback(async () => {
    setIsBusy(true);
    await ApiService.getGroupParticipantSettingsById({id: Number(id)})
      .then((response => {
        const groupParticipantSetting = response.data;
        if (groupParticipantSetting) {
          setName(groupParticipantSetting.Name);
          setDescription(groupParticipantSetting.Description);
          setIsGeneral(groupParticipantSetting.IsGeneral);
          setParticipantCount(groupParticipantSetting.ParticipantCount.toFixed());
          if (groupParticipantSetting.SellerId) {
            setOldSellerId(`${groupParticipantSetting.SellerId}`);
          }
        }
      }));
    setIsBusy(false);
  }, [id]);

  const getSellerOptionList = useCallback(async () => {
    const response = await ApiService.getSellerApprovedList(1, 9999, '', 1);
    if (response.succeeded && response.data) {
      setSellerList(response.data.Data);
      return response.data.Data.map((item) => ({key: String(item.Id), value: item.StoreName}));
    }
    setSellerList([]);
    return [];
  }, []);

  useEffect(() => {
    if (id) fetchById()
  }, [id]);

  useEffect(() => {
    if (oldSellerId && sellerList.length) {
      const oldSeller = sellerList.find((item) => item.Id === parseInt(oldSellerId));
      if (oldSeller) {
        setSelectedSeller({key: `${oldSeller.Id}`, value: oldSeller.StoreName});
      }
    }
  }, [sellerList, oldSellerId]);

  return (
    <div className="content-wrapper mb-5">
      <div className="portlet-wrapper">
        <h2 className="mb-5">
          Yeni Katılımcı Ayarı Oluştur
        </h2>
        <div className="border-t border-gray-200">
          <Label className="mt-4" title="Katılımcı Ayar Başlığı" withoutDots isRequired/>
          {isBusy ? <Loading inputSm/> :
            <input
              className="w-1/2 rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm"
              type="text" placeholder="Katılımcı Ayar Başlığı" value={name}
              onChange={(e) => setName(e.target.value)}
            />}
          <Label className="mt-4" title="Katılımcı Ayar Açıklaması" withoutDots/>
          {isBusy ? <Loading inputSm/> :
            <input
              className="w-1/2 rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm"
              type="text" placeholder="Katılımcı Ayar Açıklaması" value={description}
              onChange={(e) => setDescription(e.target.value)}
            />}
          <Label className="mt-4" title="Kişi sayısı" withoutDots isRequired/>
          {isBusy ? <Loading inputSm/> :
            <input
              className="w-1/2 rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm"
              type="numeric" placeholder="Kişi sayısı" value={participantCount}
              onChange={({target: {value}}) => setParticipantCount(value)}
            />}
        </div>
        <div className="flex flex-row w-1/2">
          <div className="flex flex-col w-1/2">
            <Label className="mt-4" title="Özel / Genel" withoutDots/>
            <div className="flex p-2">
              {isBusy ? <Loading inputSm/> :
                <ToggleButton defaultValue={isGeneral} onClick={toggleIsGeneral}/>
              }
            </div>
          </div>
          <div className="flex flex-col pl-4 w-1/2">
            <Label className="mt-4" title="Mağaza" withoutDots isRequired={!isGeneral}/>
            <CustomDropdown value={selectedSeller} onChange={setSelectedSeller}
                            placeholder="Seçiniz..." disabled={isGeneral}
                            getOptionList={getSellerOptionList} className="text-gray-400"/>
          </div>
        </div>

        <div className="flex mt-4">
          <Button isLoading={isBusy} textTiny
                  className="w-24 ml-auto"
                  text="Vazgeç"
                  color="text-gray-400"
                  onClick={() => history.push("/grup-alim-katilimci-ayarlari")}/>
          <Button isLoading={isBusy} textTiny
                  className="w-72"
                  text="Kaydet ve Tamamla"
                  design="button-blue-400"
                  onClick={() => upsertGroupParticipantSetting()}/>
        </div>
      </div>
    </div>
  );
}
