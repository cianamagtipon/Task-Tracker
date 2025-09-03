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
  <div class="flex gap-2 items-center">
    <el-input
      v-model="title"
      placeholder="Add a task…"
      @keyup.enter="submit"
      clearable
    />
    <el-select
      v-model="assignee"
      placeholder="Assign"
      clearable
      style="width: 160px"
    >
      <el-option
        v-for="u in memberUsers"
        :key="u.id"
        :label="u.username"
        :value="u.id"
      />
    </el-select>
    <el-button type="primary" @click="submit">Add</el-button>
  </div>
</template>
