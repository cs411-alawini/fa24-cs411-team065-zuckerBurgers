from app import db

class Event(db.Model):
    __tablename__ = 'Events'

    EventID = db.Column(db.Integer, primary_key=True)
    VenueID = db.Column(db.Integer, db.ForeignKey('Venues.VenueID'), nullable=False)
    OrganizerID = db.Column(db.Integer, db.ForeignKey('Users.UserID'), nullable=False)
    EventName = db.Column(db.String(100), nullable=False)
    EventType = db.Column(db.String(50), nullable=False)
    EventDate = db.Column(db.Date, nullable=False)
    Budget = db.Column(db.Numeric(10, 2), nullable=True)
    Description = db.Column(db.String(500), nullable=True)

    venue = db.relationship('Venue', backref='events', foreign_keys=[VenueID])
    organizer = db.relationship('User', backref='organized_events', foreign_keys=[OrganizerID])

    def __repr__(self):
        return f'<Event {self.EventName}>'
