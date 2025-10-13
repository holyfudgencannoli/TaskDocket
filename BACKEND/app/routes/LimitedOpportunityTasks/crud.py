from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...db import SessionLocal
from ...models.Tasks.LimitedOpportunityTask import LimitedOpportunityTask
from datetime import datetime


lot_bp = Blueprint("limited _opportunity_tasks", __name__)


@lot_bp.route('/', methods=['GET'])
# @jwt_required()
def get_tasks():
    # user_id = get_jwt_identity()
    user_id = 1

    db_session = SessionLocal()

    task_objects = db_session.query(LimitedOpportunityTask).filter_by(user_id=user_id).all()

    tasks = [t.to_dict() for t in task_objects]

    db_session.close()

    return jsonify({'tasks': tasks, 'msg': "Success!"})

@lot_bp.route('/', methods=['POST'])
# @jwt_required()
def log_drt_tasks():
    # user_id = get_jwt_identity()
    user_id = 1

    # if not user_id:
        # return "Unauthorized", 401

    db_session = SessionLocal()

    data = request.get_json()

    name = data.get('name')
    open_date = datetime.fromisoformat(data.get('openDate'))
    close_date = datetime.fromisoformat(data.get('closeDate'))
    priority = data.get('priority')
    reminder_months = data.get('reminderFrequencyMonths')
    reminder_weeks = data.get('reminderFrequencyWeeks')
    reminder_days = data.get('reminderFrequencyDays')
    reminder_hours = data.get('reminderFrequencyHours')
    created_at = datetime.now()

    new_lot = LimitedOpportunityTask(
        name = name,
        open_datetime = open_date,
        close_datetime = close_date,
        priority = priority,
        reminder_frequency_months=reminder_months,
        reminder_frequency_weeks = reminder_weeks,
        reminder_frequency_days = reminder_days,
        reminder_frequency_hours = reminder_hours,
        created_at = created_at,
        user_id = user_id
    )

    try:
        db_session.add(new_lot)
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
        print(new_lot)
        return jsonify({"msg": "Successfully created~!"}), 201
    finally:
        db_session.close()
    




@lot_bp.route('/<int:task_id>', methods=['GET'])
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
