const Card = ({ title, value }) => {
  return (
    <div
      className="card shadow border-0 h-100"
      style={{
        transition: "0.3s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.classList.add("shadow-lg");
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.classList.remove("shadow-lg");
      }}
    >
      <div className="card-body text-center">

        <h5 className="card-title text-secondary mb-3">
          {title}
        </h5>

        <h1
          className="fw-bold text-primary"
          style={{
            fontSize: "48px",
          }}
        >
          {value}
        </h1>

      </div>
    </div>
  );
};

export default Card;