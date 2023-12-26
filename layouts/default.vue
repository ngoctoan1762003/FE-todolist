<template>
  <div class="default">
    <div class="default__top shadow-md">
      <TopNavBar class="top-nav" />
    </div>
    <div class="default__body h-full">
      <TabLeft class="default__body__tableft h-full shadow-md" @AddWorkspace="isCreatingWorkspace = true" />
      <nuxt class="default__body__container" />
      <!-- <TabRight class="default__body__tabright" /> -->
    </div>
    <!-- <div class="default__bottom">
      <FooterBar class="footer" />
    </div> -->
    <notifications group="foo" />
    <div class="absolute flex justify-center items-center z-20 w-full h-full" v-show="isCreatingWorkspace">
      <AddWorkSpace @cancel="isCreatingWorkspace = false" />
    </div>
    <div class="absolute flex justify-center items-center z-20 w-full h-full" v-show="isCreatingPost">
      <AddPost @cancel="closeAddPost()" />
    </div>
    <div class="absolute flex justify-center items-center z-20 w-full h-full" v-show="isCreatingTag">
      <AddTag @cancel="closeAddTag()" />
    </div>

  </div>
</template>

<script>
import AddWorkSpace from '~/components/Workspace/AddWorkSpace.vue';
import AddPost from '~/components/Workspace/AddPost.vue';
import AddTag from '~/components/Workspace/AddTag.vue';
export default {
  data() {
    return {
      isCreatingWorkspace: false,
    }
  },
  created() {
    // this.fetchInfoUser()
  },
  components: {
    AddWorkSpace,
    AddPost,
    AddTag
  },
  computed: {
    isCreatingTag() {
      return this.$store.getters.getActiveAddTag; 
    },
    isCreatingPost(){
      return this.$store.getters.getActiveAddPost; 
    }
  },
  methods: {
    closeAddTag() {
      this.$store.dispatch('setActiveAddTag', false);
    },
    closeAddPost() {
      this.$store.dispatch('setActiveAddPost', false);
    },
    // fetchInfoUser() {
    //   this.$axios
    //     .get('/users/me')
    //     .then((res) => {
    //       localStorage.setItem('user', JSON.stringify(res.data))
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //       if (err.response.data.status === 401)
    //         localStorage.removeItem('accessToken')
    //       localStorage.removeItem('user')
    //       this.$router.push('/auth/login')
    //     })
    // },
  },
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/variables.scss';

.default {
  display: flex;
  flex-direction: column;
  background-color: white;
  min-height: 100vh;
  height: 100%;
  overflow: hidden;
  // gap: 20px;
  position: relative;
  height: 100vh;
  overflow: auto;
  // background: $dark-2;

  &__top {
    height: 60px;
    position: sticky;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 20;
  }

  &__tableft {}

  &__tabright {
    height: 100%;
    max-width: 239px;
  }

  &__body {
    display: inline-flex;
    align-items: flex-start;
    gap: 20px;

    // width: 100%;
    // padding: 0 20px;
    &__container {
      height: 100%;
      max-width: calc(100% - 350px);
      min-height: 490px;
      padding-top: 30px;
    }
  }

  .footer {}
}
</style>
