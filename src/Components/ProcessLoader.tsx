import { FunctionComponent } from "react";


interface LoaderProps{
  loaderColor?:string;
}
export const ProcessLoader: FunctionComponent<LoaderProps> = (props: LoaderProps) => {
  let circleCommonClasses = `${props.loaderColor ? props.loaderColor : "bg-white"} h-2 w-2 rounded-full`;

  return (
      <div className='flex py-1.5'>
          <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
          <div
              className={`${circleCommonClasses} mr-1 animate-bounce200`}
          ></div>
          <div className={`${circleCommonClasses} animate-bounce400`}></div>
      </div>
  );
};
