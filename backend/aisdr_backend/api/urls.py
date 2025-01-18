from django.urls import path
from .views import CSVUploadView
from .views import ReceiveMessages

urlpatterns = [
    path('upload-csv/', CSVUploadView.as_view(), name='upload-csv'),
    path('upload-csv/', CSVUploadView.as_view(), name='test'),
    path('leads/', ReceiveMessages.as_view(), name='post lead data')
]