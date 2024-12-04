<template>
  <nav class="navbar">
    <ul class="navbar-list">
      <li class="navbar-item">
        <router-link to="/home-athlete" class="nav-link" active-class="active">
          <img src="@/assets/home.svg" alt="Home" />
        </router-link>
      </li>
      <li class="navbar-item">
        <router-link to="/progress" class="nav-link" active-class="active">
          <img src="@/assets/progress.svg" alt="Progress" />
        </router-link>
      </li>
      <li class="navbar-item">
        <router-link to="/programmes" class="nav-link" active-class="active">
          <img src="@/assets/programmes.svg" alt="Programmes" />
        </router-link>
      </li>
      <li class="navbar-item">
        <router-link to="/calendar" class="nav-link" active-class="active">
          <img src="@/assets/calendar-menu.svg" alt="Calendar" />
        </router-link>
      </li>
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
  display: flex;
  justify-content: center;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.navbar-list {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 600px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.navbar-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.nav-link {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 10px;
  transition: transform 0.3s ease;
}

.nav-link.active::after {
  content: "";
  position: absolute;
  width: 3em;
  height: 3em;
  background-color: rgba(255, 255, 255, 0.158);
  border-radius: 50%;
  z-index: -1;
}

.nav-link:hover {
  transform: scale(1.1);
}
</style>
