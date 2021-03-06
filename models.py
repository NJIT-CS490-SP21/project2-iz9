from app import db

class Users(db.Model):
    username = db.Column(db.String(80), primary_key=True)
    score = db.Column(db.Integer, nullable=False)
    
    def __repr__(self):
        return '<User %r>' % self.username
    

