import { FunctionComponent } from "react";
import { formatter } from "../Services/Functions";
import { fraction } from "../Services/Functions";

export interface NumberViewPropModel {
  price: number,
  suffix: "TL" | "₺" | "€" | "$" | "",
}

export const NumberView: FunctionComponent<NumberViewPropModel> = (props: NumberViewPropModel) => {
  const result = () => {
    if (props.price % 1 === 0) {
      return `${fraction.format(props.price).toString()} ${props.suffix}`
    }
    return `${formatter.format(props.price).toString()} ${props.suffix}`
  }

  return (<>
    {result()}
  </>);
}
