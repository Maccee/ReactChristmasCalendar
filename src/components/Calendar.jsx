import Door from "./Door";

const Calendar = ({ doors, onDoorClick, onDecorationClick }) => {
    return (
      <div className="calendar">
        {doors.map((door, index) => (
          <div className="calendar-item" key={index}>
            <div className="calendar-content">
              <Door 
                door={door} 
                onClick={onDoorClick} 
                onDecorationClick={onDecorationClick}
              />
            </div>
          </div>
        ))}
      </div>
    );
};

export default Calendar;
