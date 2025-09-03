<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useBoardsStore } from '@/stores/boards'

const auth = useAuthStore()
const boards = useBoardsStore()

const formRef = ref<FormInstance>()
const form = reactive({
  email: '',
  username: '',
  password: '',
  confirm: '',
})

const rules: FormRules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Invalid email', trigger: 'blur' },
  ],
  username: [
    { required: true, message: 'Username is required', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
  ],
  confirm: [
    { required: true, message: 'Please confirm password', trigger: 'blur' },
    {
      validator: (_r, v, cb) => {
        if (v !== form.password) cb(new Error('Passwords do not match'))
        cb()
      },
      trigger: 'blur',
    },
  ],
}

async function submit() {
  await formRef.value?.validate(async (valid) => {
    if (!valid) return
    try {
      auth.signup(form.email, form.username, form.password)
      boards.ensureDefaultBoard()
      window.location.href = '/board'
    } catch (e: any) {
      ElMessage.error(e.message || 'Sign up failed')
    }
  })
}
</script>

<template>
  <div class="page">
    <div class="card">
      <h1 class="title">Create your account</h1>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="form"
      >
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" clearable />
        </el-form-item>

        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" clearable />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" show-password clearable />
        </el-form-item>

        <el-form-item label="Confirm Password" prop="confirm">
          <el-input v-model="form.confirm" show-password clearable />
        </el-form-item>

        <div class="actions">
          <el-button type="primary" @click="submit">Sign Up</el-button>
        </div>
      </el-form>

      <p class="hint">
        Already have an account?
        <el-link type="primary" @click="$router.push('/login')">Log in</el-link>
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
