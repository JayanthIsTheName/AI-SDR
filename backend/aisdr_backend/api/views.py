<<<<<<< HEAD
from django.shortcuts import render

# Create your views here.
=======
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import csv
import io
import requests
from twilio.rest import Client
import os


class CSVUploadView(APIView):
    def post(self, request):
        try:
            # Check if file is present in request
            if 'file' not in request.FILES:
                return Response(
                    {'error': 'No file uploaded'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            csv_file = request.FILES['file']

            # Check if file is CSV
            if not csv_file.name.endswith('.csv'):
                return Response(
                    {'error': 'File must be CSV format'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Read the CSV file
            decoded_file = csv_file.read().decode('utf-8')
            # Convert the csv into a dictionary
            csv_data = csv.DictReader(io.StringIO(decoded_file))

            # ----- Vapi settings -------

            # Your Vapi API Authorization token
            auth_token = os.getenv("VAPI_AUTH_TOKEN")
            assisstant_id = os.getenv("VAPI_ASSISSTANT_ID")
            # The Phone Number ID, and the Customer details for the call
            phone_number_id = os.getenv("VAPI_PHONE_ID")

            # Create the header with Authorization token
            headers = {
                'Authorization': f'Bearer {auth_token}',
                'Content-Type': 'application/json',
            }

            # ----- twilio settings --------
            # Your Account SID and Auth Token from console.twilio.com
            account_sid = os.getenv('TWILIO_ACCOUNT_SID')
            # auth_token  = '43a9ebbd32b761123d9e657d49542fb1'
            # client = Client(account_sid, auth_token)

            # verification = client.verify \
            #     .v2 \
            #     .services('VAc1ae47c07e6fc3da97d87ef5cab6695d') \
            #     .verifications \
            #     .create(to='+917989409481', channel='sms')

            # print(verification.sid)

            # Process each row
            for row in csv_data:
                initial_digits = row["number"][0:3]
                if(initial_digits != "+91"):
                    row["number"] = "+91"+row["number"]
                print("calling : " + row["id"] +" , "+ row["number"])
                    
                # data
                data = {
                    "name": row["name"],
                    "assistantId": assisstant_id,
                    "phoneNumberId": phone_number_id,
                    "customer": {
                        "number": row["number"]
                    }
                }
                # Make the POST request to Vapi to create the phone call
                response = requests.post(
                    'https://api.vapi.ai/call/phone', headers=headers, json=data)
                # Check if the request was successful and print the response
                if response.status_code == 201:
                    print('Call created successfully')
                    # print(response.json())
                else:
                    print('Failed to create call')
                    # print(response.text)

            return Response(
                {'message': 'CSV file processed successfully','response': response.json()},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ReceiveMessages(APIView):
    def post(self, request):
        print('hi')
>>>>>>> 68a74c0 (the calling functionality is added)
