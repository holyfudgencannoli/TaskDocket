from werkzeug.security import check_password_hash
from ...db import db_session
from ...models import *


    # Helper functions
def create_user(username, password_hash, email, phone, is_admin):
    already_there = db_session.query(User).filter(User.username==username).first()

    if not already_there:
        user = User(
            username=username,
            email=email,
            is_admin=is_admin,
            phone=phone,
            password_hash=password_hash,
            provider="local"
        )

        db_session.add(user)
        db_session.commit()
    else:
        raise ValueError("User already exists")
    db_session.close()

    
def get_user_by_user_id(user_id):
    user = db_session.query(User).filter_by(id=user_id).first()
    db_session.close()
    if user:
        # return consistent keys
        return {
            "id": user.id,
            "username": user.username,
            "password_hash": user.password_hash,
            "is_admin": user.is_admin
        }
    return None
    

def get_user_by_username(username):
    user = db_session.query(User).filter_by(username=username).first()
    db_session.close()
    if user:
        # return consistent keys
        return {
            "id": user.id,
            "username": user.username,
            "password_hash": user.password_hash,
            "is_admin": user.is_admin
        }
    return None

def check_password(user, password):
    if not user or "password_hash" not in user:
        return False
    return check_password_hash(user["password_hash"], password)




