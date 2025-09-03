<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useBoardsStore } from '@/stores/boards'

// Element Plus icons
import {
  Histogram,
  User,
  Collection,
  SwitchButton,
} from '@element-plus/icons-vue'

const auth = useAuthStore()
const boards = useBoardsStore()

function logout() {
  auth.logout()
}
function goBoard() {
  boards.ensureDefaultBoard()
  window.location.href = '/board'
}
</script>

<template>
  <el-header class="header-bar" height="60px">
    <!-- Left: App title -->
    <RouterLink to="/board" class="header-title">
      <el-icon><Histogram /></el-icon>
      Task Tracker
    </RouterLink>

    <!-- Right: Actions -->
    <div class="nav-actions">
      <!-- Guest view -->
      <template v-if="!auth.isAuthenticated">
        <el-button type="text" @click="$router.push('/login')">Login</el-button>
        <el-button type="primary" @click="$router.push('/signup')"
          >Sign Up</el-button
        >
      </template>

      <!-- Authenticated view -->
      <template v-else>
        <div class="user-greeting">
          <el-icon><User /></el-icon>
          Hi, {{ auth.me?.username }}
        </div>
        <el-button type="success" @click="goBoard" plain>
          <el-icon><Collection /></el-icon>
          My Board
        </el-button>
        <el-button type="danger" @click="logout" plain>
          <el-icon><SwitchButton /></el-icon>
          Logout
        </el-button>
      </template>
    </div>
  </el-header>
</template>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: linear-gradient(90deg, #c4a484 0%, #a8c09a 50%, #9db4a6 100%);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 8px rgba(90, 74, 58, 0.1);
  position: relative;
}

/* .header-bar::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #c4a484 0%, #a8c09a 50%, #9db4a6 100%);
} */

.header-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #5a4a3a;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.header-title:hover {
  color: #5e7c4d;
  transform: translateY(-1px);
}

.nav-actions {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  gap: 12px;
}

.user-greeting {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(232, 221, 212, 0.6);
  color: #6b5b4a;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid rgba(196, 164, 132, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .header-bar {
    padding: 0 12px;
  }

  .header-title {
    font-size: 1.1rem;
  }

  .user-greeting {
    font-size: 0.8rem;
    padding: 4px 8px;
  }
}
</style>
