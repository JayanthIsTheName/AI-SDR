from django.urls import path
from .views import CSVUploadView, ReceiveLeadData, SendOtp, VerifyOtp


urlpatterns = [
    path('upload-csv/', CSVUploadView.as_view(), name='upload-csv'),
    path('leads/', ReceiveLeadData.as_view(), name='post lead data'),
    path('sendotp/', SendOtp.as_view(), name='send otp'),
    path('verifyotp/', VerifyOtp.as_view(), name='verify otp'),
]