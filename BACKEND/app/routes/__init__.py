from .Authentication.auth_routes import auth_bp
from .DynamicRecurringTasks.crud import drt_bp
from .StaticRecurringTasks.crud import srt_bp
from .OneTimeTasks.crud import ott_bp
from .LimitedOpportunityTasks.crud import lot_bp
from .Users.crud import users_bp

__all__ = [
    "auth_bp",
    "drt_bp",
    "srt_bp",
    "ott_bp",
    "lot_bp",
    "users_bp"
]