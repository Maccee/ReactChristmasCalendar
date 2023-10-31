import Door from "./Door";

const Calendar = ({ doors, onDoorClick, onDecorationClick }) => {
    return (
      <div className="calendar">
        {doors.map((door, index) => (
    <Door 
        key={index} 
        door={door} 
        onClick={onDoorClick} 
        onDecorationClick={onDecorationClick}
    />
))}
      </div>
    );
  };

export default Calendar;
