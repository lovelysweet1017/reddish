import postService from '../services/posts';

const postPageReducer = (state = null, action) => {
  switch (action.type) {
    case 'FETCH_POST_COMMENTS':
      return action.payload;
    case 'CREATE_NEW_POST':
      return action.payload;
    case 'UPDATE_POST':
      return action.payload;
    case 'TOGGLE_VOTE':
      return { ...state, ...action.payload };
    case 'VOTE_COMMENT':
      return {
        ...state,
        comments: state.comments.map((c) =>
          c.id !== action.payload.commentId
            ? c
            : { ...c, ...action.payload.data }
        ),
      };
    case 'VOTE_REPLY':
      return {
        ...state,
        comments: state.comments.map((c) =>
          c.id !== action.payload.commentId
            ? c
            : {
                ...c,
                replies: c.replies.map((r) =>
                  r.id !== action.payload.replyId
                    ? r
                    : { ...r, ...action.payload.data }
                ),
              }
        ),
      };
    default:
      return state;
  }
};

export const fetchPostComments = (id) => {
  return async (dispatch) => {
    const fetchedPost = await postService.getPostComments(id);

    dispatch({
      type: 'FETCH_POST_COMMENTS',
      payload: fetchedPost,
    });
  };
};

export const createNewPost = (postObject) => {
  return async (dispatch) => {
    const addedPost = await postService.addNew(postObject);

    dispatch({
      type: 'CREATE_NEW_POST',
      payload: addedPost,
    });

    return addedPost.id;
  };
};

export const updatePost = (id, postObject) => {
  return async (dispatch) => {
    const updatedPost = await postService.editPost(id, postObject);

    dispatch({
      type: 'UPDATE_POST',
      payload: updatedPost,
    });
  };
};

export const toggleUpvote = (id, upvotedBy, downvotedBy) => {
  return async (dispatch) => {
    let pointsCount = upvotedBy.length - downvotedBy.length;
    if (pointsCount < 0) {
      pointsCount = 0;
    }

    dispatch({
      type: 'TOGGLE_VOTE',
      payload: { upvotedBy, pointsCount, downvotedBy },
    });

    await postService.upvotePost(id);
  };
};

export const toggleDownvote = (id, downvotedBy, upvotedBy) => {
  return async (dispatch) => {
    let pointsCount = upvotedBy.length - downvotedBy.length;
    if (pointsCount < 0) {
      pointsCount = 0;
    }

    dispatch({
      type: 'TOGGLE_VOTE',
      payload: { upvotedBy, pointsCount, downvotedBy },
    });

    await postService.downvotePost(id);
  };
};

export const toggleCommentUpvote = (
  postId,
  commentId,
  upvotedBy,
  downvotedBy
) => {
  return async (dispatch) => {
    const pointsCount = upvotedBy.length - downvotedBy.length;

    dispatch({
      type: 'VOTE_COMMENT',
      payload: { commentId, data: { upvotedBy, pointsCount, downvotedBy } },
    });

    await postService.upvoteComment(postId, commentId);
  };
};

export const toggleCommentDownvote = (
  postId,
  commentId,
  downvotedBy,
  upvotedBy
) => {
  return async (dispatch) => {
    const pointsCount = upvotedBy.length - downvotedBy.length;

    dispatch({
      type: 'VOTE_COMMENT',
      payload: { commentId, data: { upvotedBy, pointsCount, downvotedBy } },
    });

    await postService.downvoteComment(postId, commentId);
  };
};

export const toggleReplyUpvote = (
  postId,
  commentId,
  replyId,
  upvotedBy,
  downvotedBy
) => {
  return async (dispatch) => {
    const pointsCount = upvotedBy.length - downvotedBy.length;

    dispatch({
      type: 'VOTE_REPLY',
      payload: {
        commentId,
        replyId,
        data: { upvotedBy, pointsCount, downvotedBy },
      },
    });

    await postService.upvoteReply(postId, commentId, replyId);
  };
};

export const toggleReplyDownvote = (
  postId,
  commentId,
  replyId,
  downvotedBy,
  upvotedBy
) => {
  return async (dispatch) => {
    const pointsCount = upvotedBy.length - downvotedBy.length;

    dispatch({
      type: 'VOTE_REPLY',
      payload: {
        commentId,
        replyId,
        data: { upvotedBy, pointsCount, downvotedBy },
      },
    });

    await postService.downvoteReply(postId, commentId, replyId);
  };
};

export default postPageReducer;
