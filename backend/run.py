from flask import Flask
from app import create_app, db

app: Flask = create_app()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # This will create the db.sqlite3 file if it doesn't exist
    app.run(debug=True)
