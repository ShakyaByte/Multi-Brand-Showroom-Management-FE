const initialState: any = {
  user: {
    isLoggedIn: false,
    data: null,
    loading: false,
  },
  dashboard: {
    data: null,
    loading: false,
  },
  users: {
    data: [],
    loading: false,
  },
  roles: {
    data: [],
    loading: false,
  },
  bikes: {
    data: [],
    loading: false,
  },
  brands: {
    data: [],
    loading: false,
  },
  showroom: {
    data: [],
    loading: false,
  },
};

export default initialState;
