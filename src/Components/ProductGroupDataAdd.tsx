import React, { FunctionComponent, useEffect, useState } from "react";
import { InfoIcon, TrashIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { useStateEffect } from "../Components/UseStateEffect";
import { Button } from "../Components/Button";

export interface ProductGroupDataAddPropModel {
  setGroupData: (e: string) => void
  groupData: string
}

export const ProductGroupDataAdd: FunctionComponent<ProductGroupDataAddPropModel> = (props: ProductGroupDataAddPropModel) => {

  const [name, setName] = useState<string>("");

  const [value, setValue] = useState<string>("");

  const [dataArray, setDataArray] = useState<{ name: string, value: string }[]>([]);

  const addToArray = () => {
    if (name === "" || value === "") {
      return;
    }
    let data = (dataArray || []).find(x => x.name == name && x.value == value);
    if (!data) {
      setDataArray([...dataArray, { name, value }]);
    }
    setName("");
    setValue("");
  }

  const removeFromArray = (i: number) => {
    let data = dataArray[i];

    if (data) {
      setDataArray(dataArray.filter(x => x.name !== data.name && x.value !== data.value));
    }
  }

  useEffect(() => {
    try {
      let data: { name: string, value: string }[] = JSON.parse(props.groupData);
      setDataArray(data);
    } catch { }
  }, []);

  useStateEffect(() => {
    props.setGroupData(JSON.stringify(dataArray));
  }, [dataArray])

  const infoText = (text: string) => {
    return <div className="flex items-center mb-2">
      <InfoIcon className="icon-sm text-red-400 mr-2" />
      <p className="p-sm">{text}</p>
    </div>
  }

  return (
    <>
      <div className="lg:col-span-3 ">
        <div className="grid lg:grid-cols-10 gap-4 pt-2">
          <div className="lg:col-span-4">
            <div className="flex items-center justify-between">
              <Label withoutDots title="Ürün Adı" />
            </div>
          </div>
          <div className="lg:col-span-4">
            <Label withoutDots title="Ürün Ölçüleri" />
          </div>
        </div>
        <div className="grid lg:grid-cols-10 gap-4">
          <div className="lg:col-span-4">
            <input
              className="form-input"
              value={name}
              type="text"
              onChange={(e) => { setName(e.target.value) }}
            />
          </div>
          <div className="lg:col-span-4">
            <input
              className="form-input"
              value={value}
              type="text"
              onChange={(e) => { setValue(e.target.value) }}
            />
          </div>
          <div className="lg:col-span-2 relative">
            <div className="bg-blue-400 text-white w-full h-full flex justify-center items-center rounded-lg cursor-pointer hover:bg-blue-600 duration-300" onClick={addToArray}>Ekle</div>
          </div>
        </div>
        {dataArray?.length ? <>
          <div className="border-t border-gray-200 gap-4 my-4 h-72 overflow-y-auto custom-scrollbar">
            <div className="grid lg:grid-cols-11 gap-4">
              <div className="lg:col-span-5">
                <div className="flex items-center justify-between">
                  <Label withoutDots title="Ürün Adı" className="mt-4" />
                </div>
              </div>
              <div className="lg:col-span-5">
                <Label withoutDots title="Ürün Ölçüleri" className="mt-4" />
              </div>
              <div className="lg:col-span-1 flex items-center justify-between">
                <Label withoutDots title="İşlem" className="mt-4" />
              </div>
            </div>

            {dataArray.map((x, i) => {
              return <div className="grid lg:grid-cols-11 gap-4 my-3" key={"rw-" + i}>
                <div className="lg:col-span-5">
                  <Label title={x.name} />
                </div>
                <div className="lg:col-span-5">
                  <Label title={x.value} />
                </div>
                <div className="lg:col-span-1 relative">
                  <Button hasIcon icon={<TrashIcon className={"icon-sm text-gray-700"} />} text="" className="button  absolute my-0 w-full bottom-0" onClick={() => { removeFromArray(i) }} />
                </div>
              </div>
            })}
          </div>   </> : <></>}
      </div>


    </>
  )
}
