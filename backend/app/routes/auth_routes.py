from flask import Blueprint, request, jsonify
from app.models.user import User
from app.models.vendor import Vendor
from app.models.venue import Venue
from app import db
import logging

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


@bp.route('/venues/hot', methods=['GET'])
def get_hot_venues():
    try:
        # Raw SQL query for fetching hot venues with all relevant details
        sql_query = """
        SELECT 
            v.VenueID,
            v.ManagerID,
            v.VenueName,
            v.Address,
            v.MaxCapacity,
            AVG(r.Rating) AS AvgRating,
            COUNT(r.ReviewID) AS ReviewCount,
            SUM(s.Price) AS TotalServiceCost,
            (SELECT COUNT(*) 
             FROM Events e 
             JOIN Users u ON e.OrganizerID = u.UserID
             WHERE e.VenueID = v.VenueID 
               AND e.EventDate >= '2024-01-01'
            ) AS RecentOrganizerEvents
        FROM 
            Venues v
        JOIN 
            Reviews r ON v.VenueID = r.VenueID
        JOIN 
            Services s ON s.BundleID IN (
                SELECT BundleID 
                FROM ServiceBundles
                WHERE BundlePrice > 50
            )
        WHERE 
            v.MaxCapacity > 50
            AND r.ReviewDate >= '2024-09-10'
            AND r.Rating >= 2
        GROUP BY 
            v.VenueID, v.ManagerID, v.VenueName, v.Address, v.MaxCapacity
        HAVING 
            AVG(r.Rating) >= 2.0
            AND RecentOrganizerEvents >= 2
            AND TotalServiceCost > 100
        ORDER BY 
            AvgRating DESC, 
            ReviewCount DESC
        LIMIT 15;
        """

        # Execute the raw SQL query
        result = db.session.execute(text(sql_query))
        venues = result.fetchall()

        # Check if any venues were returned
        if not venues:
            return jsonify({'message': 'No hot venues found'}), 404

        # Format data for the response
        hot_venue_list = [
            {
                'id': venue[0],  # VenueID
                'manager_id': venue[1],  # ManagerID
                'name': venue[2],  # VenueName
                'address': venue[3],  # Address
                'max_capacity': venue[4],  # MaxCapacity
                'average_rating': float(venue[5]),  # AvgRating
                'review_count': int(venue[6]),  # ReviewCount
                'total_service_cost': float(venue[7]),  # TotalServiceCost
                'recent_organizer_events': int(venue[8]),  # RecentOrganizerEvents
            }
            for venue in venues
        ]

        return jsonify(hot_venue_list), 200

    except SQLAlchemyError as e:
        # Log error for better debugging (add logging if needed)
        logging.error(f'An error occurred while fetching hot venues: {str(e)}')
        return jsonify({'message': 'An error occurred while fetching hot venues', 'error': str(e)}), 500

@bp.route('/venues/upcoming-events', methods=['GET'])
def get_venues_with_upcoming_events():
    try:
        # Raw SQL query selecting only required fields
        sql_query = """
        SELECT 
            v.VenueID AS id,          -- Venue ID
            v.ManagerID AS manager_id, -- Manager ID
            v.VenueName AS name,      -- Venue Name
            v.Address AS address,     -- Venue Address
            v.MaxCapacity AS max_capacity -- Venue Capacity
        FROM 
            Venues v
        JOIN 
            Events e ON v.VenueID = e.VenueID
        WHERE 
            v.MaxCapacity > 100  -- venues with capacity greater than 100
            AND e.EventDate >= '2024-09-17'  -- Filter for upcoming events
        GROUP BY 
            v.VenueID, v.ManagerID, v.VenueName, v.Address, v.MaxCapacity
        ORDER BY 
            COUNT(e.EventID) DESC  -- Order by total events
        LIMIT 15;
        """

        # Execute the raw SQL query
        result = db.session.execute(text(sql_query))
        venues = result.fetchall()

        # Check if any venues were returned
        if not venues:
            return jsonify({'message': 'No venues with upcoming events found'}), 404

        # Format data for the response
        upcoming_event_venue_list = [
            {
                'id': venue.id,             # Venue ID
                'manager_id': venue.manager_id,  # Manager ID
                'name': venue.name,         # Venue Name
                'address': venue.address,   # Venue Address
                'max_capacity': venue.max_capacity,  # Max Capacity
            }
            for venue in venues
        ]

        return jsonify(upcoming_event_venue_list), 200

    except SQLAlchemyError as e:
        logging.error(f'An error occurred while fetching venues with upcoming events: {str(e)}')
        return jsonify({'message': 'An error occurred while fetching venues with upcoming events', 'error': str(e)}), 500

@bp.route('/users/addid', methods=['POST'])
def add_user():
    try:
        print("Route triggered!")  # Add a print statement as a minimal log
        logging.debug("Debug: Route hit!")
        data = request.get_json()
        logging.debug(f"Received data: {data}")

        # Required fields check
        required_fields = ['clerk_id', 'username', 'email', 'phone_number', 'user_type']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({'message': f'Missing fields: {", ".join(missing_fields)}'}), 400

        # Check if user exists by email
        check_query = text("""
            SELECT UserID, Email FROM Users 
            WHERE Email = :email
        """)
        logging.debug("Check Query is about to hit!")
        result = db.session.execute(check_query, {
            'email': data['email']
        }).fetchone()
        logging.debug(f"Received data: {result}")

        if result:
            user_id, email = result  # Unpack the result tuple
            return jsonify({
                'message': 'Email already exists',
                'user_id': user_id,
                'email': email,
                'clerk_id': data['clerk_id']
            }), 409

        # Generate new UserID (get max UserID and add 1)
        max_id_query = text("SELECT MAX(UserID) as max_id FROM Users")
        max_id_result = db.session.execute(max_id_query).fetchone()
        new_user_id = (max_id_result.max_id or 1000) + 1  # Start from 1001 if table is empty

        # Validate user type
        if data['user_type'] not in ['Organizer', 'Manager']:
            return jsonify({'message': 'Invalid user type'}), 400

        # Insert new user with generated numeric ID
        insert_query = text("""
            INSERT INTO Users (UserID, Username, Email, PhoneNumber, UserType)
            VALUES (:user_id, :username, :email, :phone_number, :user_type)
        """)

        db.session.execute(insert_query, {
            'user_id': new_user_id,  # Use generated numeric ID
            'username': data['username'],
            'email': data['email'],
            'phone_number': data['phone_number'],
            'user_type': data['user_type']
        })
        db.session.commit()

        return jsonify({
            'message': 'User added successfully',
            'user_id': new_user_id,
            'clerk_id': data['clerk_id']
        }), 201

    except IntegrityError as e:
        db.session.rollback()
        logging.error(f"IntegrityError: {str(e)}")
        return jsonify({'message': 'Database integrity error'}), 409
    except Exception as e:
        db.session.rollback()
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({'message': str(e)}), 500

@bp.route('/venues/search/vendors', methods=['GET'])
def search_suitable_vendors():
    try:
        # Extracting query parameters from the request
        max_base_price = request.args.get('budget', type=float)
        desired_service_category = request.args.get('category', type=str)

        # Check if both parameters are provided
        if max_base_price is None or desired_service_category is None:
            return jsonify({'message': 'Both category and budget must be provided'}), 400

        # SQL query to call the stored procedure
        sql_query = """
        CALL GetSuitableVendors(:max_base_price, :desired_service_category);
        """

        # Execute the query with parameters
        result = db.session.execute(text(sql_query), {'max_base_price': max_base_price, 'desired_service_category': desired_service_category})
        vendors = result.fetchall()

        # Check if any vendors were found
        if not vendors:
            return jsonify({'message': 'No suitable vendors found for the given filters'}), 404

        # Format the response
        vendor_list = [
            {
                'vendor_name': vendor.VendorName,
                'service_category': vendor.ServiceCategory,
                'base_price': float(vendor.BasePrice),
                'description': vendor.Description,
            }
            for vendor in vendors
        ]

        return jsonify(vendor_list), 200

    except SQLAlchemyError as e:
        logging.error(f'An error occurred while searching for suitable vendors: {str(e)}')
        return jsonify({'message': 'An error occurred while searching for suitable vendors', 'error': str(e)}), 500

@bp.route('/venues/<int:manager_id>/all', methods=['GET'])
def get_venues_by_manager(manager_id):
    try:
        # Fetch all venues for the given manager_id
        query = text("""
            SELECT VenueID, ManagerID, VenueName, Address, MaxCapacity
            FROM Venues
            WHERE ManagerID = :manager_id
        """)
        result = db.session.execute(query, {'manager_id': manager_id}).fetchall()

        # If no venues found, return an empty list
        if not result:
            return jsonify({'venues': []}), 200

        # Format the result as a list of dictionaries
        venues = [
            {
                'id': row.VenueID,
                'manager_id': row.ManagerID,
                'name': row.VenueName,
                'address': row.Address,
                'max_capacity': row.MaxCapacity
            }
            for row in result
        ]

        return jsonify({'venues': venues}), 200

    except SQLAlchemyError as e:
        logging.error(f"SQLAlchemyError: {str(e)}")
        return jsonify({'message': 'An error occurred while fetching venues'}), 500
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred'}), 500

@bp.route('/venues/<int:venue_id>/delete', methods=['DELETE'])
def delete_venue(venue_id):
    try:
        # Attempt to delete the venue by ID
        delete_query = text("""
            DELETE FROM Venues
            WHERE VenueID = :venue_id
        """)

        result = db.session.execute(delete_query, {'venue_id': venue_id})

        # Check if any row was deleted
        if result.rowcount == 0:
            logging.error(f"Venue with ID {venue_id} not found.")
            return jsonify({'message': f'Venue with ID {venue_id} not found.'}), 404

        # Commit the deletion to the database
        db.session.commit()

        logging.info(f"Venue with ID {venue_id} deleted successfully.")
        return jsonify({'message': 'Venue deleted successfully'}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f"SQLAlchemyError: {str(e)}")
        return jsonify({'message': 'An error occurred while deleting the venue'}), 500
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred'}), 500
    
# @bp.route('/events/add', methods=['POST'])
# def add_new_event():
#     try:
#         # Extract and validate input from JSON request
#         event_id = request.json.get('event_id')
#         event_name = request.json.get('event_name')
#         venue_id = request.json.get('venue_id')
#         organizer_id = request.json.get('organizer_id')
#         event_type = request.json.get('event_type')
#         event_date = request.json.get('event_date')
#         budget = request.json.get('budget')
#         description = request.json.get('description')
#
#         # Check for missing fields
#         if not all([event_id, event_name, venue_id, organizer_id, event_type, event_date, budget, description]):
#             return jsonify({'message': 'All fields (event_id, event_name, venue_id, organizer_id, event_type, event_date, budget, description) are required'}), 400
#
#         # Typecasting and additional validation
#         try:
#             event_id = int(event_id)
#             venue_id = int(venue_id)
#             organizer_id = int(organizer_id)
#             budget = float(budget)
#         except ValueError:
#             return jsonify({'message': 'Invalid data types for event_id, venue_id, organizer_id, or budget. Ensure they are correct.'}), 400
#
#         # Prepare SQL query
#         sql_query = """
#         CALL AddNewEvent(:event_id, :event_name, :venue_id, :organizer_id, :event_type, :event_date, :budget, :description);
#         """
#
#         # Execute the stored procedure
#         db.session.execute(
#             text(sql_query),
#             {
#                 'event_id': event_id,
#                 'event_name': event_name,
#                 'venue_id': venue_id,
#                 'organizer_id': organizer_id,
#                 'event_type': event_type,
#                 'event_date': event_date,
#                 'budget': budget,
#                 'description': description
#             }
#         )
#
#         # Commit the transaction
#         db.session.commit()
#
#         return jsonify({'message': 'Event added successfully'}), 201
#
#     except SQLAlchemyError as e:
#         # Log the error for debugging purposes
#         logging.error(f'An error occurred while adding the event: {str(e)}')
#
#         # Return a meaningful error response
#         return jsonify({'message': 'An error occurred while adding the event', 'error': str(e)}), 500
#
#     except Exception as e:
#         # Catch any unexpected errors
#         logging.error(f'Unexpected error: {str(e)}')
#         return jsonify({'message': 'An unexpected error occurred', 'error': str(e)}), 500

@bp.route('/events/add', methods=['POST'])
def add_new_event():
    try:
        # Extract and validate input from JSON request
        event_id = int(request.json.get('event_id'))
        event_name = str(request.json.get('event_name'))
        venue_id = int(request.json.get('venue_id'))
        organizer_id = int(request.json.get('organizer_id'))
        event_type = str(request.json.get('event_type'))
        event_date = str(request.json.get('event_date'))  # Ensure date is a string in 'YYYY-MM-DD'
        budget = float(request.json.get('budget'))
        description = str(request.json.get('description'))

        # Check for missing or invalid fields
        if not all([event_id, event_name, venue_id, organizer_id, event_type, event_date, budget, description]):
            return jsonify({
                'message': 'All fields (event_id, event_name, venue_id, organizer_id, event_type, event_date, budget, description) are required.'
            }), 400

        # Call the stored procedure with the correct syntax
        sql_query = text("""
        CALL AddNewEvent(:event_id, :event_name, :venue_id, :organizer_id, :event_type, :event_date, :budget, :description);
        """)

        # Execute the stored procedure
        db.session.execute(
            sql_query,
            {
                'event_id': event_id,
                'event_name': event_name,
                'venue_id': venue_id,
                'organizer_id': organizer_id,
                'event_type': event_type,
                'event_date': event_date,
                'budget': budget,
                'description': description
            }
        )

        # Commit the transaction
        db.session.commit()

        return jsonify({'message': 'Event added successfully'}), 201

    except ValueError as ve:
        # Handle invalid input types
        logging.error(f"ValueError occurred: {str(ve)}")
        return jsonify({'message': 'Invalid input data type', 'error': str(ve)}), 400

    except SQLAlchemyError as e:
        # Log and return a meaningful error message for SQLAlchemy errors
        logging.error(f'An error occurred while adding the event: {str(e)}')
        return jsonify({'message': 'An error occurred while adding the event', 'error': str(e)}), 500

@bp.route('/users/<int:user_id>', methods=['GET'])
def get_user_contact_info(user_id):
    try:
        # Query to fetch the user details by UserID
        sql_query = text("""
        SELECT UserID, Username, Email, PhoneNumber
        FROM Users
        WHERE UserID = :user_id;
        """)

        # Execute the query
        result = db.session.execute(
            sql_query,
            {'user_id': user_id}
        ).fetchone()

        if result is None:
            return jsonify({'message': 'User not found'}), 404

        # Format the result as a dictionary
        user_data = {
            'UserID': result.UserID,
            'Username': result.Username,
            'Email': result.Email,
            'PhoneNumber': result.PhoneNumber
        }

        return jsonify(user_data), 200

    except SQLAlchemyError as e:
        # Log the error
        logging.error(f'An error occurred while fetching user contact info: {str(e)}')
        return jsonify({'message': 'An error occurred while fetching user contact info', 'error': str(e)}), 500

@bp.route('/vendors/search', methods=['GET'])
def search_vendors():
    try:
        # Extract query parameters
        name = request.args.get('name', None)  # Vendor name keyword
        category = request.args.get('category', None)  # Service category

        # Build the query
        query = Vendor.query

        # Apply filters
        if name:
            query = query.filter(Vendor.VendorName.ilike(f'%{name}%'))  # Case-insensitive match
        if category:
            query = query.filter(Vendor.ServiceCategory.ilike(f'%{category}%'))  # Case-insensitive match

        # Execute the query
        results = query.all()

        # Check if results are found
        if not results:
            return jsonify({'message': 'No vendors found matching your criteria'}), 404

        # Format the response
        vendors = [
            {
                'id': vendor.VendorID,
                'name': vendor.VendorName,
                'service_category': vendor.ServiceCategory,
                'description': vendor.Description,
                'base_price': float(vendor.BasePrice),
            }
            for vendor in results
        ]

        return jsonify({'message': 'Vendors found', 'vendors': vendors}), 200

    except SQLAlchemyError as e:
        logging.error(f"SQLAlchemyError: {str(e)}")
        return jsonify({'message': 'An error occurred while searching for vendors'}), 500
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred'}), 500