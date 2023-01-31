import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { GeneralSeoModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Button } from "./Button";
import { SearchIconLg } from "./Icons";
import { Label } from "./Label";
import { Loading } from "./Loading";

interface GeneralSeoUpdateProps {
  pageId: number,
  isLoading: boolean,
  seoList: GeneralSeoModel[],
  getGeneralSeoList: () => Promise<void>
}

export const GeneralSeoUpdate: FunctionComponent<GeneralSeoUpdateProps> = (props: GeneralSeoUpdateProps) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [title, setTitle] = useState<string>(props.seoList.find(x => x.Page === props.pageId)?.Title ?? "");

  const [description, setDescription] = useState<string>(props.seoList.find(x => x.Page === props.pageId)?.Description ?? "");

  useEffect(() => {
    setTitle(props.seoList.find(x => x.Page === props.pageId)?.Title ?? "");
    setDescription(props.seoList.find(x => x.Page === props.pageId)?.Description ?? "");
  }, [props.seoList]);

  const updateGeneralSeoData = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateGeneralSeoData(title, description, props.pageId);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi",
        onClose: () => { context.hideModal(); props.getGeneralSeoList(); }
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
    <div>
      <div className="w-1/2">
        <Label withoutDots isRequired title="Title" className="mt-4" />
        {
          props.isLoading ?
            <Loading inputSm />
            :
            <input className="form-input" type="text" value={title} onChange={(e) => { setTitle(e.target.value); }} />
        }
        <Label withoutDots isRequired title="Description" className="mt-4" />
        {
          props.isLoading ?
            <Loading inputSm />
            :
            <input className="form-input" type="text" value={description} onChange={(e) => { setDescription(e.target.value); }} />
        }
      </div>
      <div className="flex mt-6">
        <Button isLoading={processLoading} textTiny className="w-72 ml-auto" design="button-blue-400" text="Kaydet" onClick={() => { updateGeneralSeoData(); }} />
      </div>
    </div>
  )
}
