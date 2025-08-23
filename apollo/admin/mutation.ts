import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			storeWatches
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

/**************************
 *        Watch        *
 *************************/

export const UPDATE_WATCH_BY_ADMIN = gql`
  mutation UpdateWatchByAdmin($input: WatchUpdate!) {
    updateWatchByAdmin(input: $input) {
      _id
      watchType
      watchStatus
      watchOrigin
      modelName
      brand
      price
      caseDiameter
      movement
      waterResistance
      isLimitedEdition
      releaseDate
      images
      description
      memberId
      soldAt
      deletedAt
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_WATCH_BY_ADMIN = gql`
  mutation RemoveWatchByAdmin($input: String!) {
    removeWatchByAdmin(watchId: $input) {
      _id
      watchType
      watchStatus
      watchOrigin
      modelName
      brand
      price
      caseDiameter
      movement
      waterResistance
      isLimitedEdition
      releaseDate
      images
      description
      memberId
      soldAt
      deletedAt
      createdAt
      updatedAt
    }
  }
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;
