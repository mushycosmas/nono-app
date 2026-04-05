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

// ------------------ CACHE ------------------
const cache = {
  categories: null,
  subcategories: null,
};

// ------------------ CATEGORIES + SUBCATEGORIES ------------------
export const fetchCategories = async () => {
  if (cache.categories && cache.subcategories) {
    return cache.categories.map(cat => ({
      ...cat,
      subcategories: cache.subcategories[cat.id] || [],
    }));
  }

  const data = await request("/api/all_categories", { method: "GET" });
  if (!data) return [];

  // Split categories and subcategories
  cache.categories = data.map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
  }));

  cache.subcategories = {};
  data.forEach(cat => {
    cache.subcategories[cat.id] = cat.subcategories || [];
  });

  return data; // already includes subcategories
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
  const pageNum = Number(page) || 1;
  const sizeNum = Number(pageSize) || 12;

  const query = new URLSearchParams({
    page: pageNum.toString(),
    pageSize: sizeNum.toString(),
    search: search || "",
    subcategory_id: subcategoryId || "",
  });

  const res = await request(`/api/ads/all?${query.toString()}`);
  return {
    products: res?.products || [],
    total: res?.total || 0,
  };
};

// ------------------ CREATE PRODUCT ------------------
export const createProduct = async (formData) => {
  return await request("/api/ads", { method: "POST", body: formData });
};

// ------------------ UPDATE PRODUCT ------------------
export const updateProduct = async (id, formData) => {
  return await request(`/api/seller/products/${id}`, { method: "PUT", body: formData });
};

// ------------------ DELETE PRODUCT ------------------
export const deleteProduct = async (id) => {
  return await request(`/api/seller/products/${id}`, { method: "DELETE" });
};