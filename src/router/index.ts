import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Profile from "../views/ProfileView.vue";
import Calendar from "../views/CalendarView.vue";
import Progress from "../views/ProgressView.vue";
import Programmes from "../views/ProgrammesView.vue";
import SignUpPage from "@/components/auth/SignUp.vue";
import SignInPage from "@/components/auth/SignIn.vue";
import Landing from "@/components/auth/LandingPage.vue";
import ProgrammeDetail from "@/components/programmes/ProgrammeDetail.vue";
import NewProgramme from "@/components/programmes/NewProgramme.vue";
import { supabase } from "@/supabase/supabase";

const routes = [
  {
    path: "/",
    name: "landing",
    component: Landing,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpPage,
  },
  {
    path: "/signin",
    name: "signin",
    component: SignInPage,
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: "/calendar",
    name: "calendar",
    component: Calendar,
    meta: { requiresAuth: true },
  },
  {
    path: "/programmes",
    name: "programmes",
    component: Programmes,
    meta: { requiresAuth: true },
  },
  {
    path: "/programmes/:id:title",
    name: "programme",
    component: ProgrammeDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/new-programme",
    name: "new-programme",
    component: NewProgramme,
    meta: { requiresAuth: true },
  },
  {
    path: "/progress",
    name: "progress",
    component: Progress,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

let isValidatingSession = false;
router.beforeEach(async (to, from, next) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isValidatingSession) return next();
  isValidatingSession = true;

  if (to.meta.requiresAuth && !user) {
    isValidatingSession = false;
    return next({ name: "signin" });
  }

  next();
  isValidatingSession = false;
});

export default router;
