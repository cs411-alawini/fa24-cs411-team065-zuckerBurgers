from app.routes.auth_routes import bp as auth_bp
# In the future, add other blueprints like this:
# from app.routes.event_routes import bp as event_bp
# from app.routes.service_routes import bp as service_bp

blueprints = [auth_bp]
