<template>
  <div class="relative rounded-lg bg-[#f1f2f4] px-5 py-4 flex flex-col gap-2 min-w-[250px]" @dragenter.prevent
    @dragover.prevent @drop="handleDrop($event)">
    <div class="flex gap-3 items-center">
      <div class="text-[#485367] font-semibold" v-show="!isEditingName">{{ title }}</div>
      <input ref="nameInput" type="text" placeholder="New name" class="text-sm border-0 p-2 max-w-[100px]" v-model="newTitle"
        v-show="isEditingName" @keyup.enter="handleEditPost" @blur="isEditingName = false">
      <img src="~/assets/icon/write.svg" class="w-3 h-3 cursor-pointer" @click="startEditingName">

    </div>
    <div class="absolute right-5 top-3 font-bold text-xl text-gray-500 cursor-pointer" @click="isTurningOn = !isTurningOn"
      @mouseenter="isTurningOn = true">...</div>
    <div class="absolute right-5 top-5 flex flex-col gap-0 bg-white p-1 shadow-md rounded-md"
      @mouseleave="isTurningOn = false" v-show="isTurningOn">
      <div @click="setPostIdHandler()"
        class="text-xs text-gray-500 font-semibold cursor-pointer hover:bg-green-300 hover:text-white p-2 rounded-md">Thêm
        thẻ</div>
      <div @click="deletePost()"
        class="text-xs text-gray-500 font-semibold cursor-pointer hover:bg-red-400 hover:text-white p-2 rounded-md">Xóa
        bảng</div>
    </div>
    <div :class="posts._id" class="overflow-y-auto max-h-[300px] flex flex-col gap-2 pt-2"
      @dragover="handleDragOver($event)">
      <div :id="card._id" class="tag" v-for="card in arrangedTags" v-bind:key="card._id" draggable="true"
        @dragstart.stop="handleDragStart($event, card)" @dragend.stop="handleDragEnd($event)">
        <WorkingCard :title="card.title" :id="card._id" :timestamp="card.deadline.split('T')[0]" @showTag="showTag"/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import WorkingCard from './WorkingCard.vue';

export default {
  name: 'IndexPage',
  components: {
    WorkingCard
  },
  props: {
    posts: {
      type: Object,
      default: () => ({})
    },
  },
  setup() {
    return {
      handleDragStart(event, tag) {
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'move'
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer?.setData('application/json', JSON.stringify({
          startPostId: this.posts._id,
          tag
        }))
        event.target.classList.add('is-dragging');
        this.$store.dispatch('setDraggingTagAction', true)
      },
      handleDragOver(event) {
        if (this.isDraggingPost) return;
        event.preventDefault();
        const zone = document.getElementsByClassName(this.posts._id)[0];
        const bottomTask = this.insertAboveTask(zone, event.clientY);
        const curTask = document.querySelector(".is-dragging"); // Use zone to query for the dragging element
        if (!bottomTask) {
          zone.appendChild(curTask);
        } else {
          zone.insertBefore(curTask, bottomTask);
        }
      },
      handleDrop(event) {
        if (this.isDraggingPost) return;
        event.preventDefault();
        this.$store.dispatch('setDraggingTagAction', false)
        const data = JSON.parse(event.dataTransfer.getData('application/json'));
        const tag = data.tag;
        const zone = document.getElementsByClassName(this.posts._id)[0];
        const tags = zone.querySelectorAll('.tag');
        const index = Array.from(tags).findIndex((element) => element.id === tag._id);
        if (index !== -1) {
          const prev = index > 0 ? tags[index - 1] : null;
          const next = index < tags.length - 1 ? tags[index + 1] : null;

          let prevpos = -1;
          if (prev && prev.id) {
            const prevcom = this.posts.tags.find(u => u._id.toString() === prev.id);
            prevpos = prevcom ? prevcom.pos : -1;
          }

          let nextpos = -1
          if (next && next.id) {
            const nextcom = this.posts.tags.find(u => u._id.toString() === next.id);
            nextpos = nextcom ? nextcom.pos : -1;
          }

          let tagPos;
          if (prevpos !== -1 && nextpos !== -1) tagPos = (prevpos + nextpos) / 2;
          else if (prevpos === -1 && nextpos === -1) tagPos = 0.1;
          else if (prevpos === -1) tagPos = 0.1;
          else if (nextpos === -1) tagPos = prevpos + 1;
          this.$emit('changePosOfCard', data.startPostId, this.posts._id, tag._id, tagPos);
        }
      },
      handleDragEnd(event) {
        event.target.classList.remove('is-dragging');
      },
      setPostIdHandler() {
        this.$store.dispatch('setPostIdAction', this.posts._id);
        this.$store.dispatch('setActiveAddTag', true);
      },
      deletePost() {
        this.$emit('delete', this.posts._id)
      },

    }
  },
  computed: {
    arrangedTags() {
      return this.posts.tags.slice().sort((a, b) => a.pos - b.pos)
    },
    isDraggingPost() {
      return this.$store.getters.getIsDraggingPost;
    }
  },
  data() {
    return {
      news: [],
      isLoading: true,
      searchValue: '',
      currentTagId: {
        type: Number,
        default: () => { }
      },
      zoneId: {
        type: Number,
        default: () => { }
      },
      isTurningOn: false,
      isEditingName: false,
      newTitle: '',
      title: ''
    };
  },
  mounted(){
    this.title = this.posts.title
  },
  methods: {
    showTag(id){
      this.$emit('showTag', id)
    },
    startEditingName() {
      this.isEditingName = true;
      setTimeout(() => {
        this.$refs.nameInput.focus();
      }, 100);
    },
    handleEditPost() {
      if (this.newTitle === '') {
        this.$notify({
          title: 'Thất bại',
          text: 'Chưa nhập tiêu đề',
          type: 'success',
          group: 'foo',
        })
        return;
      }
      const authorization = localStorage.getItem('accessToken')
      this.isEditingName = false
      axios({
        method: 'patch',
        url: `https://noneedtoaskthereasonswhy.onrender.com/api/v1/posts/${this.posts._id}`,
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
          this.title = this.newTitle
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
          this.newTitle = ''
        })
    },
    insertAboveTask(zone, mouseY) {
      const els = zone.querySelectorAll(".tag:not(.is-dragging)");
      let closestTask = null;
      let closestOffset = Number.NEGATIVE_INFINITY;

      els.forEach((task) => {
        const { top } = task.getBoundingClientRect();
        const offset = mouseY - top;

        if (offset < 0 && offset > closestOffset) {
          closestOffset = offset;
          closestTask = task;
        }
      });
      return closestTask;
    },
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/variables.scss';

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
  