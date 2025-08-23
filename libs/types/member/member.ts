import { MemberAuthType, MemberStatus, MemberType } from '../../enums/member.enum';
import { MeFollowed } from '../follow/follow';
import { MeLiked } from '../watch/watch';


export interface Member {
  _id: string; 
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberAuthType: MemberAuthType;
  memberPhone: string;
  memberNick: string;
  memberPassword?: string;
  memberFullName?: string;
  memberImage: string;
  memberAddress?: string;
  memberDesc?: string;
  storeWatches?: number;
  memberArticles: number;
  memberFollowers: number;
  memberFollowings: number;
  memberPoints: number;
  memberLikes: number;
  memberViews: number;
  memberComments: number;
  memberRank: number;
  memberWarnings: number;
  memberBlocks: number;
  deletedAt?: Date;
  createdAt: string;
  updatedAt: Date;
  accessToken?: string;

  meLiked?: MeLiked[];
  meFollowed?: MeFollowed[];
}


export interface TotalCounter {
  total: number;
}

export interface Members {
  list: Member[];
  metaCounter: TotalCounter[];
}
