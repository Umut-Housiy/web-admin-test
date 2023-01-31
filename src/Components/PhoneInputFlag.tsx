import React, { ForwardedRef, forwardRef, ForwardRefExoticComponent, RefAttributes, useEffect, useImperativeHandle, useState } from "react";
import { Dropdown } from "./Dropdown";
import { InputWithMaskFloating } from "./InputWithMaskFloating";
import { Loading } from "./Loading";
import { useStateEffect } from "./UseStateEffect";

export interface PhoneResultModel {
  //905551234567
  purePhone: string,
  //(555) 123 45 67
  maskedPhone: string,
  //90-5551234567
  phone: string,
  //+90 (555) 123 45 67
  phonePreview: string,
  //90
  pureCountryCode: string,
  //+90
  previewCountryCode: string
}


export interface PhoneInputPropModel {
  onChange: (e: PhoneResultModel) => void,
  disabled?: boolean,
  disabledFlag?: boolean,
  initValue?: string,
  loading?: boolean,
  idForLabel?: string

}

export interface PhoneInputRefPropModel {
  setValue: (e: string) => void
}

export const PhoneInputFlag: ForwardRefExoticComponent<PhoneInputPropModel & RefAttributes<PhoneInputRefPropModel>> = forwardRef<PhoneInputRefPropModel, PhoneInputPropModel>((props: PhoneInputPropModel, ref: ForwardedRef<PhoneInputRefPropModel>) => {

  useImperativeHandle(ref, () => ({
    setValue
  }));

  const [phoneCodeList, setPhoneCodeList] = useState<{ key: string, value: string, flag: string }[]>([])

  const [selectedPhoneCodeOption, setSelectedPhoneCodeOption] = useState<{ key: string, value: string, flag?: string }>({ key: "", value: "", flag: "https://raw.githubusercontent.com/pryazilim/lib/master/data/flag/turkey-32x32-33109.png" });

  const [phone, setPhone] = useState<string>("");

  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  useEffect(() => {
    getPhoneCodes();
  }, [])

  useStateEffect(() => {
    setValue(props.initValue ?? "90-");
  }, [phoneCodeList]);

  const setValue = (value: string) => {
    if (value) {
      try {
        const phoneCode = value.split("-")[0];
        const phone = value.split("-")[1];
        let selectedPhoneCode = phoneCodeList.filter(x => x.key == phoneCode);

        if (selectedPhoneCode.length) {
          setSelectedPhoneCodeOption(selectedPhoneCode[0]);
        }
        if (phone?.length) {
          let generatedmaskedPhone = "";
          for (let i = 0; i < phone.length; i++) {
            const num = phone[i];

            if (i === 0) generatedmaskedPhone += "(";
            if (i === 3) generatedmaskedPhone += ") ";
            if (i === 6 || i === 8) generatedmaskedPhone += " ";

            generatedmaskedPhone += num;
          }

          setPhone(generatedmaskedPhone);
        }

      } catch (e) { }
    }
  }

  useStateEffect(() => {
    setResultString();
  }, [phone, selectedPhoneCodeOption])

  const getPhoneCodes = async () => {
    try {
      const response = await fetch(`https://raw.githubusercontent.com/pryazilim/lib/master/data/phone-codes.json`, { method: "GET" });
      const json = await response.json();
      var PhoneCodeList: { key: string, value: string, flag: string }[] = [];
      json.forEach(item =>
        PhoneCodeList.push({
          key: String(item.code),
          value: String(item.code.length < 4 ? `+${item.code}` : item.code),
          flag: item.flag,
        })
      );
      setPhoneCodeList(PhoneCodeList);
      return true;
    } catch (error) {
      return false;
    }
  };

  const setResultString = () => {
    const data: PhoneResultModel = {
      pureCountryCode: selectedPhoneCodeOption.key,
      previewCountryCode: selectedPhoneCodeOption.value,
      maskedPhone: phone,
      phone: selectedPhoneCodeOption.key + "-" + phone.replace(/[^0-9]/g, ""),
      phonePreview: selectedPhoneCodeOption.value + " " + phone,
      purePhone: phone.replace(/[^0-9]/g, "")
    }
    props.onChange(data);
  }
  return (
    <>
      {props.loading ? <Loading inputSm /> :
        <div className="flex floating-label-wrapper">
          <Dropdown
            showImage
            isDisabled={props.disabledFlag}
            isDropDownOpen={showDropDown}
            onClick={() => { setShowDropDown(!showDropDown) }}
            className="w-full font-normal border-none "
            label={selectedPhoneCodeOption.flag}
            items={phoneCodeList}
            onItemSelected={item => { setSelectedPhoneCodeOption(item) }} />
          <InputWithMaskFloating phone welcome value={phone} disabled={props.disabled ? true : false} onChange={(e) => { setPhone(e.target.value) }} idForLabel={props.idForLabel} />
        </div>
      }
    </>
  )
});
