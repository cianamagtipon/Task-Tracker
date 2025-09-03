<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useBoardsStore } from '@/stores/boards'
import { useAuthStore } from '@/stores/auth'

const tasks = useTasksStore()
const boards = useBoardsStore()
const auth = useAuthStore()

const title = ref('')
const assignee = ref<string | null>(null)

const memberUsers = computed(() =>
  auth.allUsers.filter((u) => boards.currentBoard?.memberIds.includes(u.id)),
)

function submit() {
  if (!title.value.trim()) return
  tasks.addTask(title.value, assignee.value || null)
  title.value = ''
  assignee.value = null
}
</script>

<template>
  <div class="task-input">
    <el-input
      v-model="title"
      placeholder="Add a task…"
      @keyup.enter="submit"
      clearable
      class="task-input-field"
    />
    <el-select
      v-model="assignee"
      placeholder="Assign"
      clearable
      class="task-input-select"
    >
      <el-option
        v-for="u in memberUsers"
        :key="u.id"
        :label="u.username"
        :value="u.id"
      />
    </el-select>
    <el-button class="task-input-btn" @click="submit">Add</el-button>
  </div>
</template>

<style scoped>
.task-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
}

/* Input field */
.task-input-field :deep(.el-input__wrapper) {
  border-radius: 8px;
  background: #fffdfb;
  border: 1px solid rgba(196, 164, 132, 0.2);
  box-shadow: none;
  transition: border-color 0.2s ease;
}
.task-input-field :deep(.el-input__wrapper:hover),
.task-input-field :deep(.el-input__wrapper.is-focus) {
  border-color: #c4a484;
}

/* Select dropdown */
.task-input-select :deep(.el-select__wrapper) {
  border-radius: 8px;
  background: #fffdfb;
  border: 1px solid rgba(196, 164, 132, 0.2);
  transition: border-color 0.2s ease;
}
.task-input-select :deep(.el-select__wrapper:hover),
.task-input-select :deep(.el-select__wrapper.is-focus) {
  border-color: #a8c09a; /* soft sage when active */
}

/* Add button */
.task-input-btn {
  background: #c4a484;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  color: #fff;
  transition: background-color 0.2s ease;
}
.task-input-btn:hover {
  background: #b29170;
}
</style>
