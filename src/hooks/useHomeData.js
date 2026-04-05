import { useEffect, useState } from "react";
import { fetchCategories, fetchLocations, fetchProducts } from "../api/api";

export default function useHomeData() {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const pageSize = 12;

  // ---------------- INITIAL LOAD ----------------
  const loadData = async () => {
    try {
      setLoading(true);

      const [cats, locs, productRes] = await Promise.all([
        fetchCategories(),
        fetchLocations(),
        fetchProducts(1, pageSize),
      ]);

      setCategories(cats);
      setLocations(locs);
      setProducts(productRes.products);
      setTotal(productRes.total);
      setPage(1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOAD MORE ----------------
  const loadMore = async () => {
    if (loadingMore) return;

    // 🚫 STOP if all loaded
    if (products.length >= total) return;

    try {
      setLoadingMore(true);

      const nextPage = page + 1;
      const res = await fetchProducts(nextPage, pageSize);

      setProducts((prev) => [...prev, ...res.products]);
      setPage(nextPage);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    categories,
    locations,
    products,
    loading,
    loadMore,
    loadingMore,
  };
}