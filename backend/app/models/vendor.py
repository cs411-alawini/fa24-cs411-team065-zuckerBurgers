from app import db

class Vendor(db.Model):
    __tablename__ = 'Vendors'

    VendorID = db.Column(db.Integer, primary_key=True)
    VendorName = db.Column(db.String(100), nullable=False)
    ServiceCategory = db.Column(db.String(50), nullable=False)
    Description = db.Column(db.String(500), nullable=True)
    BasePrice = db.Column(db.Numeric(10, 2), nullable=False)

    def __repr__(self):
        return f'<Vendor {self.VendorName}>'
