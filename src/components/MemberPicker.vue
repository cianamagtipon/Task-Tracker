<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBoardsStore } from '@/stores/boards'
import { useAuthStore } from '@/stores/auth'

// Element Plus icons
import {
  User,
  ArrowDown,
  Plus,
  UserFilled,
  Close,
} from '@element-plus/icons-vue'

const boards = useBoardsStore()
const auth = useAuthStore()
const selected = ref<string | null>(null)
const isDropdownOpen = ref(false)
const board = computed(() => boards.currentBoard)
const ownerId = computed(() => board.value?.ownerId)

const memberUsers = computed(() =>
  auth.allUsers.filter((u) => board.value?.memberIds.includes(u.id)),
)

const candidates = computed(() =>
  auth.allUsers.filter((u) => !board.value?.memberIds.includes(u.id)),
)

function add() {
  if (!selected.value) return
  boards.addMember(selected.value)
  selected.value = null
  isDropdownOpen.value = false
}

function remove(userId: string) {
  boards.removeMember(userId)
}

function selectCandidate(userId: string) {
  selected.value = userId
  isDropdownOpen.value = false
}
</script>

<template>
  <div class="member-picker">
    <!-- Add Member Section -->
    <div class="add-member-section">
      <div class="custom-select" @click="isDropdownOpen = !isDropdownOpen">
        <div class="select-display">
          <el-icon class="select-icon"><User /></el-icon>
          <span class="select-text">
            {{
              selected
                ? auth.allUsers.find((u) => u.id === selected)?.username
                : 'Add member'
            }}
          </span>
          <el-icon class="chevron" :class="{ 'chevron-open': isDropdownOpen }"
            ><ArrowDown
          /></el-icon>
        </div>

        <!-- Custom Dropdown -->
        <div v-if="isDropdownOpen" class="dropdown-menu">
          <div v-if="candidates.length === 0" class="dropdown-empty">
            No users available to add
          </div>
          <div
            v-for="u in candidates"
            :key="u.id"
            class="dropdown-option"
            @click="selectCandidate(u.id)"
          >
            <div class="option-content">
              <span class="option-name">{{ u.username }}</span>
              <span class="option-email">{{ u.email }}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        class="add-btn"
        @click="add"
        :disabled="!selected"
        :class="{ 'add-btn-disabled': !selected }"
      >
        <el-icon><Plus /></el-icon>
        Add
      </button>
    </div>

    <!-- Members List -->
    <div v-if="memberUsers.length > 0" class="members-section">
      <div class="members-label">
        <el-icon class="members-icon"><UserFilled /></el-icon>
        Members ({{ memberUsers.length }})
      </div>

      <div class="members-list">
        <div
          v-for="u in memberUsers"
          :key="u.id"
          class="member-tag"
          :class="{ 'member-owner': u.id === ownerId }"
        >
          <div class="member-info">
            <el-icon class="member-avatar"><User /></el-icon>
            <span class="member-name">{{ u.username }}</span>
            <span v-if="u.id === ownerId" class="owner-badge">owner</span>
          </div>

          <button
            v-if="u.id !== ownerId"
            class="remove-btn"
            @click="remove(u.id)"
            title="Remove member"
          >
            <el-icon><Close /></el-icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.member-picker {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;
  background: rgba(250, 249, 247, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(196, 164, 132, 0.2);
}

/* Add Member Section */
.add-member-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.custom-select {
  position: relative;
  min-width: 220px;
}

.select-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(244, 241, 235, 0.8);
  border: 1px solid rgba(196, 164, 132, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  color: #5a4a3a;
}

.select-display:hover {
  background: rgba(232, 221, 212, 0.9);
  border-color: rgba(196, 164, 132, 0.5);
}

.select-icon {
  color: #a8998a;
  flex-shrink: 0;
}

.select-text {
  flex: 1;
  color: #6b5b4a;
}

.chevron {
  color: #a8998a;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.chevron-open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #faf9f7;
  border: 1px solid rgba(196, 164, 132, 0.3);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(90, 74, 58, 0.15);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
}

.dropdown-empty {
  padding: 12px;
  color: #a8998a;
  font-style: italic;
  font-size: 0.875rem;
  text-align: center;
}

.dropdown-option {
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(196, 164, 132, 0.1);
}

.dropdown-option:last-child {
  border-bottom: none;
}

.dropdown-option:hover {
  background: rgba(196, 164, 132, 0.1);
}

.option-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.option-name {
  font-weight: 500;
  color: #5a4a3a;
  font-size: 0.875rem;
}

.option-email {
  color: #a8998a;
  font-size: 0.75rem;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #a8c09a 0%, #95b085 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(168, 192, 154, 0.2);
}

.add-btn:hover:not(.add-btn-disabled) {
  background: linear-gradient(135deg, #95b085 0%, #829970 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(168, 192, 154, 0.3);
}

.add-btn-disabled {
  background: rgba(168, 153, 138, 0.3) !important;
  color: rgba(90, 74, 58, 0.5) !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

/* Members Section */
.members-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.members-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #5a4a3a;
}

.members-icon {
  color: #a8998a;
}

.members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.member-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(232, 221, 212, 0.6);
  border: 1px solid rgba(196, 164, 132, 0.2);
  border-radius: 16px;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.member-owner {
  background: rgba(168, 192, 154, 0.2);
  border-color: rgba(168, 192, 154, 0.3);
}

.member-info {
  display: flex;
  align-items: center;
  gap: 6px;
}

.member-avatar {
  color: #a8998a;
  flex-shrink: 0;
}

.member-name {
  color: #5a4a3a;
  font-weight: 500;
}

.owner-badge {
  background: rgba(168, 192, 154, 0.8);
  color: #4a5d3f;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 500;
}

.remove-btn {
  background: none;
  border: none;
  color: #c49999;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: rgba(196, 153, 153, 0.2);
  color: #a67777;
}

/* Responsive Design */
@media (max-width: 768px) {
  .member-picker {
    padding: 8px;
  }

  .add-member-section {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .custom-select {
    min-width: unset;
  }

  .members-list {
    gap: 6px;
  }

  .member-tag {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
}
</style>
