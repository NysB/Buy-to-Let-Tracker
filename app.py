# import dependencies
import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, MetaData

from flask import Flask, jsonify, render_template, request
from flask_cors import CORS, cross_origin


# Database Setup

engine = create_engine("sqlite:///Dataset/real_estate_data.sqlite")
Base = automap_base()
Base.prepare(engine, reflect=True)

PropertyEnriched = Base.classes.propertyEnriched


# initialzie the flask app
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# define the app 

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/data')
def get_data():
    
    session = Session(engine)

    results = session.query(
        PropertyEnriched.propertyCode,
        PropertyEnriched.propertyType,
        PropertyEnriched.address,
        PropertyEnriched.municipality,
        PropertyEnriched.country,
        PropertyEnriched.lat,
        PropertyEnriched.lon,
        PropertyEnriched.bathrooms,
        PropertyEnriched.bedrooms,
        PropertyEnriched.size,
        PropertyEnriched.status,
        PropertyEnriched.floor,
        PropertyEnriched.hasLift,
        PropertyEnriched.newDevelopment,
        PropertyEnriched.epc,
        PropertyEnriched.price,
        PropertyEnriched.predictedRentPrice,
        PropertyEnriched.url,
        PropertyEnriched.image
    ).filter(
        PropertyEnriched.predictedRentPrice.isnot(None)
    ).all()

    session.close()

    results_list = []

    for row in results:
        properties_dict = {
            "propertyCode": row[0],
            "propertyType": row[1],
            "address": row[2],
            "municipality": row[3],
            "country": row[4],
            "lat": row[5],
            "lon": row[6],
            "bathrooms": row[7],
            "bedrooms": row[8],
            "size": row[9],
            "status": row[10],
            "floor": row[11],
            "hasLift": row[12],
            "newDevelopment": row[13],
            "epc": row[14],
            "price": row[15],
            "predictedRentPrice": row[16],
            "URL": row[17],
            "image": row[18]
        }

        results_list.append(properties_dict)
    
    return jsonify(results_list)


@app.route('/start')
def start():

    ## Input variables
    minimum_purchase_price_input = 100000
    maximum_purchase_price_input = 200000

    ## Filter on data

    session = Session(engine)

    results = session.query(
        PropertyEnriched.propertyCode,
        PropertyEnriched.propertyType,
        PropertyEnriched.address,
        PropertyEnriched.municipality,
        PropertyEnriched.country,
        PropertyEnriched.lat,
        PropertyEnriched.lon,
        PropertyEnriched.bathrooms,
        PropertyEnriched.bedrooms,
        PropertyEnriched.size,
        PropertyEnriched.status,
        PropertyEnriched.floor,
        PropertyEnriched.hasLift,
        PropertyEnriched.newDevelopment,
        PropertyEnriched.epc,
        PropertyEnriched.price,
        PropertyEnriched.predictedRentPrice,
        PropertyEnriched.url,
        PropertyEnriched.image,
    ).filter(
        PropertyEnriched.price >= minimum_purchase_price_input,
        PropertyEnriched.price <= maximum_purchase_price_input,
        PropertyEnriched.predictedRentPrice.isnot(None)
    ).all()

    session.close()

    filtered_results_list = []

    for row in results:
        properties_dict = {
            "propertyCode": row[0],
            "propertyType": row[1],
            "address": row[2],
            "municipality": row[3],
            "country": row[4],
            "lat": row[5],
            "lon": row[6],
            "bathrooms": row[7],
            "bedrooms": row[8],
            "size": row[9],
            "status": row[10],
            "floor": row[11],
            "hasLift": row[12],
            "newDevelopment": row[13],
            "epc": row[14],
            "price": row[15],
            "predictedRentPrice": row[16],
            "URL": row[17],
            "image": row[18]
        }

        filtered_results_list.append(properties_dict)
    
    return jsonify(filtered_results_list)



@app.route('/filter', methods=['POST'])
def filter():

    ## Input variables
    minimum_purchase_price_input = float(request.form['min-price'])
    maximum_purchase_price_input = float(request.form['max-price'])
    municipality_input = request.form['municipality']

    ## Filter on data

    session = Session(engine)

    results = session.query(
        PropertyEnriched.propertyCode,
        PropertyEnriched.propertyType,
        PropertyEnriched.address,
        PropertyEnriched.municipality,
        PropertyEnriched.country,
        PropertyEnriched.lat,
        PropertyEnriched.lon,
        PropertyEnriched.bathrooms,
        PropertyEnriched.bedrooms,
        PropertyEnriched.size,
        PropertyEnriched.status,
        PropertyEnriched.floor,
        PropertyEnriched.hasLift,
        PropertyEnriched.newDevelopment,
        PropertyEnriched.epc,
        PropertyEnriched.price,
        PropertyEnriched.predictedRentPrice,
        PropertyEnriched.url,
        PropertyEnriched.image
    ).filter(
        PropertyEnriched.price >= minimum_purchase_price_input,
        PropertyEnriched.price <= maximum_purchase_price_input,
        PropertyEnriched.municipality == municipality_input,
        PropertyEnriched.predictedRentPrice.isnot(None)
    ).all()

    session.close()

    filtered_results_list = []

    for row in results:
        properties_dict = {
            "propertyCode": row[0],
            "propertyType": row[1],
            "address": row[2],
            "municipality": row[3],
            "country": row[4],
            "lat": row[5],
            "lon": row[6],
            "bathrooms": row[7],
            "bedrooms": row[8],
            "size": row[9],
            "status": row[10],
            "floor": row[11],
            "hasLift": row[12],
            "newDevelopment": row[13],
            "epc": row[14],
            "price": row[15],
            "predictedRentPrice": row[16],
            "URL": row[17],
            "image": row[18]
        }

        filtered_results_list.append(properties_dict)
    
    return jsonify(filtered_results_list)


# start the flask server
if __name__ == '__main__':
    app.run(debug=True)