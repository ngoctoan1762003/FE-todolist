<template>
    <div class="flex justify-between cursor-pointer hover:bg-gray-300 p-2 rounded-md" @click="toWorkSpaceId">
        <div class="flex items-center gap-2" >
            <img src="~/assets/img/background-for-workspace.jpg" alt="" class="w-[25px] h-[25px] rounded-md">
            <div class="text-sm text-gray-600 font-semibold hover:text-white">{{ workspace.title }}</div>
        </div>
        <img src="~/assets/icon/drop-down-icon.svg" alt="">
    </div>
</template>
<script>
export default{
    props: {
        workspace: {}
    },
    methods: {
        toWorkSpaceId(){
            this.$router.push(`/workspace/${this.workspace._id}`)
        }
    }
}
</script>