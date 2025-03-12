import { createSlice, configureStore } from '@reduxjs/toolkit';

// Slice для хранения поискового запроса вакансий
const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searchTerm: '',
    filters: {}, // Добавим фильтры для вакансий
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
});

// Slice для отслеживания откликов на вакансии
const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    appliedJobs: [],
  },
  reducers: {
    addApplication: (state, action) => {
      state.appliedJobs.push(action.payload);
    },
    removeApplication: (state, action) => {
      state.appliedJobs = state.appliedJobs.filter(job => job.id !== action.payload.id);
    },
  },
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    usernameError: '',
    emailError: '',
    passwordError: '',
    isLoggedIn: false,
  },
  reducers: {
    setUsernameError: (state, action) => {
      state.usernameError = action.payload;
    },
    setEmailError: (state, action) => {
      state.emailError = action.payload;
    },
    setPasswordError: (state, action) => {
      state.passwordError = action.payload;
    },
    clearErrors: (state) => {
      state.usernameError = '';
      state.emailError = '';
      state.passwordError = '';
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const {
  setUsernameError,
  setEmailError,
  setPasswordError,
  clearErrors,
  setLoggedIn,
} = authSlice.actions;

export const { setSearchTerm, setFilters } = searchSlice.actions;
export const { addApplication, removeApplication } = applicationsSlice.actions;

// Конфигурируем store
const store = configureStore({
  reducer: {
    search: searchSlice.reducer,
    applications: applicationsSlice.reducer,
    auth: authSlice.reducer,
  },
});

export default store;

// Теперь store готов для поиска вакансий, фильтрации и отслеживания откликов! 🚀
