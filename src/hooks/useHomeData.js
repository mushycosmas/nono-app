import { useEffect, useState, useCallback } from "react";
import { fetchCategories, fetchLocations, fetchProducts } from "../api/api";

export default function useHomeData(initialSearch = "", initialSubcategory = "") {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);

  const pageSize = 12;

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProductData = useCallback(
    async (pageNum = 1, append = false) => {
      try {
        if (!append) setLoading(true);
        const res = await fetchProducts(pageNum, pageSize, searchQuery, selectedSubcategory);

        if (append) {
          setProducts((prev) => [...prev, ...res.products]);
        } else {
          setProducts(res.products);
        }

        setTotal(res.total);
        setPage(pageNum);
      } catch (err) {
        console.log("Fetch Products Error:", err);
      } finally {
        if (!append) setLoading(false);
      }
    },
    [searchQuery, selectedSubcategory]
  );

  // ---------------- INITIAL LOAD ----------------
  const loadData = async () => {
    try {
      setLoading(true);

      const [cats, locs] = await Promise.all([fetchCategories(), fetchLocations()]);
      setCategories(cats);
      setLocations(locs);

      await fetchProductData(1, false); // first page
    } catch (err) {
      console.log("Load Data Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOAD MORE ----------------
  const loadMore = async () => {
    if (loadingMore) return;
    if (products.length >= total) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      await fetchProductData(nextPage, true);
    } catch (err) {
      console.log("Load More Error:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // ---------------- SEARCH / FILTER ----------------
  const handleSearch = async (query) => {
    setSearchQuery(query);
    await fetchProductData(1, false);
  };

  const handleFilterSubcategory = async (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    await fetchProductData(1, false);
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
    handleSearch,
    handleFilterSubcategory,
  };
}