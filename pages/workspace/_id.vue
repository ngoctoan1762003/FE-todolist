<template>
  <div class="main relative w-full" @dragenter.prevent @dragover.prevent @drop="handleDrop($event)">
    <div
      class="absolute right-1 top-8 bg-red-500 px-2 py-1 rounded-md cursor-pointer text-white font-semibold text-sm z-10"
      @click="deleteWorkspace">Xóa</div>
    <div class="sticky top-0">
      <div>
        <div class="flex gap-5 items-center">
          <div class="text-xl font-bold text-gray-700" v-show="!isEditingName">{{ title }}</div>
          <input type="text" placeholder="New name" class="border-0 p-2" v-model="newTitle" v-show="isEditingName"
            @keyup.enter="handleEditWorkspace">
          <img src="~/assets/icon/write.svg" class="w-5 h-5 cursor-pointer" @click="isEditingName = true">
        </div>
        <div class="border-b-2 m-4 sticky left-[100px]"></div>
      </div>
    </div>
    <div class="flex gap-5 w-full overflow-x-auto">
      <!-- Wrap PostCard components in a container with fixed width -->
      <div id="post-card-container" @dragover="handleDragOver($event)">
        <div class="post" :id="postCard._id" v-for="postCard in arrangedPost" :key="postCard._id" draggable="true"
          @dragstart="handleDragStart($event, postCard)" @dragend="handleDragEnd($event)">
          <PostCard :posts="postCard" @showTag="showTag" @delete="deletePost" @changePosOfCard="changePosOfCard" />
        </div>
        <div id="add-post-btn" class="rounded-lg bg-[#f1f2f4] px-5 py-4 flex flex-col gap-2 min-w-[250px] h-[50px]">
          <div class="text-[#485367] font-semibold text-sm text-[#ff5722] cursor-pointer" @click="setActiveAddPost()">+
            Thêm danh sách khác</div>
        </div>
      </div>
    </div>
    <div v-if="isShowTag" class="fixed inset-0 bg-[rgba(71,79,98,0.8)] flex justify-center items-center z-20">
      <TagInformation @cancel="isShowTag = false" :tagId="currentTagId" @edit="editTag" @delete="deleteTag" />
    </div>
    <div v-if="isEdittingTag" class="fixed inset-0 bg-[rgba(71,79,98,0.8)] flex justify-center items-center z-20">
      <EditTag @cancel="isEdittingTag = false" :tag="currentTag" @save="doneEditTag" />
    </div>
  </div>
</template>
    
<script>
import axios from 'axios'
import TagInformation from '~/components/Workspace/TagInformation.vue';
import PostCard from '~/components/Workspace/PostCard.vue'
import EditTag from '~/components/Workspace/EditTag.vue'
export default {
  name: 'IndexPage',
  components: {
    PostCard,
    TagInformation,
    EditTag
  },
  computed: {
    arrangedPost() {
      return this.posts.slice().sort((a, b) => a.pos - b.pos);
    },
    isDraggingPost() {
      return this.$store.getters.getIsDraggingPost;
    },
    isDraggingTag() {
      return this.$store.getters.getIsDraggingTag;
    },
  },
  data() {
    return {
      alert: {
        isShowModal: false,
        title: '',
        type: 'failed',
        content: '',
        buttonCancelContent: '',
        buttonOkContent: '',
        typeSubmit: '',
      },
      isEditingName: false,
      posts: [],
      newTitle: '',
      title: '',
      currentPostId: {
        type: Number,
        default: () => { }
      },
      isShowTag: false,
      currentTagId: {
        type: Number,
        default: () => { }
      },
      isEdittingTag: false,
      currentTag:{
        type: Object,
        default: () => {}
      }
    }
  },
  async created() {
    await this.getWorkspaceDetail()
    this.isLoading = false
    // await this.modifyListBlog()
  },
  methods: {
    handleDragStart(event, post) {
      this.$store.dispatch('setDraggingPostAction', true)
      event.stopPropagation();
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer?.setData('application/json', JSON.stringify(post))
      event.target.classList.add('is-dragging');
      this.currentPostId = post._id
    },
    handleDragOver(event) {
      if (!this.isDraggingPost || this.isDraggingTag) return;
      event.preventDefault();
      const zone = document.getElementById("post-card-container");
      const rightTask = this.insertLeftTask(zone, event.clientX);
      const curTask = document.querySelector(".is-dragging"); // Use zone to query for the dragging element

      if (!rightTask) {
        const rightTask = document.getElementById("add-post-btn")
        zone.insertBefore(curTask, rightTask);
      } else {
        zone.insertBefore(curTask, rightTask);
      }
    },
    handleDrop(event) {
      if (!this.isDraggingPost || this.isDraggingTag) return;
      event.preventDefault();
      const zone = document.getElementById("post-card-container");
      const posts = zone.querySelectorAll('.post');
      const index = Array.from(posts).findIndex((element) => element.id === this.currentPostId);
      if (index !== -1) {
        const prev = index > 0 ? posts[index - 1] : null;
        const next = index < posts.length - 1 ? posts[index + 1] : null;

        let prevpos = -1;
        console.log(prev)
        if (prev && prev.id) {
          const prevcom = this.posts.find(u => u._id.toString() === prev.id.toString());
          prevpos = prevcom ? prevcom.pos : -1;
        }

        let nextpos = -1
        console.log(next)
        if (next && next.id) {
          const nextcom = this.posts.find(u => u._id.toString() === next.id.toString());
          nextpos = nextcom ? nextcom.pos : -1;
        }

        let tagPos;
        if (prevpos !== -1 && nextpos !== -1) tagPos = (prevpos + nextpos) / 2;
        else if (prevpos === -1 && nextpos === -1) tagPos = 0.1;
        else if (prevpos === -1) tagPos = 0.1;
        else if (nextpos === -1) tagPos = prevpos + 1;

        console.log("prevpos" + prevpos);
        console.log('nextpos', nextpos);
        console.log(tagPos);
        const authorization = localStorage.getItem('accessToken')
        axios({
          method: 'patch',
          url: `https://noneedtoaskthereasonswhy.onrender.com/api/v1/posts/${this.currentPostId}`,
          headers: {
            Authorization: authorization
          },
          data: {
            pos: tagPos
          },
        })
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
    ,
    handleDragEnd(event) {
      event.stopPropagation();
      event.target.classList.remove('is-dragging');
      this.$store.dispatch('setDraggingPostAction', false)
    },
    insertLeftTask(zone, mouseX) {
      const els = zone.querySelectorAll(".post:not(.is-dragging):not(#add-post-btn)");
      let closestTask = null;
      let closestOffset = Number.NEGATIVE_INFINITY;

      els.forEach((task) => {
        const { left } = task.getBoundingClientRect();
        const offset = mouseX - left;

        // Điều chỉnh điều kiện offset dựa trên yêu cầu cụ thể của bạn
        if (offset < 70 && offset > closestOffset) {
          closestOffset = offset;
          closestTask = task;
        }
      });

      return closestTask;
    },


    getWorkspaceDetail() {
      const workspaceid = this.$route.params.id
      const authorization = localStorage.getItem('accessToken')
      axios({
        method: 'get',
        url: `https://noneedtoaskthereasonswhy.onrender.com/api/v1/workspaces/${workspaceid}?include=True`,
        headers: {
          Authorization: authorization
        }
      })
        .then(res => {
          console.log(res)
          this.posts = res.data.posts
          this.title = res.data.title
          this.posts = res.data.posts
        })
        .catch(err => {
          console.log(err)
        })
    },
    setActiveAddPost() {
      this.$store.dispatch('setActiveAddPost', true)
    },
    handleEditWorkspace() {
      if (this.newTitle === '') {
        this.$notify({
          title: 'Thất bại',
          text: 'Chưa nhập tiêu đề',
          type: 'success',
          group: 'foo',
        })
        return;
      }
      const workspaceid = this.$route.params.id
      const authorization = localStorage.getItem('accessToken')
      this.isEditingName = false
      axios({
        method: 'put',
        url: `https://noneedtoaskthereasonswhy.onrender.com/api/v1/workspaces/${workspaceid}`,
        headers: {
          Authorization: authorization
        },
        data: {
          title: this.newTitle
        },
      })
        .then(res => {
          console.log(res)
          this.$notify({
            title: 'Thành công',
            text: 'Đổi thành công',
            type: 'success',
            group: 'foo',
          })
          this.getWorkspaceDetail()
        })
        .catch(err => {
          console.log(err)
          this.$notify({
            title: 'Thất bại',
            text: 'Đổi thất bại: ' + err.response.data.message,
            type: 'success',
            group: 'foo',
          })
        })
        .finally(() => {
          this.$emit('doneLoading')
        })
      this.newTitle = ''
    },
    deleteWorkspace() {
      const workspaceid = this.$route.params.id
      const authorization = localStorage.getItem('accessToken')
      axios({
        method: 'delete',
        url: `https://noneedtoaskthereasonswhy.onrender.com/api/v1/workspaces/${workspaceid}`,
        headers: {
          Authorization: authorization
        }
      })
        .then(res => {
          console.log(res)
          this.posts = res.data.posts
          this.$router.push('/')
        })
        .catch(err => {
          console.log(err)
        })
    },
    deletePost(postId) {
      const authorization = localStorage.getItem('accessToken')
      axios({
        method: 'delete',
        url: `https://noneedtoaskthereasonswhy.onrender.com/api/v1/posts/${postId}`,
        headers: {
          Authorization: authorization
        },
      })
        .then(res => {
          console.log(res)
          this.$notify({
            title: 'Thành công',
            text: 'Xóa thành công',
            type: 'success',
            group: 'foo',
          })
          this.$emit('reload')
        })
        .catch(err => {
          console.log(err)
          this.$notify({
            title: 'Thất bại',
            text: 'Xóa thất bại: ' + err.response.data.message,
            type: 'success',
            group: 'foo',
          })
        })
      this.getWorkspaceDetail()
    },
    changePosOfCard(startPostId, endPostId, tagId, tagPos) {
      console.log(tagPos)
      const startPost = this.posts.find(u => u._id.toString() === startPostId)
      const endPost = this.posts.find(u => u._id.toString() === endPostId)
      const tag = startPost.tags.find(u => u._id.toString() === tagId)
      tag.pos = tagPos
      const tagIndex = startPost.tags.findIndex(u => u._id.toString() === tagId);
      startPost.tags.splice(tagIndex, 1);
      endPost.tags.push(tag);
      const authorization = localStorage.getItem('accessToken')
      axios({
        method: 'patch',
        url: `https://noneedtoaskthereasonswhy.onrender.com/api/v1/tags/${tag._id}`,
        headers: {
          Authorization: authorization
        },
        data: {
          post_id: endPostId,
          pos: tagPos
        },
      })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    showTag(id) {
      this.currentTagId = id
      this.isShowTag = true
    },
    editTag(tag) {
      this.currentTag = tag
      this.isEdittingTag = true
    },
    deleteTag(id) {
      const authorization = localStorage.getItem('accessToken')
      axios({
        method: 'delete',
        url: `https://noneedtoaskthereasonswhy.onrender.com/api/v1/tags/${id}`,
        headers: {
          Authorization: authorization
        },
      })
        .then(res => {
          console.log(res)
          this.$notify({
            title: 'Thành công',
            text: 'Xóa thành công',
            type: 'success',
            group: 'foo',
          })
          this.$emit('reload')
        })
        .catch(err => {
          console.log(err)
          this.$notify({
            title: 'Thất bại',
            text: 'Xóa thất bại: ' + err.response.data.message,
            type: 'success',
            group: 'foo',
          })
        })
        .finally(() => {
          this.isShowTag = false
          this.getWorkspaceDetail()
        })
    },
    doneEditTag(){
      this.isEdittingTag = false
      this.getWorkspaceDetail()
    }
  },
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/variables.scss';

*::-webkit-scrollbar {
  display: none;
}

.is-dragging {}

.main {
  .post-creator {
    position: fixed;
    inset: 0;
    background: rgba(71, 79, 98, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 30;
    padding: 20px 0;

    &__container {
      height: 100%;
      overflow-y: auto;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__form {
      width: 100%;
      max-width: 800px;
      padding: 40px 20px;
      border-radius: 10px;
      margin: auto;
      // height: 100%;
    }
  }

  #post-card-container {
    display: flex;
    flex-wrap: nowrap; // Prevent wrapping to the next line
    overflow-x: auto; // Enable horizontal scrollbar if content overflows
    gap: 5px; // Adjust the gap between PostCard components
    padding-bottom: 5px; // Adjust as needed
    height: calc(100vh - 200px);
    max-width: 100%;
  }

  .container {
    display: flex;
    width: 100%;
    max-width: 750px;
    height: 100%;

    .blog {
      width: 100%;
    }

    .search {
      position: relative;
      flex: 1;
      width: 100%;

      input {
        display: flex;
        width: 100%;
        padding: 9px 20px;
        padding-right: 40px;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        border-radius: 10px;
        outline: none;
        color: #fff;
        /* Regular 14 */
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        /* 157.143% */
        background: $dark-4;

        ::placeholder {
          color: #858ead;
        }
      }

      img {
        position: absolute;
        display: flex;
        width: 20px;
        height: 20px;
        padding: 0px 0.5px 0.5px 1px;
        justify-content: center;
        align-items: center;
        top: 50%;
        right: 40px;
        transform: translateY(-50%);
      }
    }
  }

  .main-content {
    height: calc(100% - 100px);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
    