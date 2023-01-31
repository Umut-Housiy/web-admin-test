import React, { FunctionComponent, useState } from "react";
import { useStateEffect } from "./UseStateEffect";

export interface TextAreaPropModel {
  text: string,
  setText: (e: string) => void,
  className?: string,
  placeholder?: string,
  row?: number,
  maxCount?: number,
  disabled?: boolean
}

export const TextArea: FunctionComponent<TextAreaPropModel> = (props: TextAreaPropModel) => {

  const onTextChange = (e) => {
    const _text = e.target.value || "";
    if (props.maxCount) {
      if (_text.length <= props.maxCount) {
        props.setText(_text);
      }
      else {
        props.setText(_text.substring(0, props.maxCount));
      }
    }
    else {
      props.setText(_text)
    }
  }

  const getSpanClass = () => {
    if (props.maxCount) {
      let closeLimitLength = parseInt(((props.maxCount ?? 0) / 10).toString()) * 9;

      if (props.text.length >= props.maxCount) {
        return "absolute font-semibold -bottom-3 right-2 text-sm text-red-400";
      }
      else if (props.text.length >= closeLimitLength) {
        return "absolute -bottom-3 right-2 text-sm text-red-400";
      }
      else {
        return "absolute -bottom-3 right-2 text-sm text-gray-400";
      }
    }
    else {
      return "absolute -bottom-3 right-2 text-sm text-gray-400";
    }
  }

  useStateEffect(() => {
    props.setText(props.text);
  }, [props.text]);

  return (
    <div className="relative">
      <textarea
        disabled={props.disabled}
        onChange={onTextChange}
        className={"text-sm w-full p-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none resize-none leading-5 custom-scrollbar overflow-auto" + (props.className ?? "")}
        placeholder={props.placeholder ? props.placeholder : ""}
        rows={props.row || 3}
        value={props.text ? props.text : props.text} />
      {props.maxCount && <span
        className={getSpanClass()}
      >{props.text.length} / {props.maxCount}</span>}

    </div>
  )
}
