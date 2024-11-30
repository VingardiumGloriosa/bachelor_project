export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  roles?: string[];
  team?: Team | null;
}

export interface Team {
  team_id: string;
  name: string;
  coach_id: string | null;
}

export interface Role {
  role_id: string;
  role_name: string;
}
