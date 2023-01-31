import React, { ForwardedRef, forwardRef, ForwardRefExoticComponent, RefAttributes, useEffect, useImperativeHandle, useState } from "react";
import { Dropdown } from "./Dropdown";
import { InputWithMask } from "./InputWithMask";
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
  initValue?: string
}
export interface PhoneInputRefPropModel {
  setValue: (e: string) => void
}
export const PhoneInput: ForwardRefExoticComponent<PhoneInputPropModel & RefAttributes<PhoneInputRefPropModel>> = forwardRef<PhoneInputRefPropModel, PhoneInputPropModel>((props: PhoneInputPropModel, ref: ForwardedRef<PhoneInputRefPropModel>) => {
  useImperativeHandle(ref, () => ({
    setValue
  }));
  const [phoneCodeList, setPhoneCodeList] = useState<{ key: string, value: string }[]>([
    { key: "90", value: "+90" },
  ])
  const [selectedPhoneCodeOption, setSelectedPhoneCodeOption] = useState<{ key: string, value: string }>({ key: "90", value: "+90" });
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
        else {
          setPhone("");
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
      var PhoneCodeList: { key: string, value: string }[] = [];
      json.forEach(item =>
        PhoneCodeList.push({
          key: String(item.code),
          value: String(item.code.length < 4 ? `+${item.code}` : item.code)
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
    <div className="flex gap-2">
      <Dropdown
        isDisabled={props.disabled ? true : false}
        isDropDownOpen={showDropDown}
        onClick={() => { setShowDropDown(!showDropDown) }}
        label={selectedPhoneCodeOption.value}
        items={phoneCodeList}
        onItemSelected={item => { setSelectedPhoneCodeOption(item) }} />
      <InputWithMask phone value={phone} disabled={props.disabled ? true : false} onChange={(e) => { setPhone(e.target.value) }} />
    </div>
  )
});
