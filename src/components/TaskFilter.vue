<script setup lang="ts">
import { useVModel } from '@vueuse/core' // optional; if not using, use plain emit/update:modelValue
const props = defineProps<{ modelValue: 'all' | 'active' | 'completed' }>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: 'all' | 'active' | 'completed'): void
}>()
const model = useVModel(props, 'modelValue', emit)
</script>

<template>
  <div class="flex items-center gap-2">
    <el-radio-group v-model="model" size="small">
      <el-radio-button label="all">All</el-radio-button>
      <el-radio-button label="active">Active</el-radio-button>
      <el-radio-button label="completed">Completed</el-radio-button>
    </el-radio-group>
  </div>
</template>
