def define_user_class(db):
    class User(db.Model):
        username = db.Column(db.String(80), primary_key=True)
        score = db.Column(db.Integer, nullable=False)
        
        def __repr__(self):
            return '<User %r>' % self.username
    return User
    

