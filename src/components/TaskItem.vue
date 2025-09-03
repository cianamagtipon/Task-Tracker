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
  <el-card class="task-card">
    <div class="task-content">
      <!-- Checkbox -->
      <el-checkbox
        :model-value="task.completed"
        @change="tasks.toggle(task.id)"
        class="task-checkbox"
      />

      <!-- Title + Assignee -->
      <div class="task-main">
        <div class="task-title" :class="{ completed: task.completed }">
          {{ task.title }}
        </div>
        <div v-if="assigneeName" class="task-assignee">
          Assignee: {{ assigneeName }}
        </div>
      </div>

      <!-- Delete button -->
      <el-button
        size="small"
        text
        class="task-delete"
        @click="tasks.remove(task.id)"
      >
        ✕
      </el-button>
    </div>
  </el-card>
</template>

<style scoped>
.task-card {
  border: 1px solid rgba(196, 164, 132, 0.25);
  border-radius: 10px;
  background: #fffdfb;
  box-shadow: 0 1px 6px rgba(90, 74, 58, 0.08);
  padding: 8px 12px;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(90, 74, 58, 0.12);
}

/* Layout */
.task-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.task-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 0.45rem;
  gap: 2px;
}

/* Title */
.task-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #5a4a3a;
  transition:
    opacity 0.2s ease,
    text-decoration 0.2s ease;
}
.task-title.completed {
  text-decoration: line-through;
  opacity: 0.6;
}

/* Assignee */
.task-assignee {
  font-size: 0.75rem;
  color: #7b6a58;
  opacity: 0.8;
}

/* Checkbox */
.task-checkbox :deep(.el-checkbox__inner) {
  border-radius: 4px;
  border-color: rgba(196, 164, 132, 0.6);
}
.task-checkbox :deep(.is-checked .el-checkbox__inner) {
  background-color: #a8c09a; /* sage green */
  border-color: #a8c09a;
}

/* Delete button */
.task-delete {
  color: #a8998a;
  font-size: 0.85rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}
.task-delete:hover {
  background: #f3eee8;
  color: #b24a4a; /* muted warm red */
}
</style>
