<template>
  <div class="relative flex justify-center items-center h-[100vh] bg-white gap-10">
    <div class="z-10 w-[500px]">
      <form action="" class="flex flex-col form gap-7 py-[60px] justify-center items-center w-[400px] rounded-md px-10"
        @keydown.enter="userLogin">
        <div class="text-3xl font-bold text-[#485367]">Forgot Password</div>
        <div class="w-full flex flex-col gap-2">
          <label for="" class="text-sm text-[#485367] font-medium">Email</label>
          <input v-model="email" type="text"
            class="focus:outline-0 text-[#485367] h-[50px] w-full rounded-md pl-5 bg-white border-[1px]"
            placeholder="Email" :class="{ invalid: !validateEmail }" required />
        </div>
        <hr />
        <div class="flex justify-between w-full">
          <nuxt-link to="/auth/login" class="text-sm text-[#FF4B26] font-medium">Back to login</nuxt-link>
        </div>
        <div class="flex justify-center items-center w-full">
          <button class="text-[16px] font-bold text-white bg-[#FF4401] rounded-[25px] py-[8px] px-[40px]" type="button"
            @click.prevent="SendCode">
            Send code
          </button>
        </div>
      </form>
    </div>
    <img src="~/assets/img/todo_list.png" alt="" class="w-[442px] h-[228px]">
    <!-- <div class="w-full h-full bg-white flex justify-center items-center">
    </div> -->
    <modal-alert v-if="alert.isShowModal" :width="480" v-bind="alert" @close="onCloseModal" />
  </div>
</template>

<script>
import ModalAlert from '~/components/Modal/ModalAlert.vue'
export default {
  components: { ModalAlert },
  layout: 'empty',
  data() {
    return {
      alert: {
        isShowModal: false,
        title: 'Xác nhận',
        type: 'confirm',
        content: 'Cần được xác nhận',
        buttonCancelContent: '',
        buttonOkContent: 'Ok',
        typeSubmit: '',
      },
      isShowPassword: false,
      isShowPasswordConfirm: false,
      email: ''
    }
  },
  computed: {
    validateEmail() {
      const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (this.email) return this.email.toLowerCase().match(regex)
      else return true
    },

  },
  methods: {
    SendCode() {
      if (!this.email || !this.validateEmail) {
        if (!this.email) {
          this.$notify({
            title: 'Lỗi',
            text: 'Vui lòng điền đầy đủ thông tin',
            type: 'error',
            group: 'foo',
          })
        } else {
          this.$notify({
            group: 'foo',
            title: 'Lỗi',
            text: 'Vui lòng điền đúng định dạng email',
            type: 'error',
          })
        }
      } else {
        this.$axios
          .post(`/auth/forgot-password`, {
            email: this.email.toLowerCase().trim(),
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then((res) => {
            this.alert = {
              ...this.alert,
              ...{
                isShowModal: true,
                title: 'Thành công',
                content:
                  `Chúng tôi đã gửi đến email của bạn - ${this.email.toLowerCase()}, vui lòng kiểm tra email và làm theo hướng dẫn`,
                type: 'success',
                buttonOkContent: 'Đến sign in',
                typeSubmit: 'gotologin',
              },
            }
          })
          .catch((res) => {
            this.alert = {
              ...this.alert,
              ...{
                isShowModal: true,
                title: 'Thất bại',
                content: res.response.data.error,
                type: 'failed',
                buttonOkContent: 'Đóng',
              },
            }
          })

      }
    },
    toggleShowPassword() {
      this.isShowPassword = !this.isShowPassword
    },

    async userLogin() {
      if (!this.validateEmail || !this.checkData) {
        if (!this.validateEmail)
          this.$notify({
            group: 'foo',
            title: 'Lỗi',
            text: 'Vui lòng điền email đúng định dạng',
            type: 'error',
          })
        else
          this.$notify({
            group: 'foo',
            title: 'Lỗi',
            text: 'Vui lòng điền đầy đủ thông tin',
            type: 'error',
          })
      } else
        try {
          await this.$axios
            .post('/auth/login', {
              email: this.login.email.toLowerCase().trim(),
              password: this.login.password,
            })
            .then(async (res) => {
              const token = `Bearer ${res.data.token}`
              await this.$axios
                .get('/users/me', {
                  headers: {
                    Authorization: token,
                  },
                })
                .then((res) => {
                  localStorage.setItem('user', JSON.stringify(res.data))
                })
                .catch((err) => {
                  console.log(err)
                })

              localStorage.setItem('accessToken', token)
              this.$router.push('/')
            })
            .catch((err) => {
              this.alert = {
                ...this.alert,
                ...{
                  isShowModal: true,
                  title: 'Lỗi',
                  buttonOkContent: 'Đóng',
                  content: err.response.data.error,
                  type: 'failed',
                },
              }
            })
        } catch (err) {
          console.log('Lỗi nè ông già')
        }
    },
    toSignup() {
      this.$router.push('/auth/signup')
    },
    toFogotPassword() {
      this.$router.push('/auth/forgot-password')
    },
    onCloseModal(typeSubmit) {
      switch (typeSubmit) {
        case '':
          this.resetAlert()
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
@import '~assets/scss/variables.scss';
</style>
