import classes from "./AdCard.module.css";

const statusLabels = {
  approved: "Одобрено",
  rejected: "Отклонено",
  pending: "Ждет проверки",
  draft: "Доработка",
};

const AdCard = ({ ad }) => {
  return (
    <div className="ad-card">
      <div className="ad-image__container">
        <img
          loading="lazy"
          className="ad-image"
          src={ad.images && ad.images.length > 0 ? ad.images[0] : ""}
          alt={`изображение ${ad.title} `}
          onError={(e) => e.target.src("default-image.jpg")}
        />
      </div>
      <div className="ad-details">
        <h3 className="ad-title">{ad.title}</h3>
        <p className="ad-price">
          {ad.price > 0
            ? `${ad.price.toLocaleString("ru-RU")} ₽`
            : "Цена не указана."}
        </p>
        <p className="ad-date">
          Дата создания: {new Date(ad.createdAt).toLocaleDateString()}
        </p>

        <p className="ad-category">Категория: {ad.category}</p>
        <p className={`ad-status ${classes[`ad-status-${ad.status}`]}`}>
          Статус: {statusLabels[ad.status] || "неизвестно"}
        </p>
        <p className="ad-priority">
          Приоритет: {ad.priority === "urgent" ? "срочный" : "обычный"}
        </p>
        <hr />
      </div>
    </div>
  );
};

export default AdCard;
