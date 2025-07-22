const login = async (username, password) => {
  const response = await axios.post('/auth/login', { username, password });
  const { token, role } = response.data;

  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  setAuthState({ token, role });
};
