<template>
  <div class="top-bar">
    <div class="logo">
      <router-link to="/home">
        <img src="@/assets/logo.svg" alt="Logo" />
      </router-link>
    </div>
    <div class="profile">
      <router-link to="/profile">
        <img src="@/assets/profile.svg" alt="Profile Icon" />
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

.logo img {
  height: 40px;
}

.profile img {
  height: 40px;
  border-radius: 50%;
}
</style>
