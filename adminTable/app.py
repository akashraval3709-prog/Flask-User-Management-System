from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError, OperationalError

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] ="mysql://root:@localhost/user_management"
app.config['SQLALCHEMY_TREACK_MODIFICATION'] =False
db=SQLAlchemy(app)

app.secret_key = 'my-key' 

class admin_tb(db.Model):
     id = db.Column(db.Integer,primary_key=True)
     Admin_name = db.Column(db.String(20), nullable=False)
     Email = db.Column(db.String(35),nullable=False,unique=True)
     Password = db.Column(db.String(255),nullable=False)
    #  ragisterDate = db.Column(db.Date ,nullable=False)
with app.app_context():
    db.create_all()

@app.route('/',methods=['GET', 'POST'])

def adminRegister():
    
    if request.method == 'POST':
        #registration logic
        fullname = request.form.get("name")
        email =request.form.get("email")
        password = request.form.get("pass")
        
       
        if fullname == "":
            flash("Missing Full Name","error")
        elif email == '':
            flash('Missing Email Address','error')
        elif password =='':
            flash('Missing Password','error')
        elif len(password) <= 8:
            flash('Password must be at least 8 characters long.', 'error')
        elif not '@' in email:
            flash('Please enter a valid email address. Missing @', 'warning')
        
        else:
            
            try:
                
                old_user =  admin_tb.query.filter_by(Email = email).first()
                print(old_user)
                if old_user == None:
                    hashedPass = generate_password_hash(password)
        
                    new_user =admin_tb( Admin_name = fullname , Email = email ,Password = hashedPass)
                    db.session.add(new_user)
                    db.session.commit()
                    flash('Account created successfully!,Please login', 'success')
                    return redirect(url_for('login'))
                else:
                    flash('User all ready exists', 'error')
                
            except OperationalError:
                flash('Database Connection Failed','error')
            except Exception as e:
                db.session.rollback()
                flash('Something Went Wrong. Please Try Again Later','error')
                print(e)
            
    return render_template('adminRegister.html')


if __name__ == '__main__':
    app.run(debug=True)