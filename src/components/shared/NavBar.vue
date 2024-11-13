<template>
  <nav class="navbar">
    <ul class="navbar-list">
      <router-link to="/home">
        <img src="@/assets/home.svg" alt="Logo" />
      </router-link>
      <router-link to="/progress">
        <img src="@/assets/progress.svg" alt="Progress" />
      </router-link>
      <router-link to="/programmes">
        <img src="@/assets/programmes.svg" alt="Programmes" />
      </router-link>
      <router-link to="/calendar">
        <img src="@/assets/calendar-menu.svg" alt="Calendar" />
      </router-link>
    </ul>
  </nav>
</template>
<style scoped>
.navbar {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #0561e2;
  padding: 10px 0;
}

.navbar-list {
  display: flex;
  justify-content: space-around;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar-item a {
  color: white;
}
</style>
