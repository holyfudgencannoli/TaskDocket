from flask import Blueprint, jsonify,request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...db import SessionLocal
from ...models.Tasks.DynamicRecurringTask import DynamicRecurringTask
from ...models.Tasks.CompletedTask import CompletedTask
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta


drt_bp = Blueprint("dynamic_recurring_tasks", __name__)


@drt_bp.route('/', methods=['GET'])
# @jwt_required()
def get_drt_tasks():
    # user_id = get_jwt_identity()
    user_id = 1

    db_session = SessionLocal()

    task_objects = db_session.query(DynamicRecurringTask).filter_by(user_id=user_id).all()

    tasks = [t.to_dict() for t in task_objects]

    db_session.close()

    return jsonify({'tasks': tasks, "msg": "Success!"}), 200


@drt_bp.route('/due-today', methods=['GET'])
# @jwt_required()
def get_drt_tasks_due_today():
    # user_id = get_jwt_identity()
    user_id = 1

    db_session = SessionLocal()

    today = datetime.today()

    task_objects = db_session.query(DynamicRecurringTask).filter_by(
        user_id=user_id,
        due_datetime=today,
        completed=False
    ).all()

    if not task_objects:
        return jsonify({"msg": "No Task Objects Found"})

    tasks = [t.to_dict() for t in task_objects]

    db_session.close()

    return jsonify({'tasks': tasks, "msg": "Success!"}), 200


@drt_bp.route('/due-this-week', methods=['GET'])
# @jwt_required()
def get_drt_tasks_due_this_week():
    # user_id = get_jwt_identity()
    user_id = 1

    db_session = SessionLocal()

    today = datetime.today()
    day_of_week = datetime.weekday(today)
    
    if day_of_week is 6:
        start_date = today
    else:
        start_date = today - timedelta(days=(day_of_week+1))


    task_objects = db_session.query(DynamicRecurringTask).filter_by(
        user_id=user_id,
        completed=False,
    ).all()

    if not task_objects:
        return jsonify({"msg": "No Task Objects Found"})

    incomplete_tasks = []

    for t in task_objects:
        if t.due_datetime > start_date:
            incomplete_tasks.append(t)
        else:
            pass


    tasks = [t.to_dict() for t in incomplete_tasks]

    db_session.close()

    return jsonify({'tasks': tasks, "msg": "Success!"}), 200



@drt_bp.route('/incomplete', methods=['GET'])
# @jwt_required()
def get_tasks_incomplete():
    # user_id = get_jwt_identity()
    user_id = 1

    db_session = SessionLocal()

   
    task_objects = db_session.query(DynamicRecurringTask).filter(
        DynamicRecurringTask.user_id==user_id,
        DynamicRecurringTask.completed!=True
    ).all()
    tasks = [t.to_dict() for t in task_objects]

    db_session.close()

    return jsonify({'tasks': tasks, "msg": "Success!"}), 200
    



@drt_bp.route('/', methods=['POST'])
# @jwt_required()
def log_drt_tasks():
    # user_id = get_jwt_identity()
    user_id = 1

    # if not user_id:
    #     return "Unauthorized", 401


    db_session = SessionLocal()

    data = request.get_json()

    name = data.get('name')
    due_datetime = datetime.fromisoformat(data.get('dueDate'))
    priority = data.get('priority')
    prior_notice_months = data.get('priorNoticeMonths')
    prior_notice_weeks = data.get('priorNoticeWeeks')
    prior_notice_days = data.get('priorNoticeDays')
    prior_notice_hours = data.get('priorNoticeHours')
    created_at = datetime.now()

    new_drt = DynamicRecurringTask(
        name = name,
        due_datetime = due_datetime,
        priority = priority,
        prior_notice_months = prior_notice_months,
        prior_notice_weeks = prior_notice_weeks,
        prior_notice_days = prior_notice_days,
        prior_notice_hours = prior_notice_hours,
        created_at = created_at,
        user_id = user_id
    )

    try:
        db_session.add(new_drt)
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
        print(new_drt)
        return jsonify({"msg": "Successfully created~!"}), 201
    finally:
        db_session.close()
    



@drt_bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_drt_task(task_id):
    user_id = get_jwt_identity()

    db_session = SessionLocal()

    task_object = db_session.query(DynamicRecurringTask).filter_by(
        user_id=user_id,
        id=task_id
    ).all()

    db_session.close()

    return jsonify({'one_time_task': task_object})


@drt_bp.route('/mark-complete/<int:task_id>', methods=['POST'])
# @jwt_required()
def mark_complete(task_id):
    # user_id = get_jwt_identity()
    user_id = 1

    data = request.get_json()

    db_session = SessionLocal()

    new_due_date = datetime.fromisoformat(data.get('due_date'))

    task_obj = db_session.query(DynamicRecurringTask).filter_by(id=task_id, user_id=user_id).first() #type:ignore
    if not task_obj:
        return jsonify({'msg': 'Task Object Not Found!!'}), 404
    if task_obj.completed == True:
        return "Task Already Complete", 406

    task_obj.completed = True

    prior_notice_delta = timedelta(
        weeks=task_obj.prior_notice_weeks, 
        days=task_obj.prior_notice_days, 
        hours=task_obj.prior_notice_hours,
    )
    
    new_completed_task = CompletedTask(
        name = task_obj.name,
        due_datetime = task_obj.due_datetime,
        completed_datetime = datetime.now(),
        task_type = "srt",
        task_id = task_obj.id,
        user_id= user_id
    )

    new_drt = DynamicRecurringTask(
        name = task_obj.name,
        due_datetime = new_due_date,
        priority = task_obj.priority,
        prior_notice_months = task_obj.prior_notice_months,
        prior_notice_weeks = task_obj.prior_notice_weeks,
        prior_notice_days = task_obj.prior_notice_days,
        prior_notice_hours = task_obj.prior_notice_hours,
        created_at = datetime.now(),
        user_id=user_id
    )

    try:
        db_session.add(new_completed_task)
        db_session.add(new_drt)
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
        print(new_completed_task)
        return jsonify({"msg": "Completed task succesfully logged~!"}), 201
    finally:
        db_session.close()
    