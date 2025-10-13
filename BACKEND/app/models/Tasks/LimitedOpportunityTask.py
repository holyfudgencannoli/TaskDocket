from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ...db import Base


class LimitedOpportunityTask(Base):
    __tablename__ = "limited_opportunity_tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String)
    open_datetime = Column(DateTime)
    close_datetime = Column(DateTime)
    priority = Column(String)
    reminder_frequency_months = Column(Integer)
    reminder_frequency_weeks = Column(Integer)
    reminder_frequency_days = Column(Integer)
    reminder_frequency_hours = Column(Integer)
    created_at = Column(DateTime)

    completed_task = relationship("CompletedTask", back_populates='lo_task')
       
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='limited_opportunity_tasks')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "open_datetime": self.open_datetime.isoformat(),
            "close_datetime": self.close_datetime.isoformat(),
            "priority": self.priority,
            "reminder_frequency_months": self.reminder_frequency_months,
            "reminder_frequency_weeks": self.reminder_frequency_weeks,
            "reminder_frequency_days": self.reminder_frequency_days,
            "reminder_frequency_hours": self.reminder_frequency_hours,
            "created_at": self.created_at.isoformat(),
            "user_id": self.user_id
        }

    def get_id(self):
        return str(self.id)