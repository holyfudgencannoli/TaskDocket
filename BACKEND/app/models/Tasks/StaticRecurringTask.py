from sqlalchemy import Column, Integer, String, DateTime, ForeignKey,Boolean
from ...db import Base
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime

class StaticRecurringTask(Base):
    __tablename__ = "static_recurring_tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String)
    due_datetime: Mapped[datetime] = mapped_column(DateTime)
    priority: Mapped[str] = mapped_column(String)
    prior_notice_months: Mapped[int] = mapped_column(Integer)
    prior_notice_weeks: Mapped[int] = mapped_column(Integer)
    prior_notice_days: Mapped[int] = mapped_column(Integer)
    prior_notice_hours: Mapped[int] = mapped_column(Integer)
    delta_months: Mapped[int] = mapped_column(Integer)
    delta_weeks: Mapped[int] = mapped_column(Integer)
    delta_days: Mapped[int] = mapped_column(Integer)
    delta_hours: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='static_recurring_tasks')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "due_datetime": self.due_datetime.isoformat(),
            "priority": self.priority,
            "prior_notice_months": self.prior_notice_months,
            "prior_notice_weeks": self.prior_notice_weeks,
            "prior_notice_days": self.prior_notice_days,
            "prior_notice_hours": self.prior_notice_hours,
            "delta_months": self.delta_months,
            "delta_weeks": self.delta_weeks,
            "delta_days": self.delta_days,
            "delta_hours": self.delta_hours,
            "created_at": self.created_at.isoformat(),
            "user_id": self.user_id,
            "completed": self.completed
        }

    def get_id(self):
        return str(self.id)