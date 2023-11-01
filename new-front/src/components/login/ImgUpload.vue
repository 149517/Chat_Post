<template>
  <div class="clearfix">
    <a-upload
        v-model:file-list="fileList"
        list-type="picture-card"
        @preview="handlePreview"
        :before-upload="beforeUpload"
    >
      <div v-if="fileList.length < 8">
        <plus-outlined/>
        <div style="margin-top: 8px">Upload</div>
      </div>
    </a-upload>
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </a-modal>
  </div>
</template>
<script setup>
import {ref, defineProps, computed, watch} from 'vue';

import {PlusOutlined} from "@ant-design/icons-vue";
import api from "../../utils/api.js";
import {useStore} from "vuex";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const beforeUpload = file => {
  fileList.value = [...(fileList.value || []), file];
  return false;
};

const store = useStore()
// 需要通过 click 的变化触发函数，将图片传递到父组件一起发送
const click = computed(()=>store.state.send)

const emit = defineEmits(['sending'])
watch(click,(newValue)=>{
  if(newValue === true) {
    emit('sending',fileList.value)
  }
})


const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const fileList = ref([]);
const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};
const handlePreview = async file => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

</script>
<style scoped>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>