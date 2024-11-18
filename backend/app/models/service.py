from app import db

class Service(db.Model):
    __tablename__ = 'Services'

    ServiceID = db.Column(db.Integer, primary_key=True)
    VendorID = db.Column(db.Integer, db.ForeignKey('Vendors.VendorID'), nullable=True)
    BundleID = db.Column(db.Integer, db.ForeignKey('ServiceBundles.BundleID'), nullable=True)
    ServiceName = db.Column(db.String(100), nullable=False)
    Description = db.Column(db.String(500), nullable=True)
    Price = db.Column(db.Numeric(10, 2), nullable=False)

    vendor = db.relationship('Vendor', backref='services', foreign_keys=[VendorID])
    bundle = db.relationship('ServiceBundle', backref='services', foreign_keys=[BundleID])

    def __repr__(self):
        return f'<Service {self.ServiceName}>'
