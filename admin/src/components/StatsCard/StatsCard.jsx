import './StatsCard.css';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="stats-card">
      <div className="stats-card-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="stats-card-content">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;