// src/api/api.js
export const fetchCategories = async () => {
  return [
    { id: 1, name: "Electronics", icon: "phone-portrait" },
    { id: 2, name: "Bags", icon: "bag" },
    { id: 3, name: "Furniture", icon: "bed" },
  ];
};

export const fetchLocations = async () => {
  return [
    { id: 1, name: "Dar es Salaam" },
    { id: 2, name: "Dodoma" },
    { id: 3, name: "Arusha" },
  ];
};

// Mock fetchProducts
export const fetchProducts = async () => {
  return [
    {
      id: 1,
      name: "iPhone 14 Pro",
      price: 1500000,
      slug: "iphone-14-pro",
      description: "Brand new iPhone 14 Pro with amazing camera.",
      location: "Dar es Salaam",
      postedTime: "2026-04-01T12:00:00Z",
      category: { slug: "electronics" },
      subcategory: { slug: "phones" },
      images: [{ id: 1, ad_id: 1, path: "https://placekitten.com/300/200" }],
    },
    {
      id: 2,
      name: "MacBook Pro 16",
      price: 3500000,
      slug: "macbook-pro-16",
      description: "Powerful MacBook Pro for developers.",
      location: "Dodoma",
      postedTime: "2026-03-30T08:00:00Z",
      category: { slug: "electronics" },
      subcategory: { slug: "laptops" },
      images: [{ id: 2, ad_id: 2, path: "https://placekitten.com/301/200" }],
    },
    {
      id: 3,
      name: "Leather Backpack",
      price: 120000,
      slug: "leather-backpack",
      description: "Stylish leather backpack for daily use.",
      location: "Arusha",
      postedTime: "2026-03-28T10:30:00Z",
      category: { slug: "bags" },
      subcategory: { slug: "backpacks" },
      images: [{ id: 3, ad_id: 3, path: "https://placekitten.com/302/200" }],
    },
  ];
};