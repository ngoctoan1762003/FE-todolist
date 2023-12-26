export const state = () => ({
    postId: null,
    isActiveAddTag: false,
    isActiveAddPost: false,
    isDragPost: false,
    isDragTag: false,
  });
  
  export const mutations = {
    setPostId(state, postId) {
      state.postId = postId;
    },
    setActiveAddTag(state, value) {
      state.isActiveAddTag = value;
    },
    setActiveAddPost(state, value) {
      state.isActiveAddPost = value;
    },
    setDraggingPost(state, value){
      state.isDragPost = value;
    },
    setDraggingTag(state, value){
      state.isDragTag = value;
    }
  };
  
  export const actions = {
    setPostIdAction({ commit }, postId) {
      commit('setPostId', postId);
    },
    setActiveAddTag({ commit }, value) {
      commit('setActiveAddTag', value);
    },
    setActiveAddPost({ commit }, value) {
      commit('setActiveAddPost', value);
    },
    setDraggingPostAction({ commit }, value) {
      commit('setDraggingPost', value);
    },
    setDraggingTagAction({ commit }, value) {
      commit('setDraggingTag', value);
    },
};

export const getters = {
    getPostId(state) {
      return state.postId;
    },
    getActiveAddTag(state) {
        console.log(state.isActiveAddTag)
      return state.isActiveAddTag;
    },
    getActiveAddPost(state) {
      return state.isActiveAddPost;
    },
    getIsDraggingPost(state){
      return state.isDragPost;
    },
    getIsDraggingTag(state){
      return state.isDragTag;
    },
};