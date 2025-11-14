import React, { useState } from "react";

const ModeratorPanel = () => {
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const handleApprove = () => {
    setAction("approved");
    setReason("");
    setCustomReason("");
  };

  const handleReject = () => {
    setAction("rejected");
    setReason("");
    setCustomReason("");
  };

  const handleRequestChanges = () => {
    setAction("requestChanges");
    setReason("");
    setCustomReason("");
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleCustomReasonChange = (e) => {
    setCustomReason(e.target.value);
  };

  const handleSubmit = () => {
    if (!action) {
      console.log("choise action");
      return;
    }
    if (action === "rejected" && !reason) {
      console.log("choice reason");
      return;
    }
    if (reason === "other" && !reason) {
      console.log("choice reason");
      return;
    }
  };

  const reasonText = {
    banItem: "Запрещённый товар",
    incorrectCategory: "Неверная категория",
    scam: "Подозрение на мошенничество",
    other: customReason,
  };

  const isSubmitDisabled =
    action !== "approved" && (!reason || (reason === "other" && !customReason));

  return (
    <div className="moderation-actions">
      <button onClick={handleApprove} style={{ backgroundColor: "green" }}>
        Одобрить
      </button>
      <button onClick={handleReject} style={{ backgroundColor: "red" }}>
        Отклонить
      </button>
      <button
        onClick={handleRequestChanges}
        style={{ backgroundColor: "yellow" }}
      >
        Доработка
      </button>

      {action === "rejected" && (
        <div className="reason-container">
          <label>Укажите причину отклонения:</label>
          <select
            value={reason}
            onChange={handleReasonChange}
            disabled={customReason !== ""}
          >
            <option value="">Выберите причину</option>
            <option value="banItem">Запрещённый товар</option>
            <option value="incorrectCategory">Неверная категория</option>
            <option value="scam">Подозрение на мошенничество</option>
            <option value="other">Другое</option>
          </select>
          {reason === "other" && (
            <input
              type="text"
              placeholder="Введите вашу причину"
              value={customReason}
              onChange={handleCustomReasonChange}
            />
          )}
        </div>
      )}
      {action && (
        <div>
          <h3>
            Вы выбрали действие:{" "}
            {action === "approved"
              ? "Одобрено"
              : action === "rejected"
              ? "Отклонено"
              : "Вернуть на доработку"}
          </h3>
          {reason && <p>Причина: {reasonText[reason]}</p>}
          <br />
        </div>
      )}

      <button onClick={handleSubmit} disabled={isSubmitDisabled}>
        Отправить
      </button>
      <br />
      <br />
    </div>
  );
};

export default ModeratorPanel;
