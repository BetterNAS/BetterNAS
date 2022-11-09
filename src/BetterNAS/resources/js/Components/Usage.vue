<script>
export default {
    name: "usage",
    props: {
        usage: {
            memory: { type: String},
            usedmemInGB: {type: String},
            totalram: { type: String },
            cpuload: { type: String}
        }
    }
}
</script>

<template>
    <div class="col-sm-6 col-md-3">
        <h2 class="no-margin text-semibold">Current RAM Usage</h2>
        <div class="progress progress-micro mb-10">
            <div class="progress-bar bg-indigo-400" :style="{width: usage.memory}">
                <span class="sr-only">{{usage.memory}}</span>
            </div>
        </div>
        <span class="pull-right">{{usage.usedmemInGB}} / {{usage.totalram}} ({{usage.memory}})</span>

    </div>

    <div class="col-sm-6 col-md-3">
        <h2 class="no-margin text-semibold">Current CPU Usage</h2>
        <div class="progress progress-micro mb-10">
            <div class="progress-bar bg-indigo-400" :style="{width: usage.cpuload + '%'}">
                <span class="sr-only">{{usage.cpuload}}% / 100%</span>
            </div>
        </div>
        <span class="pull-right">{{usage.cpuload}}% / 100%</span>
    </div>
</template>

<style scoped>

.progress {
    background-color: #2ca02c;
    height: 20px;
}

.progress-bar {
    background-color: red;
    height: 20px;
}

</style>
