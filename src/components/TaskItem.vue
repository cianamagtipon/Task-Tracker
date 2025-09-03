<script setup lang="ts">
import type { Task } from '@/types'
import { computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{ task: Task }>()
const tasks = useTasksStore()
const auth = useAuthStore()

const assigneeName = computed(() => {
  const a = auth.allUsers.find((u) => u.id === props.task.assigneeId)
  return a?.username ?? ''
})
</script>

<template>
  <el-card class="mb-2">
    <div class="flex items-center gap-3">
      <el-checkbox
        :model-value="task.completed"
        @change="tasks.toggle(task.id)"
      />
      <div class="flex-1">
        <div :class="task.completed ? 'line-through opacity-60' : ''">
          {{ task.title }}
        </div>
        <div v-if="assigneeName" class="text-xs opacity-70">
          Assignee: {{ assigneeName }}
        </div>
      </div>
      <el-button size="small" type="danger" text @click="tasks.remove(task.id)"
        >Delete</el-button
      >
    </div>
  </el-card>
</template>
