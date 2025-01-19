from django.db import models

# Create your models here.
class Leads(models.Model):
    id = models.AutoField(primary_key=True)
    dob = models.CharField(max_length=255)
    gstin = models.CharField(max_length=255)
    firm_name = models.CharField(max_length=255)
    firm_type = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255)
    annual_turnover = models.CharField(max_length=255)
    property_ownership = models.CharField(max_length=255)
    
