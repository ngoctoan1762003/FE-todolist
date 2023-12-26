<template>
    <div>
        <div class="relative cursor-pointer w-[200px] h-[120px]" @click="ToWorkSpace()">
            <img src="~/assets/img/background-for-workspace.jpg" alt="" class="w-[200px] h-[100px] rounded-md">
            <div class="absolute top-0 bg-black opacity-40 w-[200px] h-[100px] rounded-md"></div>
            <div class="absolute top-3 left-3 text-white font-semibold">{{ title }}</div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        id: {
                type: String,
                default: () => {}
            },
        title: {
                type: String,
                default: () => {}
            },
    },
    methods: {
        ToWorkSpace() {
            console.log("hear")
            this.$router.push(`/workspace/${this.id}`);
        }
    }
}
</script>
<style scoped></style>