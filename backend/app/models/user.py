from app import db

class User(db.Model):
    __tablename__ = 'Users'

    UserID = db.Column(db.Integer, primary_key=True)
    Username = db.Column(db.String(50), nullable=False)
    Email = db.Column(db.String(100), unique=True, nullable=False)
    PhoneNumber = db.Column(db.String(20), nullable=True)
    UserType = db.Column(db.Enum('Organizer', 'Manager', name='user_types'), nullable=False)

    def __repr__(self):
        return f'<User {self.Username}>'
