from flask import Flask, render_template, request, redirect, url_for, flash, session
import json
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError, OperationalError
from datetime import timedelta,datetime
import pymysql

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:@localhost/user_management"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # fixed typo (was ...MODIFICATION)
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False

app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
# app.config['PERMANENT_SESSION_LIFETIME'] = 3600
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=5)
db = SQLAlchemy(app)
app.secret_key = 'my-secret_key'




class UserRegister(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Full_name = db.Column(db.String(20), nullable=False)
    Email = db.Column(db.String(35), nullable=False, unique=True)
    Password = db.Column(db.String(255), nullable=False)
    ragisterDate = db.Column(db.Date, nullable=False)

    # new column
    phone = db.Column(db.String(10), nullable=True)
    address = db.Column(db.String(255), nullable=True)


class admin_tb(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Admin_name = db.Column(db.String(20), nullable=False)
    Email = db.Column(db.String(35), nullable=False, unique=True)
    Password = db.Column(db.String(255), nullable=False)
    #  ragisterDate = db.Column(db.Date ,nullable=False)


class Product_tb(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_code = db.Column(db.String(20), unique=True, nullable=False)
    product_name = db.Column(db.String(30), nullable=False)
    price = db.Column(db.DECIMAL(10, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=False)


with app.app_context():
    db.create_all()


# User Registration

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # registration logic
        fullName = request.form.get("fullname")
        email = request.form.get("email")
        password = request.form.get("password")

       
        if not fullName:
            flash('Missing Fullname', 'error')
            
        elif len(fullName) > 20:
            flash('Full name cannot exceed 20 characters.', 'error')
        elif not email:
            flash('Missing Email Address', 'error')
        elif len(email) > 35:
            flash('Email address cannot exceed 35 characters.', 'error')
        elif not password:
            flash('Missing Password', 'error')
        elif len(password) < 8:
            flash('Password must be at least 8 characters long.', 'error')
        elif '@' not in email:
            flash('Please enter a valid email address. Missing @', 'warning')
        else:
            try:
                old_user = UserRegister.query.filter_by(Email=email).first()

                if old_user is None:
                    hashedPass = generate_password_hash(password)
                    date = datetime.date.today()

                    new_user = UserRegister(
                        Full_name=fullName,
                        Email=email,
                        Password=hashedPass,
                        ragisterDate=date
                    )
                    db.session.add(new_user)
                    db.session.commit()
                    flash('Account created successfully!,Please login', 'success')
                    return redirect(url_for('login'))
                else:
                    flash('User all ready exists', 'error')

            except IntegrityError:
                # covers the race condition where two requests pass the
                # "old_user is None" check at the same time
                db.session.rollback()
                flash('User all ready exists', 'error')
            except OperationalError:
                flash('Database Connection Failed', 'error')
            except Exception as e:
                db.session.rollback()
                flash('Something Went Wrong. Please Try Again Later', 'error')
                print(e)

    return render_template('register.html')


# User Login
@app.route('/')
@app.route('/login', methods=['GET', 'POST'])
def login():
    # Handle login logic
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        remember =request.form.get('remember')
        print(remember)
        if not email:
            flash('Missing Email Address', 'error')
        elif not password:
            flash('Missing Password', 'error')
        elif '@' not in email:
            flash('Please enter a valid email address. Missing @ .', 'warning')
        else:
            try:
               
                
                user = UserRegister.query.filter_by(Email=email).first()
                

               
                if user is not None and check_password_hash(user.Password, password):
                    session['user_name'] = user.Full_name
                    session['user_email'] = user.Email
                    session['is_logged_in'] = True
                    if remember is not None:
                        session.permanent=True
                      
                    else:
                        session.permanent=False
                        
                    return redirect(url_for('user_dashboard'))
                else:
                        flash('Invalid Email or Password.', 'error')
            except Exception as e:
                flash('Something Went Wrong. Please Try Again Later', 'error')
                print(e)

    return render_template('login.html')


# User Dashboard
@app.route('/user_dashboard', methods=['GET'])
def user_dashboard():
    print(session)
    print(session.permanent)
    print(datetime.now()) 
    print(session)
    if 'user_name' in session and 'is_logged_in' in session:
        email = session['user_email']
        user = UserRegister.query.filter_by(Email=email).first()
        return render_template(
            'user_dashboard.html',
            user=session['user_name'],
            email=session['user_email'],
            date=user.ragisterDate,
            phone=user.phone,
            address=user.address
        )

    return redirect(url_for('login'))



@app.route('/update-profile', methods=['POST'])
def update_profile():
    
    if 'user_name' not in session or 'is_logged_in' not in session:
        return redirect(url_for('login'))

    fullname = request.form.get('fullname')
    phone = request.form.get('phone')
    address = request.form.get('address')

    if not fullname:
        flash("Full name is required.", "error")
    elif len(fullname) < 2:
        flash("Full name must be at least 2 characters long.", "error")
    elif len(fullname) > 20:
        flash("Full name cannot exceed 20 characters.", "error")
    elif phone and (not phone.isdigit() or len(phone) > 10):
        flash("Phone number must be numeric and up to 10 digits.", "error")
    elif address and len(address) > 255:
        flash("Address cannot exceed 255 characters.", "error")
    else:
        try:
            user = UserRegister.query.filter_by(Email=session['user_email']).first()

            if user is not None:
               
                user.Full_name = fullname
                user.phone = phone
                user.address = address
                db.session.commit()

                session['user_name'] = fullname
                flash('Profile updated successfully!', 'success')
            else:
                flash('User not found.', 'error')
        except OperationalError:
            flash('Database Connection Failed', 'error')
        except Exception as e:
            db.session.rollback()
            flash('Something Went Wrong. Please Try Again Later', 'error')
            print(e)

    return redirect(url_for('user_dashboard'))



@app.route('/change-password', methods=['POST'])
def change_password():
   
    if 'user_name' not in session or 'is_logged_in' not in session:
        return redirect(url_for('login'))

    current = request.form.get('current_password')
    new = request.form.get('new_password')
    confirm = request.form.get('confirm_password')

    if not current or not new or not confirm:
        flash('Please fill out all password fields.', 'error')
        return redirect(url_for('user_dashboard'))

    if len(new) < 8:
        flash('New password must be at least 8 characters long.', 'error')
        return redirect(url_for('user_dashboard'))

    if new != confirm:
        flash('Passwords do not match!', 'error')
        return redirect(url_for('user_dashboard'))

    
    try:
        user = UserRegister.query.filter_by(Email=session['user_email']).first()

        if user is None:
            flash('User not found.', 'error')
        elif not check_password_hash(user.Password, current):
            flash('Current password is incorrect.', 'error')
        else:
            user.Password = generate_password_hash(new)
            db.session.commit()
            flash('Password changed successfully!', 'success')
    except OperationalError:
        flash('Database Connection Failed', 'error')
    except Exception as e:
        db.session.rollback()
        flash('Something Went Wrong. Please Try Again Later', 'error')
        print(e)

    return redirect(url_for('user_dashboard'))
    
   


    return redirect(url_for('user_dashboard'))


# Admin Login
@app.route('/admin-login', methods=['GET', 'POST'])
def admin_login():
    # Handle login logic
    

    if request.method == 'POST':
        email = request.form.get('username')
        password = request.form.get('password')

        if not email:
            flash('Missing Email Address', 'error')
        elif not password:
            flash('Missing Password', 'error')
        elif '@' not in email:
            flash('Please enter a valid email address. Missing @ .', 'warning')
        else:
            try:
                admin = admin_tb.query.filter_by(Email=email).first()
                # BUG FIX: same dead/misplaced flash issue as user login - made explicit.
                if admin is not None and check_password_hash(admin.Password, password):
                    session['admin_name'] = admin.Admin_name
                    session['admin_email'] = admin.Email
                    session['admin_is_logged_in'] = True
                    return redirect(url_for('dashboard'))
                else:
                    flash('Admin access denied!', 'error')
            except Exception as e:
                flash('Something Went Wrong. Please Try Again Later', 'error')
                print(e)

    return render_template('admin_login.html')


# Admin Dashboard
@app.route('/dashboard', methods=['GET'])
def dashboard():
    if "admin_is_logged_in" not in  session:
       return  redirect(url_for('admin_login'))
    if 'admin_name' in session and 'admin_is_logged_in' in session:
        productList = Product_tb.query.all()
        return render_template('dashboard.html', name=session['admin_name'], products=productList)
    
    return redirect(url_for('admin_login'))


# Add Product
@app.route('/add-product', methods=['GET', 'POST'])
def add_product():
    
    if 'admin_name' not in session or 'admin_is_logged_in' not in session:
        return redirect(url_for('admin_login'))

    if request.method == 'POST':
        productCode = request.form.get('product_code')
        productName = request.form.get('product_name')
        price = request.form.get('price')
        stock = request.form.get('stock')

        if not productCode or not productName or not price or not stock:
            flash("Please fill out the entire form before submitting", "error")
            return redirect(url_for("dashboard"))

       
        try:
            price = float(price)
            stock = int(stock)
        except ValueError:
            flash("Price must be a number and stock must be a whole number.", "error")
            return redirect(url_for('dashboard'))

       
        try:
            product_data = Product_tb.query.filter_by(product_code=productCode).first()
            if product_data is None:
                newProduct = Product_tb(
                    product_code=productCode,
                    product_name=productName,
                    price=price,
                    stock=stock
                )
                db.session.add(newProduct)
                db.session.commit()
                flash('Product added successfully!', 'success')
            else:
                flash('Product already exist!', 'error')
        except IntegrityError:
            db.session.rollback()
            flash('Product already exist!', 'error')
        except OperationalError:
            flash('Database Connection Failed', 'error')
        except Exception as e:
            db.session.rollback()
            flash('Something Went Wrong. Please Try Again Later', 'error')
            print(e)

    return redirect(url_for('dashboard'))


# Delete Product
@app.route('/delete-product/<int:product_id>', methods=['POST'])
def delete_product(product_id):
   
    if 'admin_name' not in session or 'admin_is_logged_in' not in session:
        return redirect(url_for('admin_login'))

    # Handle product deletion
    try:
        product = Product_tb.query.filter_by(id=product_id).first()
        if product is not None:
            db.session.delete(product)
            db.session.commit()
            flash('Product deleted!', 'success')
        else:
            
            flash('Product not found.', 'error')
    except OperationalError:
        flash('Database Connection Failed', 'error')
    except Exception as e:
        db.session.rollback()
        flash('Something Went Wrong. Please Try Again Later', 'error')
        print(e)

    
    return redirect(url_for('dashboard'))


# Edit Product (optional, referenced in dashboard)
@app.route('/edit-product/<int:product_id>', methods=['GET', 'POST'])
def edit_product(product_id):
   
    if 'admin_name' not in session or 'admin_is_logged_in' not in session:
        return redirect(url_for('admin_login'))

    # Handle product editing
    if request.method == 'POST':
        code = request.form.get('product_code')
        name = request.form.get('product_name')
        price = request.form.get('price')
        stock = request.form.get('stock')

        if not code or not name or not price or not stock:
            flash("All fields are required.", "error")
           
            return redirect(url_for('dashboard'))

        
        try:
            price = float(price)
            stock = int(stock)
        except ValueError:
            flash("Price must be a number and stock must be a whole number.", "error")
            return redirect(url_for('dashboard'))

        try:
            product = Product_tb.query.filter_by(id=product_id).first()
            if product is not None:
               
                existing = Product_tb.query.filter(
                    Product_tb.product_code == code,
                    Product_tb.id != product_id
                ).first()

                if existing is not None:
                    flash('Another product already uses that product code!', 'error')
                else:
                    product.product_code = code
                    product.product_name = name
                    product.price = price
                    product.stock = stock
                    db.session.commit()
                    flash('Product edit successfully!', 'success')
            else:
                
                flash('Product not found.', 'error')
        except IntegrityError:
            db.session.rollback()
            flash('Another product already uses that product code!', 'error')
        except OperationalError:
            flash('Database Connection Failed', 'error')
        except Exception as e:
            db.session.rollback()
            flash('Something Went Wrong. Please Try Again Later', 'error')
            print(e)

        return redirect(url_for('dashboard'))

   
    return redirect(url_for('dashboard'))


# Logout
@app.route('/logout', methods=['GET'])
def logout():
    # Handle logout
    if "is_logged_in" in session:
        session.clear()

    return redirect(url_for('login'))


@app.route('/admin_logout', methods=['GET'])
def admin_logout():
    if 'admin_is_logged_in' in session:
        session.clear()
    return redirect(url_for('admin_login'))


if __name__ == "__main__":
    app.run(debug=True)
