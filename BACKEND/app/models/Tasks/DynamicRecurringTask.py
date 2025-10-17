from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship, Mapped, mapped_column
from ...db import Base
from datetime import datetime


class DynamicRecurringTask(Base):
    __tablename__ = "dynamic_recurring_tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[int] = mapped_column(Integer)
    due_datetime: Mapped[datetime] = mapped_column(DateTime)
    priority: Mapped[int] = mapped_column(String)
    prior_notice_months: Mapped[int] = mapped_column(Integer)
    prior_notice_weeks: Mapped[int] = mapped_column(Integer)
    prior_notice_days: Mapped[int] = mapped_column(Integer)
    prior_notice_hours: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime)

    user = relationship('User', back_populates='dynamic_recurring_tasks', uselist=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'))
    completed: Mapped[int] = mapped_column(Boolean, default=False)
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "due_datetime": self.due_datetime.isoformat(),
            "priority": self.priority,
            'prior_notice_months': self.prior_notice_months,
            'prior_notice_weeks': self.prior_notice_weeks,
            'prior_notice_days': self.prior_notice_days,
            'prior_notice_hours': self.prior_notice_hours,
            "created_at": self.created_at.isoformat(),
            'user_id': self.user_id,
            "completed": self.completed
        }

    def get_id(self):
        return str(self.id)