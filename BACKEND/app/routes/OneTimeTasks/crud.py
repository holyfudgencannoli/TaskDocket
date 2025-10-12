from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...db import SessionLocal
from ...models.OneTimeTask import OneTimeTask
from datetime import datetime


ott_bp = Blueprint("one_time_tasks", __name__)


@ott_bp.route('/', methods=['GET'])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()

    db_session = SessionLocal()

    task_objects = db_session.query(OneTimeTask).filter_by(user_id=user_id).all()

    tasks = [t.to_dict() for t in task_objects]

    db_session.close()

    return jsonify({'one_time_tasks': tasks})


@ott_bp.route('/', methods=['POST'])
@jwt_required()
def log_drt_tasks():
    user_id = get_jwt_identity()

    if not user_id:
        return "Unauthorized", 401

    db_session = SessionLocal()

    data = request.get_json()

    name = data.get('name')
    due_datetime = datetime.fromisoformat(data.get('due_datetime'))
    priority = data.get('priority')
    prior_notice = data.get('prior_notice')
    created_at = datetime.now()

    new_ott = OneTimeTask(
        name = name,
        due_datetime = due_datetime,
        priority = priority,
        prior_notice = prior_notice,
        created_at = created_at,
        user_id = user_id
    )


    try:
        db_session.add(new_ott)
        db_session.commit()    
    except ValueError:
        db_session.rollback()
        print('Error: Invalid property value.')
        return "Value Error", 400
    except Exception as e:
        db_session.rollback()
        print(f'Unexpected error: {e}')
        return "Internal Server Error", 500
    else:
        print(new_ott)
        return "Successfully created~!", 201
    finally:
        db_session.close()
    



@ott_bp.route('/<int:task_ id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    user_id = get_jwt_identity()

    db_session = SessionLocal()

    task_object = db_session.query(OneTimeTask).filter_by(
        user_id=user_id,
        id=task_id
    ).all()

    db_session.close()

    return jsonify({'one_time_task': task_object})
