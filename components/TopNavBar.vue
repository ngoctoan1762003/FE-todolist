<template>
  <div class="top-nav">
    <div class="top-nav__logo" @click="$router.push('/')">
      <img src="~assets/img/logosgroup.png" alt="" />
      <div class="name-web">S-Forum</div>
    </div>
    <div class="top-nav__main">
      <div class="top-nav__main__left">
        <div class="top-nav__main__menu">
          <!-- <div class="menu__item" :class="{ isActive: getPath !== 'admin' }" @click="navigation('home')">
            <img src="~/assets/icon/home.svg" alt="" />
          </div> -->
        </div>
      </div>
      <div class="top-nav__main__right">

        <div v-if="user.role === 'admin'" class="menu__item" @click="navigation('admin')">
          <img src="~/assets/icon/manage.svg" alt="" />
        </div>
        <div class="account" @click="toggleDropdown">
          <img :src="user?.profileImage ?? require('~/assets/img/avt.png')" alt=""
            class="rounded-full w-[40px] h-[40px]" />
          <span class="name">{{ user?.firstName ?? '' }} {{ user?.lastName ?? '' }}</span>
          <div class="icon-drop-down">
            <img src="~assets/icon/drop-down-icon.svg" alt="" />
          </div>
          <div v-show="isShowDropDown" class="dropdown-menu">
            <nuxt-link class="item" :to="`/user/${user.id}`">Profile</nuxt-link>
            <p class="item" @click="logout()">Logout</p>
          </div>

        </div>
      </div>
    </div>
    <modal-alert v-if="alert.isShowModal" v-bind="alert" @close="onCloseModal" />
  </div>
</template>
<script>
import ModalAlert from '~/components/Modal/ModalAlert.vue'
export default {
  components: { ModalAlert },
  data() {
    return {
      user: {},
      alert: {
        isShowModal: false,
        title: '',
        type: 'confirm',
        content: '',
        buttonCancelContent: '',
        buttonOkContent: 'Ok',
        typeSubmit: '',
      },
      currentTab: 'home',
      listTab: [
        {
          id: 'home',
          icon: 'home',
        },
        {
          id: 'calendar',
          icon: 'calendar',
        },
      ],
      isShowDropDown: false,
    }
  },
  computed: {
    getPath() {
      return this.$route.name
    }
  },
  created() {
    this.getProfile()
  },
  methods: {
    navigation(item) {
      switch (item) {
        case 'home':
          this.$router.push('/')
          break
        case 'admin':
          this.$router.push('/admin')
          break
      }
    },
    getProfile() {
      this.user = JSON.parse(localStorage.getItem('user'))
      console.log(this.user)
    },
    logout() {
      this.alert = {
        ...this.alert,
        ...{
          isShowModal: true,
          title: 'Xác nhận',
          buttonCancelContent: 'Đóng',
          buttonOkContent: 'Xác nhận',
          content: 'Bạn có muốn đăng xuất?',
          type: 'confirm',
          typeSubmit: 'confirmLogout'
        },
      }
    },
    toggleDropdown() {
      this.isShowDropDown = !this.isShowDropDown
    },
    onCloseModal(typeSubmit) {
      switch (typeSubmit) {
        case 'confirmLogout':
          localStorage.removeItem('accessToken')
          localStorage.removeItem('user')
          this.$router.push('/auth/login')
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

.top-nav {
  display: inline-flex;
  padding: 20px 22px;
  flex-direction: row;
  align-items: start;
  gap: 84px;
  // background: #f1f2f4;
  height: 100%;
  width: 100%;
  border-bottom: 1px solid rgb(183, 183, 183);

  &__logo {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;

    img {
      height: 100%;
      object-fit: contain;
    }

    .name-web {
      color: $orange;
      font-family: 'Montserrat', sans-serif;
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: 38px;
      /* 146.154% */
    }
  }

  &__main {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 50px;
    height: 100%;
    width: 100%;
    flex: 1;

    &__left {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex: 1 0 0;
      gap: 17px;
    }

    &__menu {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      cursor: pointer;

      .menu__item {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        border-radius: 8px;

        &.isActive {
          background: $orange;
        }

        img {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
      }
    }

    &__right {
      height: 100%;
      display: flex;
      align-items: center;

      gap: 25px;

      .notification {
        display: flex;
        width: 20px;
        height: 20px;
        justify-content: center;
        align-items: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          cursor: pointer;
        }
      }

      .account {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        gap: 10px;
        padding-right: 10px;
        position: relative;
        cursor: pointer;
        margin-right: 40px;

        img {
          height: 100%;
          object-fit: contain;
        }

        .name {
          color: #485367;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: 24px;
          /* 150% */
        }

        .icon-drop-down {
          position: absolute;
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
        }

        .dropdown-menu {
          position: absolute;
          display: inline-flex;
          right: -20px;
          top: 40px;
          flex-direction: column;
          background: $gray;
          padding: 6px 12px;
          border-radius: 8px;
          width: 100%;
          min-width: 100px;

          .item {
            display: flex;
            width: 100%;
            padding: 6px 12px;
            color: $orange;
            border-radius: 8px;
            font-weight: 500;
            font-size: 15px;

            &:hover {
              color: $gray;
              background: $orange;
            }
          }
        }
      }
    }
  }
}
</style>
