export type GlobalStore = {
  idToken: string;
  accessToken: string;
  profile: Profile;
};

export type Profile = {
  user_id: string;
  email: string;
  realm_access: {
    roles: string[];
  };
};
