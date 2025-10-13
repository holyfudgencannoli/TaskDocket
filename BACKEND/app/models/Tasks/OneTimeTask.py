from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ...db import Base


class OneTimeTask(Base):
    __tablename__ = "one_time_tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String)
    due_datetime = Column(DateTime)
    priority = Column(String)
    prior_notice_months = Column(Integer)
    prior_notice_weeks = Column(Integer)
    prior_notice_days = Column(Integer)
    prior_notice_hours = Column(Integer)
    created_at = Column(DateTime)
    
    completed_task = relationship("CompletedTask", back_populates='ot_task')

    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='one_time_tasks')


    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "due_datetime": self.due_datetime.isoformat(),
            "priority": self.priority,
            "prior_notice": self.prior_notice,
            "created_at": self.created_at.isoformat(),
            "user_id": self.user_id
        }

    def get_id(self):
        return str(self.id)