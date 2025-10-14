from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ...db import Base


class CompletedTask(Base):
    __tablename__ = "completed_tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String)
    due_datetime = Column(DateTime)
    completed_datetime = Column(DateTime)
    task_type = Column(String)
    
    ot_task = relationship("OneTimeTask", back_populates='completed_task')
    ot_task_id = Column(Integer, ForeignKey('one_time_tasks.id'))

    lo_task = relationship("LimitedOpportunityTask", back_populates='completed_task')
    lo_task_id = Column(Integer, ForeignKey('limited_opportunity_tasks.id'))

    sr_task = relationship("StaticRecurringTask", back_populates='completed_task')
    sr_task_id = Column(Integer, ForeignKey('static_recurring_tasks.id'))

    dr_task = relationship("DynamicRecurringTask", back_populates='completed_task')
    dr_task_id = Column(Integer, ForeignKey('dynamic_recurring_tasks.id'))

    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='completed_tasks')

    def to_dict(self):
        return{
            'id': self.id,
            'name': self.name,
            'due_datetime': self.due_datetime,
            'completed_datetime': self.completed_datetime,
            'user_id': self.user_id,
            "task_type": self.task_type,
            "task_id": self.ot_task_id or self.dr_task_id or self.lo_task_id or self.sr_task_id 
        }
    
    def get_id(self):
        return str(self.id)

