<template>
  <div>
    <main class="profile-page overflow-hidden rounded-lg">
      <section class="relative block" style="height: 500px">
        <div class="absolute top-0 w-full h-full bg-center bg-cover">
          <span id="blackOverlay" class="w-full h-full absolute opacity-50 bg-black"></span>
        </div>
        <div class="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
          style="height: 70px"></div>
      </section>
      <section class="relative py-16 bg-[#2C353D]">
        <div class="container mx-auto">
          <div class="relative flex flex-col min-w-0 break-words bg-[#2C353D] w-full mb-6 shadow-xl rounded-lg -mt-64">
            <div class="px-6">
              <div class="flex flex-wrap justify-between w-full">
                <div class="w-[200px] px-4 flex justify-center">
                  <div class="relative">
                    <img alt="..." :src="user.profileImage ?? require('~/assets/img/avt.png')
                      " class="shadow-xl rounded-full h-[150px] border-none absolute -m-16 -ml-20 lg:-ml-16"
                      style="max-width: 150px" />
                  </div>
                </div>
                <div class="info_user w-full md:ml-0 lg:ml-[255px] lg:order-3 lg:text-right lg:self-center">
                  <div class="pt-4 px-3 sm:mt-0 flex justify-between gap-[40px]">
                    <div class="text-left">
                      <span class="text-4xl font-semibold leading-normal mb-2 text-[#fafcfe] mb-2">
                        {{ user?.username }} {{ user?.lastName }}
                      </span>
                      <div class="text-sm leading-normal mt-0 mb-2 text-[#fafcfe] font-semibold uppercase">
                        Ngày tạo: {{ user.created_at }}
                      </div>
                      <div class="text-sm leading-normal mt-0 mb-2 text-[#fafcfe] font-semibold uppercase">
                        Email: {{ user.email }}
                      </div>
                    </div>
                    <div class="button flex items-center">
                      <button
                        class="bg-[#FF571A] active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1"
                        type="button" style="transition: all 0.15s ease 0s" @click="EditProfile" v-if="isOwn">
                        Edit profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Profile',
  components: {

  },
  layout: 'topandfooter',
  data() {
    return {
      user: {},
      news: [],
      filternews: [],
      isEditProfile: false,
      isLoading: true,
      isOwn: false,
      isUpdatingBlog: false,
      alert: {
        isShowModal: false,
        title: '',
        type: 'confirm',
        content: '',
        buttonCancelContent: '',
        buttonOkContent: 'Ok',
        typeSubmit: '',
      },
    }
  },
  computed: {
    countPost() {
      return this.filternews.length
    },
    countLikes() {
      let totalLikes = 0
      this.filternews.forEach((e) => {
        e.reaction.forEach((r) => {
          if (r.reaction === 'like') {
            totalLikes++
          }
        })
      })
      return totalLikes
    },
    compareLength() {
      return this.filternews.length === this.news.length
    },
  },
  created() {
    const authorization = localStorage.getItem('accessToken')
    axios({
      method: 'get',
      url: `https://noneedtoaskthereasonswhy.onrender.com/api/v1/users/${this.$route.params.id}`,
      headers: {
        Authorization: authorization
      },
    })
      .then(res => {
        console.log(res)
        this.user = res.data.user
      })
      .catch(err => {
        console.log(err)

      })
      .finally(() => {
        this.$emit('doneLoading')
      })
  },
  methods: {
    getProfile() {
      this.$axios.get(`/users/${this.$route.params.id}`).then((res) => {
        this.user = res.data
        console.log(JSON.parse(JSON.stringify(res.data)))
      })
    },
    showMore() {
      this.filternews = this.news
    },
    EditProfile() {
      this.isEditProfile = true
    },
    cancelSave() {
      this.alert = {
        ...this.alert,
        ...{
          isShowModal: true,
          title: 'Xác nhận',
          buttonCancelContent: 'Hủy',
          buttonOkContent: 'Xác nhận',
          content:
            'Bạn có chưa lưu thông tin cập nhật. Bạn có muốn thoát cập nhật?',
          type: 'confirm',
          typeSubmit: 'cancelUpdate',
        },
      }
    },
    save(userProp) {
      alert('Luu thanh cong:', JSON.stringify(userProp))
      console.log(userProp)
      this.isEditProfile = false
    },
    fetchInfoUser(data) {
      this.alert.isShowModal = false
      this.isEditProfile = false
      console.log('Fetch user for edit')
      this.$axios
        .get('/users/me')
        .then((res) => {
          console.log(JSON.stringify(data))
          localStorage.setItem('user', JSON.stringify(data))
          // console.log(JSON.stringify(res.data))
          this.user = data
          console.log(JSON.stringify(this.user))
        })
        .catch((err) => {
          console.log(err)
        })
    },
    GoToDetails(id) {
      this.$router.push(`/blog/${id}`)
    },
    cancel() {
      this.isUpdatingBlog = false
    },
    onCloseModal(typeSubmit) {
      switch (typeSubmit) {
        case 'cancelUpdate':
          this.resetAlert()
          this.isEditProfile = false
          break
        default:
          this.resetAlert()
          break
      }
    },
    resetAlert() {
      this.alert = {
        isShowModal: false,
        title: '',
        type: 'failed',
        content: '',
        buttonCancelContent: '',
        buttonOkContent: '',
        typeSubmit: '',
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.bg-cover {
  background-image: url('~/assets/img/anhsgroup.jpg');
}

.relative {
  img {
    width: 150px;
    height: 150px;
    object-fit: contain;
  }
}

.post-creator {
  position: fixed;
  inset: 0;
  background: rgba(71, 79, 98, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 30;
  padding: 20px 0;
}

@media screen and (max-width: 1024px) {
  .info_user {
    margin-top: 80px;
  }
}
</style>
