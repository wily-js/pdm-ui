<template>
    <div style="position: relative">
        <div style="display: flex;flex-direction: row-reverse;">
            <el-button @click="fomatter">格式化</el-button>
        </div>
        <codemirror v-model="script" :style="{ height: initHeight, 'font-size': '14px' }" :autofocus="true"
            :indent-with-tab="true" :tab-size="2" :extensions="extensions" :disabled="readOnly" :lang="lang"
            @blur="updateScript" @keydown.ctrl="save" />
    </div>
</template>
  
<script setup>
import { ref, watch } from "vue";
import { Codemirror } from "vue-codemirror";
import { json } from "@codemirror/lang-json";
const props = defineProps({
    content: {
        type: String,
        default: "",
    },
    lang: {
        type: String,
        default: "json",
    },
    readOnly: {
        type: Boolean,
        default: false,
    },
    initHeight: {
        type: String,
        default: "600px",
    },
});
const extensions = [json()];
let script = ref("");
let step = 0
watch(
    () => props.content,
    () => {
        step += 1
        script.value = props.content;
        if (step >= 2) {
            script.value = JSON.stringify(JSON.parse(script.value), null, "\t");
        }
    },
    { immediate: true } // immediate选项可以开启首次赋值监听
);
const fomatter = () => {
    script.value = JSON.stringify(JSON.parse(script.value), null, "\t");
};
const emit = defineEmits(["updateScript"]);
const updateScript = () => {
    emit("updateScript", script.value);
};
const save = (val) => {
    if (val.key == 's') {
        val.preventDefault()
    }
}
</script>
  
<style scoped></style>