import { Member } from '../member/member';
import { WatchOrigin, WatchStatus, WatchType } from '../../enums/watch.enum';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Watch {
  _id: string;
  watchType: WatchType;
  watchStatus: WatchStatus;
  watchOrigin: WatchOrigin;
  modelName: string;
  brand: string;
  price: number;
  caseDiameter?: number; // in mm
  movement?: string;
  waterResistance?: string;
  isLimitedEdition: boolean;
  releaseDate?: Date;
  watchViews: number;
  likes: number;
  comments: number;
  rank: number;
  images: string[];
  description?: string;
  memberId: string;
  soldAt?: Date;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  memberData?: Member;
  meLiked?: MeLiked[];
}

export interface Watches {
  list: Watch[];
  metaCounter: { total: number }[];
}
