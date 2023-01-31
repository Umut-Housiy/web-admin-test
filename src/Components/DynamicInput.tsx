import { FunctionComponent, useEffect, useState } from "react";
import { DatePicker } from "./DatePicker";
import { DateRangePicker } from "./DateRangePicker";
import { Dropzone } from "./Dropzone";
import { TrashIcon } from "./Icons";
import { Label } from "./Label";
import { DropdownModel, MultiSelect } from "./MultiSelectForDropdown";
import { useStateEffect } from "./UseStateEffect";
import ReactNumeric from 'react-numeric';
import { autonNumericOptions } from "../Services/Functions";
import { Dropdown } from "./Dropdown";

export interface DynamicInputPropModel {
  elementId: number,
  name: string,
  dataType: number,
  data?: { key: string, value: string }[],
  selectedValue?: string,
  setDynamicData: (elementId: number, dataType: number, value: string) => void,
  uploadUrl: string,
  isRequired?: boolean
}
export const DynamicInput: FunctionComponent<DynamicInputPropModel> = (props: DynamicInputPropModel) => {

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [multiValue, setMultiValue] = useState<DropdownModel[]>(() => {
    if (props.dataType === 7) {
      if (props.selectedValue) {
        try {
          let data: {
            Ids: number[],
            Text: string
          } = JSON.parse(props.selectedValue);
          return (props.data || []).filter(x => data.Ids.indexOf(parseInt(x.key)) > -1);
        } catch { }
      }
    }
    return [];
  });

  const [date, setDate] = useState<Date>(() => {
    if (props.dataType === 2) {
      if (props.selectedValue) {
        try {
          let data: number = parseInt(props.selectedValue);

          let _date = new Date();
          _date.setTime(data)
          return _date;
        } catch { }
      }
    }
    return new Date();
  });

  const [minDate, setMinDate] = useState<Date>(() => {
    if (props.dataType === 1) {
      if (props.selectedValue) {
        try {
          let data: {
            StartDate: number,
            EndDate: number
          } = JSON.parse(props.selectedValue);

          let _minDate = new Date();
          _minDate.setTime(data.StartDate)
          return _minDate;
        } catch { }
      }
    }
    return new Date();
  });

  const [maxDate, setMaxDate] = useState<Date>(() => {
    if (props.dataType === 1) {
      if (props.selectedValue) {
        try {
          let data: {
            StartDate: number,
            EndDate: number
          } = JSON.parse(props.selectedValue);

          let _maxDate = new Date();
          _maxDate.setTime(data.EndDate)
          return _maxDate;
        } catch { }
      }
    }
    return new Date();
  });

  const [textValue, setTextValue] = useState<string>(() => {
    if (props.dataType === 5) {
      if (props.selectedValue) {
        try {
          return props.selectedValue;
        } catch { }
      }
    }
    return "";
  });

  const [fileUrl, setFileUrl] = useState<string>(() => {
    if (props.dataType === 6) {
      if (props.selectedValue) {
        try {
          return props.selectedValue;
        } catch { }
      }
    }
    return "";
  });

  const [numberValue, setNumberValue] = useState<number>(() => {
    if (props.dataType === 4) {
      if (props.selectedValue) {
        try {
          let data: number = parseInt(props.selectedValue);
          return data;
        } catch { }
      }
    }
    return 0;
  });

  const [selectedListValue, setSelectedListValue] = useState<{ key: string, value: string }>(() => {
    if (props.dataType === 3) {
      if (props.selectedValue) {
        try {
          let data: number = parseInt(props.selectedValue);

          let _selectedData = (props.data || []).find(x => x.key === data.toString());
          if (_selectedData) {
            return _selectedData;
          }
        } catch { }
      }
    }
    return { key: "0", value: props.name + " Seçiniz..." };
  });

  const [provinceList, setProvinceList] = useState<{ key: string, value: string }[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<{ key: string, value: string }>(() => {
    if (props.dataType === 9) {
      if (props.selectedValue) {
        try {
          let data: number = parseInt(props.selectedValue);

          let _selectedData = (provinceList || []).find(x => x.key === data.toString());
          if (_selectedData) {
            return _selectedData;
          }
        } catch { }
      }
    }
    return { key: "0", value: "Seçiniz..." }
  });

  const [price, setPrice] = useState<number>(() => {
    if (props.dataType === 8) {
      if (props.selectedValue) {
        try {
          return Number(props.selectedValue);
        } catch { }
      }
    }
    return 0;
  });

  useEffect(() => {
    if (props.dataType === 1) {
      props.setDynamicData(props.elementId, props.dataType, JSON.stringify({
        StartDate: minDate.getTime(),
        EndDate: maxDate.getTime(),
      }));
    }
  }, [minDate, maxDate]);

  useEffect(() => {
    if (props.dataType === 2) {
      props.setDynamicData(props.elementId, props.dataType, date.getTime().toString());
    }
  }, [date]);

  useStateEffect(() => {
    if (props.dataType === 3) {
      props.setDynamicData(props.elementId, props.dataType, selectedListValue.key);
    }
  }, [selectedListValue]);

  useStateEffect(() => {
    if (props.dataType === 4) {
      props.setDynamicData(props.elementId, props.dataType, numberValue.toString());
    }
  }, [numberValue]);

  useStateEffect(() => {
    if (props.dataType === 5) {
      props.setDynamicData(props.elementId, props.dataType, textValue);
    }
  }, [textValue]);

  useStateEffect(() => {
    if (props.dataType === 6) {
      props.setDynamicData(props.elementId, props.dataType, fileUrl);
    }
  }, [fileUrl]);

  useStateEffect(() => {
    if (props.dataType === 7) {
      let obj: { Ids: number[], Text: string } = {
        Ids: multiValue.map(x => parseInt(x.key)) || [],
        Text: multiValue.map(x => x.value).join("-")
      };
      props.setDynamicData(props.elementId, props.dataType, JSON.stringify(obj));
    }
  }, [multiValue]);

  useStateEffect(() => {
    if (props.dataType === 8) {

      props.setDynamicData(props.elementId, props.dataType, JSON.stringify(price));
    }
  }, [price]);

  useStateEffect(() => {
    if (props.dataType === 9) {

      props.setDynamicData(props.elementId, props.dataType, (selectedProvince.key));
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (props.dataType === 9) {
      getProvinceList();
    }
  }, []);

  useEffect(() => {
    if (props.dataType === 9) {
      getProvinceList();
    }
  }, []);

  const addFiles = (e) => {
    if (e && e[0]) {
      let tempData = e[0].FileUrl;
      setFileUrl(tempData);
    }
  }

  const getProvinceList = async () => {
    let _provinceList: { key: string, value: string }[] = [];
    const response = await fetch(`https://raw.githubusercontent.com/pryazilim/lib/master/data/location/cities.json`, { method: "GET" });
    const json = await response.json();
    json.forEach(item =>
      _provinceList.push({
        key: String(item.id),
        value: item.name
      })
    );
    setProvinceList([..._provinceList]);
  }

  const component = () => {

    switch (props.dataType) {
      // DATE_RANGE = 1,
      case 1:
        return <DateRangePicker
          setMaxDate={setMaxDate}
          setMinDate={setMinDate}
          minValue={minDate}
          maxValue={maxDate}
        />
      // DATE = 2,
      case 2:
        return <DatePicker
          isFull
          value={date}
          setSelectedDate={setDate}
        />
      // ONE_CHOICE = 3,
      case 3:
        return <Dropdown
          key="select"
          isDropDownOpen={showDropdown}
          label={selectedListValue.value}
          items={props.data || []}
          isSearchable={true}
          onItemSelected={item => { setSelectedListValue(item) }} />
      // NUMBER = 4,
      case 4:
        return <input
          className="form-input"
          value={numberValue}
          type="number"
          onChange={(e) => { setNumberValue(parseInt(e.target.value)) }}
        />
      // TEXT = 5,
      case 5:
        return <input
          className="form-input"
          value={textValue}
          type="text"
          onChange={(e) => { setTextValue(e.target.value) }}
        />
      // MEDIA = 6,
      case 6:
        return <>
          {fileUrl ?
            <div className="lg:col-span-2">
              <div className="relative inline-block">
                <img src={fileUrl} alt={""} className="w-full object-contain max-h-40" />
                <TrashIcon className="w-6 h-6 absolute right-0 top-0 shadow-lg absolute right-2 bg-white top-2 rounded-sm text-gray-900 cursor-pointer"
                  onClick={() => { setFileUrl(""); }} />
              </div>
            </div>
            :
            <Dropzone
              fileUploaderCss
              accept={["image"]}
              addFiles={addFiles}
              maxFileSizeAsMB={5}
              uploadUrl={props.uploadUrl}
              maxFileCount={1}
            ></Dropzone>}

        </>
      // MULTIPLE_CHOICE = 7
      case 7:
        return <MultiSelect
          placeholder="Seçim Yapınız"
          selectedValue={multiValue}
          data={props.data || []}
          setSelectedList={setMultiValue}
        />
      // PROVINCE = 8
      case 8:
        return <ReactNumeric
          value={price}
          preDefined={autonNumericOptions.TL}
          onChange={(e, value: number) => { setPrice(value) }}
          className={"form-input"}
        />
      // PROVINCE = 9
      case 9:
        return <Dropdown
          key="selectProvince"
          isDropDownOpen={showDropdown}
          onClick={() => { setShowDropdown(!showDropdown); }}
          label={selectedProvince.value}
          items={provinceList || []}
          isSearchable={true}
          onItemSelected={item => { setSelectedProvince(item) }} />
      default:
        return <></>
    }
  }
  return (
    <>
      <Label title={props.name} withoutDots isRequired={props.isRequired ?? false} className="mt-4"></Label>
      {component()}
    </>
  )
}
