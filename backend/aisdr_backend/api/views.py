from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
import csv
import io
import requests
from twilio.rest import Client
import os
import json

from .models import Leads
from .serializers import LeadsSerializers

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
            vapi_auth_token = os.getenv("VAPI_AUTH_TOKEN")
            assisstant_id = os.getenv("VAPI_ASSISSTANT_ID")
            # The Phone Number ID, and the Customer details for the call
            phone_number_id = os.getenv("VAPI_PHONE_ID")

            # Create the header with Authorization token
            headers = {
                'Authorization': f'Bearer {vapi_auth_token}',
                'Content-Type': 'application/json',
            }

            # Process each row
            for row in csv_data:
                initial_digits = row["number"][0:3]
                if (initial_digits != "+91"):
                    row["number"] = "+91"+row["number"]
                print("calling : " + row["id"] + " , " + row["number"])

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
                {'message': 'CSV file processed successfully',
                    'response': response.json()},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SendOtp(APIView):
    def post(self, request):
        twilio_account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        twilio_otp_service_id = os.getenv("TWILIO_OTP_SERVICE_ID")

        client = Client(twilio_account_sid, twilio_auth_token)

        number = request.data["message"]["toolCalls"][0]["function"]["arguments"]["number"]
        initial_digits = number[0:3]
        if (initial_digits != "+91"):
            number = "+91"+number
        print("sending otp to : "  + number)
        
        toolCallId = request.data["message"]["toolCalls"][0]["id"]

        try:
            otp_verification = client.verify.v2.services(twilio_otp_service_id).verifications.create(
                to= number, channel="sms"
            )

            return Response(
                {
                    "results": [
                        {
                            "toolCallId" : toolCallId,
                            "result": "otp sent successfully"
                        }
                    ]
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {'response': {e}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VerifyOtp(APIView):
    def post(self, request):
        twilio_account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        twilio_otp_service_id = os.getenv("TWILIO_OTP_SERVICE_ID")

        client = Client(twilio_account_sid, twilio_auth_token)
        
        print(request.data)
        
        otp_code = int(request.data["message"]["toolCalls"][0]["function"]["arguments"]["otp"])
        number = request.data["message"]["toolCalls"][0]["function"]["arguments"]["number"]
        initial_digits = number[0:3]
        if (initial_digits != "+91"):
            number = "+91"+number
        print("verifying : "  + number)
        
        toolCallId = request.data["message"]["toolCalls"][0]["id"]


        try:
            otp_check = client.verify.v2.services(twilio_otp_service_id).verification_checks.create(
                to= number, code=otp_code
            )
            
            if(otp_check.status == "approved"):
                return Response(
                    {
                        "results": [
                            {
                                "toolCallId" : toolCallId,
                                "result": "verification successful"
                            }
                        ]
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {
                        "results": [
                            {
                                "toolCallId" : toolCallId,
                                "result": "verification failed"
                            }
                        ]
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as e:
            return Response(
                {'response': {e}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LeadData(APIView):
    def get(self, request):
        records = Leads.objects.all()
        serializer = LeadsSerializers(records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        print(request.data)
        structured_data = request.data["message"]["analysis"]["structuredData"]
        print(structured_data)
        serializer = LeadsSerializers(data=structured_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request):
        try:
            # Delete all records from the table
            Leads.objects.all().delete()
            return Response(
                {"message": "All records deleted successfully."},
                status=status.HTTP_204_NO_CONTENT
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
