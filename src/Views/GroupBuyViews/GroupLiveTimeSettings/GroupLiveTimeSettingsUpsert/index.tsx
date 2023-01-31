import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SharedContext, SharedContextProviderValueModel } from "../../../../Services/SharedContext";
import { useHistory } from "react-router";
import { CustomDropdown, Option } from "../../../../Components/CustomDropdown";
import ApiService from "../../../../Services/ApiService";
import { Label } from "../../../../Components/Label";
import { Loading } from "../../../../Components/Loading";
import { Button } from "../../../../Components/Button";
import { GroupParticipantSetting, SellerModel } from "../../../../Models";
import { ToggleButton } from "../../../../Components/ToggleButton";

export function GroupLiveTimeSettingsUpsert() {
  const {id} = useParams<{ id: string }>();
  const context = useContext<SharedContextProviderValueModel>(SharedContext);
  const history = useHistory();

  const [busyCount, setBusyCount] = useState<number>(0);
  const [isGeneral, setIsGeneral] = useState<boolean>(true);
  const [liveTime, setLiveTime] = useState<string>('0');
  const [selectedSellerOption, setSelectedSellerOption] = useState<Option>({key: "-1", value: ""});
  const [oldSellerId, setOldSellerId] = useState<string>('');
  const [sellerList, setSellerList] = useState<SellerModel[]>([]);
  const [selectedGroupParticipantSetting, setSelectedGroupParticipantSetting] = useState<Option>({
    key: "-1", value: "",
  });
  const [groupParticipantSettingList, setGroupParticipantSettingList] = useState<GroupParticipantSetting[]>([]);
  const [oldGroupParticipantSettingId, setOldGroupParticipantSettingId] = useState<string>('');

  const toggleIsGeneral = useCallback(() => {
    if (isGeneral) {
      setIsGeneral(false);
    } else {
      setSelectedSellerOption({key: "-1", value: ""});
      setSelectedGroupParticipantSetting({key: "-1", value: ""});
      setIsGeneral(true);
    }
  }, [isGeneral]);

  const upsertGroupParticipantSetting = useCallback(async () => {
    setBusyCount(x => x + 1);

    const body = {
      id: -1,
      groupParticipantSettingId: parseInt(selectedGroupParticipantSetting.key),
      isGeneral,
      sellerId: isGeneral ? null : Number(selectedSellerOption.key),
      liveTime: parseInt(liveTime),
    }

    let response;
    if (!id) {
      response = await ApiService.createGroupLiveTimeSettings(body);
    } else {
      body.id = Number(id);
      response = await ApiService.updateGroupLiveTimeSettings(body);
    }

    if (response.succeeded) {
      context.showModal({
        type: "Success",
        title: id ? "Değişiklikler kaydedildi." : "Süre Ayarı oluşturuldu.",
        onClose: () => {
          context.hideModal();
          setBusyCount(x => x - 1);
          history.push("/grup-alim-sure-ayarlari");
        }
      });
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
          setBusyCount(x => x - 1);
        }
      });
    }
  }, [selectedGroupParticipantSetting, isGeneral, liveTime, selectedSellerOption, id]);

  const fetchById = useCallback(async () => {
    setBusyCount(x => x + 1);
    await ApiService.getGroupLiveTimeSettingsById({id: Number(id)})
      .then((response => {
        const groupLiveTimeSetting = response.data;
        if (groupLiveTimeSetting) {
          setIsGeneral(groupLiveTimeSetting.IsGeneral);
          setLiveTime(groupLiveTimeSetting.LiveTime.toString());
          if (groupLiveTimeSetting.SellerId) {
            setOldSellerId(groupLiveTimeSetting.SellerId.toString());
          }
          setOldGroupParticipantSettingId(groupLiveTimeSetting.GroupParticipantSettingId.toString())
        }
      }));
    setBusyCount(x => x - 1);
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

  const getGroupParticipantSettingOptionList = useCallback(async (): Promise<Option[]> => {
    const response = await ApiService.getGroupParticipantSettingsList({
      page: 1, take: 9999, searchText: '', sellerId: isGeneral ? 0 : Number(selectedSellerOption.key),
      includeGeneral: isGeneral,
      includeSpecial: !isGeneral,
    });
    if (response.succeeded && response.data) {
      setGroupParticipantSettingList(response.data.Data);
      return response.data.Data.map((item) => ({key: String(item.Id), value: item.ParticipantCount.toString()}));
    }
    setGroupParticipantSettingList([]);
    return [];
  }, [isGeneral, selectedSellerOption]);

  useEffect(() => {
    if (id) fetchById()
  }, [id]);

  useEffect(() => {
    if (oldSellerId && sellerList.length) {
      const oldSeller = sellerList.find((item) => item.Id === parseInt(oldSellerId));
      if (oldSeller) {
        setSelectedSellerOption({key: `${oldSeller.Id}`, value: oldSeller.StoreName});
      }
    }
  }, [sellerList, oldSellerId]);

  useEffect(() => {
    if (oldGroupParticipantSettingId && groupParticipantSettingList.length) {
      const oldParticipantSetting = groupParticipantSettingList.find(({Id}) => Id === parseInt(oldGroupParticipantSettingId));
      if (oldParticipantSetting) {
        setSelectedGroupParticipantSetting({
          key: `${oldParticipantSetting.Id}`,
          value: oldParticipantSetting.ParticipantCount.toString(),
        });
      }
    }
  }, [groupParticipantSettingList, oldGroupParticipantSettingId]);

  return (
    <div className="content-wrapper mb-5">
      <div className="portlet-wrapper">
        <h2 className="mb-5">
          Yeni Süre Ayarı Oluştur
        </h2>
        <div className="border-t border-gray-200 flex flex-row w-1/2">
          <div className="flex flex-col w-1/2">
            <Label className="mt-4" title="Süre(saat)" withoutDots isRequired/>
            {busyCount ? <Loading inputSm/> :
              <input
                className="rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm"
                type="numeric" placeholder="Süre(saat)" value={liveTime}
                onChange={({target: {value}}) => setLiveTime(value)}
              />}
          </div>
        </div>
        <div className="flex flex-row w-1/2">
          <div className="flex flex-col w-1/4">
            <Label className="mt-4" title="Özel / Genel" withoutDots/>
            {busyCount ? <Loading inputSm/> :
              <ToggleButton defaultValue={isGeneral} onClick={toggleIsGeneral}/>
            }
          </div>
          <div className="flex flex-col pl-4 w-1/2">
            <Label className="mt-4" title="Mağaza" withoutDots isRequired={!isGeneral}/>
            <CustomDropdown value={selectedSellerOption} onChange={setSelectedSellerOption}
                            placeholder="Seçiniz..." disabled={isGeneral} isLoading={!!busyCount}
                            getOptionList={getSellerOptionList} className="text-gray-900"/>
          </div>
        </div>
        <div className="flex flex-col w-1/4">
          <Label className="mt-4" title="Katılımcı Sayısı" withoutDots isRequired/>
          <CustomDropdown value={selectedGroupParticipantSetting} onChange={setSelectedGroupParticipantSetting}
                          placeholder="Seçiniz..." isLoading={!!busyCount}
                          getOptionList={getGroupParticipantSettingOptionList} className="text-gray-900"/>
        </div>

        <div className="flex mt-4">
          <Button isLoading={!!busyCount} textTiny
                  className="w-24 ml-auto"
                  text="Vazgeç"
                  color="text-gray-400"
                  onClick={() => history.push("/grup-alim-sure-ayarlari")}/>
          <Button isLoading={!!busyCount} textTiny
                  className="w-72"
                  text="Kaydet ve Tamamla"
                  design="button-blue-400"
                  onClick={() => upsertGroupParticipantSetting()}/>
        </div>
      </div>
    </div>
  );
}
