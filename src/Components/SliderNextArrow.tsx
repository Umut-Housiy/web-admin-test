import React, { FunctionComponent } from "react";
import { ChevronRightIcon, RightArrowIcon } from "./Icons";

interface SliderNextArrowProps {
  onClick?: () => void,
}

export const SliderNextArrow: FunctionComponent<SliderNextArrowProps> = (props: SliderNextArrowProps) => {
  return (
    <div className="absolute -bottom-5 left-1/2 pl-2 pr-1 transfrom bg-white z-10 cursor-pointer" onClick={props.onClick}>
      <ChevronRightIcon className="w-6 h-6 text-gray-900" />
    </div>
  );
};

export const SliderNextArrowOnMiddle: FunctionComponent<SliderNextArrowProps> = (props: SliderNextArrowProps) => {
  return (
    <div className="absolute bottom-1/2 right-2 transform translate-y-1/2  p-2 transform bg-gray-200 rounded-full z-50 cursor-pointer" onClick={props.onClick}>
      <RightArrowIcon className="w-4 h-4 text-gray-900" />
    </div>
  );
};

export const SliderNextArrowOnCard: FunctionComponent<SliderNextArrowProps> = (props: SliderNextArrowProps) => {
  return (
    <div className="absolute bottom-5 right-5 pl-2 pr-1 transfrom  z-10 cursor-pointer" onClick={props.onClick}>
      <ChevronRightIcon className="w-8 h-8 text-white" />
    </div>
  );
};
