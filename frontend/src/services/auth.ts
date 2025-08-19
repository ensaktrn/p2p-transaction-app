export async function loginUser(data: {
    email: string;
    password: string;    
  })
 {
  console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
  
    return res.json(); // { token, user }
  }  
  
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  return data;
};