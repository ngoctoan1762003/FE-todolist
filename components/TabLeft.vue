<template>
  <div class="tableft">
    <div class="tableft__item category">
      <div class="category__item" @click="AddWorkspace">
        <img src="~/assets/icon/add.svg" alt="" class="category__item__image" />
        <div class="category__item__info">
          <span class="text-[#ff5722] font-semibold text-[13px]">Thêm</span>
        </div>
      </div>

      <div class="p-[10px] flex flex-col items-start justify-start">
        <!-- <img src="~/assets/icon/popular.svg" alt="" class="category__item__image"/> -->
        <div class="category__item__info">
          <span class="name">Các không gian làm việc</span>
          <!-- <span class="desc">Shots featured today by curators</span> -->
        </div>
      </div>
      <div class="px-[10px] w-full flex flex-col gap-5" v-for="space in workSpace" :key="space._id">
        <WorkSpaceTag :workspace="space" />
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import WorkSpaceTag from './Workspace/WorkSpaceTag.vue';
export default {
  components: {
    WorkSpaceTag,
  },
  data() {
    return{
      workSpace: []
    }
  },
  created() {
    const authorization = localStorage.getItem('accessToken')
    axios({
      method: 'get',
      url: `https://noneedtoaskthereasonswhy.onrender.com/api/v1/workspaces`,
      headers: {
        Authorization: authorization
      }
    })
      .then(res => {
        console.log(res)
        this.workSpace = res.data.workspaces
      })
      .catch(err => {
        console.log(err)
      })
  },

  methods: {
    AddWorkspace() {
      this.$emit('AddWorkspace')
    }
  }
}

</script>

<style scoped lang="scss">
@import '~/assets/scss/variables.scss';

.tableft {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;

  &__item {
    // border-radius: 16px;
    // background: #f1f2f4;
    display: flex;
    width: 300px;
    height: 100%;
    padding: 10px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    border-right: 1px solid rgb(202, 202, 202);

    .category {
      &__item {
        display: flex;
        width: 100%;
        padding: 6px 5px;
        align-items: center;
        gap: 10px;
        border-radius: 6px;
        // background: $dark-3;  
        cursor: pointer;

        img {
          display: flex;
          height: 100%;
          object-fit: contain;
          justify-content: center;
          align-items: center;
          padding: 4px;
          gap: 10px;
        }

        &__info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;

          // gap: 2px;
          .name {
            color: #97989d;
            font-family: 'Montserrat', sans-serif;
            font-size: 13px;
            font-style: normal;
            font-weight: 500;
            // line-height: 18px; /* 150% */
          }

          .desc {
            color: #97989d;
            /* Regular 9 */
            font-family: 'Montserrat', sans-serif;
            font-size: 10px;
            font-style: normal;
            font-weight: 400;
            line-height: 14px;
            /* 155.556% */
          }
        }

        &__image {
          width: 30px;
          height: 30px;
        }

        &:hover {
          background: rgb(246, 237, 232);
        }
      }
    }
  }
}
</style>
