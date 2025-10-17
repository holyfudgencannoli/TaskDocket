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
    task_id = Column(Integer)

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
            "task_id": self.task_id 
        }
    
    def get_id(self):
        return str(self.id)

