// todo:
// filter
// edit route by pages: list => list/1 list/2 ... list/10

// навигация работает только на объявления, которые в списке limit:

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdCard from "../components/adcard/AdCard";
import Pagination from "../components/pagination";

import MySelect from "../UI/select/MySelect";
import MyButton from "../UI/button/MyButton";
import MyInput from "../UI/input/MyInput";
import MyCheckbox from "../UI/checkbox/MyCheckBox";

const ListPage = () => {
  const [adsOrig, setAdsOrig] = useState([]);
  const [ads, setAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSort, setSelectedSort] = useState("");
  const [filters, setFilters] = useState({
    statuses: [], // ["approved", "rejected", "requestChanges"]
    categoryId: "",
    priceMin: "",
    priceMax: "",
    search: "",
  });

  const navigate = useNavigate();

  const fetchAds = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/v1/ads", {
        params: {
          page,
          limit: 10,
          // status: ["approved"],
        },
      });
      setAds(response.data.ads);
      setAdsOrig(response.data.ads);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(`Произошла ошибка при загрузке данных list: ${err.message}`);
      console.error(`fetch error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds(currentPage);
  }, [currentPage]);

  const handleCLick = (ad) => {
    console.log("navigate to ad.id:", ad.id);
    navigate(`/item/${ad.id}`, {
      state: { ads },
    });
  };

  if (loading) return <div className="loading">загрузка...</div>; // todo: add loader
  if (error) return <div className="error">{error}</div>;

  const applyFiltersAndSort = (sortValue) => {
    let result = [...adsOrig];

    if (filters.statuses.length > 0) {
      result = result.filter((ad) => filters.statuses.includes(ad.status));
    }

    if (filters.categoryId) {
      result = result.filter(
        (ad) => ad.categoryId === Number(filters.categoryId)
      );
    }

    if (filters.priceMin !== "") {
      const min = Number(filters.priceMin);
      if (!Number.isNaN(min)) {
        result = result.filter((ad) => Number(ad.price) >= min);
      }
    }

    if (filters.priceMax !== "") {
      const max = Number(filters.priceMax);
      if (!Number.isNaN(max)) {
        result = result.filter((ad) => Number(ad.price) <= max);
      }
    }

    if (filters.search.trim() !== "") {
      result = result.filter((ad) =>
        ad.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    const sort = sortValue || selectedSort;

    if (sort) {
      switch (sort) {
        case "priotiry": {
          const order = ["urgent", "normal"];
          result.sort(
            (a, b) => order.indexOf(a.priority) - order.indexOf(b.priority)
          );
          break;
        }
        case "updated-new":
          result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          break;

        case "updated-old":
          result.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
          break;

        case "price-asc":
          result.sort((a, b) => Number(a.price) - Number(b.price));
          break;

        case "price-desc":
          result.sort((a, b) => Number(b.price) - Number(a.price));
          break;

        case "default":
        default:
          break;
      }
    }

    setAds(result);
  };

  const sortPosts = (sort) => {
    setSelectedSort(sort);
    console.log(sort);

    if (sort === "default") {
      applyFiltersAndSort("");
      return;
    }

    applyFiltersAndSort(sort);
  };

  const applyFilters = () => {
    applyFiltersAndSort();
  };

  const resetFilters = () => {
    setFilters({
      statuses: [],
      categoryId: "",
      priceMin: "",
      priceMax: "",
      search: "",
    });
    setSelectedSort("");
    setAds(adsOrig);
  };

  const toggleCheckbox = (filterName, value) => {
    setFilters((prev) => {
      const list = prev[filterName];

      if (list.includes(value)) {
        return { ...prev, [filterName]: list.filter((v) => v !== value) };
      }

      return { ...prev, [filterName]: [...list, value] };
    });
  };

  return (
    <>
      <h1 className="ads-title">Объявления для вас </h1>

      <div className="ads-filter">
        <MyInput
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Поиск по объявлениям"
          type="text"
        />

        <div className="filter-group">
          <h4>Статус:</h4>

          <MyCheckbox
            label="Ждет проверки"
            checked={filters.statuses.includes("pending")}
            onChange={() => toggleCheckbox("statuses", "pending")}
          />

          <MyCheckbox
            label="Одобрено"
            checked={filters.statuses.includes("approved")}
            onChange={() => toggleCheckbox("statuses", "approved")}
          />

          <MyCheckbox
            label="Отклонено"
            checked={filters.statuses.includes("rejected")}
            onChange={() => toggleCheckbox("statuses", "rejected")}
          />

          <MyCheckbox
            label="Доработка"
            checked={filters.statuses.includes("draft")}
            onChange={() => toggleCheckbox("statuses", "draft")}
          />
        </div>

        <MyInput
          type="number"
          placeholder="Минимальная цена"
          value={filters.priceMin}
          onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
        />

        <MyInput
          type="number"
          placeholder="Максимальная цена"
          value={filters.priceMax}
          onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
        />

        <div className="filter-group">
          <MySelect
            value={filters.categoryId}
            onChange={(value) => setFilters({ ...filters, categoryId: value })}
            defaultValue="Категория"
            options={[
              { value: "", name: "Все" },
              { value: "1", name: "Недвижимость" },
              { value: "2", name: "Транспорт" },
              { value: "3", name: "Электроника" },
            ]}
          />
        </div>

        <MyButton onClick={applyFilters}>Применить</MyButton>
        <MyButton onClick={resetFilters}>Сбросить</MyButton>
        <hr />
      </div>

      <div className="ads-search">
        <MySelect
          value={selectedSort}
          onChange={sortPosts}
          defaultValue="Сортировка"
          options={[
            { value: "default", name: "По умолчанию" },
            { value: "priotiry", name: "По приоритету" },
            { value: "updated-new", name: "Сначала новые" },
            { value: "updated-old", name: "Сначала старые" },
            { value: "price-asc", name: "Дешевле" },
            { value: "price-desc", name: "Дороже" },
          ]}
        />
      </div>

      <div className="ads-list">
        <hr />

        {ads.map((ad) => (
          <div
            className="add-card__container"
            key={ad.id}
            onClick={() => handleCLick(ad)}
          >
            <AdCard ad={ad} key={ad.id} />
          </div>
        ))}
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <p className="ads-totalItems">
        Всего объявлений: {pagination.totalItems}
      </p>
    </>
  );
};

export default ListPage;
