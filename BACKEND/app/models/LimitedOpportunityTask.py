from sqlalchemy import Column, Integer, String, DateTime
from ..db import Base

class LimitedOpportunityTask(Base):
    __tablename__ = "limited-opportunity-tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String)
    open_datetime = Column(DateTime)
    close_datetime = Column(DateTime)
    priority = Column(String)
    reminder_delta_months = Column(Integer)
    reminder_delta_weeks = Column(Integer)
    reminder_delta_days = Column(Integer)
    reminder_delta_hours = Column(Integer)
    created_at = Column(DateTime)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "open_datetime": self.open_datetime.isoformat(),
            "close_datetime": self.close_datetime.isoformat(),
            "priority": self.priority,
            "reminder_delta_months": self.reminder_delta_months,
            "reminder_delta_weeks": self.reminder_delta_weeks,
            "reminder_delta_days": self.reminder_delta_days,
            "reminder_delta_hours": self.reminder_delta_hours,
            "created_at": self.created_at.isoformat()
        }

    def get_id(self):
        return str(self.id)