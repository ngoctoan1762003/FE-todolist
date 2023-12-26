<template>
    <div class=" relative bg-white p-10 rounded-md shadow-md flex flex-col gap-10 min-w-[400px]">
        <div class="text-lg text-gray-600 font-semibold">Thêm không gian làm việc</div>
        <div class="w-full flex flex-col gap-2">
            <label for="" class="text-sm text-[#485367] font-medium">Tiêu đề</label>
            <input 
                v-model="title" 
                type="text"
                class="focus:outline-0 text-[#485367] h-[50px] w-full rounded-md pl-5 bg-white border-[1px]"
                placeholder="Tiêu đề" required />
        </div>
        <button class="absolute right-4 top-4" @click="cancel">
            <img src="~/assets/icon/close-gray.svg" alt="" class="w-[30px] h-[30px] hover:bg-gray-300 rounded-full p-1" />
        </button>
        <div class="flex justify-center items-center w-full">
            <button 
                type="button" 
                class="text-[16px] font-bold text-white bg-[#FF4401] rounded-[25px] py-[8px] px-[40px]"
                @click="submit">
                Thêm không gian
            </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            title: '',
        }
    },
    methods: {
        cancel(){
            this.$emit('cancel')
        },
        submit() {
            const authorization = localStorage.getItem('accessToken')

            axios({
                method: 'post',
                url: `https://noneedtoaskthereasonswhy.onrender.com/api/v1/workspaces`,
                headers: {
                    Authorization: authorization,
                    'Content-Type': 'application/json'
                },
                data: {
                    title: this.title
                },
            })
                .then((res) => {
                    console.log(res)
                    this.$notify({
                        title: 'Thành công',
                        text: 'Tạo thành công',
                        type: 'success',
                        group: 'foo',
                    })
                    window.location.assign(`/workspace/${res.data.workspace._id}`);

                })
                .catch((error) => {
                    console.log(error)
                    this.$notify({
                        title: 'Thất bại',
                        text: 'Không thể tạo bài post',
                        type: 'error',
                        group: 'foo',
                    })
                })
            this.$emit('save')
        }
    }
}
</script>