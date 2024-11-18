from flask import Blueprint, request, jsonify
from app.models.user import User
from app import db
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.orm.exc import NoResultFound

bp = Blueprint('auth', __name__)

@bp.route('/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Validate input data
    required_fields = ['username', 'email', 'phone_number', 'user_type']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({'message': f'Missing fields: {", ".join(missing_fields)}'}), 400

    try:
        # Get the highest existing UserID and increment it
        highest_user = db.session.query(User).order_by(User.UserID.desc()).first()
        next_user_id = highest_user.UserID + 1 if highest_user else 1

        # Create the new user
        new_user = User(
            UserID=next_user_id,  # Assign a generated UserID
            Username=data.get('username'),
            Email=data.get('email'),
            PhoneNumber=data.get('phone_number'),
            UserType=data.get('user_type')
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User created successfully', 'user_id': new_user.UserID}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({'message': 'User with this email or phone number already exists'}), 409
    except SQLAlchemyError as e:
        db.session.rollback()  # Roll back in case of an error
        return jsonify({'message': 'An internal error occurred while creating the user'}), 500

@bp.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        if not users:
            return jsonify({'message': 'No users found'}), 404
        return jsonify([{'id': user.UserID, 'username': user.Username, 'email': user.Email} for user in users]), 200
    except SQLAlchemyError:
        return jsonify({'message': 'An internal error occurred while fetching users'}), 500

@bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200

    except SQLAlchemyError:
        db.session.rollback()
        return jsonify({'message': 'An internal error occurred while deleting the user'}), 500
