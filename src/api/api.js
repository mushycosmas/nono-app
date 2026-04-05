const BASE_URL = "https://nono.co.tz";

// ------------------ GENERIC REQUEST ------------------
const request = async (url, options = {}) => {
  try {
    const method = options.method || "GET";

    console.log("API CALL:", method, `${BASE_URL}${url}`);

    const res = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(options.body instanceof FormData
          ? {} // ⚠️ DO NOT set Content-Type for FormData
          : { "Content-Type": "application/json" }),
        ...options.headers,
      },
      body: options.body || null,
    });

    // Handle empty response safely
    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      console.log("API ERROR RESPONSE:", data);
      throw new Error(data?.message || `HTTP ${res.status}`);
    }

    return data;
  } catch (error) {
    console.log("API ERROR:", error.message);
    return null; // prevent app crash
  }
};


// ------------------ CATEGORIES ------------------
export const fetchCategories = async () => {
  return await request("/api/categories", {
    method: "GET",
  });
};


// ------------------ SUBCATEGORIES ------------------
export const fetchSubCategories = async () => {
  return await request("/api/categories_sub", {
    method: "GET",
  });
};


// ------------------ LOCATIONS (STATIC) ------------------
export const fetchLocations = async () => {
  return [
    { id: 1, name: "Dar es Salaam" },
    { id: 2, name: "Dodoma" },
    { id: 3, name: "Arusha" },
  ];
};


// ------------------ PRODUCTS ------------------
export const fetchProducts = async (page = 1, pageSize = 12, search = "", subcategoryId = "") => {
  const query = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    search,
    subcategory_id: subcategoryId,
  });

  const res = await request(`/api/ads/all?${query.toString()}`); // Use same request function
  return {
    products: res?.products || [],
    total: res?.total || 0,
  };
};



// ------------------ CREATE PRODUCT ------------------
export const createProduct = async (formData) => {
  return await request("/api/ads", {
    method: "POST",
    body: formData,
  });
};


// ------------------ UPDATE PRODUCT ------------------
export const updateProduct = async (id, formData) => {
  return await request(`/api/seller/products/${id}`, {
    method: "PUT",
    body: formData,
  });
};


// ------------------ DELETE PRODUCT ------------------
export const deleteProduct = async (id) => {
  return await request(`/api/seller/products/${id}`, {
    method: "DELETE",
  });
};