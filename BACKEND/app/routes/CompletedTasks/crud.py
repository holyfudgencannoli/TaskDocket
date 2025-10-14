from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...db import SessionLocal
from ...models.Tasks.CompletedTask import CompletedTask
from datetime import datetime


ct_bp = Blueprint("completed_tasks", __name__)


@ct_bp.route('/', methods=['GET'])
# @jwt_required()
def get_tasks():
    # user_id = get_jwt_identity()
    user_id = 1

    db_session = SessionLocal()

    task_objects = db_session.query(CompletedTask).filter_by(user_id=user_id).all()

    tasks = [t.to_dict() for t in task_objects]

    db_session.close()

    return jsonify({'tasks': tasks, "msg": "Success!"}), 200



@ct_bp.route('/', methods=['POST'])
@jwt_required()
def log_drt_tasks():
    # user_id = get_jwt_identity()
    user_id = 1

    # if not user_id:
    #     return "Unauthorized", 401

    db_session = SessionLocal()

    data = request.get_json()

    

    name = data.get('name')
    due_datetime = datetime.fromisoformat(data.get('due_datetime'))
    created_at = datetime.now()
    completed_datetime = data.get('completed_datetime')
    task_type = data.get('task_type')
    user_id = data.get('user_id')
    

    new_ott = CompletedTask(
        name = name,
        due_datetime = due_datetime,
        completed_datetime = completed_datetime,
        task_type = task_type,
        user_id = user_id,
        
        created_at = created_at,
    )


    try:
        db_session.add(new_ott)
        db_session.commit()    
    except ValueError:
        db_session.rollback()
        print('Error: Invalid property value.')
        return jsonify({"msg": "Value Error"}), 400
    except Exception as e:
        db_session.rollback()
        print(f'Unexpected error: {e}')
        return jsonify({"msg": "Internal Server Error"}), 500
    else:
        print(new_ott)
        return jsonify({"msg": "Successfully created~!"}), 201
    finally:
        db_session.close()
    



@ct_bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    user_id = get_jwt_identity()

    db_session = SessionLocal()

    task_object = db_session.query(CompletedTask).filter_by(
        user_id=user_id,
        id=task_id
    ).all()

    db_session.close()

    return jsonify({'task': task_object})
