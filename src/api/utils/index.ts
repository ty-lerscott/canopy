import type { PrimitiveObject } from "@/types";
import { type ClassValue, clsx } from "clsx";
import type { Request } from "express";
import objectOmit from "object.omit";

export const omit = <Generic = PrimitiveObject>(
	obj: PrimitiveObject | Request["query"],
	keyArr: string[],
) => objectOmit(obj, keyArr) as Generic;

export const cn = (...inputs: ClassValue[]) => clsx(inputs);
