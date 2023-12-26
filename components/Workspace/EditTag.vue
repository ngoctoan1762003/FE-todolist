<template>
    <div class=" relative bg-white p-10 rounded-md shadow-md flex flex-col gap-3 min-w-[400px]">
        <div class="text-lg text-gray-600 font-semibold">Chỉnh sửa thẻ làm việc</div>
        <div class="w-full flex flex-col gap-2">
            <label for="" class="text-sm text-[#485367] font-medium">Tiêu đề</label>
            <input v-model="title" type="text"
                class="focus:outline-0 text-[#485367] h-[50px] w-full rounded-md pl-5 bg-white border-[1px]"
                placeholder="Tiêu đề" required />
            <label for="" class="text-sm text-[#485367] font-medium">Nội dung</label>
            <input v-model="body" type="text"
                class="focus:outline-0 text-[#485367] h-[50px] w-full rounded-md pl-5 bg-white border-[1px]"
                placeholder="Nội dung" required />
            <div class="flex space-between gap-5">
                <div>
                    <label for="" class="text-sm text-[#485367] font-medium mt-2">Trạng thái</label>
                    <select v-model="status" class="text-[#485367] h-[50px] w-full rounded-md pl-5 bg-white border-[1px]">
                        <option value="on the way">On the Way</option>
                        <option value="completed">Completed</option>
                        <option value="is over">Is over</option>
                    </select>
                </div>
                <div>
                    <label for="" class="text-sm text-[#485367] font-medium mt-2">Danh mục</label>
                    <select v-model="category" class="text-[#485367] h-[50px] w-full rounded-md pl-5 bg-white border-[1px]">
                        <option value="development">Development</option>
                        <option value="design">Design</option>
                        <option value="marketing">Marketing</option>
                        <option value="finance">Finance</option>
                        <option value="health">Health</option>
                        <option value="education">Education</option>
                        <!-- Add more categories as needed -->
                    </select>
                </div>
            </div>
            <label for="" class="text-sm text-[#485367] font-medium mt-2">Deadline</label>
            <input v-model="dateTime" type="date"
                class="text-[#485367] h-[50px] w-full rounded-md pl-5 bg-white border-[1px]" required />
        </div>
        <button class="absolute right-4 top-4" @click="cancel">
            <img src="~/assets/icon/close-gray.svg" alt="" class="w-[30px] h-[30px] hover:bg-gray-300 rounded-full p-1" />
        </button>
        <div class="flex justify-center items-center w-full">
            <button type="button" class="text-[16px] font-bold text-white bg-[#FF4401] rounded-[25px] py-[8px] px-[40px]"
                @click="submit">
                Chỉnh sửa
            </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex';

export default {
    props: {
        tag: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            title: this.tag.title,
            status: this.tag.status,
            category: this.tag.category,
            dateTime: this.formatDateForInput(this.tag.deadline),
            body: this.tag.body,
        }
    },
    computed: {
        ...mapGetters(['getPostIdAction']),

    },
    methods: {
        formatDateForInput(dateTime) {
            const date = new Date(dateTime);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        cancel() {
            this.$emit('cancel')
        },
        submit() {
            const formattedDateTime = new Date(this.dateTime).toLocaleDateString('en-CA'); // 'en-CA' represents the format 'year/month/day'
            console.log(formattedDateTime)
            const authorization = localStorage.getItem('accessToken')
            axios({
                method: 'patch',
                url: `https://noneedtoaskthereasonswhy.onrender.com/api/v1/tags/${this.tag._id}`,
                headers: {
                    Authorization: authorization,
                    'Content-Type': 'application/json'
                },
                data: {
                    "post_id": this.$store.getters.getPostId,
                    "title": this.title,
                    "category": this.category.toString(),
                    "status": this.status.toString(),
                    "deadline": formattedDateTime.split('-').join('/'),
                    "pos": 10.1,
                    "body": this.body
                },
            })
                .then((res) => {
                    console.log(res)
                    this.$notify({
                        title: 'Thành công',
                        text: 'Chỉnh sửa thành công',
                        type: 'success',
                        group: 'foo',
                    })
                })
                .catch((error) => {
                    console.log(error)
                    this.$notify({
                        title: 'Thất bại',
                        text: 'Không thể chỉnh sửa',
                        type: 'error',
                        group: 'foo',
                    })
                })
                .finally(() => {
                    this.$emit('save')
                })
        }
    }
}
</script>