import { useState } from "react";
import { endpoints } from "../../config/api";

export default function useRegister() {
  const [loading, setLoading] = useState(false);

  const register = async (payload) => {
    setLoading(true);

    const res = await fetch(endpoints.register, {
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

  return { register, loading };
}