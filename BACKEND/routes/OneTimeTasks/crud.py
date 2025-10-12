from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...app import SessionLocal
from ...models.OneTimeTask import OneTimeTask


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
