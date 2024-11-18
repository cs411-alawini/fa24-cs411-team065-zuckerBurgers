from app import db

class ServiceBundle(db.Model):
    __tablename__ = 'ServiceBundles'

    BundleID = db.Column(db.Integer, primary_key=True)
    BundlePrice = db.Column(db.Numeric(10, 2), nullable=False)

    def __repr__(self):
        return f'<ServiceBundle {self.BundleID}>'
