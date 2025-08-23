import { Direction } from '../../enums/common.enum';
import {
  CaseDiameter,
  Movement,
  WatchOrigin,
  WatchStatus,
  WatchType,
} from '../../enums/watch.enum';

export interface WatchInput {
  watchType: WatchType;
  watchOrigin: WatchOrigin;
  modelName: string;
  brand: string;
  price: number;
  caseDiameter?: CaseDiameter;               // single value on create/update
  movement?: Movement | string;
  waterResistance?: number;
  isLimitedEdition?: boolean;
  releaseDate?: Date;
  images: string[];
  description?: string;
  memberId?: string;
}

export interface Range {
  start: number;
  end: number;
}

export interface PeriodsRange {
  start: Date | number;
  end: Date | number;
}

export interface WatchSearch {
  movement?: Movement[];                     // <-- array (you call .includes on it)
  caseDiameter?: string[];             // <-- array of enum strings (e.g., "MM40")
  originList?: WatchOrigin[];
  typeList?: WatchType[];
  brandList?: string[];

  // Optional singletons / other filters:
  watchType?: WatchType;
  memberId?: string;
  pricesRange?: Range | undefined;
  periodsRange?: PeriodsRange;
  text?: string;
  isLimitedEdition?: boolean;
  watchStatus?: WatchStatus;
}

export interface WatchesInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search?: WatchSearch;                      // <-- use WatchSearch here
}

export interface StoreWatchesInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: WatchSearch;                       // <-- and here
}
