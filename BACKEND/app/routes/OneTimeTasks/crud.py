from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ...db import SessionLocal
from ...models import CompletedTask, OneTimeTask
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo


ott_bp = Blueprint("one_time_tasks", __name__)


@ott_bp.route('/', methods=['GET'])
# @jwt_required()
def get_tasks():
    # user_id = get_jwt_identity()
    user_id = 1

    db_session = SessionLocal()

    task_objects = db_session.query(OneTimeTask).filter_by(user_id=user_id).all()

    tasks = [t.to_dict() for t in task_objects]

    db_session.close()

    return jsonify({'tasks': tasks, "msg": "Success!"}), 200



@ott_bp.route('/incomplete', methods=['GET'])
# @jwt_required()
def get_incomplete_tasks():
    # user_id = get_jwt_identity()
    user_id = 1

    db_session = SessionLocal()

    task_objects = db_session.query(OneTimeTask).filter(
        OneTimeTask.user_id==user_id,
        OneTimeTask.completed!=True
    ).all()

    tasks = [t.to_dict() for t in task_objects]

    db_session.close()

    return jsonify({'tasks': tasks, "msg": "Success!"}), 200



@ott_bp.route('/due-today', methods=['GET'])
# @jwt_required()
def get_ott_tasks_due_today():
    # user_id = get_jwt_identity()
    user_id = 1

    db_session = SessionLocal()


    start_of_today = datetime.today().replace(hour=4)
    end_of_today = start_of_today + timedelta(hours=24)

    task_objects = (db_session.query(OneTimeTask).filter(
        OneTimeTask.user_id==user_id,
        OneTimeTask.due_datetime>= start_of_today,
        OneTimeTask.due_datetime < end_of_today,
        OneTimeTask.completed==False
    ).all())

    if not task_objects:
        return jsonify({"msg": "No Task Objects Found"})

    tasks = [t.to_dict() for t in task_objects]
    print(tasks)

    db_session.close()

    return jsonify({'tasks': tasks, "msg": "Success!"}), 200



@ott_bp.route('/due-this-week', methods=['GET'])
# @jwt_required()
def get_ott_tasks_due_this_week():
    # user_id = get_jwt_identity()
    user_id = 1

    db_session = SessionLocal()

    today = datetime.today()
    day_of_week = datetime.weekday(today)
    
    if day_of_week == 6:
        start_date = today
    else:
        start_date = today - timedelta(days=(day_of_week+1))


    task_objects = db_session.query(OneTimeTask).filter_by(
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


    tasks = [t.to_dict() for t in incomplete_tasks] if incomplete_tasks else []

    db_session.close()

    return jsonify({'tasks': tasks, "msg": "Success!"}), 200


# @ott_bp.route('/', methods=['POST'])


@ott_bp.route('/', methods=['POST'])
# @jwt_required()
def log_ott_tasks():
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

    new_ott = OneTimeTask(
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
        return jsonify({"msg": "Successfully created~!"}), 201
    finally:
        db_session.close()
    



@ott_bp.route('/<int:task_id>', methods=['GET'])
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

@ott_bp.route('/mark-complete/<int:task_id>', methods=['POST'])
# @jwt_required()
def mark_complete(task_id):
    # user_id = get_jwt_identity()
    user_id = 1

    db_session = SessionLocal()

    task_obj = db_session.query(OneTimeTask).filter_by(id=task_id, user_id=user_id).first() #type:ignore
    if not task_obj:
        return jsonify({'msg': 'Task Object Not Found!!'}), 404
    if task_obj.completed == True:
        return "Task Already Complete", 406

    task_obj.completed = True
    
    new_completed_task = CompletedTask(
        name = task_obj.name,
        due_datetime = task_obj.due_datetime,
        completed_datetime = datetime.now(),
        task_type = "ott",
        task_id = task_obj.id,
        user_id= user_id
    )

    try:
        db_session.add(new_completed_task)
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
    