from sqlalchemy import Column, Integer, String, DateTime, Boolean
from ..db import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'users' 
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(1024), unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    email = Column(String)
    phone = Column(String)
    provider = Column(String)
    provider_id = Column(Integer)
    created_at = Column(DateTime)
    last_login =  Column(DateTime)
    
    dynamic_recurring_tasks = relationship("DynamicRecurringTask", back_populates="user", lazy="noload", uselist=True)
    
    static_recurring_tasks = relationship("StaticRecurringTask", back_populates="user", lazy="noload", uselist=True)
    
    one_time_tasks = relationship("OneTimeTask", back_populates="user", lazy="noload", uselist=True)
    
    limited_opportunity_tasks = relationship("LimitedOpportunityTask", back_populates="user", lazy="noload", uselist=True)

    completed_tasks = relationship("CompletedTask", back_populates="user", lazy="noload", uselist=True)

    def to_dict(self):
        return{
            'id': self.id,
            'username': self.username,
            'is_admin': self.is_admin,
            'email': self.email,
            'phone': self.phone,
            'provider': self.provider,
            'provider_id': self.provider_id,
            'created_at': self.created_at,
            'last_login': self.last_login,
            'dynamic_recurring_tasks': [t.to_dict() for t in self.dynamic_recurring_tasks] if self.dynamic_recurring_tasks else [],
            'static_recurring_tasks': [t.to_dict() for t in self.static_recurring_tasks] if self.static_recurring_tasks else [],
            'one_time_tasks': [t.to_dict() for t in self.one_time_tasks] if self.one_time_tasks else [],
            'limited_opportunity_tasks': [t.to_dict() for t in self.limited_opportunity_tasks] if self.limited_opportunity_tasks else [],
        }
    
    def get_id(self):
        return str(self.id)

