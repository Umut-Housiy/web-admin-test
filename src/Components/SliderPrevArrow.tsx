import { FunctionComponent } from "react";
import { ChevronRightIcon, RightArrowIcon } from "./Icons";

interface SliderPrevArrowProps {
  onClick?: () => void;
}
export const SliderPrevArrow: FunctionComponent<SliderPrevArrowProps> = (props: SliderPrevArrowProps) => {
  return (
    <div className="absolute -bottom-5 right-1/2 transfrom z-10 bg-white pr-2 pl-1 mr-1 cursor-pointer" onClick={props.onClick}>
      <ChevronRightIcon className="w-6 h-6 text-gray-900 transform -rotate-180" />
    </div>
  );
};

export const SliderPrevArrowOnMiddle: FunctionComponent<SliderPrevArrowProps> = (props: SliderPrevArrowProps) => {
  return (
    <div className="absolute bottom-1/2 left-2 transform translate-y-1/2  p-2 transform bg-gray-200 rounded-full z-50 cursor-pointer" onClick={props.onClick}>
      <RightArrowIcon className="w-4 h-4 transform -rotate-180 text-gray-900" />
    </div>
  );
};


export const SliderPrevArrowOnCard: FunctionComponent<SliderPrevArrowProps> = (props: SliderPrevArrowProps) => {
  return (
    <div className="absolute bottom-5 right-14 z-10 cursor-pointer" onClick={props.onClick}>
      <ChevronRightIcon className="w-8 h-8 text-white transform -rotate-180" />
    </div>
  );
};
