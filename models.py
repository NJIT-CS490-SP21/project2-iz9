from app import DB

class Users(DB.Model):
    username = DB.Column(DB.String(80), primary_key=True)
    score = DB.Column(DB.Integer, nullable=False)
    
    def __repr__(self):
        return '<User %r>' % self.username
    

