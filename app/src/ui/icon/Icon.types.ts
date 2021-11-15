import { ReactNode, CSSProperties } from "react";

import { Styles } from "./Icon.module.scss";

export type IconProps = {
  name: keyof Styles;
  className?: string;
};