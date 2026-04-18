import { useState } from "react";
import { endpoints } from "../../config/api";

export default function useLogin() {
  const [loading, setLoading] = useState(false);

  const login = async (payload) => {
    setLoading(true);

    const res = await fetch(endpoints.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      throw new Error(data.message);
    }

    return data;
  };

  return { login, loading };
}