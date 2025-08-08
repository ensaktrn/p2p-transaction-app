const { registerUser, loginUser, logoutUser } = require('../services/authService');

//User register
const register = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const user = await registerUser({ email, password, name });
    res.status(201).json({
      message: 'User created successfully.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const { token, user } = await loginUser({ email, password });
  
      res.status(200).json({
        message: 'Logged in.',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: error.message });
    }
  };

const logout = async (req, res) => {
  const token = req.token;
  const expiresAt = new Date(req.user.exp * 1000); // exp saniye → ms

  try {
    await logoutUser(token, expiresAt);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
};

module.exports = {
  register,
  login,
  logout,
};
