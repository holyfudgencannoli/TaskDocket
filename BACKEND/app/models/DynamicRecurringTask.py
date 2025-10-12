from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..db import Base

class DynamicRecurringTask(Base):
    __tablename__ = "dynamic-recurring-tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String)
    due_datetime = Column(DateTime)
    priority = Column(String)
    prior_notice = Column(String)
    created_at = Column(DateTime)

    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='dynamic_recurring_tasks')

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "due_datetime": self.due_datetime.isoformat(),
            "priority": self.priority,
            "prior_notice": self.prior_notice,
            "created_at": self.created_at.isoformat(),
            'user_id': self.user_id
        }

    def get_id(self):
        return str(self.id)