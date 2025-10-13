from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...db import SessionLocal
from ...models.Tasks.StaticRecurringTask import StaticRecurringTask
from datetime import datetime


srt_bp = Blueprint("static_recurring_tasks", __name__)


@srt_bp.route('/', methods=['GET'])
# @jwt_required()
def get_tasks():
    # user_id = get_jwt_identity()
    user_id = 1

    db_session = SessionLocal()

    task_objects = db_session.query(StaticRecurringTask).filter_by(user_id=user_id).all()

    tasks = [t.to_dict() for t in task_objects]

    db_session.close()

    return jsonify({'tasks': tasks, "msg": "Success!"}), 200
    

@srt_bp.route('/', methods=['POST'])
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
    priority = data.get('priority')
    prior_notice_months = data.get('priorNoticeMonths')
    prior_notice_weeks = data.get('priorNoticeWeeks')
    prior_notice_days = data.get('priorNoticeDays')
    prior_notice_hours = data.get('priorNoticeHours')
    delta_months = data.get('monthsDelta')
    delta_weeks = data.get('weeksDelta')
    delta_days = data.get('daysDelta')
    delta_hours = data.get('hoursDelta')
    created_at = datetime.now()

    new_srt = StaticRecurringTask(
        name = name,
        due_datetime = due_datetime,
        priority = priority,
        prior_notice_months = prior_notice_months,
        prior_notice_weeks = prior_notice_weeks,
        prior_notice_days = prior_notice_days,
        prior_notice_hours = prior_notice_hours,
        delta_months = delta_months,
        delta_weeks = delta_weeks,
        delta_days = delta_days,
        delta_hours = delta_hours,
        created_at = created_at,
        user_id = user_id
    )
    try:
        db_session.add(new_srt)
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
        print(new_srt)
        return jsonify({"msg": "Successfully created~!"}), 201
    finally:
        db_session.close()
    


@srt_bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    user_id = get_jwt_identity()

    db_session = SessionLocal()

    task_object = db_session.query(StaticRecurringTask).filter_by(
        user_id=user_id,
        id=task_id
    ).all()

    db_session.close()

    return jsonify({'one_time_task': task_object})
