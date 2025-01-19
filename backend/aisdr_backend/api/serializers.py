from rest_framework import serializers
from .models import Leads

class LeadsSerializers(serializers.ModelSerializer):
    class Meta:
        model=Leads
        fields='__all__'
