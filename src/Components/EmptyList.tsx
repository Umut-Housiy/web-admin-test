
import React, { FunctionComponent } from "react";
import { EmptyListData } from "./Icons";

interface EmptyListProp {
  text: string,
  desc?: string
}
export const EmptyList: FunctionComponent<EmptyListProp> = (props: EmptyListProp) => {
  return (
    <div className="text-center my-4">
      <EmptyListData className="text-blue-400 mb-4 mx-auto" />
      <p className="text-tiny text-gray-900 font-medium">{props.text}</p>
      {props.desc !== undefined &&
        <p className="text-sm text-gray-900 w-4/5 mx-auto mt-4">{props.desc}</p>
      }
    </div>
  )
}
