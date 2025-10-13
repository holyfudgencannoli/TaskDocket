from flask import Blueprint, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt, JWTManager
from flask import Flask, request, jsonify, send_file
from werkzeug.security import generate_password_hash, check_password_hash
from ..Utils.utility_routes import create_user, check_password, get_user_by_username
from datetime import timedelta

auth_bp = Blueprint('authentication', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.form

    username = data.get('username')
    email = data.get('email')
    phone = data.get('phone')
    isAdmin = data.get('is_admin')

    if isAdmin == 'admin123':
        is_admin = True
    else:
        is_admin = False

    password_hash = generate_password_hash(str(data.get('password')))

    try:
        create_user(username, password_hash, email, phone, is_admin)
    except ValueError:
        return jsonify({"msg": "User already exists"}), 400
    return jsonify({"msg": "User created"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = get_user_by_username(data['username'])
    if user and check_password(user, data['password']):
        if user['is_admin']:
            additional_claims = {"is_admin": True}
            access_token = create_access_token(
                identity=str(user['id']),
                additional_claims=additional_claims,
                expires_delta=timedelta(hours=1)
            )
        access_token = create_access_token(identity=str(user['id']), expires_delta=timedelta(hours=1))

        user_data = {"id": user["id"], "username": user["username"]}
        return jsonify({'access_token': access_token, 'user': user_data})
    return jsonify({"msg": "Bad username or password"}), 401

BLACKLIST = set()


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    BLACKLIST.add(jti)
    return jsonify(msg="Successfully logged out"), 200
