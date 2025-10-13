from flask import Blueprint, jsonify,request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...db import SessionLocal
from ...models.Tasks.DynamicRecurringTask import DynamicRecurringTask
from datetime import datetime
from ..Utils.utility_routes import *


users_bp = Blueprint("users", __name__)


@users_bp.route('/', methods=['GET'])
@jwt_required()
def get_drt_tasks():
    db_session = SessionLocal()

    user_objects = db_session.query(User).all()

    users = [u.to_dict() for u in user_objects]


    return jsonify({'users': users})

@users_bp.route('/', methods=['POST'])
@jwt_required()
def log_drt_tasks():
    user_id = get_jwt_identity()

    if not user_id:
        return "Unauthorized", 401


    db_session = SessionLocal()

    data = request.get_json()

    username = data.get('username')
    password_hash = data.get('password_hash')
    is_admin = data.get('is_admin')
    email = data.get('email')
    phone = data.get('phone')

    try:
        create_user(
            username=username,
            password_hash=password_hash,
            is_admin=is_admin,
            email=email,
            phone=phone,
        )
    except ValueError:
        db_session.rollback()
        print('Error: Invalid property value.')
        return "Value Error", 400
    except Exception as e:
        db_session.rollback()
        print(f'Unexpected error: {e}')
        return "Internal Server Error", 500
    else:
        print(username, password_hash, is_admin, email, phone)
        return "Successfully created~!", 201
    finally:
        db_session.close()
    



@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = get_user_by_user_id(user_id=user_id)

    return jsonify({'user': user})
