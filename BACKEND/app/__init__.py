from flask import Flask, request, jsonify, send_file
import io
import pandas as pd
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt, JWTManager
from sqlalchemy import Column, Integer, String, ForeignKey, Float, Boolean, DateTime, create_engine, MetaData, Table, Interval, BigInteger
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from config import Config
from datetime import datetime, timedelta
from sqlalchemy.exc import SQLAlchemyError
from dateutil.relativedelta import relativedelta
from .db import Base, engine, db_session
from .models import *
from .routes import *
from .routes.Authentication.auth_routes import BLACKLIST

def create_app():

    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:8081", "http://localhost"]}}, supports_credentials=True)
    jwt = JWTManager(app)


    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return jti in BLACKLIST
    
    Base.metadata.create_all(bind=engine)
    
    app.register_blueprint(ott_bp, url_prefix='/api/ott')
    app.register_blueprint(lot_bp, url_prefix='/api/lot')
    app.register_blueprint(srt_bp, url_prefix='/api/srt')
    app.register_blueprint(drt_bp, url_prefix='/api/drt')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')



# @app.route('/api/log-tasks', methods=['POST'])
# @jwt_required()
# def log_task():
#     user_id = get_jwt_identity()

#     db_session = SessionLocal()

#     data = request.get_json()

#     name = data['name']
#     due_datetime = data['due_datetime']
#     log_datetime = data['log_datetime']
#     fin_datetime = data['fin_datetime']
#     completed = data['completed']
#     memo = data['memo']
#     user_id = int(user_id)

#     new_task = Task(
#         name=name,
#         due_datetime=due_datetime,
#         log_datetime=log_datetime,
#         user_id=user_id,
#         completed=completed
#     )

#     db_session.add(new_task)
#     db_session.commit()

#     new_task_dict = new_task.to_dict()
#     db_session.close()


#     return jsonify({'success': True, 'task': new_task_dict})


# @app.route('/api/get-tasks-all', methods=['GET'])
# # @jwt_required()
# def get_tasks_all():
#     # user_id = get_jwt_identity()

#     db_session = SessionLocal()

#     # tasks = db_session.query(Task).filter_by(user_id=user_id).all()
#     tasks = db_session.query(Task).all()

#     tasks_serialized = [t.to_dict() for t in tasks]
#     db_session.close()
#     return jsonify({'tasks': tasks_serialized})

# @app.route('/api/get-tasks', methods=['GET'])
# @jwt_required()
# def get_tasks():
#     user_id = get_jwt_identity()

#     db_session = SessionLocal()

#     task_objects = db_session.query(Task).filter_by(user_id=user_id).all()

#     tasks = [t.to_dict() for t in task_objects]

#     db_session.close()

#     return jsonify({'tasks': tasks})


# @app.route('/api/get-completed-tasks', methods=['GET'])
# @jwt_required()
# def get_completed_tasks():
#     user_id = get_jwt_identity()

#     db_session = SessionLocal()

#     task_objects = db_session.query(Task).filter_by(
#         user_id=user_id,
#         completed=True
#     ).all()

#     tasks = [t.to_dict() for t in task_objects]

#     db_session.close()

#     return jsonify({'tasks': tasks})


# @app.route('/api/get-tasks-by-date', methods=['POST'])
# @jwt_required()
# def get_tasks_by_date():
#     user_id = get_jwt_identity()

#     data = request.get_json()

#     date_str = data.get('date')

#     target_date = datetime.strptime(date_str, "%Y-%m-%d").date()

#     db_session = SessionLocal()

#     tasks = []

#     for t in db_session.query(Task).filter_by(user_id=user_id).all():
#         if t.due_datetime: 
#             try:
#                 task_date = datetime.fromisoformat(t.due_datetime).date()
#                 if task_date == target_date:
#                     tasks.append(t.to_dict())
#             except ValueError:
#                 # optionally log invalid date strings
#                 print("Skipping invalid datetime:", t.due_datetime)
#     db_session.close()

#     return jsonify({'tasks': tasks})

# @app.route('/api/get-completed-tasks-by-date', methods=['POST'])
# @jwt_required()
# def get_completed_tasks_by_date():
#     user_id = get_jwt_identity()

#     data = request.get_json()

#     date_str = data.get('date')

#     target_date = datetime.strptime(date_str, "%Y-%m-%d").date()

#     db_session = SessionLocal()

#     tasks = []

#     for t in db_session.query(Task).filter_by(
#         user_id=user_id,
#         completed=True    
#     ).all():
#         if t.due_datetime: 
#             try:
#                 task_date = datetime.fromisoformat(t.due_datetime).date()
#                 if task_date == target_date:
#                     tasks.append(t.to_dict())
#             except ValueError:
#                 # optionally log invalid date strings
#                 print("Skipping invalid datetime:", t.due_datetime)
#     db_session.close()

#     return jsonify({'tasks': tasks})


# from datetime import datetime

# @app.route('/api/get-tasks-today', methods=['GET'])
# # @jwt_required()
# def get_tasks_today():
#     # user_id = get_jwt_identity()
#     target_date = datetime.now().date()

#     db_session = SessionLocal()
#     tasks = []

#     try:
#         for t in db_session.query(Task).all():
#             if t.due_datetime:
#                 try:
#                     task_date = datetime.fromisoformat(t.due_datetime).date()
#                     if task_date == target_date:
#                         tasks.append(t.to_dict())
#                 except ValueError:
#                     print("Skipping invalid datetime:", t.due_datetime)
#     finally:
#         db_session.close()

#     return jsonify({'tasks': tasks})


# from datetime import datetime

# @app.route('/api/get-task-dates', methods=['POST'])
# @jwt_required()
# def get_task_dates():
#     user_id = get_jwt_identity()
#     db_session = SessionLocal()

#     task_dates = (
#         db_session.query(Task.due_datetime)
#         .filter_by(user_id=user_id)
#         .all()
#     )

#     db_session.close()

#     dates = []
#     for dt in task_dates:
#         if dt[0]:
#             if isinstance(dt[0], str):
#                 # Parse string to datetime
#                 parsed = datetime.fromisoformat(dt[0])
#                 dates.append(parsed.date().isoformat())
#             else:
#                 dates.append(dt[0].date().isoformat())

#     return jsonify({'dates': sorted(set(dates))})


# @app.route('/api/get-tasks-to-do', methods=['GET'])
# @jwt_required()
# def get_tasks_to_do():
#     user_id = get_jwt_identity()

#     db_session = SessionLocal()

#     tt = db_session.query(Task).filter_by(user_id=user_id, completed=False).all()

#     tasks = []
#     for t in tt:
#         tasks.append(t.to_dict())
#     db_session.close()

#     return jsonify({'tasks': tasks})

# @app.route('/api/mark-complete', methods=['POST'])
# @jwt_required()
# def mark_complete():
#     user_id = get_jwt_identity()

#     data = request.get_json()

#     task_id = data.get('task_id')

#     db_session = SessionLocal()

#     task_obj = db_session.query(Task).filter_by(id=task_id, user_id=user_id).first() #type:ignore


#     task_obj.completed = True
#     task_obj.fin_datetime = datetime.now().isoformat()
#     print(datetime.now().isoformat())

#     db_session.commit()
#     db_session.close()

#     return jsonify({'message': 'Task marked complete!'})

# @app.route('/api/mark-complete-repeating', methods=['POST'])
# @jwt_required()
# def mark_complete_repeating():
#     user_id = get_jwt_identity()

#     data = request.get_json()

#     task_id = data.get('task_id')

#     db_session = SessionLocal()

#     task_obj = db_session.query(RepeatingTask).filter_by(id=task_id, user_id=user_id).first() #type:ignore

#     task_obj.last_completed = datetime.now()
#     task_obj.next_due = task_obj.next_due + timedelta(seconds=task_obj.frequency_seconds)
#     print(datetime.now().isoformat())

#     db_session.commit()
#     db_session.close()

#     return jsonify({'message': 'Task marked complete!'})

# @app.route("/api/export-all", methods=["GET"])
# @jwt_required()
# def export_all():
#     claims = get_jwt()
#     if not claims.get("is_admin"):
#         return jsonify({"msg": "Admins only!"}), 403
#     else:

#         db_session = SessionLocal()

#         users = db_session.query(User).all()
#         tasks = db_session.query(Task).all()
#         db_session.close()

#         # Convert to DataFrames
#         users_df = pd.DataFrame([u.to_dict() for u in users])
#         tasks_df = pd.DataFrame([t.to_dict() for t in tasks])

#         # Save to in-memory Excel
#         output = io.BytesIO()
#         with pd.ExcelWriter(output, engine="openpyxl") as writer:
#             users_df.to_excel(writer, index=False, sheet_name="Users")
#             tasks_df.to_excel(writer, index=False, sheet_name="Tasks")
#         output.seek(0)

#         return send_file(
#             output,
#             as_attachment=True,
#             download_name="backup_export.xlsx",
#             mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
#         )

# @app.route("/api/import-all", methods=["POST"])
# def import_all():
#     claims = get_jwt()
#     if not claims.get("is_admin"):
#         return jsonify({"msg": "Admins only!"}), 403
#     else:
            
#         if "file" not in request.files:
#             return jsonify({"error": "No file uploaded"}), 400
        
#         file = request.files["file"]

#         try:
#             xls = pd.ExcelFile(file)
#         except Exception as e:
#             return jsonify({"error": f"Failed to read Excel: {str(e)}"}), 400

#         db_session = SessionLocal()
#         imported_users = imported_tasks = 0

#         # --- Users ---
#         if "Users" in xls.sheet_names:
#             users_df = pd.read_excel(xls, sheet_name="Users")
#             for _, row in users_df.iterrows():
#                 existing = db_session.query(User).filter_by(username=row.get("username")).first()
#                 if not existing:
#                     user = User(
#                         username=row.get("username"),
#                         email=row.get("email"),
#                         password=row.get("password"),  # ⚠️ ideally hash before import
#                     )
#                     db_session.add(user)
#                     imported_users += 1

#         # --- Tasks ---
#         if "Tasks" in xls.sheet_names:
#             tasks_df = pd.read_excel(xls, sheet_name="Tasks")
#             for _, row in tasks_df.iterrows():
#                 existing = db_session.query(Task).filter_by(
#                     name=row.get("name"),
#                     log_datetime=row.get("log_datetime")
#                 ).first()
#                 if not existing:
#                     task = Task(
#                         name=row.get("name"),
#                         due_datetime=row.get("due_datetime"),
#                         log_datetime=row.get("log_datetime"),
#                         fin_datetime=row.get("fin_datetime"),
#                         completed=bool(row.get("completed")),
#                         memo=row.get("memo"),
#                         user_id=row.get("user_id")
#                     )
#                     db_session.add(task)
#                     imported_tasks += 1

#         db_session.commit()
#         db_session.close()

#         return jsonify({
#             "message": f"Imported {imported_users} users and {imported_tasks} tasks successfully"
#         })
    
# @app.route("/api/repeating-tasks", methods=["GET"])
# @jwt_required()
# def list_repeating_tasks():
#     user_id = get_jwt_identity()

#     db_session = SessionLocal()

#     tasks = db_session.query(RepeatingTask).filter_by(user_id=user_id).all()
#     serialized_tasks = [task.to_dict() for task in tasks]

#     db_session.close()

#     return jsonify({'tasks': serialized_tasks})

# @app.route("/api/repeating-tasks", methods=["POST"])
# @jwt_required()
# def create_repeating_task():

#     db_session = SessionLocal()
#     try:
#         user_id = get_jwt_identity()
#         data = request.get_json()

#         for key in ["name", "first_due", "high_priority"]:
#             if key not in data:
#                 return jsonify({"error": f"Missing field {key}"}), 400


#             frequency_months = int(data.get("frequency_months", 0))
#             frequency_weeks = int(data.get("frequency_weeks", 0))
#             frequency_days = int(data.get("frequency_days", 0))
#             frequency_hours = int(data.get("frequency_hours", 0))
#             frequency_minutes = int(data.get("frequency_minutes", 0))

#             frequency = relativedelta(
#                 months=frequency_months,
#                 weeks=frequency_weeks,
#                 days=frequency_days,
#                 hours=frequency_hours,
#                 minutes=frequency_minutes
#             )


#             name = data.get('name')
#             created_at = datetime.now()
#             first_due = datetime.fromisoformat(data.get('first_due'))
#             next_due = first_due + frequency
#             memo = data.get('memo')
#             high_priority = data.get('high_priority')

#             new_repeating_task = RepeatingTask(
#                 name = name,
#                 created_at = created_at,
#                 frequency_months = frequency_months,
#                 frequency_weeks = frequency_weeks,
#                 frequency_days = frequency_days,
#                 frequency_hours = frequency_hours,
#                 frequency_minutes = frequency_minutes,
#                 first_due = first_due,
#                 next_due = next_due,
#                 memo = memo,
#                 high_priority = high_priority,
#                 user_id = user_id
#             )

#             db_session.add(new_repeating_task)
#             db_session.commit()

#             return jsonify({"msg": "Task created"}), 201  
        
#     except SQLAlchemyError as e:
#         db_session.rollback()
#         return jsonify({"error": "Database error", "details": str(e)}), 500

#     except Exception as e:
#         return jsonify({"error": "Unexpected error", "details": str(e)}), 500

#     finally:
#         db_session.close()


# # @app.route("/api/repeating-tasks/<int:task_id>", methods=["GET"])
# # @jwt_required()
# # def get_repeating_task(task_id):
# #     user_id = get_jwt_identity()


# # @app.route("/api/repeating-tasks/<int:task_id>", methods=["PUT"])
# # @jwt_required()
# # def update_repeating_task(task_id):
# #     user_id = get_jwt_identity()


# @app.route("/api/repeating-tasks/<int:task_id>", methods=["DELETE"])
# @jwt_required()
# def delete_repeating_tasks(task_id):
#     user_id = get_jwt_identity()

#     db_session = SessionLocal()

#     task = db_session.query(RepeatingTask).filter_by(id=task_id, user_id=user_id).first()

#     db_session.delete(task)
#     db_session.commit()
#     db_session.close()

#     return "", 204

    return app