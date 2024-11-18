from app import db

class Review(db.Model):
    __tablename__ = 'Reviews'

    ReviewID = db.Column(db.Integer, primary_key=True)
    ServiceID = db.Column(db.Integer, db.ForeignKey('Services.ServiceID'), nullable=True)
    VenueID = db.Column(db.Integer, db.ForeignKey('Venues.VenueID'), nullable=True)
    UserID = db.Column(db.Integer, db.ForeignKey('Users.UserID'), nullable=False)
    Rating = db.Column(db.Integer, nullable=False)
    Comment = db.Column(db.String(1000), nullable=True)
    ReviewDate = db.Column(db.Date, nullable=False)

    service = db.relationship('Service', backref='reviews', foreign_keys=[ServiceID])
    venue = db.relationship('Venue', backref='reviews', foreign_keys=[VenueID])
    user = db.relationship('User', backref='reviews', foreign_keys=[UserID])

    def __repr__(self):
        return f'<Review {self.ReviewID}>'
