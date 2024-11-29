from flask import Blueprint, request, jsonify
from app.models.user import User
from app.models.vendor import Vendor
from app.models.venue import Venue
from app import db
import logging
from sqlalchemy import text

# Set up basic logging
logging.basicConfig(level=logging.DEBUG)

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

@bp.route('/vendors', methods=['GET'])
def get_vendors():
    try:
        # Fetch all vendors
        vendors = Vendor.query.all()
        if not vendors:
            return jsonify({'message': 'No vendors found'}), 404

        # Format data for response
        vendor_list = [
            {
                'id': vendor.VendorID,
                'name': vendor.VendorName,
                'service_category': vendor.ServiceCategory,
                'description': vendor.Description,
                'base_price': float(vendor.BasePrice),
            }
            for vendor in vendors
        ]

        return jsonify(vendor_list), 200

    except SQLAlchemyError as e:
        return jsonify({'message': 'An error occurred while fetching vendors'}), 500

@bp.route('/venues', methods=['GET'])
def get_venues():
    try:
        # Fetch all venues from the database
        # venues = Venue.query.all()

        result = db.session.execute(text("SELECT * FROM Venues"))
        venues = result.fetchall()
        if not venues:
            return jsonify({'message': 'No venues found'}), 404

        # Format data for the response
        venue_list = [
            {
                'id': venue.VenueID,
                'manager_id': venue.ManagerID,
                'name': venue.VenueName,
                'address': venue.Address,
                'max_capacity': venue.MaxCapacity,
            }
            for venue in venues
        ]

        return jsonify(venue_list), 200

    except SQLAlchemyError as e:
        return jsonify({'message': 'An error occurred while fetching venues'}), 500


@bp.route('/venues/search', methods=['GET'])
def search_venues():
    try:
        # Extract query parameters
        name = request.args.get('name', None)  # Venue name
        location = request.args.get('location', None)  # Venue location
        min_price = request.args.get('min_price', None)  # Minimum price
        max_price = request.args.get('max_price', None)  # Maximum price

        # Start building the query
        query = Venue.query

        # Add filters based on available parameters
        if name:
            query = query.filter(Venue.VenueName.ilike(f'%{name}%'))  # Case-insensitive match
        if location:
            query = query.filter(Venue.Address.ilike(f'%{location}%'))
        if min_price:
            query = query.filter(Venue.MaxCapacity >= int(min_price))  # Example: using capacity as a proxy for price
        if max_price:
            query = query.filter(Venue.MaxCapacity <= int(max_price))  # Example: using capacity as a proxy for price

        # Execute the query
        results = query.all()

        if not results:
            return jsonify({'message': 'No venues found matching your criteria'}), 404

        # Format response
        venues = [
            {
                'id': venue.VenueID,
                'name': venue.VenueName,
                'address': venue.Address,
                'max_capacity': venue.MaxCapacity,
            }
            for venue in results
        ]

        return jsonify(venues), 200

    except SQLAlchemyError as e:
        return jsonify({'message': 'An error occurred while fetching venues'}), 500

import logging
from flask import request, jsonify
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy import text

# Set up basic logging
logging.basicConfig(level=logging.DEBUG)

from sqlalchemy import func

@bp.route('/venues/add', methods=['POST'])
def add_venue():
    try:
        # Parse the input JSON request
        data = request.get_json()
        logging.debug(f"Received data: {data}")

        # Required fields
        required_fields = ['manager_id', 'name', 'address', 'max_capacity']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            logging.error(f"Missing fields: {', '.join(missing_fields)}")
            return jsonify({'message': f'Missing fields: {", ".join(missing_fields)}'}), 400

        # Validate the required fields
        manager_id = data.get('manager_id')
        name = data.get('name')
        address = data.get('address')
        max_capacity = data.get('max_capacity')

        logging.debug(f"Manager ID: {manager_id}, Name: {name}, Address: {address}, Max Capacity: {max_capacity}")

        if not isinstance(max_capacity, int) or max_capacity <= 0:
            logging.error("Invalid max capacity value")
            return jsonify({'message': 'Max capacity must be a positive integer'}), 400

        # Get the current maximum VenueID from the Venues table
        max_venue_id = db.session.query(func.max(Venue.VenueID)).scalar()

        # If there's no venue yet, start with VenueID = 4000
        new_venue_id = max_venue_id + 1 if max_venue_id else 4000

        logging.debug(f"Generated VenueID: {new_venue_id}")

        # Insert the new venue into the database with the generated VenueID
        query = text("""
            INSERT INTO Venues (VenueID, ManagerID, VenueName, Address, MaxCapacity)
            VALUES (:venue_id, :manager_id, :venue_name, :address, :max_capacity)
        """)

        logging.debug(f"Executing query with: venue_id={new_venue_id}, manager_id={manager_id}, venue_name={name}, address={address}, max_capacity={max_capacity}")

        # Execute the query
        db.session.execute(query, {
            'venue_id': new_venue_id,
            'manager_id': manager_id,
            'venue_name': name,
            'address': address,
            'max_capacity': max_capacity
        })
        db.session.commit()

        logging.info("Venue added successfully")
        return jsonify({'message': 'Venue added successfully', 'venue_id': new_venue_id}), 201

    except IntegrityError as e:
        db.session.rollback()
        logging.error(f"IntegrityError: {str(e)}")
        return jsonify({'message': 'Invalid data or duplicate venue entry'}), 409
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f"SQLAlchemyError: {str(e)}")
        return jsonify({'message': 'An error occurred while adding the venue'}), 500
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred'}), 500


@bp.route('/venues/<int:venue_id>', methods=['GET'])
def get_venue(venue_id):
    try:
        venue = Venue.query.filter_by(VenueID=venue_id).first()

        if not venue:
            logging.error(f"Venue with ID {venue_id} not found.")
            return jsonify({'message': f'Venue with ID {venue_id} not found.'}), 404

        venue_data = {
            'venue_id': venue.VenueID,
            'manager_id': venue.ManagerID,
            'venue_name': venue.VenueName,
            'address': venue.Address,
            'max_capacity': venue.MaxCapacity
        }

        logging.debug(f"Returning venue details: {venue_data}")
        return jsonify({'message': 'Venue found', 'venue': venue_data}), 200

    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred'}), 500

@bp.route('/venues/<int:venue_id>/edit', methods=['POST'])
def edit_venue(venue_id):
    try:
        # Parse the input JSON request
        data = request.get_json()
        logging.debug(f"Received data for venue update: {data}")

        # Required fields for updating a venue
        required_fields = ['manager_id', 'name', 'address', 'max_capacity']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            logging.error(f"Missing fields: {', '.join(missing_fields)}")
            return jsonify({'message': f'Missing fields: {", ".join(missing_fields)}'}), 400

        # Validate the input data
        manager_id = data.get('manager_id')
        name = data.get('name')
        address = data.get('address')
        max_capacity = data.get('max_capacity')

        if not isinstance(max_capacity, int) or max_capacity <= 0:
            logging.error("Invalid max capacity value")
            return jsonify({'message': 'Max capacity must be a positive integer'}), 400

        # Perform the update using raw SQL
        update_query = text("""
            UPDATE Venues
            SET ManagerID = :manager_id,
                VenueName = :name,
                Address = :address,
                MaxCapacity = :max_capacity
            WHERE VenueID = :venue_id
        """)

        result = db.session.execute(update_query, {
            'manager_id': manager_id,
            'name': name,
            'address': address,
            'max_capacity': max_capacity,
            'venue_id': venue_id
        })

        # Check if any row was updated
        if result.rowcount == 0:
            logging.error(f"Venue with ID {venue_id} not found.")
            return jsonify({'message': f'Venue with ID {venue_id} not found.'}), 404

        # Commit the changes to the database
        db.session.commit()

        logging.info(f"Venue with ID {venue_id} updated successfully.")
        return jsonify({'message': 'Venue updated successfully'}), 200

    except IntegrityError as e:
        db.session.rollback()
        logging.error(f"IntegrityError: {str(e)}")
        return jsonify({'message': 'Invalid data or conflict in updating venue'}), 409
    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f"SQLAlchemyError: {str(e)}")
        return jsonify({'message': 'An error occurred while updating the venue'}), 500
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred'}), 500