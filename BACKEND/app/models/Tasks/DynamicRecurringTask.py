from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ...db import Base


class DynamicRecurringTask(Base):
    __tablename__ = "dynamic_recurring_tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String)
    due_datetime = Column(DateTime)
    priority = Column(String)
    prior_notice_months = Column(Integer)
    prior_notice_weeks = Column(Integer)
    prior_notice_days = Column(Integer)
    prior_notice_hours = Column(Integer)
    created_at = Column(DateTime)

    completed_task = relationship("CompletedTask", back_populates='dr_task')

    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='dynamic_recurring_tasks')

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
            'user_id': self.user_id
        }

    def get_id(self):
        return str(self.id)