<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useBoardsStore } from '@/stores/boards'
import { useAuthStore } from '@/stores/auth'
import TaskInput from '@/components/TaskInput.vue'
import TaskItem from '@/components/TaskItem.vue'
import MemberPicker from '@/components/MemberPicker.vue'
import draggable from 'vuedraggable'
import type { Task, TaskStatus } from '@/types'

const tasks = useTasksStore()
const boards = useBoardsStore()
const auth = useAuthStore()

watchEffect(() => {
  boards.ensureDefaultBoard()
})

const board = computed(() => boards.currentBoard)
const ownerName = computed(() => {
  const owner = auth.allUsers.find((u) => u.id === board.value?.ownerId)
  return owner?.username || '—'
})

const columns = computed(
  (): { id: TaskStatus; title: string; tasks: Task[]; color: string }[] => [
    {
      id: 'todo',
      title: 'To Do',
      tasks: tasks.filtered.filter((t) => t.status === 'todo'),
      color: '#c4a484', // warm beige/tan
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: tasks.filtered.filter((t) => t.status === 'in-progress'),
      color: '#a8c09a', // sage green
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: tasks.filtered.filter((t) => t.status === 'completed'),
      color: '#9db4a6', // soft eucalyptus
    },
  ],
)

function onMoveTask(e: any, newStatus: TaskStatus) {
  if (e.added) {
    const task: Task = e.added.element
    tasks.updateStatus(task.id, newStatus)
  }
}
</script>

<template>
  <div class="board-page">
    <!-- Board Header -->
    <div class="board-header">
      <div class="board-info">
        <h1 class="board-title">{{ board?.name || 'Board' }}</h1>
        <div class="board-meta">
          <span class="board-owner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
            {{ ownerName }}
          </span>
          <span class="task-count">{{ tasks.filtered.length }} tasks</span>
        </div>
      </div>
      <div class="board-actions">
        <MemberPicker />
        <button class="board-menu-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Board Columns -->
    <div class="board-columns">
      <div
        v-for="col in columns"
        :key="col.id"
        class="board-column"
        :style="{ '--column-color': col.color }"
      >
        <div class="column-header">
          <h2 class="column-title">
            {{ col.title }}
            <span class="task-counter">{{ col.tasks.length }}</span>
          </h2>
          <button class="column-menu">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
              />
            </svg>
          </button>
        </div>

        <!-- Task Input only for To Do column -->
        <TaskInput v-if="col.id === 'todo'" class="column-task-input" />

        <!-- Task List -->
        <draggable
          v-model="col.tasks"
          group="tasks"
          item-key="id"
          class="task-list"
          :class="{ 'task-list-empty': col.tasks.length === 0 }"
          ghost-class="task-ghost"
          chosen-class="task-chosen"
          drag-class="task-drag"
          @change="(e: any) => onMoveTask(e, col.id)"
        >
          <template #item="{ element }">
            <div :data-id="element.id" class="task-wrapper">
              <TaskItem :task="element" />
            </div>
          </template>
        </draggable>

        <!-- Add Card Button -->
        <button v-if="col.id !== 'todo'" class="add-card-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Add a card
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* background: linear-gradient(135deg, #f4f1eb 0%, #e8ddd4 100%); */
  overflow: hidden;
}

/* Board Header */
.board-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(244, 241, 235, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(200, 180, 160, 0.3);
}

.board-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.board-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #5a4a3a;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.board-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.85rem;
  color: #8b7355;
}

.board-owner {
  display: flex;
  align-items: center;
  gap: 6px;
}

.task-count {
  opacity: 0.8;
}

.board-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.board-menu-btn {
  background: rgba(196, 164, 132, 0.3);
  border: none;
  border-radius: 6px;
  padding: 8px;
  color: #5a4a3a;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.board-menu-btn:hover {
  background: rgba(196, 164, 132, 0.5);
}

/* Board Columns */
.board-columns {
  flex: 1;
  display: flex;
  gap: 12px;
  padding: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: flex-start;
}

.board-column {
  flex: 0 0 300px;
  background: #faf9f7;
  border-radius: 12px;
  padding: 0;
  display: flex;
  flex-direction: column;
  max-height: calc(75vh - 120px);
  box-shadow: 0 2px 12px rgba(90, 74, 58, 0.15);
  position: relative;
  border: 1px solid rgba(196, 164, 132, 0.2);
}

.board-column::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  margin-left: 0.3rem;
  margin-right: 0.3rem;
  background: var(--column-color);
  border-radius: 12px 12px 0 0;
}

/* Column Header */
.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(196, 164, 132, 0.15);
  background: #faf9f7;
  border-radius: 12px 12px 0 0;
  margin-top: 3px;
}

.column-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #5a4a3a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-counter {
  background: #e8ddd4;
  color: #6b5b4a;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}

.column-menu {
  background: none;
  border: none;
  color: #a8998a;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.column-menu:hover {
  background: #f0ebe5;
  color: #5a4a3a;
}

/* Task Input */
.column-task-input {
  margin: 0 12px 8px;
}

/* Task List */
.task-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 12px;
  overflow-y: auto;
  min-height: 8px;
}

.task-list-empty {
  min-height: 100px;
  /* background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(196, 164, 132, 0.05) 10px,
    rgba(196, 164, 132, 0.05) 20px
  ); */
  border-radius: 8px;
  margin: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a8998a;
  font-style: italic;
}

.task-list-empty::after {
  content: 'Drop tasks here';
  opacity: 0;
  transition: opacity 0.3s ease;
}

.task-list-empty.sortable-ghost::after {
  opacity: 1;
}

.task-wrapper {
  transition: transform 0.2s ease;
}

.task-wrapper:hover {
  transform: translateY(-2px);
}

/* Drag and Drop States */
.task-ghost {
  opacity: 0.5;
  background: var(--column-color) !important;
  border: 2px dashed rgba(250, 249, 247, 0.9) !important;
  transform: rotate(5deg);
}

.task-chosen {
  transform: scale(1.05);
  z-index: 1000;
  box-shadow: 0 8px 25px rgba(90, 74, 58, 0.25);
}

.task-drag {
  transform: rotate(-5deg);
  opacity: 0.9;
}

/* Add Card Button */
.add-card-btn {
  background: none;
  border: none;
  color: #a8998a;
  padding: 12px 16px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  border-radius: 0 0 12px 12px;
  transition: all 0.2s ease;
  margin-top: auto;
}

.add-card-btn:hover {
  background: #f0ebe5;
  color: #5a4a3a;
}

/* Responsive Design */
@media (max-width: 768px) {
  .board-header {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }

  .board-columns {
    padding: 12px 8px;
    gap: 8px;
  }

  .board-column {
    flex: 0 0 280px;
  }
}
</style>
