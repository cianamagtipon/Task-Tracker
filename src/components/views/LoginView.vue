<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useBoardsStore } from '@/stores/boards'

const auth = useAuthStore()
const boards = useBoardsStore()

const formRef = ref<FormInstance>()
const form = reactive({
  identifier: '',
  password: '',
})

const rules: FormRules = {
  identifier: [
    { required: true, message: 'Enter username or email', trigger: 'blur' },
  ],
  password: [{ required: true, message: 'Enter password', trigger: 'blur' }],
}

async function submit() {
  await formRef.value?.validate((_valid) => {
    try {
      auth.login(form.identifier, form.password)
      boards.ensureDefaultBoard()
      window.location.href = '/board'
    } catch (e: any) {
      ElMessage.error(e.message || 'Login failed')
    }
  })
}
</script>

<template>
  <div class="page">
    <div class="card">
      <h1 class="title">Welcome back</h1>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="form"
      >
        <el-form-item label="Username or Email" prop="identifier">
          <el-input v-model="form.identifier" clearable />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" show-password clearable />
        </el-form-item>

        <div class="actions">
          <el-button type="primary" @click="submit">Log In</el-button>
        </div>
      </el-form>

      <p class="hint">
        Don’t have an account?
        <el-link type="primary" @click="$router.push('/signup')"
          >Sign up</el-link
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f9fafb;
}

.card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form {
  margin-bottom: 16px;
}

.actions {
  display: flex;
  justify-content: center;
}

.hint {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}
</style>
