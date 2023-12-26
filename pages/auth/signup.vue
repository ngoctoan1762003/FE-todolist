<template>
  <div class="relative flex justify-center items-center h-[100vh] bg-white gap-10">
    <div class="z-10 w-[500px]">
      <form action="" class="flex flex-col form gap-7 py-[60px] justify-center items-center w-[400px] rounded-md px-10"
        @keydown.enter="userLogin">
        <div class="text-3xl font-bold text-[#485367]">Create new account</div>
        <div class="w-full flex flex-col gap-2">
          <label for="" class="text-sm text-[#485367] font-medium">Username</label>
          <input v-model="login.username" type="text"
            class="focus:outline-0 text-[#485367] h-[50px] w-full rounded-md pl-5 bg-white border-[1px]"
            placeholder="Username" required />
        </div>
        <div class="w-full flex flex-col gap-2">
          <label for="" class="text-sm text-[#485367] font-medium">Email</label>
          <input v-model="login.email" type="text"
            class="focus:outline-0 text-[#485367] h-[50px] w-full rounded-md pl-5 bg-white border-[1px]"
            placeholder="Email" :class="{ invalid: !validateEmail }" required />
        </div>
        <div class="w-full relative flex flex-col gap-2">
          <label for="" class="text-sm text-[#485367] font-medium">Password</label>
          <input v-model="login.password" :type="isShowPassword ? 'text' : 'password'"
            class="focus:outline-0 text-[#485367] h-[50px] w-full rounded-md pl-5 pr-8 bg-white border-[1px]"
            placeholder="Password" required />
          <img v-if="isShowPassword" src="~assets/icon/eye.svg"
            class="absolute w-[20px] h-[16px] right-[10px] bottom-[17px] cursor-pointer" alt=""
            @click="toggleShowPassword()" />
          <img v-else src="~assets/icon/eye-slash.svg"
            class="absolute w-[20px] h-[16px] right-[10px] bottom-[17px] cursor-pointer" alt=""
            @click="toggleShowPassword()" />
        </div>
        <hr />
        <div class="flex justify-between w-full">
          <button class="text-sm text-[#FF4B26] font-medium" @click.prevent="toSignin">
            Go to sign in
          </button>
        </div>
        <div class="flex justify-center items-center w-full">
          <button type="button" @click="submit"
            class="text-[16px] font-bold text-white bg-[#FF4401] rounded-[25px] py-[8px] px-[40px]">
            Sign up
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
      login: {
        email: '',
        password: '',
        username: '',
      },
      isShowPassword: false,
    }
  },
  computed: {
    validateEmail() {
      const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (this.login.email) return this.login.email.toLowerCase().match(regex)
      else return true
    },
    checkData() {
      return this.login.email && this.login.password
    },
  },
  methods: {
    toggleShowPassword() {
      this.isShowPassword = !this.isShowPassword
    },

    submit() {
      if (
        !this.checkData ||
        !this.validateEmail
      ) {
        if (!this.checkData) {
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
            text: 'Vui lòng điền email đúng định dạng',
            type: 'error',
          })
        }
      } else {
        this.$axios.post('/auth/register', {
          email: this.login.email.toLowerCase().trim(),
          password: this.login.password,
          username: this.login.username
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          this.alert = {
            ... this.alert,
            ...{
              isShowModal: true,
              title: 'Thành công',
              content: 'Bạn đã đăng kí thành công, hãy đăng nhập để sử dụng trang web',
              type: 'success',
              buttonOkContent: 'Đến sign in',
              typeSubmit: 'gotologin'
            }
          }
        }).catch((res) => {
          this.alert = {
            ... this.alert,
            ...{
              isShowModal: true,
              title: 'Thất bại',
              content: res.response.data.message[0].message,
              type: 'failed',
              buttonOkContent: 'Đóng'
            }
          }
        })
      }
    },
    toSignin() {
      this.$router.push('/auth/login')
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
