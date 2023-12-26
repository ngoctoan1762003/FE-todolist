<template>
  <div class="main relative">
    <div class="font-bold text-xl text-gray-500">CÁC KHÔNG GIAN LÀM VIỆC CỦA BẠN</div>
    <div class="mt-5 flex gap-10 flex-wrap">
      <div v-for="workspace in workspaces" :key="workspace._id">
        <WorkSpaceCard :id="workspace._id" :title="workspace.title" />
      </div>
    </div>

    <!-- <modal-alert
      v-if="alert.isShowModal"
      :width="480"
      v-bind="alert"
      @close="onCloseModal"
    /> -->
  </div>
</template>

<script>
import axios from 'axios'
import WorkSpaceCard from '~/components/Workspace/WorkSpaceCard.vue';
export default {
  name: 'IndexPage',
  components: {
    WorkSpaceCard,
  },
  data() {
    return {
      workspaces: [],
    };
  },
  async created() {
    await this.getListWorkspace();
  },
  methods: {
    getListWorkspace() {
      // Example usage:
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const authorization = localStorage.getItem('accessToken')
      console.log(userId)

      axios({
        method: 'get',
        url: `https://noneedtoaskthereasonswhy.onrender.com/api/v1/workspaces`,
        headers: {
          Authorization: authorization
        }
      })
      .then(res => {
        this.workspaces = res.data.workspaces
        console.log(this.workspaces)
      })
      .catch(err => {
        console.log(err)
      })
    },
    // ... other methods
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/scss/variables.scss';

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
