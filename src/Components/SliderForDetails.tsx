import React, { FunctionComponent, ReactNodeArray, useState } from "react";
import Slider from "react-slick";
import { SliderNextArrowOnCard, SliderNextArrowOnMiddle } from "./SliderNextArrow";
import { SliderPrevArrowOnCard, SliderPrevArrowOnMiddle } from "./SliderPrevArrow";

interface SliderForDetailsProps {
  children: ReactNodeArray,
  navigator?: ReactNodeArray
}

export const SliderForDetails: FunctionComponent<SliderForDetailsProps> = (props: SliderForDetailsProps) => {
  const [nav1, setNav1] = React.useState<Slider | undefined>(undefined)
  const [nav2, setNav2] = React.useState<Slider | undefined>(undefined)
  let slider1: Slider | undefined = undefined;
  let slider2: Slider | undefined = undefined;

  React.useEffect(() => {
    setNav1(slider1)
    setNav2(slider2)
  }, [slider1, slider2])

  const settings1 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SliderNextArrowOnCard />,
    prevArrow: <SliderPrevArrowOnCard />
  };
  const settings2 = {
    infinite: true,
    centerMode: true,
    nextArrow: <SliderNextArrowOnMiddle />,
    prevArrow: <SliderPrevArrowOnMiddle />
  };
  return (
    <div className="project-detail-slider">
      <div className="project-detail-slider-main">
        <Slider
          asNavFor={nav2}
          ref={slider => { if (slider) { slider1 = slider } }}
          {...settings1}
          className={` relative`}
        >
          {props.children}
        </Slider>
      </div>

      {
        props.children.length > 1 &&
        <Slider
          asNavFor={nav1}
          ref={slider => { if (slider) { slider2 = slider } }}
          slidesToShow={props.children.length > 5 ? 5 : props.children.length}
          swipeToSlide={false}
          focusOnSelect={true}
          {...settings2}

          className={`${props.children.length === 1 ? "hidden" : "detail-slider-md"} mt-2`}
        >
          {
            props.navigator ?
              props.navigator
              :
              props.children
          }
        </Slider>
      }

    </div>
  );

}
