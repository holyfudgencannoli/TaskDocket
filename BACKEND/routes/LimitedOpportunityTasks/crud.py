from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...app import SessionLocal
from ...models.LimitedOpportunityTask import LimitedOpportunityTask


lot_bp = Blueprint("limited _opportunity_tasks", __name__)


@lot_bp.route('/', methods=['GET'])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()

    db_session = SessionLocal()

    task_objects = db_session.query(LimitedOpportunityTask).filter_by(user_id=user_id).all()

    tasks = [t.to_dict() for t in task_objects]

    db_session.close()

    return jsonify({'one_time_tasks': tasks})



@lot_bp.route('/<int:task_ id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    user_id = get_jwt_identity()

    db_session = SessionLocal()

    task_object = db_session.query(LimitedOpportunityTask).filter_by(
        user_id=user_id,
        id=task_id
    ).all()

    db_session.close()

    return jsonify({'one_time_task': task_object})
