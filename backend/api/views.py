import random
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note, UserOTP
from django.contrib.auth import authenticate, login as django_login
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response
from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from .models import UserOTP
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


def generate_random_digits(n=6):
    return "".join(map(str, random.sample(range(0, 10), n)))

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)

    if user is not None:
        user_profile = get_object_or_404(UserOTP, user=user)
        verification_code = generate_random_digits  
        user_profile.otp = verification_code
        user_profile.otp_expiry_time = timezone.now() + timedelta(hours=1)
        user_profile.save()

        send_mail(
            'Verification Code',
            f'Your verification code is: {verification_code}',
            'from@example.com',
            [user.get_email_field_name()],
            fail_silently=False,
        )
        
        return Response({'detail': 'Verification code sent successfully.'}, status=status.HTTP_200_OK)
    
    return Response({'detail': 'Invalid verification code or credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
    

class VerifyView(APIView):
    pass