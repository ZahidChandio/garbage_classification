from django.db import models

class ImageModel(models.Model):
    image_file = models.ImageField(upload_to='images/')