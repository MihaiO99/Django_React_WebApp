from django.db import models
from django.contrib.auth.models import User

class UserOTP(models.Model):
   user = models.OneToOneField(User, on_delete=models.CASCADE)
   otp = models.CharField(max_length=6, blank=True)
   otp_expiry_time = models.DateTimeField(blank=True, null=True)

   def __str__(self):
        return self.user
   

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title