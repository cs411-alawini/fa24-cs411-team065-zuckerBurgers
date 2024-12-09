from app import db

class Venue(db.Model):
    __tablename__ = 'Venues'

    VenueID = db.Column(db.Integer, primary_key=True)
    ManagerID = db.Column(db.Integer, db.ForeignKey('Users.UserID'), nullable=False)
    VenueName = db.Column(db.String(100), nullable=False)
    Address = db.Column(db.String(500), nullable=False)
    MaxCapacity = db.Column(db.Integer, nullable=False)

    manager = db.relationship('User', backref='managed_venues', foreign_keys=[ManagerID])

    def __repr__(self):
        return f'<Venue {self.VenueName}>'
