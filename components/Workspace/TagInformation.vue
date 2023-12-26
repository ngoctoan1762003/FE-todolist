<template>
    <div class=" relative bg-white p-10 rounded-md shadow-md flex flex-col gap-3 min-w-[400px]">
        <div class="text-lg text-gray-600 font-semibold">Thẻ làm việc</div>
        <div class="relative flex">
            <div class="w-full flex flex-col gap-2 min-w-[300px]">
                <label for="" class="text-sm text-[#485367] font-medium">Tiêu đề</label>
                <p>{{ tag.title }}</p>
                <label for="" class="text-sm text-[#485367] font-medium">Nội dung</label>
                <p>{{ tag.body }}</p>
                <label for="" class="text-sm text-[#485367] font-medium mt-2">Trạng thái</label>
                <p>{{ tag.status }}</p>
                <label for="" class="text-sm text-[#485367] font-medium mt-2">Danh mục</label>
                <p>{{ tag.category }}</p>
                <!-- <div class="flex space-between gap-5">
                    <div>
                    </div>
                    <div>
                    </div>
                </div> -->
                <label for="" class="text-sm text-[#485367] font-medium mt-2">Deadline</label>
                <p>{{ date }}</p>
                
            </div>
            <div class="flex flex-col gap-5 items-center w-full">
                <button type="button" class="hover:bg-green-500 hover:text-white w-[100px] text-sm font-semibold text-gray-500 bg-gray-200 rounded-md py-[8px] px-[10px]"
                    @click="edit">
                    Chỉnh sửa
                </button>
                <button type="button" class="hover:bg-red-500 hover:text-white w-[100px] text-sm font-semibold text-gray-500 bg-gray-200 rounded-md py-[8px] px-[20px]"
                    @click="deleteTag">
                    Xóa
                </button>
            </div>
        </div>
        <button class="absolute right-4 top-4" @click="cancel">
            <img src="~/assets/icon/close-gray.svg" alt="" class="w-[30px] h-[30px] hover:bg-gray-300 rounded-full p-1" />
        </button>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    props: {
        tagId: {
            type: String,
            default: () => {}
        }
    },
    computed: {
        date(){
            return this.tag.deadline?this.tag.deadline.split('T')[0]:""
        }
    },
    data() {
        return {
            tag: {}
        }
    },
    created(){
        this.getInformationOfTag(this.tagId)
    },
    methods: {
        cancel() {
            this.$emit('cancel')
        },
        getInformationOfTag(tagId){
            const authorization = localStorage.getItem('accessToken')
            axios({
                method: 'get',
                url: `https://noneedtoaskthereasonswhy.onrender.com/api/v1/tags/${tagId}`,
                headers: {
                    Authorization: authorization,
                    'Content-Type': 'application/json'
                },
            })
                .then((res) => {
                    console.log(res)
                    this.tag = res.data.tag
                })
                .catch((error) => {
                    console.log(error)
                    this.$notify({
                        title: 'Thất bại',
                        text: 'Xảy ra lỗi ' + error.response.data.message,
                        type: 'error',
                        group: 'foo',
                    })
                })
            this.$emit('save')
        },
        submit() {
            const formattedDateTime = new Date(this.dateTime).toLocaleDateString('en-CA'); // 'en-CA' represents the format 'year/month/day'
            console.log(formattedDateTime)
            const authorization = localStorage.getItem('accessToken')
            axios({
                method: 'post',
                url: `https://noneedtoaskthereasonswhy.onrender.com/api/v1/tags`,
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
                        text: 'Tạo thành công',
                        type: 'success',
                        group: 'foo',
                    })
                    window.location.reload();
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
        },
        edit(){
            this.$emit('edit', this.tag)
        },
        deleteTag(){
            this.$emit('delete', this.tag._id)
        }
    }
}
</script>